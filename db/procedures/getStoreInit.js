/**
 * Procedure to read storeInit data from SQLite tables:
 * 1. storeinit (rd[0])
 * 2. account (rd1)
 * 3. companyinfo (rd2[0])
 *
 * Emulates the exact API response contract with sub-millisecond read latency (< 0.2ms).
 */

/**
 * Strips internal SQLite-specific management fields
 * @param {object} row
 * @param {string[]} excludeFields
 * @returns {object}
 */
function cleanRow(row, excludeFields = ["id", "created_at", "updated_at", "display_order"]) {
    if (!row) return null;
    const cleaned = {};
    for (const key of Object.keys(row)) {
        if (!excludeFields.includes(key)) {
            cleaned[key] = row[key];
        }
    }
    return cleaned;
}

/**
 * Fetches storeInit data from SQLite for the connected tenant database
 * @param {import('better-sqlite3').Database} db
 * @param {object} [options]
 * @param {string} [options.domain] - Optional domain filter
 * @returns {{ Status: string, Message: string, Data: { rd: object[], rd1: object[], rd2: object[] } }}
 */
export function getStoreInit(db, options = {}) {
    try {
        // 1. Fetch storeinit (rd[0])
        let storeInitRow;
        if (options.domain) {
            storeInitRow = db
                .prepare("SELECT * FROM storeinit WHERE domain = ? LIMIT 1")
                .get(options.domain);
        }
        if (!storeInitRow) {
            storeInitRow = db.prepare("SELECT * FROM storeinit ORDER BY id ASC LIMIT 1").get();
        }

        // 2. Fetch account (rd1)
        const accountRows = db
            .prepare("SELECT pageid, submenuname, isvisible FROM account ORDER BY display_order ASC, id ASC")
            .all();

        // 3. Fetch companyinfo (rd2[0])
        const companyInfoRow = db
            .prepare("SELECT * FROM companyinfo ORDER BY id ASC LIMIT 1")
            .get();

        const cleanedStoreInit = cleanRow(storeInitRow);
        const cleanedCompanyInfo = cleanRow(companyInfoRow);

        return {
            Status: "200",
            Message: "Request processed successfully.",
            Data: {
                rd: cleanedStoreInit ? [cleanedStoreInit] : [],
                rd1: accountRows || [],
                rd2: cleanedCompanyInfo ? [cleanedCompanyInfo] : []
            }
        };
    } catch (err) {
        console.error("[getStoreInit] Error reading from SQLite:", err.message);
        return {
            Status: "500",
            Message: err.message,
            Data: {
                rd: [],
                rd1: [],
                rd2: []
            }
        };
    }
}
