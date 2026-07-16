"use client";
import { useMemo } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Marquee from "react-fast-marquee";

const BrandInfoMarquee = ({ assetBase }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const items = useMemo(() => ["100% Certified Jewellery", "Free Shipping Across India", "Easy 7 Days Return", "Trusted by 1L+ Customers", "Premium Quality Craftsmanship"], []);

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        bgcolor: "#f8f6f4",
        height: "79px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* 🔥 LEFT BLUR */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: "80px",
          zIndex: 2,
          pointerEvents: "none",
          background: "linear-gradient(to right, #f8f6f4 40%, transparent)",
        }}
      />

      {/* 🔥 RIGHT BLUR */}
      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          height: "100%",
          width: "80px",
          zIndex: 2,
          pointerEvents: "none",
          background: "linear-gradient(to left, #f8f6f4 40%, transparent)",
        }}
      />

      <Marquee gradient={false} speed={isMobile ? 25 : 40} pauseOnHover>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 3, sm: 6 },
            px: { xs: 2, sm: 4 },
          }}
        >
          {[...items, ...items, ...items].map((text, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  color: "#222",
                  whiteSpace: "nowrap",
                }}
              >
                {text}
              </Typography>
              {/* 🔥 Logo Divider */}
              <Box
                sx={{
                  opacity: 0.8,
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={25} height={25} viewBox="0 0 16 16">
                  <g fill="none" stroke="#5b72ff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
                    <path d="m13.75 7.75h-12"></path>
                    <path d="m7.75 1.75v12"></path>
                    <path d="m4.25 11.25 7-7"></path>
                    <path d="m11.25 11.25-7-7"></path>
                  </g>
                </svg>
              </Box>
            </Box>
          ))}
        </Box>
      </Marquee>
    </Box>
  );
};

export default BrandInfoMarquee;

// import { useEffect, useState } from "react";
// import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
// import Marquee from "react-fast-marquee";
// import FeatherLogo from "../../../../Assets/logo.png";
// import { storImagePath } from "../../../../../../../utils/Glob_Functions/GlobalFunction";
// import { IsSetupFor } from "../../../../Recoil/atom";

// const BrandInfoMarquee = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const [MarqueeItems, setMarqueeItems] = useState([]);
//    const kayralogo = ["logo1.png", "logo2.png", "logo3.png", "logo4.png", "logo5.png", "logo6.png", "logo1.png", "logo2.png", "logo3.png", "logo4.png", "logo5.png", "logo6.png"];
//     const mayrologo = ["logo1.png", "logo2.jpg", "logo3.png", "logo4.png", "logo1.png", "logo2.jpg", "logo3.png", "logo4.png", "logo1.png", "logo2.jpg", "logo3.png", "logo4.png"];
//     const Omjiyanslogo = ["logo1.png", "logo2.png", "logo3.png", "logo4.png", "logo1.png", "logo2.png", "logo3.png", "logo4.png", "logo1.png", "logo2.png", "logo3.png", "logo4.png"];

//     const sonasonsLogo = ["logo2.png", "logo3.png", "logo4.png", "logo6.png", "logo2.png", "logo3.png", "logo4.png", "logo6.png"];
//     const KayralogoElements = kayralogo.map((logo, index) => <img key={index} alt="logo" className="smr_affilitionImg" loading="lazy" src={`${assetBase}/images/HomePage/BrandLogo/kayra/${logo}`} style={{ width: "130px", objectFit: "cover", marginRight: "90px" }} />);
//     const OmlogoElements = Omjiyanslogo?.map((logo, index) => <img key={index} alt="logo" className="smr_affilitionImg" loading="lazy" src={`${assetBase}/images/HomePage/BrandLogo/omjiyansh/${logo}`} style={{ width: "130px", objectFit: "cover", marginRight: "90px" }} />);
//     const MayoralogoElements = mayrologo.map((logo, index) => <img key={index} alt="logo" className="smr_affilitionImg" loading="lazy" src={`${assetBase}/images/HomePage/BrandLogo/mayora/${logo}`} style={{ width: "130px", objectFit: "cover", marginRight: "90px" }} />);
//     const SonasonslogoElements = sonasonsLogo.map((logo, index) => <img key={index} alt="logo" className="smr_affilitionImg" loading="lazy" src={`${assetBase}/images/HomePage/BrandLogo/sonasons/${logo}`} style={{ width: "130px", objectFit: "cover", marginRight: "90px" }} />);

//   const path = storImagePath() + "/json/offers.json";
//   const Logo = IsSetupFor ? storImagePath() + "/logoIcon/androidCh1.png" : FeatherLogo;

//   useEffect(() => {
//     let isMounted = true;
//     fetch(path, { cache: "no-store" })
//       .then((response) => {
//         if (!response.ok) throw new Error("Invalid response");
//         return response.json();
//       })
//       .then((data) => {
//         if (!isMounted) return;

//         const cleanOffers = Array.isArray(data?.offers)
//           ? data.offers.filter((o) => typeof o === "string" && o.trim() !== "")
//           : [];

//         setMarqueeItems([...cleanOffers, ...cleanOffers, ...cleanOffers, ...cleanOffers, ...cleanOffers, ...cleanOffers]);
//       })
//       .catch(() => {
//       });

//     return () => {
//       isMounted = false;
//     };
//   }, [path]);

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         bgcolor: "#f8f6f4",
//         height: "79px",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         overflow: "hidden",
//       }}
//     >
//       <Marquee
//         gradient={false}
//         speed={isMobile ? 25 : 40}
//         pauseOnHover
//         style={{
//           display: "flex",
//           alignItems: "center",
//           height: "100%",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: { xs: 3, sm: 6 },
//             px: { xs: 2, sm: 4 },
//             height: "100%",
//           }}
//         >
//           {MarqueeItems?.map((text, index) => (
//             <Box
//               key={index}
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 gap: 1.2,
//                 textTransform: "uppercase",
//                 height: "100%",
//               }}
//             >
//               <Typography
//                 sx={{
//                   fontSize: { xs: "0.8rem", sm: "0.9rem" },
//                   fontWeight: 600,
//                   letterSpacing: 0.5,
//                   color: "#222",
//                   lineHeight: 1,
//                   display: "flex",
//                   alignItems: "center",
//                 }}
//               >
//                 {text}
//               </Typography>
//               {index !== MarqueeItems.length - 1 && (
//                 <Box
//                   sx={{
//                     fontSize: { xs: "0.8rem", sm: "0.9rem" },
//                     fontWeight: 600,
//                     letterSpacing: 0.5,
//                     color: "#222",
//                     lineHeight: 1,
//                     display: "flex",
//                     alignItems: "center",
//                     ...(IsSetupFor ? { width: "40px", height: "40px" } : {
//                       width: "60px",
//                       height: "60px",
//                     }),
//                   }}
//                   component={"img"}
//                   src={Logo}
//                 />
//               )}
//             </Box>
//           ))}
//         </Box>
//       </Marquee>
//     </Box>
//   );
// };

// export default BrandInfoMarquee;
