
"use client";
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  styled,
} from "@mui/material";
import {
  ChevronLeftRounded as ChevronLeft,
  ChevronRightRounded as ChevronRight,
} from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
 
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { formatRedirectTitleLine, formatter,  formatTitleLine, } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import Cookies from "js-cookie";
import Pako from "pako";
import MaxHeader from "./Header";


const imageNotFound="/image-not-found.jpg"
const SectionHeader = styled(Box)(({ theme }) => ({
  paddingBlock: theme.spacing(1),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "26px",
  fontWeight: 400,
  letterSpacing: "2px",
  textTransform: "uppercase",
  color: "#2E2E2E",
}));

const MaxBestSeller = ({ storeInit }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const swiperRef = useRef(null);
  const [imageUrl, setImageUrl] = useState();
  const [bestSellerData, setBestSellerData] = useState("");
 
  const { finalId, loginUserDetail, islogin } = useStore();
   const navigation = useNextRouterLikeRR();
 
 
  const [validatedData, setValidatedData] = useState([]);

  const callAllApi = () => {
    
 
    let data =  storeInit;
    setImageUrl(data?.CDNDesignImageFol);
 
    Get_Tren_BestS_NewAr_DesigSet_Album("GETBestSeller", finalId)
      .then((response) => {
        if (response?.Data?.rd) {
          
          console.log("TCL: callAllApi BestSaller ->response?.Data?.rd ", response?.Data?.rd)
          setBestSellerData(response?.Data?.rd);
        }
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    callAllApi();
  }, []);

  const compressAndEncode = (inputString) => {
    try {
      const uint8Array = new TextEncoder().encode(inputString);
      const compressed = Pako.deflate(uint8Array, { to: "string" });
      return btoa(String.fromCharCode.apply(null, compressed));
    } catch (error) {
      console.error("Error compressing and encoding:", error);
      return null;
    }
  };

  const validateImageURLs = async () => {
    if (!bestSellerData?.length) return;
    const validatedData = await Promise.all(
      bestSellerData.map(async (item) => {
        const imageURL = `${imageUrl}${item?.designno}~1.${item?.ImageExtension || 'webp'}`;
        return { ...item, validatedImageURL: imageURL };
      }),
    );
    setValidatedData(validatedData);
  };

  useEffect(() => {
    validateImageURLs();
  }, [bestSellerData]);

  const handleNavigation = (designNo, autoCode, titleLine, index) => {
    let obj = {
      a: autoCode,
      b: designNo,
      m: loginUserDetail?.MetalId,
      d: loginUserDetail?.cmboDiaQCid,
      c: loginUserDetail?.cmboCSQCid,
      f: {},
    };
    sessionStorage.setItem("scrollToProduct1", `product-${index}`);
    let encodeObj = compressAndEncode(JSON.stringify(obj));
    navigation.push(
      `/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeObj}`,
    );
  };

  const handlePrev = () => {
    if (swiperRef.current) swiperRef.current.slidePrev();
  };

  const handleNext = () => {
    if (swiperRef.current) swiperRef.current.slideNext();
  };

  if (bestSellerData.length === 0) {
    return;
  }

  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        px: { xs: 2, sm: 3, md: 4 },
        width: "100%",
      }}
    >
      <Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "auto", sm: "auto", md: "1fr auto 1fr" },
            alignItems: "center",
            position: { xs: "relative", sm: "relative", md: "" }
          }}
        >
          {/* <SectionHeader>
                        <SectionTitle variant="overline">BestSeller</SectionTitle>
                    </SectionHeader> */}
          <Box
            sx={{
              display: { xs: "none", sm: "none", md: "block" },
            }}
          />
          <Box sx={{ justifySelf: "center", textAlign: "center" }}>
            <MaxHeader
              title="BestSeller"
              alignment={{ xs: "left", sm: "center" }}
            />
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifySelf: { xs: "center", sm: "center", md: "end" },
                marginBottom: { xs: "44px", sm: "44px", md: "0px" },
                position: { xs: "absolute", sm: "", md: "" },
                right: { xs: "0", sm: "0", md: "" },
                top: 0,
                marginTop: "44px",
              }}
            >
              <NavButton onClick={handlePrev}>
                <ChevronLeft />
              </NavButton>
              <NavButton onClick={handleNext}>
                <ChevronRight />
              </NavButton>
            </Box>
          )}
        </Box>
        <Box sx={{ position: "relative" }}>
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            modules={[Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              480: { slidesPerView: 3, spaceBetween: 8 },
              768: { slidesPerView: 4, spaceBetween: 8 },
              1280: { slidesPerView: 5, spaceBetween: 8 },
            }}
            style={{
              paddingBottom: "20px",
            }}
            className="product-card-group-grid"
          >
            {validatedData?.map((item, index) => (
              <SwiperSlide
                key={item.id}
                style={{
                  height: "auto",
                }}
              >
                <ProductCard
                  onClick={() =>
                    handleNavigation(
                      item?.designno,
                      item?.autocode,
                      item?.TitleLine,
                      index,
                    )
                  }
                  item={item}
                  storeInit={storeInit}
                  loginUserDetail={loginUserDetail}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Box>
    </Box>
  );
};

const ProductCard = ({ item, storeInit, loginUserDetail, onClick }) => {
  return (
    <Box
      className="product-card-group"
      sx={{
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
        cursor: "pointer",
        height: "100%",
        "&:hover .image-container": { transform: "translateY(-8px)" },
        "&:hover .product-image": { transform: "scale(1.1)" },
        "&:hover .info-overlay": { transform: "translateY(0)", opacity: 1 },
        borderRadius: 4,
      }}
    >
      <Box
        className="image-container"
        sx={{
          position: "relative",
          width: "100%",
          paddingTop: "140%",
          overflow: "hidden",
          transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          backgroundColor: "#d6d6d624",
        }}
        onClick={onClick}
      >
        {/* Background Image */}
        <Box
          className="product-image"
          component="img"
          src={item.validatedImageURL}
          alt={item.name}
          onError={(e) => {
            e.target.src = imageNotFound;
            e.target.alt = "no-image-found";
          }}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            transition: "transform 0.8s ease", // Slow zoom
            mixBlendMode: "multiply",
          }}
        />
        {/* <Box
          className="info-overlay"
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "15%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            pb: 4,
            px: 3,
            transform: "translateY(100%)", // Hidden down initially
            opacity: 0,
            transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            bgcolor: "#fff",
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              color: "#000",
              mb: 0.5,
              fontSize: "15px",
            }}
          >
            {loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode} &nbsp;
            {formatter(item?.UnitCostWithMarkUp)}
          </Typography>
        </Box> */}
        <Box
          className="info-overlay"
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            // Use auto height with padding for a better fit
            height: "auto",
            minHeight: "15%",

            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",

            // Spacing
            py: 2, // Vertical padding (top/bottom)
            px: 3, // Horizontal padding

            // --- THE APPLE GLASS EFFECT ---
            background: "rgba(255, 255, 255, 0.65)", // Semi-transparent white
            backdropFilter: "blur(20px) saturate(180%)", // The "Liquid" Blur magic
            WebkitBackdropFilter: "blur(20px) saturate(180%)", // Safari/Apple support
            borderTop: "1px solid rgba(255, 255, 255, 0.4)", // Subtle frost edge
            boxShadow: "0px -4px 20px rgba(0, 0, 0, 0.1)", // Soft shadow lifting it up

            // Transitions & Visibility
            transform: "translateY(100%)", // Hidden down initially
            opacity: 0,
            zIndex: 10,
            transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <Typography
            sx={{
              fontWeight: 700, // Thicker font for premium feel
              color: "#1a1a1a", // Soft black, not harsh #000
              fontSize: "16px",
              letterSpacing: "0.5px",
              textTransform: "uppercase", // Often looks cleaner for currency
              // Ensures text stays readable if background image is dark
              textShadow: "0px 1px 1px rgba(255,255,255,0.8)",
            }}
          >
            {loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode} &nbsp;
            {formatter(item?.UnitCostWithMarkUp)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 2.5 }}>
        <Typography
          variant="caption"
          sx={{
            color: "#888",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            fontWeight: 600,
            fontSize: "0.7rem",
          }}
        >
          {item?.designno}
        </Typography>
        {!!item?.TitleLine && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              color: "#1a1a1a",
              mt: 0.5,
              fontSize: "1.1rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {item?.TitleLine}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const NavButton = ({ children, onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      border: "1px solid #e0e0e0",
      borderRadius: 8,
      width: 40,
      height: 40,
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "#163164",
        borderColor: "#fff",
        "& .MuiSvgIcon-root": {
          color: "#fff",
        },
      },
    }}
  >
    {children}
  </IconButton>
);

export default MaxBestSeller;
