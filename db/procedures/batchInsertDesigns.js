/**
 * Batch inserts or updates design records into SQLite.
 * Enforces UNIQUE(ArticleNo) to prevent duplicate product entries.
 * Updates existing products with incoming details while preserving attributes.
 * Automatically logs sync actions in sync_logs table.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {Array<object>} designs
 * @param {string} [menuIdentifier='GLOBAL']
 * @returns {{ totalReceived: number, insertedCount: number, updatedCount: number, success: boolean }}
 */
export function batchInsertDesigns(db, designs = [], menuIdentifier = "GLOBAL") {
    const cleanMenu = String(menuIdentifier || "GLOBAL").trim();

    if (!Array.isArray(designs) || designs.length === 0) {
        return { totalReceived: 0, insertedCount: 0, updatedCount: 0, success: true };
    }

    const upsertStmt = db.prepare(`
        INSERT INTO designs (
            id,
            SrNo,
            DesignId,
            ArticleNo,
            designno,
            autocode,
            TitleLine,
            description,
            DisplayOrder,
            IsBestSeller,
            IsTrending,
            IsNewArrival,
            IsInReadyStock,
            IsMrpBase,
            EntryDate,
            FrontEnd1_newArrivalsto,
            DiaQuaCol,
            CsQuaCol,
            SoldCnt,
            Nwt,
            Gwt,
            Dwt,
            Dpcs,
            CSwt,
            CSpcs,
            UnitCost,
            UnitCostWithMarkUp,
            UnitCostWithMarkUpIncTax,
            Metal_Cost,
            Labour_Cost,
            Diamond_Cost,
            Diamond_SettingCost,
            ColorStone_Cost,
            ColorStone_SettingCost,
            Misc_Cost,
            Misc_SettingCost,
            Other_Cost,
            SolPrice,
            MetalPurityid,
            MetalColorid,
            MetalTypeid,
            MetalTypePurity,
            CartId,
            IsInWish,
            IsInCart,
            ImageCount,
            ColorImageCount,
            "360ImageCount",
            VideoCount,
            ImageExtension,
            "360ImageExtension",
            VideoExtension,
            IsImageNameWithRandNo,
            ImageVideoDetail,
            category,
            collection,
            sub_category,
            gender,
            brand,
            occasion,
            product_type,
            style,
            make_type,
            updated_at
        ) VALUES (
            @id,
            @SrNo,
            @DesignId,
            @ArticleNo,
            @designno,
            @autocode,
            @TitleLine,
            @description,
            @DisplayOrder,
            @IsBestSeller,
            @IsTrending,
            @IsNewArrival,
            @IsInReadyStock,
            @IsMrpBase,
            @EntryDate,
            @FrontEnd1_newArrivalsto,
            @DiaQuaCol,
            @CsQuaCol,
            @SoldCnt,
            @Nwt,
            @Gwt,
            @Dwt,
            @Dpcs,
            @CSwt,
            @CSpcs,
            @UnitCost,
            @UnitCostWithMarkUp,
            @UnitCostWithMarkUpIncTax,
            @Metal_Cost,
            @Labour_Cost,
            @Diamond_Cost,
            @Diamond_SettingCost,
            @ColorStone_Cost,
            @ColorStone_SettingCost,
            @Misc_Cost,
            @Misc_SettingCost,
            @Other_Cost,
            @SolPrice,
            @MetalPurityid,
            @MetalColorid,
            @MetalTypeid,
            @MetalTypePurity,
            @CartId,
            @IsInWish,
            @IsInCart,
            @ImageCount,
            @ColorImageCount,
            @threeSixtyImageCount,
            @VideoCount,
            @ImageExtension,
            @threeSixtyImageExtension,
            @VideoExtension,
            @IsImageNameWithRandNo,
            @ImageVideoDetail,
            @category,
            @collection,
            @sub_category,
            @gender,
            @brand,
            @occasion,
            @product_type,
            @style,
            @make_type,
            CURRENT_TIMESTAMP
        )
        ON CONFLICT(ArticleNo) DO UPDATE SET
            id = excluded.id,
            SrNo = excluded.SrNo,
            DesignId = excluded.DesignId,
            designno = excluded.designno,
            autocode = excluded.autocode,
            TitleLine = excluded.TitleLine,
            description = excluded.description,
            DisplayOrder = excluded.DisplayOrder,
            IsBestSeller = excluded.IsBestSeller,
            IsTrending = excluded.IsTrending,
            IsNewArrival = excluded.IsNewArrival,
            IsInReadyStock = excluded.IsInReadyStock,
            IsMrpBase = excluded.IsMrpBase,
            EntryDate = excluded.EntryDate,
            FrontEnd1_newArrivalsto = excluded.FrontEnd1_newArrivalsto,
            DiaQuaCol = excluded.DiaQuaCol,
            CsQuaCol = excluded.CsQuaCol,
            SoldCnt = excluded.SoldCnt,
            Nwt = excluded.Nwt,
            Gwt = excluded.Gwt,
            Dwt = excluded.Dwt,
            Dpcs = excluded.Dpcs,
            CSwt = excluded.CSwt,
            CSpcs = excluded.CSpcs,
            UnitCost = excluded.UnitCost,
            UnitCostWithMarkUp = excluded.UnitCostWithMarkUp,
            UnitCostWithMarkUpIncTax = excluded.UnitCostWithMarkUpIncTax,
            Metal_Cost = excluded.Metal_Cost,
            Labour_Cost = excluded.Labour_Cost,
            Diamond_Cost = excluded.Diamond_Cost,
            Diamond_SettingCost = excluded.Diamond_SettingCost,
            ColorStone_Cost = excluded.ColorStone_Cost,
            ColorStone_SettingCost = excluded.ColorStone_SettingCost,
            Misc_Cost = excluded.Misc_Cost,
            Misc_SettingCost = excluded.Misc_SettingCost,
            Other_Cost = excluded.Other_Cost,
            SolPrice = excluded.SolPrice,
            MetalPurityid = excluded.MetalPurityid,
            MetalColorid = excluded.MetalColorid,
            MetalTypeid = excluded.MetalTypeid,
            MetalTypePurity = excluded.MetalTypePurity,
            CartId = excluded.CartId,
            IsInWish = excluded.IsInWish,
            IsInCart = excluded.IsInCart,
            ImageCount = excluded.ImageCount,
            ColorImageCount = excluded.ColorImageCount,
            "360ImageCount" = excluded."360ImageCount",
            VideoCount = excluded.VideoCount,
            ImageExtension = excluded.ImageExtension,
            "360ImageExtension" = excluded."360ImageExtension",
            VideoExtension = excluded.VideoExtension,
            IsImageNameWithRandNo = excluded.IsImageNameWithRandNo,
            ImageVideoDetail = excluded.ImageVideoDetail,
            category = COALESCE(excluded.category, designs.category),
            collection = COALESCE(excluded.collection, designs.collection),
            sub_category = COALESCE(excluded.sub_category, designs.sub_category),
            gender = COALESCE(excluded.gender, designs.gender),
            brand = COALESCE(excluded.brand, designs.brand),
            occasion = COALESCE(excluded.occasion, designs.occasion),
            product_type = COALESCE(excluded.product_type, designs.product_type),
            style = COALESCE(excluded.style, designs.style),
            make_type = COALESCE(excluded.make_type, designs.make_type),
            updated_at = CURRENT_TIMESTAMP
    `);

    const countBefore = db.prepare("SELECT COUNT(*) as count FROM designs").get()?.count || 0;

    const executeBatch = db.transaction((rows) => {
        for (const row of rows) {
            const article = String(row.ArticleNo || row.designno || row.id || "").trim();
            if (!article) continue; // Skip invalid entries without ArticleNo

            upsertStmt.run({
                id: row.id ?? row.DesignId ?? null,
                SrNo: row.SrNo != null ? String(row.SrNo) : "",
                DesignId: row.DesignId ?? row.id ?? null,
                ArticleNo: article,
                designno: row.designno ?? "",
                autocode: row.autocode ?? "",
                TitleLine: row.TitleLine ?? "",
                description: row.description ?? "",
                DisplayOrder: Number(row.DisplayOrder) || 0,
                IsBestSeller: row.IsBestSeller ? 1 : 0,
                IsTrending: row.IsTrending ? 1 : 0,
                IsNewArrival: row.IsNewArrival ? 1 : 0,
                IsInReadyStock: row.IsInReadyStock ? 1 : 0,
                IsMrpBase: row.IsMrpBase != null ? (row.IsMrpBase ? 1 : 0) : 1,
                EntryDate: row.EntryDate ?? null,
                FrontEnd1_newArrivalsto: row.FrontEnd1_newArrivalsto ?? null,
                DiaQuaCol: row.DiaQuaCol ?? "",
                CsQuaCol: row.CsQuaCol ?? "",
                SoldCnt: Number(row.SoldCnt) || 0,
                Nwt: Number(row.Nwt) || 0,
                Gwt: Number(row.Gwt) || 0,
                Dwt: Number(row.Dwt) || 0,
                Dpcs: Number(row.Dpcs) || 0,
                CSwt: Number(row.CSwt) || 0,
                CSpcs: Number(row.CSpcs) || 0,
                UnitCost: Number(row.UnitCost) || 0,
                UnitCostWithMarkUp: Number(row.UnitCostWithMarkUp) || 0,
                UnitCostWithMarkUpIncTax: Number(row.UnitCostWithMarkUpIncTax) || 0,
                Metal_Cost: row.Metal_Cost != null ? Number(row.Metal_Cost) : null,
                Labour_Cost: row.Labour_Cost != null ? Number(row.Labour_Cost) : null,
                Diamond_Cost: row.Diamond_Cost != null ? Number(row.Diamond_Cost) : null,
                Diamond_SettingCost: row.Diamond_SettingCost != null ? Number(row.Diamond_SettingCost) : null,
                ColorStone_Cost: row.ColorStone_Cost != null ? Number(row.ColorStone_Cost) : null,
                ColorStone_SettingCost: row.ColorStone_SettingCost != null ? Number(row.ColorStone_SettingCost) : null,
                Misc_Cost: row.Misc_Cost != null ? Number(row.Misc_Cost) : null,
                Misc_SettingCost: row.Misc_SettingCost != null ? Number(row.Misc_SettingCost) : 0,
                Other_Cost: row.Other_Cost != null ? Number(row.Other_Cost) : null,
                SolPrice: Number(row.SolPrice) || 0,
                MetalPurityid: row.MetalPurityid != null ? Number(row.MetalPurityid) : null,
                MetalColorid: row.MetalColorid != null ? Number(row.MetalColorid) : null,
                MetalTypeid: row.MetalTypeid != null ? Number(row.MetalTypeid) : null,
                MetalTypePurity: row.MetalTypePurity ?? "",
                CartId: Number(row.CartId) || 0,
                IsInWish: row.IsInWish ? 1 : 0,
                IsInCart: row.IsInCart ? 1 : 0,
                ImageCount: Number(row.ImageCount) || 0,
                ColorImageCount: Number(row.ColorImageCount) || 0,
                threeSixtyImageCount: Number(row["360ImageCount"] ?? row.threeSixtyImageCount) || 0,
                VideoCount: Number(row.VideoCount) || 0,
                ImageExtension: row.ImageExtension ?? "png",
                threeSixtyImageExtension: row["360ImageExtension"] ?? row.threeSixtyImageExtension ?? "",
                VideoExtension: row.VideoExtension ?? "",
                IsImageNameWithRandNo: row.IsImageNameWithRandNo ? 1 : 0,
                ImageVideoDetail: typeof row.ImageVideoDetail === "string" ? row.ImageVideoDetail : JSON.stringify(row.ImageVideoDetail || []),
                category: row.category ?? row.Category ?? null,
                collection: row.collection ?? row.Collection ?? null,
                sub_category: row.sub_category ?? row.SubCategory ?? row.subcategory ?? null,
                gender: row.gender ?? row.Gender ?? null,
                brand: row.brand ?? row.Brand ?? null,
                occasion: row.occasion ?? row.Occasion ?? null,
                product_type: row.product_type ?? row.ProductType ?? row.producttype ?? null,
                style: row.style ?? row.Style ?? null,
                make_type: row.make_type ?? row.MakeType ?? row.maketype ?? null,
            });
        }
    });

    executeBatch(designs);

    const countAfter = db.prepare("SELECT COUNT(*) as count FROM designs").get()?.count || 0;
    const insertedCount = Math.max(0, countAfter - countBefore);
    const updatedCount = designs.length - insertedCount;

    // Log to sync_logs
    try {
        db.prepare(`
            INSERT INTO sync_logs (menu_identifier, action, total_received, inserted_count, updated_count, status, message)
            VALUES (?, 'SYNC_PRODUCTS', ?, ?, ?, 'SUCCESS', ?)
        `).run(cleanMenu, designs.length, insertedCount, updatedCount, `Processed ${designs.length} products (Inserted: ${insertedCount}, Updated: ${updatedCount})`);
    } catch (logErr) {
        console.warn("[sync_logs] Failed writing log:", logErr.message);
    }

    // Flush WAL to database.db so external GUI tools see data immediately
    try {
        db.pragma("wal_checkpoint(PASSIVE)");
    } catch (_) {}

    return {
        totalReceived: designs.length,
        insertedCount,
        updatedCount,
        success: true,
    };
}

export default batchInsertDesigns;
