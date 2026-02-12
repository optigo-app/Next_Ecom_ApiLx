import { NEXT_APP_WEB } from "./env";

export async function getDomainInfo() {
    try {
        // ✅ If running on server
        if (typeof window === "undefined") {
            const { headers } = await import("next/headers");
            const headerList = await headers();

            const rawHost = headerList.get("x-forwarded-host") || headerList.get("host") || "";
            console.log("🚀 ~ getDomainInfo ~ rawHost:", rawHost)
            const rawProto = headerList.get("x-forwarded-proto") || "https";
            console.log("🚀 ~ getDomainInfo ~ rawProto:", rawProto)

            return {
                hostname: rawHost || NEXT_APP_WEB,
                protocol: `${rawProto}:`,
            };
        }
        const { hostname, protocol } = window.location;
        return {
            hostname: hostname.replace(/^www\./, ""),
            protocol,
        };
    } catch (error) {
        console.error("😉 ~ getDomainInfo ~ error:", error);
        return {
            hostname: NEXT_APP_WEB,
            protocol:
                process.env.NODE_ENV === "development" ? "http:" : "https:",
        };
    }
}

// "use server";
// import { headers } from "next/headers";
// import { NEXT_APP_WEB } from "./env";

// export async function getDomainInfo() {
//     try {
//         const headerList = await headers();
//         const headersObj = {};

//         headerList.forEach((value, key) => {
//             headersObj[key] = value;
//         });
//         if (process.env.NODE_ENV === "development") {
//         }
//         const rawHost = headerList.get("x-forwarded-host") || "";
//         const rawProto = headerList.get("x-forwarded-proto") || "";
//         const hostname = rawHost || NEXT_APP_WEB;
//         const protocol = `${rawProto}:`;
//         return { hostname, protocol };
//     } catch (error) {
//         console.error("😉 ~ getDomainInfo ~ error:", error);
//         return {
//             hostname: NEXT_APP_WEB,
//             protocol: process.env.NODE_ENV === "development" ? "http:" : "https:",
//         };
//     }
// }
