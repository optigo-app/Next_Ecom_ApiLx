import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { CommonAPI } from "@/app/(core)/utils/API/CommonAPI/CommonAPI";

// Generic fetcher for combos that works on the server
const fetchCombo = async (mode, funcName, pValue, customerEmail, storeInit) => {
    const body = {
        con: JSON.stringify({ id: "", mode, appuserid: customerEmail ?? "" }),
        f: funcName,
        p: JSON.stringify(pValue),
    };
    return CommonAPI(body, storeInit);
};

// The actual cached fetching function
const getAggregatedCombos = unstable_cache(
    async (finalID, storeInit) => {
        console.log(`[ComboCache] Fetching fresh combos for: ${storeInit?.FrontEnd_RegNo}, ID: ${finalID}`);

        const customerEmail = finalID; // Logic from individual APIs
        const customerId = finalID;
        const FrontEnd_RegNo = storeInit?.FrontEnd_RegNo;

        const results = {};

        // 1. MetalTypeCombo
        results.metalTypeCombo = await fetchCombo(
            "METALTYPECOMBO",
            "Account (changePassword)",
            { FrontEnd_RegNo, Customerid: customerId },
            customerEmail,
            storeInit
        );

        // 2. DiamondQualityColorCombo
        results.diamondQualityColorCombo = await fetchCombo(
            "DIAMONDQUALITYCOLORCOMBO",
            "Account (changePassword)",
            { FrontEnd_RegNo, Customerid: customerId },
            customerEmail,
            storeInit
        );

        // 3. MetalColorCombo
        results.MetalColorCombo = await fetchCombo(
            "METALCOLORCOMBO",
            "Account (changePassword)",
            { FrontEnd_RegNo, Customerid: customerId },
            customerEmail,
            storeInit
        );

        // 4. ColorStoneQualityColorCombo
        results.ColorStoneQualityColorCombo = await fetchCombo(
            "COLORSTONEQUALITYCOLORCOMBO",
            "Account (changePassword)",
            { FrontEnd_RegNo, Customerid: customerId },
            customerEmail,
            storeInit
        );

        // 5. CurrencyCombo
        results.CurrencyCombo = await fetchCombo(
            "CURRENCYCOMBO",
            "Account (changePassword)",
            { FrontEnd_RegNo, Customerid: customerId },
            customerEmail,
            storeInit
        );

        // 6. CountryCodeList
        results.CountryCodeListApi = await fetchCombo(
            "GETCOUNTRYLIST",
            "Account (changePassword)",
            { FrontEnd_RegNo },
            customerEmail,
            storeInit
        );

        // 7. GetCacheList
        results.GetCacheList = await fetchCombo(
            "GetCacheRebuildDate",
            "Cache (GetCacheRebuildDate)",
            { FrontEnd_RegNo, Customerid: customerId, ForEvt: "GetCacheRebuildDate" },
            customerEmail,
            storeInit
        );

        return results;
    },
    ['combos-cache'], // base cache key
    {
        revalidate: 1800, // 30 minutes
        tags: ['combos']
    }
);

export async function POST(request) {
    try {
        const body = await request.json();
        const { finalID, storeInit } = body;

        if (!finalID || !storeInit) {
            return NextResponse.json({ error: "Missing finalID or storeInit" }, { status: 400 });
        }

        // We include finalID and FrontEnd_RegNo in the unstable_cache key indirectly by passing them as arguments
        const data = await getAggregatedCombos(finalID, storeInit);

        return NextResponse.json(data);
    } catch (error) {
        console.error("[Combos API Route] Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
