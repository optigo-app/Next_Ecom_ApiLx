import { NEXT_APP_WEB } from "@/app/(core)/utils/env";
import { headers } from "next/headers";
import { getStoreInitData } from "@/app/(core)/cache_utility/storeInitCache";

export async function getActiveTheme() {
  try {
    const headersList = await headers();
    const host = headersList.get("host");
    const cleanHost = host ? host.split(":")[0].trim().toLowerCase() : "";
    if (
      cleanHost === "localhost" ||
      cleanHost === "127.0.0.1" ||
      cleanHost.endsWith(".localhost") ||
      cleanHost.endsWith(".ngrok-free.app") ||
      cleanHost.endsWith(".ngrok.io")
    ) {
      return NEXT_APP_WEB;
    }
    const storeData = await getStoreInitData(host);
    const domain = storeData?.rd?.[0]?.domain;
    return domain || NEXT_APP_WEB;
  } catch (e) {
    return NEXT_APP_WEB;
  }
}
