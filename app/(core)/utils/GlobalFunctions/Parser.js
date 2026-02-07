


export const SearchParamsParser = (searchParams) => {
    const result = [];

    try {
        const p = searchParams?.p;
        if (!p) return result;

        // Decode URL encoding
        let decodedParam = decodeURIComponent(p.replace(/ /g, "+"));

        // Convert URL-safe Base64 to standard Base64
        decodedParam = decodedParam.replace(/-/g, "+").replace(/_/g, "/");

        // Fix padding
        const padding = decodedParam.length % 4;
        if (padding !== 0) decodedParam = decodedParam.padEnd(decodedParam.length + (4 - padding), "=");

        // Split multiple key=value pairs if necessary
        // In your current usage, it looks like a single encoded value
        result.push(`p=${decodedParam}`);

    } catch (err) {
        console.error("❌ parseSearchParams failed:", err);
    }

    return result;
};
