import React from "react";
import { Box, Typography } from "@mui/material";
import Main from "./Main";
import SonaHeader from "@/app/theme/fgstore.web/home/Header";

const Index = ({ storeData }) => {
  return (
    <Box className="smr_alubmMainDiv">
      <SonaHeader title="Infinitely Inspiring" isShowViewMore={true} />
      <Main key={storeData?.IsHomeAlbum} storeData={storeData} />
    </Box>
  );
};

export default Index;
