import { NextResponse } from "next/server";
import { getStoreInitData } from "@/app/(core)/cache_utility/storeInitCache";

export default async function middleware(req) {
  const isRsc = req.headers.get("rsc") === "1" || req.nextUrl.searchParams.has("_rsc") || req.headers.has("next-action");
  if (isRsc) {
    return NextResponse.next();
  }

  const host = req.headers.get("host");

  const storeData = await getStoreInitData(host);

  const response = NextResponse.next();

  response.cookies.set(
    "x-store-data",
    JSON.stringify(storeData?.rd?.[0] || {}),
    {
      path: "/",
      httpOnly: false,
    },
  );

  response.cookies.set(
    "x-myAccountFlags-data",
    JSON.stringify(storeData?.rd1 || []),
    {
      path: "/",
      httpOnly: false,
    },
  );

  response.cookies.set(
    "x-CompanyInfoData-data",
    JSON.stringify(storeData?.rd2?.[0] || {}),
    {
      path: "/",
      httpOnly: false,
    },
  );

  return response;
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
  runtime: "nodejs",
};



// import { NextResponse } from "next/server";
// import { fetchStoreInitData } from "@/app/(core)/utils/fetchStoreInit";
// import { NEXT_APP_WEB } from "@/app/(core)/utils/env";
// import fs from "fs";
// import path from "path";

// const domainMap = {
//   localhost: NEXT_APP_WEB,
// };

// function handleMiddlewareStoreInitCache(host, fetchedData) {
//   try {
//     const cleanHost = host ? host.split(":")[0].replace(/[:\/]/g, "_") : NEXT_APP_WEB;
//     const storeInitDir = path.join(process.cwd(), "public", "storeInit");
//     const filePath = path.join(storeInitDir, `${cleanHost}_storeInit.json`);

//     let localData = null;
//     let localFileCreateDate = null;

//     if (fs.existsSync(filePath)) {
//       try {
//         const content = fs.readFileSync(filePath, "utf8");
//         localData = JSON.parse(content);
//         localFileCreateDate =
//           localData?.rd?.[0]?.FileCreateDate || localData?.FileCreateDate || null;
//       } catch (err) {
//         console.warn(`[Middleware File Cache] Error reading local file at "${filePath}":`, err.message);
//       }
//     }

//     const remoteFileCreateDate =
//       fetchedData?.rd?.[0]?.FileCreateDate || fetchedData?.FileCreateDate || null;

//     if (
//       localData &&
//       localFileCreateDate &&
//       remoteFileCreateDate &&
//       localFileCreateDate === remoteFileCreateDate
//     ) {
//       console.log(
//         `📁 [Middleware File Cache] Local file is UP TO DATE (FileCreateDate: "${remoteFileCreateDate}"). Path: "${filePath}"`
//       );
//       return localData;
//     }

//     if (!fs.existsSync(storeInitDir)) {
//       fs.mkdirSync(storeInitDir, { recursive: true });
//     }

//     fs.writeFileSync(filePath, JSON.stringify(fetchedData, null, 2), "utf8");
//     console.log(
//       `💾 [Middleware File Cache] UPDATED/WRITTEN local file at "${filePath}" (FileCreateDate: "${remoteFileCreateDate || "N/A"}").`
//     );

//     return fetchedData;
//   } catch (error) {
//     console.error("❌ [Middleware File Cache Error]:", error);
//     return fetchedData;
//   }
// }

// export default async function middleware(req) {
//   try {
//     const { cookies, nextUrl, headers } = req;
//     const host = req.headers.get("host");
//     console.log(headers, host, "headers");
//     let storeData = {};

//     try {
//       const fetchedData = await fetchStoreInitData();
//       if (fetchedData && Object.keys(fetchedData).length > 0) {
//         storeData = handleMiddlewareStoreInitCache(host, fetchedData);
//       } else {
//         const cleanHost = host ? host.split(":")[0].replace(/[:\/]/g, "_") : NEXT_APP_WEB;
//         const filePath = path.join(process.cwd(), "public", "storeInit", `${cleanHost}_storeInit.json`);
//         if (fs.existsSync(filePath)) {
//           storeData = JSON.parse(fs.readFileSync(filePath, "utf8"));
//           console.log(`⚠️ [Middleware File Cache] Fetch failed. Loaded fallback from "${filePath}".`);
//         } else {
//           storeData = { rd: [{}], rd1: [], rd2: [{}] };
//         }
//       }
//     } catch {
//       storeData = { rd: [{}], rd1: [], rd2: [{}] };
//     }

//     const response = NextResponse.next();
//     response.cookies.set(
//       "x-store-data",
//       JSON.stringify(storeData?.rd?.[0] || {}),
//       { httpOnly: false, path: "/" },
//     );
//     response.cookies.set(
//       "x-myAccountFlags-data",
//       JSON.stringify(storeData?.rd1 || []),
//       { httpOnly: false, path: "/" },
//     );
//     response.cookies.set(
//       "x-CompanyInfoData-data",
//       JSON.stringify(storeData?.rd2?.[0] || {}),
//       { httpOnly: false, path: "/" },
//     );
//     return response;
//   } catch (err) {
//     console.error("Middleware fatal error:", err);
//     return NextResponse.next();
//   }
// }

// export const config = {
//   matcher: ["/((?!_next|api|favicon.ico).*)"],
//   runtime: "nodejs",
// };
