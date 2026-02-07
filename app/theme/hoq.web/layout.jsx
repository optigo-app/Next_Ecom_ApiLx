import { getCompanyInfoData, getExtraFlag, getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import Header from "@/app/components/(dynamic)/Header/Hoq/Navbar";
import React from "react";
import { assetBase, getHoqLogos } from "@/app/(core)/lib/ServerHelper";
import { Box } from "@mui/material";
import Footer from "@/app/components/(static)/Footer/hoq/Footer/Footer";
import ChatMenu from "@/app/components/(static)/ChatMenu/ChatMenu";

const layout = async ({ children }) => {
  const storeData = await getStoreInit();
  const companyInfoData = await getCompanyInfoData();
  const logos = getHoqLogos();
  let extraFlag = await getExtraFlag();


  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%", overflow: "hidden" }}>
      <ChatMenu assetBase={assetBase} />
      <Header logos={logos} storeinit={storeData} />
      {children}
      <Footer companyInfoData={companyInfoData} storeData={storeData} extraFlag={extraFlag} logos={logos} assetBase={assetBase} />
    </Box>
  );
};

export default layout;
