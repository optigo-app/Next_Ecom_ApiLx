import { ensureWebsiteContentTable } from "../schema/websiteContent.js";

function toText(val, fallback = "") {
    if (val === undefined || val === null) return fallback;
    return String(val);
}

function toInt(val, fallback = 0) {
    if (val === undefined || val === null || val === "") return fallback;
    const num = parseInt(val, 10);
    return isNaN(num) ? fallback : num;
}

function toNullableInt(val) {
    if (val === undefined || val === null || val === "") return null;
    const num = parseInt(val, 10);
    return isNaN(num) ? null : num;
}

function toNullableText(val) {
    if (val === undefined || val === null) return null;
    return String(val);
}

function toBooleanInt(val, fallback = 1) {
    if (val === undefined || val === null) return fallback;
    if (val === true || val === 1 || val === "1" || val === "true") return 1;
    if (val === false || val === 0 || val === "0" || val === "false") return 0;
    return fallback;
}

/**
 * Saves/upserts website content into website_content table.
 * Replaces the stored snapshot by default. Pass options.replace = false for upsert-only behavior.
 * Accurately tracks insertedCount, updatedCount, deletedCount.
 *
 * @param {import('better-sqlite3').Database} db
 * @param {Array<object>|object} rawPayload - array or response payload of website content objects
 * @param {object} [options={}] - optional overrides (e.g. domain, WebsiteId, replace)
 * @returns {{ totalReceived: number, insertedCount: number, updatedCount: number, deletedCount: number, savedCount: number, elapsedMs: number, success: boolean }}
 */
