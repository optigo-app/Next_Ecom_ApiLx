
import { Typography } from "@mui/material";
import { BELUX_JEWEL } from "@/app/(core)/constants/ElveeFlag";
import { getWebContentManagement } from "@/app/(core)/hooks/webContentManagement/webContentManagement.server";
import Page from "./Page"

export default async function TopSection() {
  const { showroom, isError, error } = await getWebContentManagement();
 
  if (isError) {
    console.error("[TopSection] Error loading banners:", error);
  }

  if (BELUX_JEWEL) {
   
  if (showroom&&showroom?.visible) {
    return (
      <>
        <Page PhysicalStore={showroom} />
      </>
    );
  }

}

return null;
}
