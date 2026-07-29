import { NEXT_APP_WEB } from "@/app/(core)/utils/env";
import { cookies } from "next/headers";

export async function getActiveTheme() {
  const cookieStore = await cookies();
  const storeData = cookieStore.get("x-store-data");
  if (!storeData) return NEXT_APP_WEB;

  try {
    const parsed = JSON.parse(storeData.value);
    return parsed?.domain || NEXT_APP_WEB;
  } catch (e) {
    return NEXT_APP_WEB;
  }
}
