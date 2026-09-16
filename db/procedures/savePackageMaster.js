/**
 * Saves or updates package master items into packagemaster table.
 * Supports raw wrapped payload ({ Data: { rd: [...] } } or { rd: [...] }) or direct array.
 * Robustly matches both "PackageName" and "asPackageName" keys.
 * Enforces PRIMARY KEY (id) upsert.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {Array<object>|object} rawPayload - array or response payload of package master objects
 * @returns {{ totalReceived: number, savedCount: number, elapsedMs: number, success: boolean }}
 */
export function savePackageMaster(db, rawPayload = []) {
    const startTime = performance.now();

    let packageList = [];
    if (Array.isArray(rawPayload)) {
        packageList = rawPayload;
    } else if (rawPayload && typeof rawPayload === "object") {
        packageList = rawPayload?.Data?.rd || rawPayload?.rd || [];
    }

    if (!Array.isArray(packageList) || packageList.length === 0) {
        return {
            totalReceived: 0,
            savedCount: 0,
            elapsedMs: Math.round((performance.now() - startTime) * 100) / 100,
            success: true,
        };
    }

    const upsertStmt = db.prepare(`
        INSERT INTO packagemaster (
            id,
            asPackageName,
            IncludePackageid,
            IncludePackagename,
            updated_at
        ) VALUES (
            @id,
            @asPackageName,
            @IncludePackageid,
            @IncludePackagename,
            CURRENT_TIMESTAMP
        )
        ON CONFLICT(id) DO UPDATE SET
            asPackageName = excluded.asPackageName,
            IncludePackageid = excluded.IncludePackageid,
            IncludePackagename = excluded.IncludePackagename,
            updated_at = CURRENT_TIMESTAMP
    `);

    const executeBatch = db.transaction((rows) => {
        let count = 0;
        for (const row of rows) {
            if (row.id === undefined || row.id === null) continue;

            const pkgName = row.PackageName ?? row.asPackageName ?? row.packageName ?? row.packagename ?? "";
            const includeIds = row.IncludePackageid ?? row.IncludePackageId ?? row.includePackageId ?? row.includepackageid ?? "";
            const includeNames = row.IncludePackagename ?? row.IncludePackageName ?? row.includePackageName ?? row.includepackagename ?? "";

            upsertStmt.run({
                id: Number(row.id),
                asPackageName: String(pkgName).trim(),
                IncludePackageid: String(includeIds).trim(),
                IncludePackagename: String(includeNames).trim(),
            });
            count++;
        }
        return count;
    });

    const savedCount = executeBatch(packageList);
    const elapsedMs = Math.round((performance.now() - startTime) * 100) / 100;

    return {
        totalReceived: packageList.length,
        savedCount,
        elapsedMs,
        success: true,
    };
}

export default savePackageMaster;
