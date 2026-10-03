import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { initSchema } from "./schema.js";

// In-memory connection pool on globalThis to avoid reopening file descriptors across Next.js HMR reloads
const globalForDb = globalThis;
if (!globalForDb.__tenantDbPool) {
    globalForDb.__tenantDbPool = new Map();
}
const dbPool = globalForDb.__tenantDbPool;

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
    return "";
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
        .replace(/^www\./, "") // strip leading www.
        .replace(/:\d+$/, "") // remove port
        .replace(/[^a-zA-Z0-9._-]/g, "_");
}


let _allowedDomainsSet = null;

/**
 * Returns a set of all valid domains defined in ThemeMap.js
 * @returns {Set<string>}
 */
export function getAllowedDomains() {
    if (_allowedDomainsSet) return _allowedDomainsSet;

    try {
        const themeMapPath = path.join(process.cwd(), "app", "(core)", "utils", "ThemeMap.js");
        if (fs.existsSync(themeMapPath)) {
            const content = fs.readFileSync(themeMapPath, "utf-8");
            const set = new Set();
            const keyRegex = /"([a-zA-Z0-9._-]+)"\s*:\s*\{/g;
            let match;
            while ((match = keyRegex.exec(content)) !== null) {
                const d = match[1].toLowerCase().replace(/^www\./, "");
                set.add(d);
            }
            const activeDomain = getActiveConfigDomain();
            if (activeDomain) set.add(activeDomain.toLowerCase());

            _allowedDomainsSet = set;
            return _allowedDomainsSet;
        }
    } catch (_) {}

    return new Set();
}

/**
 * Checks if a domain is an authorized tenant defined in ThemeMap.js
 * @param {string} domain
 * @returns {boolean}
 */
export function isDomainAllowed(domain) {
    if (!domain) return false;
    const clean = sanitizeDomainName(domain);
    const allowed = getAllowedDomains();
    return allowed.has(clean.toLowerCase());
}

/**
 * Gets an active SQLite database connection for a specific domain.
 * Strictly prevents creating new database files/directories on disk unless explicitly authorized (createIfMissing: true).
 * Strictly rejects any domain not present in ThemeMap.js.
 * 
 * @param {string} domain
 * @param {object} [options]
 * @param {boolean} [options.createIfMissing=false] - Whether to create database if not on disk
 * @param {object} [options.themeInfo] - Theme metadata if creating
 * @returns {import('better-sqlite3').Database|null}
 */
export function getTenantDb(domain = "default", options = {}) {
    const cleanDomain = sanitizeDomainName(domain);

    // Strictly enforce ThemeMap: if domain is NOT in ThemeMap, reject immediately
    if (!isDomainAllowed(cleanDomain)) {
        return null;
    }

    // Return pooled connection if already active
    if (dbPool.has(cleanDomain)) {
        return dbPool.get(cleanDomain);
    }

    const tenantDir = path.join(TENANTS_ROOT, cleanDomain);
    const dbPath = path.join(tenantDir, "database.db");
    const exists = fs.existsSync(dbPath);

    const createIfMissing = Boolean(options?.createIfMissing);
    const themeInfo = options?.themeInfo || (options?.page ? options : {});

    if (!exists) {
        if (!createIfMissing) {
            // Do NOT auto-create database files or directories for arbitrary/scanner domains!
            return null;
        }

        // Only create folder if explicitly authorized (e.g. during npm run db:init)
        if (!fs.existsSync(tenantDir)) {
            fs.mkdirSync(tenantDir, { recursive: true });
        }
    }

    try {
        // Open connection
        const db = new Database(dbPath, {
            fileMustExist: !createIfMissing,
        });

        if (!exists) {
            // Initialize Schema, WAL mode and default metadata only for newly created databases
            initSchema(db, cleanDomain, themeInfo);
        }

        // Cache in pool
        dbPool.set(cleanDomain, db);

        return db;
    } catch (err) {
        return null;
    }
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
            try {
                db.pragma("wal_checkpoint(PASSIVE)");
            } catch (_) {}
            db.close();
            dbPool.delete(cleanDomain);
        }
    } else {
        for (const [key, db] of dbPool.entries()) {
            try {
                try {
                    db.pragma("wal_checkpoint(PASSIVE)");
                } catch (_) {}
                db.close();
            } catch (err) {
                console.error(`Error closing DB for ${key}:`, err);
            }
        }
        dbPool.clear();
    }
}
