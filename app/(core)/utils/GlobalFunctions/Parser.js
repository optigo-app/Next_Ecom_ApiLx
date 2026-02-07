

/**
 * Safely parses and decodes searchParams
 * @param {object|string} searchParams - The search parameters to process
 * @returns {Array<string>} - Array of key=reEncodedBase64 strings
 */
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


/**
 * Safely parses and decodes searchParams
 * @param {object|string} searchParams - The search parameters to process
 * @returns {Array<string>} - Array of key=reEncodedBase64 strings
 */
export const ParseAndDecodeSearchParams = (searchParams) => {
    let result = [];

    try {
        let parsed = searchParams;

        // If searchParams is a string, attempt to JSON.parse it
        if (typeof searchParams === "string") {
            try {
                parsed = JSON.parse(searchParams);
            } catch (e) {
                console.error("❌ Failed to parse searchParams string:", e);
                parsed = null;
            }
        }

        // If parsed is a valid object, process each key/value
        if (parsed && typeof parsed === "object") {
            result = Object.entries(parsed).map(([key, value]) => {
                if (typeof value !== "string") return `${key}=null`;

                try {
                    // Replace spaces with + (common issue with Base64 in URLs)
                    let fixed = value.replace(/ /g, "+");

                    // Ensure padding length is correct
                    const paddingNeeded = (4 - (fixed.length % 4)) % 4;
                    if (paddingNeeded !== 0) {
                        fixed = fixed.padEnd(fixed.length + paddingNeeded, "=");
                    }

                    // Decode and then re-encode to ensure valid Base64
                    const decoded = atob(fixed);
                    const reEncoded = btoa(decoded);
                    return `${key}=${reEncoded}`;
                } catch (e) {
                    console.error(`❌ Error decoding key "${key}":`, e);
                    return `${key}=null`;
                }
            });
        }
    } catch (err) {
        console.error("❌ Unexpected error in searchParams processing:", err);
    }

    return result;
};
