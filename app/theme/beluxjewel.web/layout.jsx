import { Box } from "@mui/material";
import {
  getCompanyInfoData,
  getExtraFlag,
  getStoreInit,
} from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import React, { Suspense } from "react";
import { getLogos } from "@/app/(core)/lib/ServerHelper";
import FooterNew from "@/app/components/(static)/Footer/FooterNew";
import ChatMenu from "@/app/components/(static)/ChatMenu/ChatMenu";
import AnnouncementBar from "./home/blocks/AnnouncementBar";
import BeluxNavbar from "@/app/components/(dynamic)/Header/Elvee/New/BeluxNavbar";
import { cookies } from "next/headers";
import { getSqliteMenus } from "@/app/(core)/utils/sqlite/sqliteActions";
import { getWebContentManagement } from "@/app/(core)/hooks/webContentManagement/webContentManagement.server";
import Footer from "@/app/components/(static)/Footer/DynamicFooter/Footer"; 
import { isB2BWebsite } from "@/app/(core)/utils/isB2B";

const layout = async ({ children }) => {
  const storeData = await getStoreInit();
  const companyInfoData = await getCompanyInfoData();
  const logos = getLogos();
  let extraFlag = await getExtraFlag();

  const cookieStore = await cookies();
  const isB2B = isB2BWebsite(storeData);
  const hasLoginCookie = Boolean(cookieStore.get("userLoginCookie")?.value);
  const userPkgIdCookie = cookieStore.get("userPackageId")?.value;
  console.log(userPkgIdCookie, "userPkgIdCookie")
  const activePackageId = userPkgIdCookie ? Number(userPkgIdCookie) : storeData?.PackageId;

  let initialMenuData = [];
  if (!isB2B || hasLoginCookie) {
    try {
      const menuRes = await getSqliteMenus({ packageId: activePackageId });
      initialMenuData = menuRes?.Data?.rd || [];
    } catch (err) {
      console.warn("[beluxjewel layout] SSR menu pre-fetch failed:", err.message);
    }
  }

  const webContentRes = await getWebContentManagement({ domain: storeData?.domain }).catch(() => null);


  const { pageTemplates, isError, error } = await getWebContentManagement();
  const {social }= await getWebContentManagement();
  const footerTemplates = (pageTemplates || []).filter(
    (t) => t?.PageKey?.toLowerCase() === "footer"
  );

 
 

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <AnnouncementBar />
        <BeluxNavbar
          hidden={false}
          logos={logos}
          storeInit={storeData}
          initialMenuData={initialMenuData}
          initialWebContent={webContentRes?.raw || null}
        />
        <Box component="main" id="main-content" sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {children}
        </Box>
        {/* <FooterNew
          companyInfoData={companyInfoData}
          storeData={storeData}
          extraFlag={extraFlag}
          logos={logos}
        /> */}
        <Footer templates={footerTemplates} socialData={social?.ContentJson} />

        <ChatMenu />
      </Box>
    </>
  );
};

export default layout;
