import fs from "fs";
import path from "path";
import { getTenantDb, closeTenantDb, TENANTS_ROOT } from "./tenantManager.js";
import { truncateAllData } from "./schema.js";

/**
 * Parses ThemeMap.js file safely to extract all configured domains
 * without requiring next/webpack path alias resolution in CLI.
 */
export function getDomainsFromThemeMap() {
    const themeMapPath = path.join(process.cwd(), "app", "(core)", "utils", "ThemeMap.js");
    if (!fs.existsSync(themeMapPath)) {
        console.warn(`[WARN] ThemeMap.js not found at: ${themeMapPath}`);
        return {};
    }

    const fileContent = fs.readFileSync(themeMapPath, "utf-8");

    // Match all domain keys and page mappings from the object
    const map = {};
    const regex = /"([^"]+)"\s*:\s*\{\s*page\s*:\s*"([^"]+)"/g;
    let match;
    while ((match = regex.exec(fileContent)) !== null) {
        const domain = match[1];
        const page = match[2];
        map[domain] = { page };
    }

    // Also match any additional quoted keys if formatted differently
    const keyRegex = /"([a-zA-Z0-9._-]+)"\s*:\s*\{/g;
    let keyMatch;
    while ((keyMatch = keyRegex.exec(fileContent)) !== null) {
        const domain = keyMatch[1];
        if (!map[domain]) {
            map[domain] = { page: "default" };
        }
    }

    return map;
}

/**
 * Automatically creates/updates SQLite databases for every domain in ThemeMap.js
 * Supports options.truncate to clean all table rows.
 */
export async function initAllDatabases(options = {}) {
    const isFresh = options.fresh || process.argv.includes("--fresh");
    const isTruncate = options.truncate || process.argv.includes("--truncate") || false;

    console.log("=================================================");
    console.log(`🚀 Multi-Tenant SQLite Database Initializer ${isFresh ? "(FRESH REBUILD)" : isTruncate ? "(TRUNCATE DATA)" : ""}`);
    console.log("=================================================");

    if (isFresh && fs.existsSync(TENANTS_ROOT)) {
        console.log("🧹 Clearing old tenant database files for clean migration...");
        closeTenantDb();
        const tenantDirs = fs.readdirSync(TENANTS_ROOT);
        for (const dir of tenantDirs) {
            const dirPath = path.join(TENANTS_ROOT, dir);
            try {
                fs.rmSync(dirPath, { recursive: true, force: true });
            } catch (e) {
                // Ignore if in use or missing
            }
        }
    }

    const themeMap = getDomainsFromThemeMap();
    const domains = Object.keys(themeMap);

    if (domains.length === 0) {
        console.log("⚠️ No domains found in ThemeMap.js.");
        return [];
    }

    console.log(`📁 Found ${domains.length} configured domains.`);
    console.log(`📂 Output Directory: ${TENANTS_ROOT}\n`);

    const results = [];

    for (const domain of domains) {
        const themeInfo = themeMap[domain];
        try {
            const db = getTenantDb(domain, themeInfo);

            if (isTruncate) {
                truncateAllData(db);
            }

            // Verify tables and initial state
            const tables = db
                .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
                .all()
                .map((t) => t.name);

            results.push({
                Domain: domain,
                Theme: themeInfo.page || "default",
                Status: isTruncate ? "✅ Ready (Truncated)" : "✅ Ready",
                TablesCount: tables.length,
                Path: `db/tenants/${domain}/database.db`,
            });
        } catch (error) {
            console.error(`❌ Failed initializing DB for ${domain}:`, error.message);
            results.push({
                Domain: domain,
                Theme: themeInfo.page || "default",
                Status: `❌ Error: ${error.message}`,
                TablesCount: 0,
                Path: "N/A",
            });
        }
    }

    // Close all connections after CLI run
    closeTenantDb();

    console.table(results);
    console.log("\n✨ All domain databases have been initialized and truncated successfully!");
    return results;
}

// Execute if run directly from terminal: `node db/initAllDatabases.js`
const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"));
if (isDirectRun || process.argv.includes("--run")) {
    initAllDatabases();
}
