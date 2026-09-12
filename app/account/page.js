import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";
import NewAccount from "../components/(dynamic)/new_account/Account";
import AccountMobile from "../components/(dynamic)/Account/AccountMobile";
import { LocalSetup } from "../env";

export default async function Page() {
  const storeInit = await getStoreInit();
  if (storeInit?.domain === "fgstore.mapp" || LocalSetup === "fgstore.mapp"){
    return <AccountMobile Storeinit={storeInit} />;
  }
  return <NewAccount Storeinit={storeInit} />;
}
