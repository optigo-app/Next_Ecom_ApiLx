import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";
import Account from "../components/(dynamic)/Account/Account";
import AccountMobile from "../components/(dynamic)/Account/AccountMobile";
import { LocalSetup } from "../env";

export default async function Page() {
  const storeInit = await getStoreInit();
  if (LocalSetup === "fgstore.mapp")
    return <AccountMobile Storeinit={storeInit} />;
  return <Account Storeinit={storeInit} />;
}
