import React from "react";
import { Card, Chip, CardContent, Grid, Typography, Box, Button, Checkbox } from "@mui/material";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import LocalMallIcon from "@mui/icons-material/LocalMallRounded";
import StarIcon from "@mui/icons-material/StarBorderRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

const V2ProductCard = () => {
  const productData = {
    IsBestSeller: 1,
    IsInReadyStock: 1,
    IsTrending: 1,
    IsNewArrival: 1,
  };
  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 5,
          left: 5,
          zIndex: 2,
        }}
      >
        <Checkbox
          sx={{
            bgcolor: '#f6fafd'
          }}
          size="small"
          icon={
            <StarIcon
              sx={{
                fontSize: "22px",
                color: "#7d7f85",
                opacity: ".7",
              }}
            />
          }
          checkedIcon={
            <StarRoundedIcon
              sx={{
                fontSize: "22px",
                color: "#4caf50",
              }}
            />
          }
          disableRipple={false}
        />
      </Box>

      <Box
        sx={{
          width: "100%",
          backgroundColor: "#f9f9f9",
          py: 1.5,
          position: "relative",
          maxHeight: 300,
          height: "100%",
        }}
      >
        <img
          src="http://nzen/R50B3/UFSImage/demostoreQI9S5BDATC0M1KYJH_uKey/Design_Image/Design_Thumb/LLL-0488-Z~1.jpg"
          alt="Ocean Pink Guava Fruit Drink"
          style={{
            objectFit: "contain",
            width: "100%",
            height: "100%",
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.5,
            position: "absolute",
            bottom: 5,
            left: 5,
            zIndex: 1,
          }}
        >
          {productData?.IsInReadyStock == 1 && (
            <Chip
              label="In Stock"
              size="small"
              sx={{
                fontSize: 10.5,
                height: 20,
                backgroundColor: "#e8f5e9",
                color: "#2e7d32",
                fontWeight: 600,
              }}
            />
          )}

          {productData?.IsBestSeller == 1 && (
            <Chip
              label="Best Seller"
              size="small"
              sx={{
                fontSize: 10.5,
                height: 20,
                backgroundColor: "#fff3e0",
                color: "#ef6c00",
                fontWeight: 600,
              }}
            />
          )}

          {productData?.IsTrending == 1 && (
            <Chip
              label="Trending"
              size="small"
              sx={{
                fontSize: 10.5,
                height: 20,
                backgroundColor: "#e3f2fd",
                color: "#1565c0",
                fontWeight: 600,
              }}
            />
          )}

          {productData?.IsNewArrival == 1 && (
            <Chip
              label="New"
              size="small"
              sx={{
                fontSize: 10.5,
                height: 20,
                backgroundColor: "#f3e5f5",
                color: "#6a1b9a",
                fontWeight: 600,
              }}
            />
          )}
        </Box>
      </Box>
      {/* Content */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          gap: 0.3,
          px: 0.8,
          py: 1,
          paddingBottom: "8px !important",
        }}
      >
        {/* Title */}
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: 14,
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          LLL-0488-Z - Ocean Pink Guava Fruit Drink
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: 12,
            mt: 0.2
          }}
        >
          GOLD 18K
        </Typography>

        <Grid
          container
          spacing={0.4}
          sx={{
            mt: 1,
            fontSize: 13,
          }}
        >
          <Grid size={6}>
            <Typography
              sx={{
                fontSize: "clamp(0.58rem, 2vw, 0.75rem)",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              <strong>GWT:</strong> 16.350
            </Typography>
          </Grid>

          <Grid size={6}>
            <Typography
              sx={{

                fontSize: "clamp(0.58rem, 2vw, 0.75rem)",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              <strong>NWT:</strong> 14.840
            </Typography>
          </Grid>

          <Grid size={6}>
            <Typography
              sx={{

                fontSize: "clamp(0.58rem, 2vw, 0.75rem)",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              <strong>DWT:</strong> 0.350/15
            </Typography>
          </Grid>

          <Grid size={6}>
            <Typography
              sx={{

                fontSize: "clamp(0.58rem, 2vw, 0.75rem)",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              <strong>CWT:</strong> 7.200/400
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ flexGrow: 1 }} />

        {/* Bottom Row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Price */}
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            INR 2,04,402
          </Typography>
          <Checkbox
            sx={{
              bgcolor: '#f6fafd'
            }}
            icon={
              <LocalMallOutlinedIcon
                sx={{
                  fontSize: "22px",
                  color: "#7d7f85",
                  opacity: ".7",
                }}
              />
            }
            checkedIcon={
              <LocalMallIcon
                sx={{
                  fontSize: "22px",
                  color: "#4caf50",
                }}
              />
            }
            disableRipple={false}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default V2ProductCard;
