"use client";
import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Stack,
  Divider,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import "./PhysicalStore.scss";

const FALLBACK_IMAGE = "/banner/Storebanner.webp";

// Accepts the data object itself, an object wrapping it in ContentJson,
// or a JSON string of either.
const parseIfString = (value) => {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
};

const resolveContent = (props) => {
  const raw =
    props?.PhysicalStore ??
    props?.physicalStoreData ??
    props?.physicalStore ??
    props?.data ??
    props;

  const parsed = parseIfString(raw) || {};
  const content = parseIfString(parsed?.ContentJson ?? parsed) || {};
  return content;
};

export default function MaxPhysicalStore(props) {
  const router = useNextRouterLikeRR();

  const content = useMemo(() => resolveContent(props), [props]);

  const {
    visible = true,
    imageUrl,
    imagePosition = "left",
    eyebrow,
    heading,
    subheading,
    contact = {},
    buttons = [],
  } = content;

  const { name, address, hours, phone } = contact || {};

  const validButtons = Array.isArray(buttons)
    ? buttons.filter((btn) => btn?.label)
    : [];

  const hasContactDetails = Boolean(name || address || hours || phone);
  const imageOnRight = imagePosition === "right";
  const imageSrc = imageUrl || FALLBACK_IMAGE;

  const handleButtonClick = (url) => {
    if (!url) return;
    if (/^https?:\/\//i.test(url)) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      router.push(url);
    }
  };

  if (!visible) return null;

  return (
    <Box
      className="physicalStoreContainer"
      sx={{
        py: { xs: 8, md: 12 },
      }}
    >
      <Box>
        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
          {/* Image Column */}
          <Grid
            item
            size={{
              xs: 12,
              md: 6,
            }}
            sx={{ order: { xs: 1, md: imageOnRight ? 2 : 1 } }}
          >
            <Box
              sx={{
                width: "100%",
                height: { xs: "350px", sm: "450px", md: "720px" },
                overflow: "hidden",
                borderRadius: "1px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
              }}
            >
              <img
                loading="lazy"
                decoding="async"
                src={imageSrc}
                alt={heading || "Showroom"}
                width="842"
                height="1024"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 1.5s ease",
                }}
              />
            </Box>
          </Grid>

          {/* Content Column */}
          <Grid
            item
            size={{
              xs: 12,
              md: 6,
            }}
            sx={{ order: { xs: 2, md: imageOnRight ? 1 : 2 } }}
          >
            <Box sx={{ pr: { md: 4 } }}>
              {eyebrow && (
                <Typography
                  variant="overline"
                  className="physicalStoreOverline"
                  sx={{
                    letterSpacing: "0.15em",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    mb: 1.5,
                    display: "block",
                  }}
                >
                  {eyebrow}
                </Typography>
              )}

              {heading && (
                <Typography
                  variant="h3"
                  component="h2"
                  className="physicalStoreTitle"
                  sx={{
                    fontFamily: "Prata, Playfair Display, serif",
                    fontWeight: 400,
                    fontSize: { xs: "2rem", md: "2.4rem" },
                    lineHeight: 1.3,
                    mb: 2,
                  }}
                >
                  {heading}
                </Typography>
              )}

              {subheading && (
                <Typography
                  variant="body1"
                  className="physicalStoreBody"
                  sx={{
                    fontSize: "1rem",
                    lineHeight: 1.6,
                    mb: 4,
                  }}
                >
                  {subheading}
                </Typography>
              )}

              {hasContactDetails && (
                <>
                  <Divider className="physicalStoreDivider" sx={{ mb: 4 }} />

                  {/* Showroom Details */}
                  <Stack spacing={2.5} sx={{ mb: 4 }}>
                    {(name || address) && (
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="flex-start"
                      >
                        <LocationOnOutlinedIcon
                          className="physicalStoreIcon"
                          sx={{ fontSize: "1.3rem", mt: "2px" }}
                        />
                        <Box>
                          {name && (
                            <Typography
                              variant="subtitle2"
                              component="p"
                              className="physicalStoreDetailText"
                              sx={{ fontWeight: 600, mb: 0.5 }}
                            >
                              {name}
                            </Typography>
                          )}
                          {address && (
                            <Typography
                              variant="body2"
                              className="physicalStoreDetailSubtext"
                              sx={{ lineHeight: 1.6 }}
                            >
                              {address}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    )}

                    {hours && (
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="flex-start"
                      >
                        <AccessTimeOutlinedIcon
                          className="physicalStoreIcon"
                          sx={{ fontSize: "1.3rem", mt: "2px" }}
                        />
                        <Box>
                          <Typography
                            variant="body2"
                            className="physicalStoreDetailSubtext"
                            sx={{ lineHeight: 1.6 }}
                          >
                            {hours}
                          </Typography>
                        </Box>
                      </Stack>
                    )}

                    {phone && (
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="flex-start"
                      >
                        <PhoneOutlinedIcon
                          className="physicalStoreIcon"
                          sx={{ fontSize: "1.3rem", mt: "2px" }}
                        />
                        <Box>
                          <Typography
                            variant="body2"
                            className="physicalStoreDetailText"
                            sx={{ fontWeight: 600 }}
                          >
                            {phone}
                          </Typography>
                        </Box>
                      </Stack>
                    )}
                  </Stack>
                </>
              )}

              {/* Actions */}
              {validButtons.length > 0 && (
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  {validButtons.map((btn, index) => (
                    <Button
                      key={btn.id ?? `${btn.label}-${index}`}
                      variant="outlined"
                      fullWidth
                      className="physicalStoreButton"
                      onClick={() => handleButtonClick(btn.url)}
                      sx={{
                        borderRadius: "0px",
                        py: 1.6,
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {btn.label}
                    </Button>
                  ))}
                </Stack>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}