
import { Typography } from "@mui/material";
import { BELUX_JEWEL } from "@/app/(core)/constants/ElveeFlag";
import { getWebContentManagement } from "@/app/(core)/hooks/webContentManagement/webContentManagement.server";
import Page from "./Page"

export default async function ExhibitionConfig() {
  const { exhibitionconfig, isError, error } = await getWebContentManagement();
 
  if (isError) {
    console.error("[ExhibitionConfig] Error loading ExhibitionConfig:", error);
  }

  if (BELUX_JEWEL) {
   
  if (exhibitionconfig&&exhibitionconfig?.visible) {
    return (
      <>
        <Page ExhibitionConfig={exhibitionconfig} />
      </>
    );
  }

}

return null;
}
