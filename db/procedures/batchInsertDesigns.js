/**
 * Batch inserts or updates design records into SQLite.
 * Enforces UNIQUE(ArticleNo) to prevent duplicate product entries.
 * Updates existing products with incoming details while preserving attributes.
 * Automatically logs sync actions in sync_logs table.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {Array<object>} rawPayload
 * @param {string} [menuIdentifier='GLOBAL']
 * @param {object} [options={}]
 * @returns {{ totalReceived: number, insertedCount: number, updatedCount: number, totalInDatabase: number, duplicatesInPayload: number, success: boolean }}
 */
export function batchInsertDesigns(db, rawPayload = [], menuIdentifier = "GLOBAL", options = {}) {
    const cleanMenu = String(menuIdentifier || "GLOBAL").trim();

    // If caller requested truncating/clearing before sync
    if (options?.truncate || options?.clearBeforeSync || options?.flush) {
        try {
            db.prepare("DELETE FROM designs").run();
        } catch (_) {}
    }

    let designs = [];
    if (Array.isArray(rawPayload)) {
        designs = rawPayload;
    } else if (rawPayload && typeof rawPayload === "object") {
        designs = rawPayload.products || rawPayload.Data?.rd || rawPayload.rd || [];
    }

    if (!Array.isArray(designs) || designs.length === 0) {
        const count = db.prepare("SELECT COUNT(*) as count FROM designs").get()?.count || 0;
        return { totalReceived: 0, insertedCount: 0, updatedCount: 0, totalInDatabase: count, duplicatesInPayload: 0, success: true };
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
            PackageIdList,
            ExclusiveCustomerId,
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
            product_typeid,
            collectionid,
            categoryid,
            sub_categoryid,
            brandid,
            genderid,
            occasionid,
            Styleid,
            make_typeid,
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
            @PackageIdList,
            @ExclusiveCustomerId,
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
            @product_typeid,
            @collectionid,
            @categoryid,
            @sub_categoryid,
            @brandid,
            @genderid,
            @occasionid,
            @Styleid,
            @make_typeid,
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
            PackageIdList = excluded.PackageIdList,
            ExclusiveCustomerId = excluded.ExclusiveCustomerId,
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
            product_typeid = excluded.product_typeid,
            collectionid = excluded.collectionid,
            categoryid = excluded.categoryid,
            sub_categoryid = excluded.sub_categoryid,
            brandid = excluded.brandid,
            genderid = excluded.genderid,
            occasionid = excluded.occasionid,
            Styleid = excluded.Styleid,
            make_typeid = excluded.make_typeid,
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

    const getVal = (row, ...keys) => {
        for (const k of keys) {
            if (row[k] !== undefined && row[k] !== null) return row[k];
        }
        return undefined;
    };

    const toStr = (v, def = "") => (v !== undefined && v !== null ? String(v).trim() : def);
    const toInt = (v, def = 0) => {
        const n = Number(v);
        return Number.isFinite(n) ? Math.trunc(n) : def;
    };
    const toNum = (v, def = 0) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : def;
    };
    const toNullableNum = (v) => {
        if (v === undefined || v === null || v === "") return null;
        const n = Number(v);
        return Number.isFinite(n) ? n : null;
    };

    const countBefore = db.prepare("SELECT COUNT(*) as count FROM designs").get()?.count || 0;

    const executeBatch = db.transaction((rows) => {
        for (const row of rows) {
            const rawArticle = getVal(row, "ArticleNo", "articleno", "articleNo", "designno", "id", "DesignId");
            const article = toStr(rawArticle);
            if (!article) continue; // Skip invalid entries without ArticleNo

            upsertStmt.run({
                id: toNullableNum(getVal(row, "id", "Id", "DesignId")),
                SrNo: toStr(getVal(row, "SrNo", "srno", "srNo")),
                DesignId: toNullableNum(getVal(row, "DesignId", "designid", "id")),
                ArticleNo: article,
                designno: toStr(getVal(row, "designno", "DesignNo")),
                autocode: toStr(getVal(row, "autocode", "AutoCode")),
                TitleLine: toStr(getVal(row, "TitleLine", "titleline")),
                description: toStr(getVal(row, "description", "Description")),
                DisplayOrder: toInt(getVal(row, "DisplayOrder", "displayorder")),
                IsBestSeller: getVal(row, "IsBestSeller", "isbestseller") ? 1 : 0,
                IsTrending: getVal(row, "IsTrending", "istrending") ? 1 : 0,
                IsNewArrival: getVal(row, "IsNewArrival", "isnewarrival") ? 1 : 0,
                IsInReadyStock: getVal(row, "IsInReadyStock", "isinreadystock") ? 1 : 0,
                IsMrpBase: getVal(row, "IsMrpBase", "ismrpbase") != null ? (getVal(row, "IsMrpBase", "ismrpbase") ? 1 : 0) : 1,
                EntryDate: getVal(row, "EntryDate", "entrydate") ?? null,
                FrontEnd1_newArrivalsto: getVal(row, "FrontEnd1_newArrivalsto", "frontend1_newarrivalsto") ?? null,
                DiaQuaCol: toStr(getVal(row, "DiaQuaCol", "diaquacol")),
                CsQuaCol: toStr(getVal(row, "CsQuaCol", "csquacol")),
                SoldCnt: toInt(getVal(row, "SoldCnt", "soldcnt")),
                Nwt: toNum(getVal(row, "Nwt", "nwt")),
                Gwt: toNum(getVal(row, "Gwt", "gwt")),
                Dwt: toNum(getVal(row, "Dwt", "dwt")),
                Dpcs: toInt(getVal(row, "Dpcs", "dpcs")),
                CSwt: toNum(getVal(row, "CSwt", "cswt")),
                CSpcs: toInt(getVal(row, "CSpcs", "cspcs")),
                UnitCost: toNum(getVal(row, "UnitCost", "unitcost")),
                UnitCostWithMarkUp: toNum(getVal(row, "UnitCostWithMarkUp", "unitcostwithmarkup")),
                UnitCostWithMarkUpIncTax: toNum(getVal(row, "UnitCostWithMarkUpIncTax", "unitcostwithmarkupinctax")),
                Metal_Cost: toNullableNum(getVal(row, "Metal_Cost", "metal_cost")),
                Labour_Cost: toNullableNum(getVal(row, "Labour_Cost", "labour_cost")),
                Diamond_Cost: toNullableNum(getVal(row, "Diamond_Cost", "diamond_cost")),
                Diamond_SettingCost: toNullableNum(getVal(row, "Diamond_SettingCost", "diamond_settingcost")),
                ColorStone_Cost: toNullableNum(getVal(row, "ColorStone_Cost", "colorstone_cost")),
                ColorStone_SettingCost: toNullableNum(getVal(row, "ColorStone_SettingCost", "colorstone_settingcost")),
                Misc_Cost: toNullableNum(getVal(row, "Misc_Cost", "misc_cost")),
                Misc_SettingCost: toNum(getVal(row, "Misc_SettingCost", "misc_settingcost")),
                Other_Cost: toNullableNum(getVal(row, "Other_Cost", "other_cost")),
                SolPrice: toNum(getVal(row, "SolPrice", "solprice")),
                MetalPurityid: toNullableNum(getVal(row, "MetalPurityid", "metalpurityid")),
                MetalColorid: toNullableNum(getVal(row, "MetalColorid", "metalcolorid")),
                PackageIdList: toStr(getVal(row, "PackageIdList", "packageidlist", "packageIdList", "Packageidlist")),
                ExclusiveCustomerId: toStr(getVal(row, "ExclusiveCustomerId", "exclusivecustomerid", "exclusiveCustomerId")),
                MetalTypeid: toNullableNum(getVal(row, "MetalTypeid", "metaltypeid")),
                MetalTypePurity: toStr(getVal(row, "MetalTypePurity", "metaltypepurity")),
                CartId: toInt(getVal(row, "CartId", "cartid")),
                IsInWish: getVal(row, "IsInWish", "isinwish") ? 1 : 0,
                IsInCart: getVal(row, "IsInCart", "isincart") ? 1 : 0,
                ImageCount: toInt(getVal(row, "ImageCount", "imagecount")),
                ColorImageCount: toInt(getVal(row, "ColorImageCount", "colorimagecount")),
                threeSixtyImageCount: toInt(getVal(row, "360ImageCount", "threeSixtyImageCount", "360imagecount")),
                VideoCount: toInt(getVal(row, "VideoCount", "videocount")),
                ImageExtension: toStr(getVal(row, "ImageExtension", "imageextension"), "png"),
                threeSixtyImageExtension: toStr(getVal(row, "360ImageExtension", "threeSixtyImageExtension", "360imageextension")),
                VideoExtension: toStr(getVal(row, "VideoExtension", "videoextension")),
                IsImageNameWithRandNo: getVal(row, "IsImageNameWithRandNo", "isimagenamewithrandno") ? 1 : 0,
                ImageVideoDetail: typeof getVal(row, "ImageVideoDetail", "imagevideodetail") === "string" 
                    ? getVal(row, "ImageVideoDetail", "imagevideodetail") 
                    : JSON.stringify(getVal(row, "ImageVideoDetail", "imagevideodetail") || []),
                product_typeid: toNullableNum(getVal(row, "product_typeid", "producttypeid", "Product_Typeid", "ProductTypeid")),
                collectionid: toNullableNum(getVal(row, "collectionid", "Collectionid", "CollectionId")),
                categoryid: toNullableNum(getVal(row, "categoryid", "Categoryid", "CategoryId")),
                sub_categoryid: toNullableNum(getVal(row, "sub_categoryid", "subcategoryid", "Sub_Categoryid", "SubCategoryId")),
                brandid: toNullableNum(getVal(row, "brandid", "Brandid", "BrandId")),
                genderid: toNullableNum(getVal(row, "genderid", "Genderid", "GenderId")),
                occasionid: toNullableNum(getVal(row, "occasionid", "Occasionid", "OccasionId")),
                Styleid: toNullableNum(getVal(row, "Styleid", "styleid", "StyleId")),
                make_typeid: toNullableNum(getVal(row, "make_typeid", "maketypeid", "Make_Typeid", "MakeTypeId")),
                category: getVal(row, "category", "Category") ?? null,
                collection: getVal(row, "collection", "Collection") ?? null,
                sub_category: getVal(row, "sub_category", "SubCategory", "subcategory") ?? null,
                gender: getVal(row, "gender", "Gender") ?? null,
                brand: getVal(row, "brand", "Brand") ?? null,
                occasion: getVal(row, "occasion", "Occasion") ?? null,
                product_type: getVal(row, "product_type", "ProductType", "producttype") ?? null,
                style: getVal(row, "style", "Style") ?? null,
                make_type: getVal(row, "make_type", "MakeType", "maketype") ?? null,
            });
        }
    });

    executeBatch(designs);

    const countAfter = db.prepare("SELECT COUNT(*) as count FROM designs").get()?.count || 0;
    const insertedCount = Math.max(0, countAfter - countBefore);
    const updatedCount = designs.length - insertedCount;

    // Detect if there were duplicate ArticleNos within the incoming batch itself
    const seenArticles = new Set();
    let duplicatesInPayload = 0;
    for (const row of designs) {
        const rawArticle = getVal(row, "ArticleNo", "articleno", "articleNo", "designno", "id", "DesignId");
        const article = toStr(rawArticle);
        if (article) {
            if (seenArticles.has(article)) {
                duplicatesInPayload++;
            } else {
                seenArticles.add(article);
            }
        }
    }

    // Log to sync_logs
    try {
        db.prepare(`
            INSERT INTO sync_logs (menu_identifier, action, total_received, inserted_count, updated_count, status, message)
            VALUES (?, 'SYNC_PRODUCTS', ?, ?, ?, 'SUCCESS', ?)
        `).run(cleanMenu, designs.length, insertedCount, updatedCount, `Processed ${designs.length} products (Inserted: ${insertedCount}, Updated: ${updatedCount}, In-DB: ${countAfter})`);
    } catch (logErr) {
        console.warn("[sync_logs] Failed writing log:", logErr.message);
    }

    // Flush WAL to database.db so external GUI tools (DB Browser, SQLite tools) see data immediately
    try {
        db.pragma("wal_checkpoint(TRUNCATE)");
    } catch (_) {}

    return {
        totalReceived: designs.length,
        insertedCount,
        updatedCount,
        totalInDatabase: countAfter,
        duplicatesInPayload,
        success: true,
    };
}

export default batchInsertDesigns;
