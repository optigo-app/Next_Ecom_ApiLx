/**
 * Multi-Tenant SQLite Database Schema Registry
 * Modularly combines individual table schemas into a unified, scalable catalog.
 */

import { PRAGMAS_SQL } from "./pragmas.js";
import { DESIGNS_TABLE_SQL } from "./designs.js";
import { MENU_FILTERS_TABLE_SQL } from "./menuFilters.js";
import { SYNC_LOGS_TABLE_SQL } from "./syncLogs.js";
import { STORE_INIT_TABLE_SQL } from "./storeInit.js";
import { ACCOUNT_TABLE_SQL } from "./account.js";
import { COMPANY_INFO_TABLE_SQL } from "./companyInfo.js";

// Export individual modular table schemas
export {
    PRAGMAS_SQL,
    DESIGNS_TABLE_SQL,
    MENU_FILTERS_TABLE_SQL,
    SYNC_LOGS_TABLE_SQL,
    STORE_INIT_TABLE_SQL,
    ACCOUNT_TABLE_SQL,
    COMPANY_INFO_TABLE_SQL,
};

// Unified DDL across all multi-tenant tables
export const SCHEMA_SQL = [
    PRAGMAS_SQL,
    DESIGNS_TABLE_SQL,
    MENU_FILTERS_TABLE_SQL,
    SYNC_LOGS_TABLE_SQL,
    STORE_INIT_TABLE_SQL,
    ACCOUNT_TABLE_SQL,
    COMPANY_INFO_TABLE_SQL,
].join("\n\n");

/**
 * Truncates all data from all tables in a given database
 * @param {import('better-sqlite3').Database} db
 */
export function truncateAllData(db) {
    try {
        db.exec(`
            DELETE FROM designs;
            DELETE FROM menu_filters;
            DELETE FROM sync_logs;
            DELETE FROM storeinit;
            DELETE FROM account;
            DELETE FROM companyinfo;
            DELETE FROM sqlite_sequence WHERE name IN ('menu_filters', 'sync_logs', 'storeinit', 'account', 'companyinfo');
        `);
        db.pragma("wal_checkpoint(PASSIVE)");
        return true;
    } catch (err) {
        console.error("[truncateAllData] Error truncating tables:", err.message);
        return false;
    }
}

/**
 * Initializes the database schema and performs safe migration and index alignment
 * @param {import('better-sqlite3').Database} db
 * @param {string} domain
 * @param {object} [themeInfo]
 */
export function initSchema(db, domain, themeInfo = {}) {
    // Check if designs table exists with old menu_identifier column
    try {
        const tableExists = db
            .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='designs'")
            .get();

        if (tableExists) {
            const existingCols = db.prepare("PRAGMA table_info(designs)").all().map((c) => c.name);
            if (existingCols.includes("menu_identifier")) {
                // Drop legacy table with old schema to ensure fresh clean schema with unique ArticleNo
                db.exec("DROP TABLE IF EXISTS designs;");
            }
        }
    } catch (migErr) {
        console.warn("[initSchema] Pre-migration check warning:", migErr.message);
    }

    db.exec(SCHEMA_SQL);
}

export default initSchema;
