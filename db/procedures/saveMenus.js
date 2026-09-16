/**
 * Saves or updates menu items from GETMENU API into menus table.
 * Supports raw wrapped payload ({ Data: { rd: [...] } } or { rd: [...] }) or direct array.
 * Enforces PRIMARY KEY (id) upsert.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {Array<object>|object} rawPayload - array or response payload of menu objects from GETMENU API
 * @returns {{ totalReceived: number, savedCount: number, elapsedMs: number, success: boolean }}
 */
export function saveMenus(db, rawPayload = []) {
    const startTime = performance.now();

    // Extract rd array if wrapped in Data or rd
    let menuList = [];
    if (Array.isArray(rawPayload)) {
        menuList = rawPayload;
    } else if (rawPayload && typeof rawPayload === "object") {
        menuList = rawPayload?.Data?.rd || rawPayload?.rd || [];
    }

    if (!Array.isArray(menuList) || menuList.length === 0) {
        return {
            totalReceived: 0,
            savedCount: 0,
            elapsedMs: Math.round((performance.now() - startTime) * 100) / 100,
            success: true,
        };
    }

    const upsertStmt = db.prepare(`
        INSERT INTO menus (
            id,
            SrNo,
            levelid,
            menuid,
            menuname,
            IsHashTag,
            link,
            displayorder,
            param0id,
            param0name,
            param0dataid,
            param0dataname,
            param1id,
            param1name,
            param1dataid,
            param1dataname,
            param2id,
            param2name,
            param2dataid,
            param2dataname,
            IsFilterKey1Ignore,
            PackageIdList,
            ExclusiveCustomerId,
            updated_at
        ) VALUES (
            @id,
            @SrNo,
            @levelid,
            @menuid,
            @menuname,
            @IsHashTag,
            @link,
            @displayorder,
            @param0id,
            @param0name,
            @param0dataid,
            @param0dataname,
            @param1id,
            @param1name,
            @param1dataid,
            @param1dataname,
            @param2id,
            @param2name,
            @param2dataid,
            @param2dataname,
            @IsFilterKey1Ignore,
            @PackageIdList,
            @ExclusiveCustomerId,
            CURRENT_TIMESTAMP
        )
        ON CONFLICT(id) DO UPDATE SET
            SrNo = excluded.SrNo,
            levelid = excluded.levelid,
            menuid = excluded.menuid,
            menuname = excluded.menuname,
            IsHashTag = excluded.IsHashTag,
            link = excluded.link,
            displayorder = excluded.displayorder,
            param0id = excluded.param0id,
            param0name = excluded.param0name,
            param0dataid = excluded.param0dataid,
            param0dataname = excluded.param0dataname,
            param1id = excluded.param1id,
            param1name = excluded.param1name,
            param1dataid = excluded.param1dataid,
            param1dataname = excluded.param1dataname,
            param2id = excluded.param2id,
            param2name = excluded.param2name,
            param2dataid = excluded.param2dataid,
            param2dataname = excluded.param2dataname,
            IsFilterKey1Ignore = excluded.IsFilterKey1Ignore,
            PackageIdList = excluded.PackageIdList,
            ExclusiveCustomerId = excluded.ExclusiveCustomerId,
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

    const executeBatch = db.transaction((rows) => {
        let count = 0;
        for (const row of rows) {
            const rawId = getVal(row, "id", "Id", "ID");
            if (rawId === undefined || rawId === null || rawId === "") continue;

            upsertStmt.run({
                id: toInt(rawId),
                SrNo: toStr(getVal(row, "SrNo", "srno", "srNo", "Srno")),
                levelid: toInt(getVal(row, "levelid", "LevelId", "Levelid", "levelId")),
                menuid: toInt(getVal(row, "menuid", "MenuId", "Menuid", "menuId")),
                menuname: toStr(getVal(row, "menuname", "MenuName", "menuName")),
                IsHashTag: toInt(getVal(row, "IsHashTag", "ishashtag", "isHashTag", "Ishashtag")),
                link: toStr(getVal(row, "link", "Link")),
                displayorder: toInt(getVal(row, "displayorder", "DisplayOrder", "displayOrder", "Displayorder")),
                param0id: toInt(getVal(row, "param0id", "Param0Id", "param0Id")),
                param0name: toStr(getVal(row, "param0name", "Param0Name", "param0Name")),
                param0dataid: toInt(getVal(row, "param0dataid", "Param0DataId", "param0DataId")),
                param0dataname: toStr(getVal(row, "param0dataname", "Param0DataName", "param0DataName")),
                param1id: toInt(getVal(row, "param1id", "Param1Id", "param1Id")),
                param1name: toStr(getVal(row, "param1name", "Param1Name", "param1Name")),
                param1dataid: toInt(getVal(row, "param1dataid", "Param1DataId", "param1DataId")),
                param1dataname: toStr(getVal(row, "param1dataname", "Param1DataName", "param1DataName")),
                param2id: toInt(getVal(row, "param2id", "Param2Id", "param2Id")),
                param2name: toStr(getVal(row, "param2name", "Param2Name", "param2Name")),
                param2dataid: toInt(getVal(row, "param2dataid", "Param2DataId", "param2DataId")),
                param2dataname: toStr(getVal(row, "param2dataname", "Param2DataName", "param2DataName")),
                IsFilterKey1Ignore: toInt(getVal(row, "IsFilterKey1Ignore", "isfilterkey1ignore", "isFilterKey1Ignore", "IsFilterkey1Ignore")),
                PackageIdList: toStr(getVal(row, "PackageIdList", "packageidlist", "packageIdList", "Packageidlist", "PackageIDList")),
                ExclusiveCustomerId: toStr(getVal(row, "ExclusiveCustomerId", "exclusivecustomerid", "exclusiveCustomerId", "ExclusiveCustomerID")),
            });
            count++;
        }
        return count;
    });

    const savedCount = executeBatch(menuList);
    const elapsedMs = Math.round((performance.now() - startTime) * 100) / 100;

    return {
        totalReceived: menuList.length,
        savedCount,
        elapsedMs,
        success: true,
    };
}

export default saveMenus;
