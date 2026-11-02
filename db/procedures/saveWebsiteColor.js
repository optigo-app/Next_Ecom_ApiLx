import { ensureWebsiteColorTable } from "../schema/websiteColor.js";

function toText(val, fallback = "") {
    if (val === undefined || val === null) return fallback;
    return String(val);
}

function toInt(val, fallback = 0) {
    if (val === undefined || val === null || val === "") return fallback;
    const num = parseInt(val, 10);
    return isNaN(num) ? fallback : num;
}

function toNullableText(val) {
    if (val === undefined || val === null) return null;
    return String(val);
}

/**
 * Saves/upserts website color configuration into website_color table.
 * Replaces the stored snapshot by default. Pass options.replace = false for upsert-only behavior.
 * Accurately tracks insertedCount, updatedCount, deletedCount.
 *
 * @param {import('better-sqlite3').Database} db
 * @param {Array<object>|object} rawPayload - array or response payload of website color objects
 * @param {object} [options={}] - optional overrides (e.g. domain, WebsiteId, replace)
 * @returns {{ totalReceived: number, insertedCount: number, updatedCount: number, deletedCount: number, savedCount: number, elapsedMs: number, success: boolean }}
 */
export function saveWebsiteColor(db, rawPayload = [], options = {}) {
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

    ensureWebsiteColorTable(db);

    let colorList = [];
    if (Array.isArray(rawPayload)) {
        colorList = rawPayload;
    } else if (rawPayload && typeof rawPayload === "object") {
        colorList = rawPayload?.Data?.rd || rawPayload?.rd || (rawPayload.id || rawPayload.Id || rawPayload.store_id || rawPayload.primary_theme_color ? [rawPayload] : []);
    }

    const isReplace = options.replace !== false;
    let deletedCount = 0;
    let insertedCount = 0;
    let updatedCount = 0;

    if (!Array.isArray(colorList) || colorList.length === 0) {
        if (isReplace) {
            const delInfo = db.prepare("DELETE FROM website_color").run();
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

    const checkStmt = db.prepare("SELECT 1 FROM website_color WHERE id = ?");

    const upsertStmt = db.prepare(`
        INSERT INTO website_color (
            id,
            store_id,
            domain_name,
            primary_theme_color,
            primary_theme_bg,
            sticky_header_bg,
            btn_main_bg,
            btn_main_text,
            btn_main_border,
            btn_product_bg,
            btn_product_text,
            btn_product_border,
            btn_product_border_radius,
            btn_remove_cart_bg,
            btn_remove_cart_text,
            btn_remove_cart_border,
            btn_remove_cart_border_radius,
            icon_color,
            icon_remove_color,
            created_at,
            updated_at,
            ufcc
        ) VALUES (
            @id,
            @store_id,
            @domain_name,
            @primary_theme_color,
            @primary_theme_bg,
            @sticky_header_bg,
            @btn_main_bg,
            @btn_main_text,
            @btn_main_border,
            @btn_product_bg,
            @btn_product_text,
            @btn_product_border,
            @btn_product_border_radius,
            @btn_remove_cart_bg,
            @btn_remove_cart_text,
            @btn_remove_cart_border,
            @btn_remove_cart_border_radius,
            @icon_color,
            @icon_remove_color,
            COALESCE(@created_at, CURRENT_TIMESTAMP),
            COALESCE(@updated_at, CURRENT_TIMESTAMP),
            @ufcc
        )
        ON CONFLICT(id) DO UPDATE SET
            store_id = excluded.store_id,
            domain_name = excluded.domain_name,
            primary_theme_color = excluded.primary_theme_color,
            primary_theme_bg = excluded.primary_theme_bg,
            sticky_header_bg = excluded.sticky_header_bg,
            btn_main_bg = excluded.btn_main_bg,
            btn_main_text = excluded.btn_main_text,
            btn_main_border = excluded.btn_main_border,
            btn_product_bg = excluded.btn_product_bg,
            btn_product_text = excluded.btn_product_text,
            btn_product_border = excluded.btn_product_border,
            btn_product_border_radius = excluded.btn_product_border_radius,
            btn_remove_cart_bg = excluded.btn_remove_cart_bg,
            btn_remove_cart_text = excluded.btn_remove_cart_text,
            btn_remove_cart_border = excluded.btn_remove_cart_border,
            btn_remove_cart_border_radius = excluded.btn_remove_cart_border_radius,
            icon_color = excluded.icon_color,
            icon_remove_color = excluded.icon_remove_color,
            created_at = excluded.created_at,
            updated_at = excluded.updated_at,
            ufcc = excluded.ufcc
    `);

    const executeBatch = db.transaction((rows) => {
        if (isReplace) {
            const delInfo = db.prepare("DELETE FROM website_color").run();
            deletedCount = delInfo.changes;
        }

        for (const row of rows) {
            const rawId = row.id ?? row.Id ?? row.ID;
            const storeId = toInt(row.store_id ?? row.storeId ?? row.StoreId ?? row.WebsiteId ?? row.websiteId ?? options.WebsiteId ?? options.websiteId);

            // Determine primary key id (if missing, use storeId or generate 1)
            let id = rawId != null && String(rawId).trim() !== "" ? toInt(rawId) : storeId || 1;

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

            const domainName = toNullableText(row.domain_name ?? row.domainName ?? row.domain ?? options.domain);
            const primaryThemeColor = toNullableText(row.primary_theme_color ?? row.primaryThemeColor);
            const primaryThemeBg = toNullableText(row.primary_theme_bg ?? row.primaryThemeBg);
            const stickyHeaderBg = toNullableText(row.sticky_header_bg ?? row.stickyHeaderBg);
            const btnMainBg = toNullableText(row.btn_main_bg ?? row.btnMainBg);
            const btnMainText = toNullableText(row.btn_main_text ?? row.btnMainText);
            const btnMainBorder = toNullableText(row.btn_main_border ?? row.btnMainBorder);
            const btnProductBg = toNullableText(row.btn_product_bg ?? row.btnProductBg);
            const btnProductText = toNullableText(row.btn_product_text ?? row.btnProductText);
            const btnProductBorder = toNullableText(row.btn_product_border ?? row.btnProductBorder);
            const btnProductBorderRadius = toNullableText(row.btn_product_border_radius ?? row.btnProductBorderRadius);
            const btnRemoveCartBg = toNullableText(row.btn_remove_cart_bg ?? row.btnRemoveCartBg);
            const btnRemoveCartText = toNullableText(row.btn_remove_cart_text ?? row.btnRemoveCartText);
            const btnRemoveCartBorder = toNullableText(row.btn_remove_cart_border ?? row.btnRemoveCartBorder);
            const btnRemoveCartBorderRadius = toNullableText(row.btn_remove_cart_border_radius ?? row.btnRemoveCartBorderRadius);
            const iconColor = toNullableText(row.icon_color ?? row.iconColor);
            const iconRemoveColor = toNullableText(row.icon_remove_color ?? row.iconRemoveColor);
            const createdAt = toNullableText(row.created_at ?? row.createdAt ?? row.CreatedDate ?? row.createdDate);
            const updatedAt = toNullableText(row.updated_at ?? row.updatedAt ?? row.ModifiedDate ?? row.modifiedDate);
            const ufcc = toNullableText(row.ufcc ?? row.Ufcc);

            upsertStmt.run({
                id,
                store_id: storeId,
                domain_name: domainName,
                primary_theme_color: primaryThemeColor,
                primary_theme_bg: primaryThemeBg,
                sticky_header_bg: stickyHeaderBg,
                btn_main_bg: btnMainBg,
                btn_main_text: btnMainText,
                btn_main_border: btnMainBorder,
                btn_product_bg: btnProductBg,
                btn_product_text: btnProductText,
                btn_product_border: btnProductBorder,
                btn_product_border_radius: btnProductBorderRadius,
                btn_remove_cart_bg: btnRemoveCartBg,
                btn_remove_cart_text: btnRemoveCartText,
                btn_remove_cart_border: btnRemoveCartBorder,
                btn_remove_cart_border_radius: btnRemoveCartBorderRadius,
                icon_color: iconColor,
                icon_remove_color: iconRemoveColor,
                created_at: createdAt,
                updated_at: updatedAt,
                ufcc,
            });
        }
    });

    executeBatch(colorList);

    const elapsedMs = Math.round((performance.now() - startTime) * 100) / 100;
    return {
        totalReceived: colorList.length,
        insertedCount,
        updatedCount,
        deletedCount,
        savedCount: insertedCount + updatedCount,
        elapsedMs,
        success: true,
    };
}

export default saveWebsiteColor;
