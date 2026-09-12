import { NEXT_APP_WEB } from "./env";

export async function getDomainInfo() {
    try {
        // ✅ If running on server
        if (typeof window === "undefined") {
            let headerList;
            try {
                const { headers } = await import("next/headers");
                headerList = await headers();
            } catch (e) {
                return {
                    hostname: NEXT_APP_WEB,
                    protocol: process.env.NODE_ENV === "development" ? "http:" : "https:",
                };
            }

            const rawHost = headerList?.get("x-forwarded-host") || headerList?.get("host") || "";
            const rawProto = headerList?.get("x-forwarded-proto") || "https";

            let host = rawHost.split(":")[0];
            if (!host || host === "localhost" || host === "127.0.0.1") {
                host = NEXT_APP_WEB;
            }

            return {
                hostname: host || NEXT_APP_WEB,
                protocol: `${rawProto}:`,
            };
        }
        const { hostname, protocol } = window.location;
        let clientHost = hostname.replace(/^www\./, "");
        if (clientHost === "localhost" || clientHost === "127.0.0.1") {
            clientHost = NEXT_APP_WEB;
        }
        return {
            hostname: clientHost || NEXT_APP_WEB,
            protocol,
        };

    } catch (error) {
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
