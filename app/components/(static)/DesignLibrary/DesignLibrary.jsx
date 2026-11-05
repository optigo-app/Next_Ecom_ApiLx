
import { Typography } from "@mui/material";
import { BELUX_JEWEL } from "@/app/(core)/constants/ElveeFlag";
import { getWebContentManagement } from "@/app/(core)/hooks/webContentManagement/webContentManagement.server";
import Page from "./Page"

export default async function DesignLibrary() {
  const { designlibrary, isError, error } = await getWebContentManagement();
 
  if (isError) {
    console.error("[DesignLibrary] Error loading DesignLibrary:", error);
  }

  if (BELUX_JEWEL) {
   
  if (designlibrary&&designlibrary?.visible) {
    return (
      <>
        <Page designlibrary={designlibrary} />
      </>
    );
  }

}

return null;
}
