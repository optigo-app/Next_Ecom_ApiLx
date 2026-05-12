
export const buildMenuItems = (menuData = []) => {
    if (!Array.isArray(menuData) || menuData.length === 0) return [];

    // ─────────────────────────────────────────────
    // Pre-group by menuid (FAST)
    // ─────────────────────────────────────────────
    const menuGroups = {};

    for (const row of menuData) {
        const menuid = row?.menuid;
        if (!menuGroups[menuid]) {
            menuGroups[menuid] = [];
        }
        menuGroups[menuid].push(row);
    }

    // ─────────────────────────────────────────────
    // Build final structure (SAME SHAPE)
    // ─────────────────────────────────────────────
    const menuItems = Object.keys(menuGroups).map((menuid) => {
        const menuRows = menuGroups[menuid];
        const item = menuRows[0]; // same as your `.find()`

        // unique param1dataid (same logic, faster)
        const param1Ids = [...new Set(menuRows.map((r) => r?.param1dataid))];

        const param1Items = param1Ids.map((param1dataid) => {
            const param1Rows = menuRows.filter(
                (r) => r?.param1dataid === param1dataid
            );

            const param1Item = param1Rows[0]; // same as `.find()`

            const param2Items = param1Rows.map((r) => ({
                param2dataid: r?.param2dataid,
                param2dataname: r?.param2dataname,
                param2id: r?.param2id,
                param2name: r?.param2name,
                IsFilterKey2Ignore: r?.IsFilterKey1Ignore,
            }));

            return {
                menuname: param1Item?.menuname,
                param1dataid: param1Item?.param1dataid,
                param1dataname: param1Item?.param1dataname,
                param1id: param1Item?.param1id,
                param1name: param1Item?.param1name,
                param2: param2Items,
                IsFilterKey1Ignore: param1Item?.IsFilterKey1Ignore,
            };
        });

        return {
            menuid: item?.menuid,
            menuname: item?.menuname,
            param0dataid: item?.param0dataid,
            param0dataname: item?.param0dataname,
            param0id: item?.param0id,
            param0name: item?.param0name,
            param1: param1Items,
            IsFilterKey1Ignore: item?.IsFilterKey1Ignore,
            displayorder: item?.displayorder,
        };
    });

    // SAME sorting behavior
    return menuItems.sort(
        (a, b) => a?.displayorder - b?.displayorder
    );
};
