import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const SectionHeader = styled(Box)(({ theme }) => ({
  paddingBlock: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "26px",
  fontWeight: 400,
  letterSpacing: "2px",
  textTransform: "uppercase",
  color: "#2E2E2E",
}));

const MaxHeader = ({ alignment = "left", title, subtitle, extra, noExtraMb = false }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: alignment === "left" ? "flex-start" : alignment === "center" ? "center" : "flex-end",
        flexDirection: "column",
        px: 2,
        marginBlock: "44px",
        marginBottom: { xs: noExtraMb ? "15px" : "44px", md: "44px" },
      }}
    >
      <Typography variant="h4" component="h1" sx={{ textAlign: alignment, fontWeight: "bold" }}>
        {title}
      </Typography>

      {subtitle && (
        <Typography variant="subtitle1" color="common.black" sx={{ textAlign: alignment, mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}

      {extra && <Box sx={{ mt: 1 }}>{extra}</Box>}
    </Box>
  );
};

MaxHeader.propTypes = {
  alignment: PropTypes.oneOf(["left", "center", "right"]),
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  extra: PropTypes.node,
};

export default MaxHeader;

export const HeaderV2 = ({ title = "Default Title", alignment = "left" }) => {
  return (
    <>
      <SectionHeader>
        <SectionTitle
          align={alignment}
        >{title}</SectionTitle>
      </SectionHeader>
    </>
  );
};

HeaderV2.propTypes = {
  title: PropTypes.string.isRequired,
};
