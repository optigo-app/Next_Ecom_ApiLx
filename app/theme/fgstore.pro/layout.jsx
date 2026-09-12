import { Box } from "@mui/material";
import {
  getCompanyInfoData,
  getExtraFlag,
  getStoreInit,
} from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import React, { Suspense } from "react";
import { getLogos } from "@/app/(core)/lib/ServerHelper";
import FooterNew from "@/app/components/(static)/Footer/procat/Footer";
import Header1 from "@/app/components/(dynamic)/Header/Procat/Header";
import { getFooterLinks } from "@/app/(core)/utils/footerMenuConfig";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import BackToTop from "@/app/components/(static)/Footer/procat/BackToTop";

const layout = async ({ children }) => {
  const storeData = await getStoreInit();
  const companyInfoData = await getCompanyInfoData();
  const logos = getLogos();
  const { hostname } = await getDomainInfo();
  let extraFlag = await getExtraFlag();
  const FooterList = await getFooterLinks(hostname);

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
        className="setFullThemeBack_Bg animateThemeFill"
      >
        <Header1 logos={logos} storeinit={storeData} />
        <Box
          sx={{
            minHeight: 650,
            backgroundColor: "white",
            marginInline: "6%",
            "@media screen and (max-width: 1200px)": {
              marginInline: "1%",
            },
            "@media screen and (max-width: 768px)": {
              minHeight: 500,
            },
            "@media screen and (max-width: 480px)": {
              marginInline: "0",
              minHeight: 400,
            },
            borderRadius: "24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          className="theme-content"
        >
          <Box sx={{ flexGrow: 1 }}>{children}</Box>
          <FooterNew
            list={FooterList}
            socialMediaData={parsedSocialLinks}
            companyInfoData={companyInfoData}
            storeData={storeData}
            logos={logos}
          />
        </Box>
        <BackToTop />
      </Box>
    </>
  );
};

export default layout;
