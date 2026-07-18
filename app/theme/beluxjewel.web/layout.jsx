import {
  getCompanyInfoData,
  getExtraFlag,
  getStoreInit,
} from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import React, { Suspense } from "react";
import { getLogos } from "@/app/(core)/lib/ServerHelper";
import FooterNew from "@/app/components/(static)/Footer/FooterNew";
import { Box } from "@mui/material";
import ChatMenu from "@/app/components/(static)/ChatMenu/ChatMenu";
import ElveePreNavbar from "@/app/components/(dynamic)/Header/Elvee/New/Navbar";
import AnnouncementBar from "./home/blocks/AnnouncementBar";
import BeluxNavbar from "@/app/components/(dynamic)/Header/Elvee/New/BeluxNavbar";

const layout = async ({ children }) => {
  const storeData = await getStoreInit();
  const companyInfoData = await getCompanyInfoData();
  const logos = getLogos();
  let extraFlag = await getExtraFlag();

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
        <BeluxNavbar hidden={false} logos={logos} storeInit={storeData} />
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Suspense
            fallback={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                  minHeight: "90vh",
                }}
              ></Box>
            }
          >
            {children}
          </Suspense>
        </Box>
        <FooterNew
          companyInfoData={companyInfoData}
          storeData={storeData}
          extraFlag={extraFlag}
          logos={logos}
        />

        <ChatMenu />
      </Box>
    </>
  );
};

export default layout;
