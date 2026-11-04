import { Box } from "@mui/material";
import {
  getCompanyInfoData,
  getExtraFlag,
  getStoreInit,
} from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import React, { Suspense } from "react";
import { getLogos } from "@/app/(core)/lib/ServerHelper";
import ProCatFooter from "./components/ProCatFooter";
import BackToTop from "@/app/components/(static)/Footer/procat/BackToTop";
import ChatMenu from "@/app/components/(static)/ChatMenu/ChatMenu";
import { cookies } from "next/headers";
import { getSqliteMenus } from "@/app/(core)/utils/sqlite/sqliteActions";
import ProCatNewHeader from "@/app/components/(dynamic)/Header/Procat/ProCatNewHeader";
import { getFooterLinks } from "@/app/(core)/utils/footerMenuConfig";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";

const layout = async ({ children }) => {
  const storeData = await getStoreInit();
  const companyInfoData = await getCompanyInfoData();
  const logos = getLogos();
  let extraFlag = await getExtraFlag();
  const { hostname } = await getDomainInfo();
  const footerList = await getFooterLinks(hostname);

  let parsedSocialLinks = [];
  try {
    const rawSocial = companyInfoData?.SocialLinkObj;
    parsedSocialLinks =
      rawSocial && rawSocial !== "undefined" && rawSocial !== "null"
        ? JSON.parse(rawSocial)
        : [];
  } catch (err) {
    console.warn("Invalid SocialLinkObj JSON:", err);
    parsedSocialLinks = [];
  }

  const cookieStore = await cookies();
  const userPkgIdCookie = cookieStore.get("userPackageId")?.value;
  const activePackageId = userPkgIdCookie ? Number(userPkgIdCookie) : storeData?.PackageId;

  let initialMenuData = [];
  try {
    const menuRes = await getSqliteMenus({ packageId: activePackageId });
    initialMenuData = menuRes?.Data?.rd || [];
  } catch (err) {
    console.warn("[beluxjewel layout] SSR menu pre-fetch failed:", err.message);
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          width: "100%",
          overflowX: "clip",
          position: "relative",
          backgroundImage:
            "url('/Assets/soft-grey-organic-leaves-background-with-text-space__1017-60373.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <ProCatNewHeader storeinit={storeData} logos={logos} />
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#ffffff",
            marginInline: "6%",
            "@media screen and (max-width: 1400px)": {
              marginInline: "3%",
            },
            "@media screen and (max-width: 1200px)": {
              marginInline: "1.5%",
            },
            "@media screen and (max-width: 768px)": {
              marginInline: "0px",
              borderRadius: "0px",
              my: 0,
            },
            borderRadius: "4px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.05)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
            my: { xs: 0, sm: 2, md: 3 },
          }}
        >
          <Box sx={{ flexGrow: 1 }}>{children}</Box>
          <ProCatFooter
            list={footerList}
            companyInfoData={companyInfoData}
            socialMediaData={parsedSocialLinks}
          />
        </Box>
        <BackToTop />
        <ChatMenu />
      </Box>
    </>
  );
};

export default layout;
