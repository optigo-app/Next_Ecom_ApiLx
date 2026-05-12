import React from "react";
import { Box } from "@mui/material";
import Main from "./Main";

const Index = ({ storeData }) => {
  return (
    <Box className="smr_alubmMainDiv">
      <Main key={storeData?.IsHomeAlbum} storeData={storeData} />
    </Box>
  );
};

export default Index;
