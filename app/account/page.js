import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";
import Account from "../components/(dynamic)/Account/Account";

export default async function Page() {
  const storeInit = await getStoreInit();
  return <Account Storeinit={storeInit} />;
}
