
import { Typography } from "@mui/material";
import { BELUX_JEWEL } from "@/app/(core)/constants/ElveeFlag";
import { getWebContentManagement } from "@/app/(core)/hooks/webContentManagement/webContentManagement.server";
import Page from "./Page"

export default async function CraftsmanshipPage() {
  const { craftsmanship, isError, error } = await getWebContentManagement();
 
  if (isError) {
    console.error("[CraftsmanshipPage] Error loading craftsmanship:", error);
  }

  if (BELUX_JEWEL) {
   
  if (craftsmanship&&craftsmanship?.visible) {
    return (
      <>
        <Page craftsmanship={craftsmanship} />
      </>
    );
  }

}

return null;
}
