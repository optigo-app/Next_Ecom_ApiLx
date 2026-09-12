import fs from "fs";
import path from "path";
import { getTenantDb, closeTenantDb } from "./tenantManager.js";

/**
 * Executes a SQL file or raw SQL string against a specified tenant database
 * @param {string} domain
 * @param {string} [sqlOrFilePath]
 */
export function runSql(domain = "nxt10.optigoapps.com", sqlOrFilePath) {
    const db = getTenantDb(domain);
    let sqlContent = sqlOrFilePath;

    // Check if it's a file path or default to db/queries/query.sql
    const defaultFile = path.join(process.cwd(), "db", "queries", "query.sql");
    const targetPath = sqlOrFilePath && fs.existsSync(sqlOrFilePath) ? sqlOrFilePath : defaultFile;

    if (!sqlContent || fs.existsSync(targetPath)) {
        sqlContent = fs.readFileSync(targetPath, "utf-8");
    }

    console.log(`\n⚡ Running SQL on database: [${domain}]`);
    console.log("--------------------------------------------------");

    // Remove line comments and block comments
    const cleanSql = sqlContent
        .replace(/--.*$/gm, "")
        .replace(/\/\*[\s\S]*?\*\//g, "");

    // Split queries by semicolon and execute each
    const statements = cleanSql
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    for (const stmt of statements) {
        try {
            console.log(`\nQuery: ${stmt}`);
            if (/^\s*(SELECT|PRAGMA)/i.test(stmt)) {
                const results = db.prepare(stmt).all();
                console.table(results);
            } else {
                const info = db.prepare(stmt).run();
                console.log("Result:", info);
            }
        } catch (error) {
            console.error("❌ Query Error:", error.message);
        }
    }

    closeTenantDb(domain);
}

// Run CLI if called directly
const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"));
if (isDirectRun || process.argv.includes("--run")) {
    const nonFlagArgs = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
    const domainArg = nonFlagArgs[0] || "nxt10.optigoapps.com";
    runSql(domainArg);
}