export function saveWebsiteContent(db, rawPayload = [], options = {}) {
    const startTime = performance.now();

    if (!db) {
        return {
            totalReceived: 0,
            insertedCount: 0,
            updatedCount: 0,
            deletedCount: 0,
            savedCount: 0,
            elapsedMs: 0,
            success: false,
            error: "No database instance provided"
        };
    }

    ensureWebsiteContentTable(db);

    let contentList = [];
    if (Array.isArray(rawPayload)) {
        contentList = rawPayload;
    } else if (rawPayload && typeof rawPayload === "object") {
        contentList = rawPayload?.Data?.rd || rawPayload?.rd || (rawPayload.Id || rawPayload.id || rawPayload.ContentType ? [rawPayload] : []);
    }

    const isReplace = options.replace !== false;
    let deletedCount = 0;
    let insertedCount = 0;
    let updatedCount = 0;

    if (!Array.isArray(contentList) || contentList.length === 0) {
        if (isReplace) {
            const delInfo = db.prepare("DELETE FROM website_content").run();
            deletedCount = delInfo.changes;
        }
        return {
            totalReceived: 0,
            insertedCount: 0,
            updatedCount: 0,
            deletedCount,
            savedCount: 0,
            elapsedMs: Math.round((performance.now() - startTime) * 100) / 100,
            success: true,
        };
    }

    const checkStmt = db.prepare("SELECT 1 FROM website_content WHERE id = ?");

    const upsertStmt = db.prepare(`
        INSERT INTO website_content (
            id,
            WebsiteId,
            ContentType,
            BannerTypeId,
            PageKey,
            Title,
            ContentJson,
            MediaType,
            ImageUrl,
            MobileImageUrl,
            SortOrder,
            IsActive,
            CreatedBy,
            CreatedDate,
            ModifiedBy,
            ModifiedDate,
            Websitedomain,
            updated_at
        ) VALUES (
            @id,
            @WebsiteId,
            @ContentType,
            @BannerTypeId,
            @PageKey,
            @Title,
            @ContentJson,
            @MediaType,
            @ImageUrl,
            @MobileImageUrl,
            @SortOrder,
            @IsActive,
            @CreatedBy,
            @CreatedDate,
            @ModifiedBy,
            @ModifiedDate,
            @Websitedomain,
            CURRENT_TIMESTAMP
        )
        ON CONFLICT(id) DO UPDATE SET
            WebsiteId = excluded.WebsiteId,
            ContentType = excluded.ContentType,
            BannerTypeId = excluded.BannerTypeId,
            PageKey = excluded.PageKey,
            Title = excluded.Title,
            ContentJson = excluded.ContentJson,
            MediaType = excluded.MediaType,
            ImageUrl = excluded.ImageUrl,
            MobileImageUrl = excluded.MobileImageUrl,
            SortOrder = excluded.SortOrder,
            IsActive = excluded.IsActive,
            CreatedBy = excluded.CreatedBy,
            CreatedDate = excluded.CreatedDate,
            ModifiedBy = excluded.ModifiedBy,
            ModifiedDate = excluded.ModifiedDate,
            Websitedomain = excluded.Websitedomain,
            updated_at = CURRENT_TIMESTAMP
    `);

    const executeBatch = db.transaction((rows) => {
        if (isReplace) {
            const delInfo = db.prepare("DELETE FROM website_content").run();
            deletedCount = delInfo.changes;
        }

        for (const row of rows) {
            const rawId = row.Id ?? row.id ?? row.ID;
            if (rawId === undefined || rawId === null || String(rawId).trim() === "") continue;

            const id = String(rawId).trim();

            if (!isReplace) {
                const exists = checkStmt.get(id);
                if (exists) {
                    updatedCount++;
                } else {
                    insertedCount++;
                }
            } else {
                insertedCount++;
            }

            const websiteId = toInt(row.WebsiteId ?? row.websiteId ?? options.WebsiteId ?? options.websiteId);
            const contentType = toText(row.ContentType ?? row.contentType);
            const bannerTypeId = toNullableInt(row.BannerTypeId ?? row.bannerTypeId);
            const pageKey = toNullableText(row.PageKey ?? row.pageKey);
            const title = toText(row.Title ?? row.title);

            let contentJson = "";
            if (row.ContentJson !== undefined && row.ContentJson !== null) {
                contentJson = typeof row.ContentJson === "object" ? JSON.stringify(row.ContentJson) : String(row.ContentJson);
            } else if (row.contentJson !== undefined && row.contentJson !== null) {
                contentJson = typeof row.contentJson === "object" ? JSON.stringify(row.contentJson) : String(row.contentJson);
            }

            const mediaType = toNullableText(row.MediaType ?? row.mediaType);
            const imageUrl = toNullableText(row.ImageUrl ?? row.imageUrl);
            const mobileImageUrl = toNullableText(row.MobileImageUrl ?? row.mobileImageUrl);
            const sortOrder = toInt(row.SortOrder ?? row.sortOrder, 1);
            const isActive = toBooleanInt(row.IsActive ?? row.isActive, 1);
            const createdBy = toText(row.CreatedBy ?? row.createdBy);
            const createdDate = toNullableText(row.CreatedDate ?? row.createdDate);
            const modifiedBy = toNullableText(row.ModifiedBy ?? row.modifiedBy);
            const modifiedDate = toNullableText(row.ModifiedDate ?? row.modifiedDate);
            const websitedomain = toNullableText(row.Websitedomain ?? row.websitedomain ?? row.domain ?? options.domain);

            upsertStmt.run({
                id,
                WebsiteId: websiteId,
                ContentType: contentType,
                BannerTypeId: bannerTypeId,
                PageKey: pageKey,
                Title: title,
                ContentJson: contentJson,
                MediaType: mediaType,
                ImageUrl: imageUrl,
                MobileImageUrl: mobileImageUrl,
                SortOrder: sortOrder,
                IsActive: isActive,
                CreatedBy: createdBy,
                CreatedDate: createdDate,
                ModifiedBy: modifiedBy,
                ModifiedDate: modifiedDate,
                Websitedomain: websitedomain,
            });
        }
    });

    executeBatch(contentList);

    const elapsedMs = Math.round((performance.now() - startTime) * 100) / 100;
    return {
        totalReceived: contentList.length,
        insertedCount,
        updatedCount,
        deletedCount,
        savedCount: insertedCount + updatedCount,
        elapsedMs,
        success: true,
    };
}

export default saveWebsiteContent;
