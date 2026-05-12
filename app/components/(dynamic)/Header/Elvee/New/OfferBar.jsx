import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { storImagePath } from "../../../../../../../utils/Glob_Functions/GlobalFunction";

const OfferBar = () => {
  const [offers, setOffers] = useState([]);
  const [showBar, setShowBar] = useState(false);

  const path = storImagePath() + "/json/offers.json";

  useEffect(() => {
    let isMounted = true;

    fetch(path, { cache: "no-store" }) // always fetch fresh
      .then((response) => {
        if (!response.ok) throw new Error("Invalid response");
        return response.json();
      })
      .then((data) => {
        if (!isMounted) return;

        const cleanOffers = Array.isArray(data?.offers)
          ? data.offers.filter((o) => typeof o === "string" && o.trim() !== "")
          : [];

        setOffers(cleanOffers);
        setShowBar(cleanOffers.length > 0);
      })
      .catch(() => {
        // FAIL SILENTLY
        setShowBar(false);
      });

    return () => {
      isMounted = false;
    };
  }, [path]);

  // 🚨 No offers → do not render anything
  if (!showBar) return null;

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#927038",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontSize: { xs: "12px", sm: "13px" },
        fontWeight: 400,
        position: "sticky",
        top: 0,
        zIndex: 999,
        py: 0.8,
      }}
    >
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        loop
        allowTouchMove={false}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        speed={800}
        style={{ width: "100%" }}
      >
        {offers.map((offer, index) => (
          <SwiperSlide key={index}>
            <Typography
              sx={{
                color: "#fff",
                fontSize: { xs: "12px", sm: "13px" },
                fontWeight: 400,
                letterSpacing: 0.8,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              {offer}
            </Typography>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default OfferBar;
