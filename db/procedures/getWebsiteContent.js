import { ensureWebsiteContentTable } from "../schema/websiteContent.js";

/**
 * Fetches website content from SQLite for the given tenant database.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {object} [options={}]
 * @param {string} [options.contentType] - Optional filter by ContentType (e.g. "branding")
 * @param {string} [options.pageKey] - Optional filter by PageKey
 * @param {number|string} [options.websiteId] - Optional filter by WebsiteId
 * @param {string} [options.id] - Optional filter by Id
 * @param {boolean|string|number} [options.isActive] - Optional filter by IsActive
 * @param {string} [options.domain] - Optional tenant domain filter
 * @returns {{ Status: string, Message: string, Data: { rd: Array<object> } }}
 */
export function getWebsiteContent(db, options = {}) {
    if (!db) {
        return {
            Status: "500",
            Message: "Database connection not available",
            Data: { rd: [] },
        };
    }

    try {
        ensureWebsiteContentTable(db);

        const conditions = [];
        const params = [];

        const contentType = options.contentType || options.ContentType || options.type;
        if (contentType) {
            conditions.push("LOWER(ContentType) = LOWER(?)");
            params.push(String(contentType).trim());
        }

        const pageKey = options.pageKey || options.PageKey;
        if (pageKey) {
            conditions.push("LOWER(PageKey) = LOWER(?)");
            params.push(String(pageKey).trim());
        }

        const websiteId = options.websiteId || options.WebsiteId;
        if (websiteId !== undefined && websiteId !== null && String(websiteId).trim() !== "") {
            conditions.push("WebsiteId = ?");
            params.push(parseInt(websiteId, 10));
        }

        const id = options.id || options.Id;
        if (id) {
            conditions.push("id = ?");
            params.push(String(id).trim());
        }

        if (options.isActive !== undefined && options.isActive !== null) {
            const activeVal = options.isActive === true || options.isActive === "true" || options.isActive === 1 || options.isActive === "1" ? 1 : 0;
            conditions.push("IsActive = ?");
            params.push(activeVal);
        }

        let sql = "SELECT * FROM website_content";
        if (conditions.length > 0) {
            sql += " WHERE " + conditions.join(" AND ");
        }
        sql += " ORDER BY SortOrder ASC, id ASC";

        const rows = db.prepare(sql).all(...params);

        const formatted = rows.map((row) => ({
            Id: String(row.id),
            WebsiteId: row.WebsiteId != null ? Number(row.WebsiteId) : null,
            ContentType: row.ContentType ?? null,
            BannerTypeId: row.BannerTypeId != null ? Number(row.BannerTypeId) : null,
            PageKey: row.PageKey ?? null,
            Title: row.Title ?? null,
            ContentJson: row.ContentJson ?? null,
            MediaType: row.MediaType ?? null,
            ImageUrl: row.ImageUrl ?? null,
            MobileImageUrl: row.MobileImageUrl ?? null,
            SortOrder: row.SortOrder != null ? Number(row.SortOrder) : 1,
            IsActive: Boolean(row.IsActive),
            CreatedBy: row.CreatedBy ?? "",
            CreatedDate: row.CreatedDate ?? null,
            ModifiedBy: row.ModifiedBy ?? null,
            ModifiedDate: row.ModifiedDate ?? null,
            Websitedomain: row.Websitedomain ?? null,
        }));

        return {
            Status: "200",
            Message: "Request processed successfully.",
            Data: {
                rd: formatted,
            },
        };
    } catch (err) {
        console.error("[getWebsiteContent] Error reading website_content from SQLite:", err.message);
        return {
            Status: "500",
            Message: err.message,
            Data: { rd: [] },
        };
    }
}

export default getWebsiteContent;
