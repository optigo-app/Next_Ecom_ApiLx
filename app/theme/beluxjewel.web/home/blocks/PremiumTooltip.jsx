
"use client";

import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

const ElveeTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#ffffff",        // Pure clean white
    color: "#0a1f47",                  // Deep Navy text
    padding: "10px 14px",
    fontSize: "0.80rem",
    fontWeight: 500,
    borderRadius: "10px",
    border: "1px solid rgba(146,112,56,0.25)",  // soft gold border
    boxShadow:
      "0px 6px 18px rgba(0,0,0,0.08), 0px 3px 8px rgba(0,0,0,0.04)", // premium soft shadow
    backdropFilter: "blur(6px)",       // luxury glass-like feel
  },

  [`& .${tooltipClasses.arrow}`]: {
    color: "#ffffff",
    "&::before": {
      border: "1px solid rgba(146,112,56,0.25)",  // gold border on arrow
    },
  },
}));


export default  ElveeTooltip;