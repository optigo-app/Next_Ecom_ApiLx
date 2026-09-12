import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { initSchema } from "./schema.js";

// In-memory connection pool to avoid reopening file descriptors
const dbPool = new Map();

/**
 * Root directory for all tenant databases
 */
export const TENANTS_ROOT = path.join(process.cwd(), "db", "tenants");

/**
 * Resolves the default/active domain configured in env.js for local development
 */
export function getActiveConfigDomain() {
    try {
        const envPath = path.join(process.cwd(), "app", "(core)", "utils", "env.js");
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, "utf-8");
            const webMatch = content.match(/NEXT_APP_WEB\s*=\s*([^;\n]+)/);
            if (webMatch) {
                let val = webMatch[1].trim();
                if (val.includes("WEBSITE_DOMAINS.")) {
                    const key = val.split(".")[1].trim();
                    for (const line of content.split("\n")) {
                        if (line.includes(key + ":")) {
                            const q = line.match(/["']([^"']+)["']/);
                            if (q) return q[1];
                        }
                    }
                }
                return val.replace(/["']/g, "");
            }
        }
    } catch (_) {}
    return "beluxjewel.web";
}

/**
 * Sanitizes a domain name for safe directory naming on Windows / Linux.
 * Automatically maps localhost, 127.0.0.1, or empty/default domain to the active domain in env.js.
 * @param {string} domain
 * @returns {string}
 */
export function sanitizeDomainName(domain) {
    if (!domain || typeof domain !== "string" || domain === "default") {
        return getActiveConfigDomain();
    }
    const lower = domain.trim().toLowerCase();
    if (lower.includes("localhost") || lower.includes("127.0.0.1")) {
        return getActiveConfigDomain();
    }
    return lower
        .replace(/^https?:\/\//, "")
        .replace(/:\d+$/, "") // remove port
        .replace(/[^a-zA-Z0-9._-]/g, "_");
}


/**
 * Gets or creates an active SQLite database connection for a specific domain
 * @param {string} domain
 * @param {object} [themeInfo]
 * @returns {import('better-sqlite3').Database}
 */
export function getTenantDb(domain = "default", themeInfo = {}) {
    const cleanDomain = sanitizeDomainName(domain);

    // Return pooled connection if already active
    if (dbPool.has(cleanDomain)) {
        return dbPool.get(cleanDomain);
    }

    // Ensure tenant directory exists
    const tenantDir = path.join(TENANTS_ROOT, cleanDomain);
    if (!fs.existsSync(tenantDir)) {
        fs.mkdirSync(tenantDir, { recursive: true });
    }

    const dbPath = path.join(tenantDir, "database.db");

    // Open connection
    const db = new Database(dbPath, {
        fileMustExist: false,
    });

    // Initialize Schema, WAL mode and default metadata
    initSchema(db, cleanDomain, themeInfo);

    // Cache in pool
    dbPool.set(cleanDomain, db);

    return db;
}

/**
 * Closes a specific database or all active database connections
 * @param {string} [domain]
 */
export function closeTenantDb(domain) {
    if (domain) {
        const cleanDomain = sanitizeDomainName(domain);
        if (dbPool.has(cleanDomain)) {
            const db = dbPool.get(cleanDomain);
            db.close();
            dbPool.delete(cleanDomain);
        }
    } else {
        for (const [key, db] of dbPool.entries()) {
            try {
                db.close();
            } catch (err) {
                console.error(`Error closing DB for ${key}:`, err);
            }
        }
        dbPool.clear();
    }
}
