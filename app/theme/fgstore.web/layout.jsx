import { getCompanyInfoData, getExtraFlag, getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import Header from "@/app/components/(dynamic)/Header/Header";
import React from "react";
import { getLogos } from "@/app/(core)/lib/ServerHelper";
import FooterNew from "@/app/components/(static)/Footer/FooterNew";
import { Box } from "@mui/material";
import ChatMenu from "@/app/components/(static)/ChatMenu/ChatMenu";

const layout = async ({ children }) => {
  const storeData = await getStoreInit();
  const companyInfoData = await getCompanyInfoData();
  const logos = getLogos();
  let extraFlag = await getExtraFlag();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%", overflow: "hidden" }}>
      <Header logos={logos} storeinit={storeData} />
      {children}
      <FooterNew companyInfoData={companyInfoData} storeData={storeData} extraFlag={extraFlag} logos={logos} />
      <ChatMenu />
    </Box>
  );
};

export default layout;
