import { NEXT_APP_WEB } from "@/app/(core)/utils/env";
import { headers } from "next/headers";
import { getStoreInitData } from "@/app/(core)/cache_utility/storeInitCache";

export async function getActiveTheme() {
  try {
    const headersList = await headers();
    const host = headersList.get("host");
    const storeData = await getStoreInitData(host);
    const domain = storeData?.rd?.[0]?.domain;
    return domain || NEXT_APP_WEB;
  } catch (e) {
    return NEXT_APP_WEB;
  }
}
