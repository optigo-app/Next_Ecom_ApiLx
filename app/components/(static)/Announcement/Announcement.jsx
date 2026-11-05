
import { Typography } from "@mui/material";
import { BELUX_JEWEL } from "@/app/(core)/constants/ElveeFlag";
import { getWebContentManagement } from "@/app/(core)/hooks/webContentManagement/webContentManagement.server";
import Page from "./Page"

export default async function Announcement() {
  const { announcement, isError, error } = await getWebContentManagement();
 
  if (isError) {
    console.error("[Announcement] Error loading Announcement:", error);
  }

  if (BELUX_JEWEL) {
   
  if (announcement) {
    return (
      <>
        <Page announcementData={announcement} />
      </>
    );
  }

}

return null;
}
