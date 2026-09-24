/**
 * Procedure Manager for SQLite
 * Emulates MySQL/SQL Server Stored Procedures using better-sqlite3 atomic transactions
 */

export { batchInsertDesigns } from "./batchInsertDesigns.js";
export { saveMenuFilters } from "./saveMenuFilters.js";
export { getDesigns, getDesignsByMenu } from "./getDesignsByMenu.js";
export { getMenuFilters } from "./getMenuFilters.js";
export { getFilterList } from "./getFilterList.js";
export { saveStoreInit } from "./saveStoreInit.js";
export { getStoreInit } from "./getStoreInit.js";
export { saveMenus } from "./saveMenus.js";
export { getMenus } from "./getMenus.js";
export { savePackageMaster } from "./savePackageMaster.js";
export { getPackageMaster } from "./getPackageMaster.js";
export { deleteDesigns } from "./deleteDesigns.js";
export { deleteMenus } from "./deleteMenus.js";
export { deleteMenuFilters } from "./deleteMenuFilters.js";
export { deleteStoreInit } from "./deleteStoreInit.js";
export { deletePackageMaster } from "./deletePackageMaster.js";
export {
  getHomeProducts,
  getHomeBestsellers,
  getHomeNewArrivals,
  getHomeTrending,
  resolveHomeTable,
} from "./getHomeProducts.js";
export {
  saveRecentlyViewed,
  getRecentlyViewed,
} from "./recentlyViewed.js";
export { batchInsertArticles } from "./batchInsertArticles.js";
export { batchInsertArticleMaterials } from "./batchInsertArticleMaterials.js";
export {
  getTempTableName,
  tableExists,
  dropTempTable,
  mergeTempIntoMain,
  syncTableViaTemp,
} from "./tempTableSync.js";
export { getArticlesByDesign } from "./getArticlesByDesign.js";
export { getProductArticle } from "./getProductArticle.js";
export { getHomeCategories } from "./getHomeCategories.js";
export { rebuildPolicyCategories } from "./materializePolicyCategories.js";

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
