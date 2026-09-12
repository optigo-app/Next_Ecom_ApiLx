/**
 * Procedure Manager for SQLite
 * Emulates MySQL/SQL Server Stored Procedures using better-sqlite3 atomic transactions
 */

export { batchInsertDesigns } from "./batchInsertDesigns.js";
export { saveMenuFilters } from "./saveMenuFilters.js";
export { getDesigns, getDesignsByMenu } from "./getDesignsByMenu.js";
export { getMenuFilters } from "./getMenuFilters.js";

/**
 * Executes a procedure by name on a specific domain's database
 * @param {import('better-sqlite3').Database} db
 * @param {Function} procedureFn
 * @param {any} params
 * @returns {any}
 */
export function executeProcedure(db, procedureFn, ...params) {
    if (typeof procedureFn !== "function") {
        throw new Error("Invalid procedure function provided to executeProcedure.");
    }
    return procedureFn(db, ...params);
}
