import { Box } from "@mui/material";
import React from "react";

const SpireBox = (props) => {
  return (
    <Box
      sx={{
        opacity: 0.8,
        mt: 1,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={25}
        height={25}
        viewBox="0 0 16 16"
        {...props}
      >
        <g
          fill="none"
          stroke="#114D6E"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
        >
          <path d="m13.75 7.75h-12"></path>
          <path d="m7.75 1.75v12"></path>
          <path d="m4.25 11.25 7-7"></path>
          <path d="m11.25 11.25-7-7"></path>
        </g>
      </svg>
    </Box>
  );
};

export default SpireBox;
