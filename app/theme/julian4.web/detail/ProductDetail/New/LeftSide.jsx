import React, { useRef } from "react";
import { Grid, Box, Typography, useMediaQuery } from "@mui/material";
import { DetailSkeleton } from "./Skeleton";
import JewelryCarousel from "./Carousel";

const noImageFound = '/image-not-found.jpg';

const LeftSide = ({ HandleImageDialogOpen = () => { }, loading = false, media, isMediaReady, mediaBuildDone }) => {
  const videoRefs = useRef([]);
  const Ismobile = useMediaQuery("(max-width: 768px)");

  const handleMouseEnter = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      video.muted = true;
      video.play();
    }
  };

  const handleMouseLeave = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  const handleError = (e) => {
    e.target.onerror = null;
    e.target.src = noImageFound;
  };

  const handleVideoError = (e) => {
    e.target.onerror = null;
    e.target.poster = noImageFound;
  };

  if (loading && !mediaBuildDone && media !== null) {
    return (
      <Grid size={{
        xs: 12,
        sm: 12,
        md: 6
      }} >
        <DetailSkeleton />
      </Grid>
    );
  }

  if (media !== null && isMediaReady && mediaBuildDone && media.length === 0) {
    return (
      <Grid size={{ xs: 12, sm: 12, md: 6 }} >
        <Grid container spacing={1.5}>
          <Grid item size={{ xs: 6 }}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid #f2f0ee33",
                bgcolor: '#fff9f266'
              }}
            >
              <Box
                component="img"
                src={noImageFound}
                alt="No Image Available"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  aspectRatio: { xs: "3/4", sm: "1/1.25", md: "1/1.3" },
                  display: "block",
                  mixBlendMode: "multiply",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  if (Ismobile) {
    return <>
      <Grid item size={{ xs: 12, sm: 12 }}>
        <Box>
          <JewelryCarousel carouselItems={media} HandleImageDialogOpen={HandleImageDialogOpen} />
        </Box>
      </Grid>
    </>
  }


  return (
    <Grid size={{ xs: 12, sm: 12, md: 6 }}  >
      <Box>
        <Grid container spacing={1.5}>
          {media?.map((item, index) => (
            <Grid item size={{
              xs: 6
            }} key={index}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  cursor: "zoom-in",
                  borderRadius: 3,
                  overflow: "hidden",
                  border: "1px solid #f2f0ee33",
                  transition: "0s ease-in-out",
                  bgcolor: '#fff9f266'
                }}
                onClick={() => HandleImageDialogOpen(index)}
              >
                {/* IMAGE */}
                {item?.type === "image" && (
                  <Box
                    component="img"
                    src={item?.src}
                    alt=""
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      aspectRatio: { xs: "3/4", sm: "1/1.25", md: "1/1.3" },
                      transition: "all 0.25s ease",
                      display: "block",
                      mixBlendMode: "multiply",
                    }}
                    onError={handleError}
                  />
                )}

                {/* VIDEO */}
                {item?.type === "video" && (
                  <Box
                    className="video-wrapper"
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                    sx={{
                      position: "relative",
                    }}
                  >
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      src={item?.src}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        aspectRatio: "1 / 1.3",
                        borderRadius: "12px",
                        display: "block",
                      }}
                      onError={handleVideoError}
                    />

                    {/* Play Icon Overlay */}
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 1,
                        transition: "0.25s",
                        pointerEvents: "none",
                        ".video-wrapper:hover &": {
                          opacity: 0,
                        },
                      }}
                    >
                      <PlaySvg />
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Grid>
  );
};

export default LeftSide;

const PlaySvg = () => (
  <svg viewBox="0 0 24 24" width="48" height="48" fill="none">
    <circle cx="12" cy="12" r="10" stroke="rgba(141, 133, 133, 1)" strokeWidth="1.5" opacity="0.5" />
    <path d="M13.88 9.93C14.96 10.81 15.5 11.25 15.5 12c0 .75-.54 1.19-1.62 2.07-.3.24-.6.46-.87.65-.24.17-.51.34-.79.5-1.07.66-1.61.99-2.09.63-.48-.36-.52-1.12-.6-2.63-.02-.42-.04-.84-.04-1.23s.02-.81.04-1.23c.08-1.51.12-2.27.6-2.63.48-.36 1.02-.03 2.09.63.28.16.55.33.79.5.3.21.6.43.87.66z" stroke="rgba(141, 133, 133, 1)" strokeWidth="1.5" />
  </svg>
);
