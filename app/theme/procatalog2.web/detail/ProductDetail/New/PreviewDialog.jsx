import React from "react";
import {
  Dialog,
  Box,
  IconButton,
  useMediaQuery,
  Typography,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Keyboard } from "swiper/modules";

// Swiper Styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

const PreviewDialog = ({ open, onClose, media = [], selectedIndex = 0 }) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [thumbsSwiper, setThumbsSwiper] = React.useState(null);
  const [mainSwiper, setMainSwiper] = React.useState(null);
  const [currentIndex, setCurrentIndex] = React.useState(selectedIndex);

  // Sync internal state if selectedIndex changes externally
  React.useEffect(() => {
    if (open && mainSwiper) {
      mainSwiper.slideTo(selectedIndex);
      setCurrentIndex(selectedIndex);
    }
  }, [open, selectedIndex, mainSwiper]);

  const handlePrevious = (e) => {
    e?.stopPropagation();
    mainSwiper?.slidePrev();
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    mainSwiper?.slideNext();
  };

  const pauseAllVideos = () => {
  document.querySelectorAll("video").forEach((video) => {
    if (!video.paused) {
      video.pause();
    }
  });
};



  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      keepMounted
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          bgcolor: "transparent", // handle background in the box for better control
          backgroundImage: "none",
          boxShadow: "none",
        },
      }}
    >
      {/* 
        MASTER CONTAINER 
        Uses 100dvh to handle mobile browser address bars correctly.
        Flex column ensures Header - Content - Footer structure.
      */}
      <Box
        sx={{
          width: "100vw",
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#ffffff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ================= HEADER ================= */}
        <Box
          sx={{
            flexShrink: 0,
            height: { xs: 56, md: 64 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 2, md: 4 },
            bgcolor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
            zIndex: 50,
          }}
        >
          <Typography
            sx={{
              fontFamily: "inherit",
              fontSize: "14px",
              fontWeight: 600,
              color: "#111",
              letterSpacing: "0.5px",
            }}
          >
            {currentIndex + 1} / {media.length}
          </Typography>

          <IconButton
            onClick={onClose}
            disableRipple
            sx={{
              color: "#111",
              transition: "transform 0.2s",
              "&:hover": { transform: "rotate(90deg)", bgcolor: "transparent" },
            }}
          >
            <CloseIcon fontSize="medium" />
          </IconButton>
        </Box>

        {/* ================= MAIN CONTENT (Flexible Height) ================= */}
        <Box
          sx={{
            flex: 1, // Takes all available space
            minHeight: 0, // Critical for Swiper to respect flex bounds
            position: "relative",
            bgcolor: "#f9f9f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Previous Button (Desktop) */}
          {!isMobile && (
            <NavButton
              direction="left"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            />
          )}

          {/* MAIN SWIPER */}
          <Box sx={{ width: "100%", height: "100%" }}>
            <Swiper
              onSwiper={setMainSwiper}
              initialSlide={selectedIndex}
              spaceBetween={20}
              slidesPerView={1}
              modules={[Navigation, Thumbs, Keyboard]}
              keyboard={{ enabled: true }}
              observer={false}
  observeParents={false}
  resizeObserver={false} // 🔥 important
              thumbs={{
                swiper:
                  thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
              }}
              onSlideChange={(swiper) =>{ 
                    pauseAllVideos(); // 🔥 FIX
                setCurrentIndex(swiper.activeIndex)
              }}
              style={{ width: "100%", height: "100%" }}
            >
              {media.map((item, i) => (
                <SwiperSlide key={i}>
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      p: { xs: 1, md: 4 }, // Padding inside slide
                    }}
                  >
                    {item.type === "video" ? (
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          maxWidth: "1400px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <video
                          src={item.src}
                          controls
                          autoPlay={i === currentIndex} // Only autoplay active slide
                          playsInline
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            borderRadius: "4px",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                          }}
                        />
                      </Box>
                    ) : (
                      <Box
                        component="img"
                        src={item.src}
                        alt={`Preview ${i}`}
                        sx={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                          filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.08))",
                          transition: "transform 0.3s ease",
                        }}
                      />
                    )}
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>

          {/* Next Button (Desktop) */}
          {!isMobile && (
            <NavButton
              direction="right"
              onClick={handleNext}
              disabled={currentIndex === media.length - 1}
            />
          )}

          {/* Mobile Overlay Controls (Tap zones) */}
          {isMobile && (
            <>
              <Box
                onClick={handlePrevious}
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "15%",
                  zIndex: 20,
                }}
              />
              <Box
                onClick={handleNext}
                sx={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: "15%",
                  zIndex: 20,
                }}
              />
            </>
          )}
        </Box>

        {/* ================= THUMBNAILS FOOTER ================= */}
        <Box
          sx={{
            flexShrink: 0,
            bgcolor: "#fff",
            borderTop: "1px solid rgba(0,0,0,0.05)",
            py: 2,
            px: 2,
            height: isMobile ? 80 : 100, // Fixed height area
            display: "flex",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <Box sx={{ maxWidth: "800px", width: "100%", height: "100%" }}>
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={12}
              slidesPerView="auto"
              freeMode
              watchSlidesProgress
              centerInsufficientSlides
              modules={[Thumbs]}
              style={{ height: "100%" }}
            >
              {media.map((item, i) => (
                <SwiperSlide key={i} style={{ width: "auto", height: "100%" }}>
                  <Box
                    sx={{
                      width: isMobile ? 48 : 64,
                      height: "100%",
                      borderRadius: "8px",
                      overflow: "hidden",
                      cursor: "pointer",
                      opacity: currentIndex === i ? 1 : 0.5,
                      border: `2px solid ${
                        currentIndex === i ? "#111" : "transparent"
                      }`,
                      transition: "all 0.2s ease",
                      position: "relative",
                      "&:hover": { opacity: 1 },
                    }}
                  >
                    {item.type === "video" ? (
                      <>
                        <Box
                          component="video"
                          src={item.src}
                          muted
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "rgba(0,0,0,0.2)",
                          }}
                        >
                          <PlayArrowIcon
                            sx={{ color: "#fff", fontSize: 16 }}
                          />
                        </Box>
                      </>
                    ) : (
                      <Box
                        component="img"
                        src={item.src}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

// Extracted Navigation Button Component for cleanliness
const NavButton = ({ direction, onClick, disabled }) => {
  if (disabled) return null;

  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        [direction]: 24,
        zIndex: 10,
        width: 48,
        height: 48,
        bgcolor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(4px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        border: "1px solid rgba(0,0,0,0.05)",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          bgcolor: "#fff",
          transform: "scale(1.05)",
          boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
        },
        "&:active": {
          transform: "scale(0.96)",
        },
      }}
    >
      {direction === "left" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
    </IconButton>
  );
};

export default PreviewDialog;


// import React from "react";
// import { Dialog, Box, IconButton, useMediaQuery, Typography } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Thumbs } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/thumbs";

// const PreviewDialog = ({ open, onClose, media = [], selectedIndex = 0 }) => {
//   const isMobile = useMediaQuery("(max-width:768px)");
//   const [thumbsSwiper, setThumbsSwiper] = React.useState(null);
//   const [mainSwiper, setMainSwiper] = React.useState(null);
//   const [currentIndex, setCurrentIndex] = React.useState(selectedIndex);

//   const handlePrevious = () => {
//     if (mainSwiper) {
//       mainSwiper.slidePrev();
//     }
//   };

//   const handleNext = () => {
//     if (mainSwiper) {
//       mainSwiper.slideNext();
//     }
//   };



//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       fullScreen
//       PaperProps={{
//         sx: {
//           backgroundColor: "#ffffff",
//           m: 0,
//           p: 0,
//           borderRadius: 0,
//         },
//       }}
//     >
//       {/* Main Container */}
//       <Box
//         sx={{
//           width: "100vw",
//           height: "100vh",
//           display: "flex",
//           flexDirection: "column",
//           bgcolor: "#ffffff",
//           position: "relative",
//         }}
//       >
//         {/* Top Bar with Close Button */}
//         <Box
//           sx={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             right: 0,
//             zIndex: 100,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             px: { xs: 2, md: 3 },
//             py: { xs: 1.5, md: 2 },
//             bgcolor: "rgba(255, 255, 255, 0.98)",
//             backdropFilter: "blur(8px)",
//             borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
//           }}
//         >
//           {/* Counter */}
//           <Typography
//             variant="body2"
//             sx={{
//               fontSize: { xs: "13px", md: "14px" },
//               fontWeight: 500,
//               color: "#424242",
//               letterSpacing: "0.2px",
//             }}
//           >
//             {currentIndex + 1} / {media.length}
//           </Typography>

//           {/* Close Button */}
//           <IconButton
//             onClick={onClose}
//             sx={{
//               color: "#424242",
//               width: { xs: 36, md: 40 },
//               height: { xs: 36, md: 40 },
//               transition: "all 0.2s ease",
//               "&:hover": {
//                 bgcolor: "#f5f5f5",
//                 color: "#000",
//               },
//             }}
//           >
//             <CloseIcon sx={{ fontSize: { xs: 20, md: 22 } }} />
//           </IconButton>
//         </Box>

//         {/* Main Image Area */}
//         <Box
//           sx={{
//              flex: 1,
//     minHeight: 0, // 🔥 critical for flex overflow
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     position: "relative",
//     bgcolor: "#fafafa",
//     pt: { xs: 7, md: 8 },
//     pb: { xs: 1, md: 2 },
//     overflow: "hidden",
//           }}
//         >
//           {/* Previous Button */}
//           {!isMobile && currentIndex > 0 && (
//             <IconButton
//               onClick={handlePrevious}
//               sx={{
//                 position: "absolute",
//                 left: 24,
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 zIndex: 10,
//                 bgcolor: "#ffffff",
//                 width: 48,
//                 height: 48,
//                 boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
//                 border: "1px solid rgba(0, 0, 0, 0.06)",
//                 transition: "all 0.2s ease",
//                 "&:hover": {
//                   bgcolor: "#ffffff",
//                   boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
//                   transform: "translateY(-50%) scale(1.05)",
//                 },
//                 "&:active": {
//                   transform: "translateY(-50%) scale(0.98)",
//                 },
//               }}
//             >
//               <ChevronLeftIcon sx={{ fontSize: 28, color: "#1a1a1a" }} />
//             </IconButton>
//           )}

//           {/* Main Swiper */}
//           <Box
//             sx={{
//               width: "100%",
//               height: "100%",
//               maxWidth: { xs: "100%", md: "1200px" },
//               maxHeight: { xs: "100%", md: "calc(100vh - 200px)" },
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <Swiper
//               onSwiper={setMainSwiper}
//               initialSlide={selectedIndex}
//               spaceBetween={0}
//               thumbs={{
//                 swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
//               }}
//               modules={[Navigation, Thumbs]}
//               onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
//               style={{
//                 width: "100%",
//                 height: "100%",
//               }}
//             >
//               {media.map((item, i) => (
//                 <SwiperSlide key={i}>
//                   <Box
//                     sx={{
//                       width: "100%",
//                       height: "100%",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       maxWidth: "1200px",
//                       px: { xs: 1.5, md: 4 },
//                     }}
//                   >
//                     {/* IMAGE */}
//                     {item.type === "image" && (
//                       <Box
//                         component="img"
//                         src={item.src}
//                         draggable={false}
//                         alt={`Media ${i + 1}`}
//                         sx={{
//                           maxWidth: "100%",
//                           maxHeight: "100%",
//                           objectFit: "contain",
//                           userSelect: "none",
//                         }}
//                       />
//                     )}

//                     {/* VIDEO */}
//                     {item.type === "video" && (
//                       <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
//                         <video
//                           src={item.src}
//                           controls
//                           muted
//                           style={{
//                             maxWidth: "100%",
//                             maxHeight: "100%",
//                             objectFit: "contain",
//                           }}
//                         />
//                       </Box>
//                     )}
//                   </Box>
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           </Box>

//           {/* Next Button */}
//           {!isMobile && currentIndex < media.length - 1 && (
//             <IconButton
//               onClick={handleNext}
//               sx={{
//                 position: "absolute",
//                 right: 24,
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 zIndex: 10,
//                 bgcolor: "#ffffff",
//                 width: 48,
//                 height: 48,
//                 boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
//                 border: "1px solid rgba(0, 0, 0, 0.06)",
//                 transition: "all 0.2s ease",
//                 "&:hover": {
//                   bgcolor: "#ffffff",
//                   boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
//                   transform: "translateY(-50%) scale(1.05)",
//                 },
//                 "&:active": {
//                   transform: "translateY(-50%) scale(0.98)",
//                 },
//               }}
//             >
//               <ChevronRightIcon sx={{ fontSize: 28, color: "#1a1a1a" }} />
//             </IconButton>
//           )}
//         </Box>

//         {/* Bottom Thumbnail Bar */}
//         <Box
//           sx={{
//                 flexShrink: 0, // 🔥 prevents layout push
//             width: "100%",
//             bgcolor: "#ffffff",
//             borderTop: "1px solid rgba(0, 0, 0, 0.06)",
//               py: { xs: 1.5, md: 2 },
//     px: { xs: 1.5, md: 3 },
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <Box
//             sx={{
//               maxWidth: "1000px",
//               margin: "0 auto",
//             }}
//           >
//             <Swiper
//               onSwiper={setThumbsSwiper}
//               slidesPerView="auto"
//               spaceBetween={12}
//               watchSlidesProgress
//               modules={[Thumbs]}
//               style={{
//                 height: isMobile ? 64 : 80,
//               }}
//             >
//               {media.map((item, i) => (
//                 <SwiperSlide key={i} style={{ width: "auto", height: "100%" }}>
//                   <Box
//                     sx={{
//                       height: "100%",
//                       width: "auto",
//                       position: "relative",
//                       cursor: "pointer",
//                       borderRadius: 2,
//                       overflow: "hidden",
//                       border: "2px solid",
//                       borderColor: currentIndex === i ? "#1a1a1a" : "transparent",
//                       transition: "all 0.2s ease",
//                     }}
//                   >
//                     {/* IMAGE Thumbnail */}
//                     {item.type === "image" && (
//                       <Box
//                         component="img"
//                         src={item.src}
//                         alt=""
//                         draggable={false}
//                         sx={{
//                           height: "100%",
//                           width: "auto",
//                           objectFit: "cover",
//                           bgcolor: "#fafafa",
//                         }}
//                       />
//                     )}

//                     {/* VIDEO Thumbnail */}
//                     {item.type === "video" && (
//                       <Box
//                         sx={{
//                           height: "100%",
//                           width: "auto",
//                           position: "relative",
//                           bgcolor: "#000000",
//                         }}
//                       >
//                         <video
//                           src={item.src}
//                           muted
//                           style={{
//                             height: "100%",
//                             width: "auto",
//                             objectFit: "cover",
//                             opacity: 0.75,
//                           }}
//                         />

//                         {/* Play Icon */}
//                         <Box
//                           sx={{
//                             position: "absolute",
//                             inset: 0,
//                             display: "flex",
//                             justifyContent: "center",
//                             alignItems: "center",
//                           }}
//                         >
//                           <Box
//                             sx={{
//                               width: 28,
//                               height: 28,
//                               bgcolor: "rgba(255,255,255,0.8)",
//                               borderRadius: "50%",
//                               display: "flex",
//                               justifyContent: "center",
//                               alignItems: "center",
//                             }}
//                           >
//                             ▶
//                           </Box>
//                         </Box>
//                       </Box>
//                     )}
//                   </Box>
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           </Box>
//         </Box>

//         {/* Mobile Navigation Buttons */}
//         {isMobile && (
//           <>
//             {currentIndex > 0 && (
//               <IconButton
//                 onClick={handlePrevious}
//                 sx={{
//                   position: "absolute",
//                   left: 12,
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   zIndex: 10,
//                   bgcolor: "rgba(255, 255, 255, 0.95)",
//                   width: 40,
//                   height: 40,
//                   boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//                   "&:active": {
//                     transform: "translateY(-50%) scale(0.95)",
//                   },
//                 }}
//               >
//                 <ChevronLeftIcon sx={{ fontSize: 24, color: "#1a1a1a" }} />
//               </IconButton>
//             )}

//             {currentIndex < media.length - 1 && (
//               <IconButton
//                 onClick={handleNext}
//                 sx={{
//                   position: "absolute",
//                   right: 12,
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   zIndex: 10,
//                   bgcolor: "rgba(255, 255, 255, 0.95)",
//                   width: 40,
//                   height: 40,
//                   boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//                   "&:active": {
//                     transform: "translateY(-50%) scale(0.95)",
//                   },
//                 }}
//               >
//                 <ChevronRightIcon sx={{ fontSize: 24, color: "#1a1a1a" }} />
//               </IconButton>
//             )}
//           </>
//         )}
//       </Box>

//       {/* Custom Styles */}
//       <style>
//         {`
//           .thumbnail-swiper .swiper-slide-thumb-active .thumbnail-image {
//             border-color: #1a1a1a !important;
//             box-shadow: 0 0 0 1px #1a1a1a;
//           }

//           .swiper-button-next,
//           .swiper-button-prev {
//             display: none !important;
//           }

//           .swiper-wrapper {
//             align-items: center;
//           }
//         `}
//       </style>
//     </Dialog>
//   );
// };

// export default PreviewDialog;
