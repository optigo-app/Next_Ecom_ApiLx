/**
 * Multi-Tenant SQLite Database Schema Registry
 * Modularly combines individual table schemas into a unified, scalable catalog.
 */

import { PRAGMAS_SQL } from "./pragmas.js";
import { DESIGNS_TABLE_SQL } from "./designs.js";
import { MENU_FILTERS_TABLE_SQL } from "./menuFilters.js";
import { SYNC_LOGS_TABLE_SQL } from "./syncLogs.js";
import { STORE_INIT_TABLE_SQL, ensureStoreInitColumns } from "./storeInit.js";
import { ACCOUNT_TABLE_SQL } from "./account.js";
import { COMPANY_INFO_TABLE_SQL } from "./companyInfo.js";
import { MENUS_TABLE_SQL } from "./menus.js";
import { PACKAGEMASTER_TABLE_SQL } from "./packagemaster.js";
import { RECENTLY_VIEWED_TABLE_SQL } from "./recentlyViewed.js";
import { ALBUMS_TABLE_SQL, ensureAlbumsTable } from "./albums.js";
import { WEBSITE_CONTENT_TABLE_SQL, ensureWebsiteContentTable } from "./websiteContent.js";
import { ensureDesignTableColumns } from "./dynamicDesigns.js";
import {
    ARTICLE_INFO_PREFIX,
    ARTICLE_MATERIAL_PREFIX,
    ARTICLE_TABLE_PREFIX,
    getDynamicArticleTableName,
    getDynamicArticleMaterialTableName,
    ensureDynamicArticleTable,
    ensureDynamicArticleMaterialTable,
    resolveArticleTableName,
    resolveArticleMaterialTableName,
} from "./dynamicArticles.js";
import {
    STOCK_LIST_PREFIX,
    STOCK_LIST_BASE_TABLE_SQL,
    getDynamicStockListTableName,
    ensureDynamicStockListTable,
} from "./dynamicStockList.js";



// Export individual modular table schemas
export {
    PRAGMAS_SQL,
    DESIGNS_TABLE_SQL,
    MENU_FILTERS_TABLE_SQL,
    SYNC_LOGS_TABLE_SQL,
    STORE_INIT_TABLE_SQL,
    ensureStoreInitColumns,
    ACCOUNT_TABLE_SQL,
    COMPANY_INFO_TABLE_SQL,
    MENUS_TABLE_SQL,
    PACKAGEMASTER_TABLE_SQL,
    RECENTLY_VIEWED_TABLE_SQL,
    ALBUMS_TABLE_SQL,
    ensureAlbumsTable,
    WEBSITE_CONTENT_TABLE_SQL,
    ensureWebsiteContentTable,
    ARTICLE_INFO_PREFIX,
    ARTICLE_MATERIAL_PREFIX,
    ARTICLE_TABLE_PREFIX,
    getDynamicArticleTableName,
    getDynamicArticleMaterialTableName,
    ensureDynamicArticleTable,
    ensureDynamicArticleMaterialTable,
    resolveArticleTableName,
    resolveArticleMaterialTableName,
    STOCK_LIST_PREFIX,
    STOCK_LIST_BASE_TABLE_SQL,
    getDynamicStockListTableName,
    ensureDynamicStockListTable,
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
    MENUS_TABLE_SQL,
    PACKAGEMASTER_TABLE_SQL,
    RECENTLY_VIEWED_TABLE_SQL,
    ALBUMS_TABLE_SQL,
    WEBSITE_CONTENT_TABLE_SQL,
    STOCK_LIST_BASE_TABLE_SQL,
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
            DELETE FROM menus;
            DELETE FROM packagemaster;
            DELETE FROM albums;
            DELETE FROM website_content;
            DELETE FROM sqlite_sequence WHERE name IN ('menu_filters', 'sync_logs', 'storeinit', 'account', 'companyinfo', 'menus', 'packagemaster', 'albums', 'website_content');
        `);
        db.pragma("wal_checkpoint(TRUNCATE)");
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
            } else {
                const requiredCols = [
                    { name: "PackageIdList", type: "TEXT" },
                    { name: "ExclusiveCustomerId", type: "TEXT" },
                    { name: "product_typeid", type: "INTEGER" },
                    { name: "collectionid", type: "INTEGER" },
                    { name: "categoryid", type: "INTEGER" },
                    { name: "sub_categoryid", type: "INTEGER" },
                    { name: "brandid", type: "INTEGER" },
                    { name: "genderid", type: "INTEGER" },
                    { name: "occasionid", type: "INTEGER" },
                    { name: "Styleid", type: "INTEGER" },
                    { name: "make_typeid", type: "INTEGER" },
                ];
                for (const col of requiredCols) {
                    if (!existingCols.includes(col.name)) {
                        try {
                            db.exec(`ALTER TABLE designs ADD COLUMN "${col.name}" ${col.type};`);
                        } catch (_) {}
                    }
                }
            }
        }

        const pkgExists = db
            .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='packagemaster'")
            .get();
        if (pkgExists) {
            const pkgCols = db.prepare("PRAGMA table_info(packagemaster)").all().map((c) => c.name);
            if (!pkgCols.includes("updated_at")) {
                db.exec("DROP TABLE IF EXISTS packagemaster;");
            }
        }
    } catch (migErr) {
        console.warn("[initSchema] Pre-migration check warning:", migErr.message);
    }

    db.exec(SCHEMA_SQL);
    ensureStoreInitColumns(db);
    ensurePolicyCategoriesTable(db);
    ensureAlbumsTable(db);
    ensureWebsiteContentTable(db);
    ensureDesignTableColumns(db, "designs");
    ensureDynamicStockListTable(db, "stock_list");

    try {
        const allDesignTables = db
            .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'design%'")
            .all();
        for (const tbl of allDesignTables) {
            ensureDesignTableColumns(db, tbl.name);
        }
    } catch (_) {}
}

export { ensureDesignTableColumns };
export default initSchema;
