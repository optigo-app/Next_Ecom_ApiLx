import {
  getCompanyInfoData,
  getExtraFlag,
  getStoreInit,
} from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import React, { Suspense } from "react";
import { getLogos } from "@/app/(core)/lib/ServerHelper";
import { Box } from "@mui/material";
import ChatMenu from "@/app/components/(static)/ChatMenu/ChatMenu";
import JulianBaseHeader from "@/app/components/(dynamic)/Header/julian/Header";
import Footer from "@/app/components/(static)/Footer/Julian/Footer";

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
        }}
      >
        <JulianBaseHeader hidden={false} logos={logos} storeInit={storeData} />

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1, minHeight: "90vh" }}>{children}</Box> */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              minHeight: "90vh",
            }}
          >
            {children}
          </Box>
        </Box>

        <Footer
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
