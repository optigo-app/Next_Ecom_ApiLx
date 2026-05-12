import React, { useLayoutEffect, useState } from "react";
import { Box, IconButton, Link } from "@mui/material";
import { Menu as MenuIcon } from "lucide-react";
import { Link as LinkR, useLocation, useNavigate } from "react-router-dom";

const WioNav = ({ isMobile, handleDrawerToggle, compnyLogo, IsSetupFor }) => {
  const [Menu, setMenuId] = useState("");
  const location = useLocation();
  const router = useNavigate();

  const HandleMoveToMenu = (MenuId, type) => {
    if (MenuId === "/contact-us") {
      router(MenuId);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    } else {
      router("/");
      setMenuId(MenuId);
      return;
    }
  };
  // --- STATIC PUBLIC MENU LINKS (For Non-Logged In Users) ---
  const publicLinksLeft = [
    { title: "Our Brands", id: "brandsComponentID" },
    { title: "Product", id: "elveeGiftMainId" }, // You can add hover logic here later if needed
    { title: "Our Craftsmanship", id: "craftmenshipId" },
  ];

  const publicLinksRight = [
    { title: "Gallery", id: "mainGalleryConatinerID123" },
    { title: "Social Media", id: "mainSocialMediaConatinerID" },
    { title: "Contact", id: "/contact-us" },
  ];

  useLayoutEffect(() => {
    const scrollToElement = () => {
      const targetElement = document.querySelector(`[name='${Menu}']`);

      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const offsetTop = window.pageYOffset + rect.top;
        let top = 135;
        if (Menu === "elveeGiftMainId") {
          top = 70;
        }

        window.scrollTo({
          top: offsetTop - top,
          behavior: "smooth",
        });
        setMenuId("");
      }
    };

    if (Menu !== "") {
      const timeoutId = setTimeout(() => {
        scrollToElement();
        const targetElement = document.querySelector(`[name='${Menu}']`);
        if (targetElement) {
          const resizeObserver = new ResizeObserver(() => {
            scrollToElement();
          });

          resizeObserver.observe(targetElement);
          return () => resizeObserver.disconnect();
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [Menu, location.pathname]);

  return (
    <>
      <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        {/* 1. Mobile Toggle (Only visible on mobile) */}
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} sx={{ position: "absolute", left: 0, color: "inherit" }}>
            <MenuIcon />
          </IconButton>
        )}

        {/* 2. Left Links (Desktop Only) */}
        <Box sx={{ display: { xs: "none", lg: "flex" }, alignItems: "center", gap: 4 }}>
          {publicLinksLeft.map((item, idx) => (
            <Link
              key={idx}
              onClick={() => HandleMoveToMenu(item.id)}
              style={{
                textDecoration: "none",
                color: "inherit",
                fontSize: "0.9rem",
                fontWeight: 500,
                letterSpacing: "0.5px",
                cursor: "pointer",
              }}
            >
              {item.title}
            </Link>
          ))}
        </Box>

        {/* 3. CENTER LOGO */}
        <Box component={LinkR} to="/" sx={{ mx: { xs: 0, lg: 6 }, display: "flex", alignItems: "center" }}>
          <Box
            component="img"
            src={compnyLogo}
            alt="Logo"
            sx={{
              width: IsSetupFor ? "160px" : "120px",
              transition: "width 0.3s ease",
            }}
          />
        </Box>

        {/* 4. Right Links (Desktop Only) */}
        <Box sx={{ display: { xs: "none", lg: "flex" }, alignItems: "center", gap: 4 }}>
          {publicLinksRight.map((item, idx) => (
            <Link
              onClick={() => HandleMoveToMenu(item.id)}
              key={idx}
              style={{
                textDecoration: "none",
                color: "inherit",
                fontSize: "0.9rem",
                fontWeight: 500,
                letterSpacing: "0.5px",
                cursor: "pointer",
              }}
            >
              {item.title}
            </Link>
          ))}
        </Box>

        {/* 5. "Log In" Button (Absolute Right) */}
        <Box sx={{ position: "absolute", right: 0, display: { xs: "none", sm: "block" } }}>
          <Link
            component={LinkR}
            to="/LoginOption" // Set your login route here
            style={{
              textDecoration: "none",
              color: "inherit",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Log In
          </Link>
        </Box>
      </Box>
    </>
  );
};

export default WioNav;
