import { getCompanyInfoData, getExtraFlag, getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import React from "react";
import {  getLogos } from "@/app/(core)/lib/ServerHelper";
import { Box } from "@mui/material";
import BottomNavigation from "./home/components/BottomNavigation";

const layout = async ({ children }) => {
  const storeData = await getStoreInit();
  const companyInfoData = await getCompanyInfoData();
  const logos =  getLogos();
  let extraFlag = await getExtraFlag();

  return (
    <Box className="FgstoreMapp" sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%", overflow: "hidden" }}>
      {children}
      <BottomNavigation/>
    </Box>
  );
};

export default layout;
