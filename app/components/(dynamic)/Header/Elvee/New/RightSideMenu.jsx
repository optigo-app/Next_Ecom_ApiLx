import { alpha } from "@mui/material";
import { Box, IconButton, Badge } from "@mui/material";
import { Search as SearchIcon, Heart as FavoriteIcon, User as PersonIcon, ShoppingCart as ShoppingBagIcon, LogOut } from "lucide-react";
const RightSideMenu = ({ is768px, isMobile, setSearchOpen, IsB2BWebsiteChek, storeinit, handleLogout, islogin, navigate, isHovered, isScrolled, cartCount, wishCount }) => {
  // B2C: IsB2BWebsite === 0 — guests can browse/search/cart without login
  const IsB2CWebsiteChek = IsB2BWebsiteChek == 0;

  return (
    <>
      <Box sx={{
        display: "flex", alignItems: "center",
        flex: 1,
        justifyContent: 'flex-end'
      }}>
        {(islogin || IsB2CWebsiteChek) && (
          <IconButton
            onClick={() => setSearchOpen((prev) => !prev)}
            sx={{
              "&:hover": { bgcolor: alpha("#fff", 0.08) },
              color: isHovered || isScrolled ? "#000" : "#fff",
              display: { xs: "none", sm: "flex" }, // 👈 hide on mobile
            }}
          >
            <SearchIcon style={{ fontSize: "18px", color: "inherit" }} />
          </IconButton>
        )}

        {!is768px && (
          (islogin || IsB2CWebsiteChek) && <IconButton
            sx={{
              "&:hover": { bgcolor: alpha("#fff", 0.08) },
              color: isHovered || isScrolled ? "#000" : "#fff",
            }}
            onClick={() => navigate("/myWishList")}
          >
            <Badge badgeContent={wishCount} sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "#000",
                color: "#fff",
                borderRadius: "50%",
                padding: "0 6px",
                fontSize: "10px",
                width: "20px",
                height: "20px !important",
              }
            }}>
              <FavoriteIcon style={{ fontSize: "18px", color: "inherit" }} />
            </Badge>
          </IconButton>
        )}
        {IsB2BWebsiteChek == 0 ? (
          storeinit?.IsPLW ? (
            ""
          ) : (
            <>
              {islogin && (
                <IconButton
                  sx={{
                    "&:hover": { bgcolor: alpha("#fff", 0.08) },
                    color: isHovered || isScrolled ? "#000" : "#fff",
                  }}
                  onClick={() => navigate("/account")}
                >
                  <PersonIcon style={{ fontSize: "18px", color: "inherit" }} />
                </IconButton>
              )}
            </>
          )
        ) : islogin && storeinit?.IsPLW ? (
          ""
        ) : (
          <>
            {islogin === true && (
              <IconButton
                sx={{
                  "&:hover": { bgcolor: alpha("#fff", 0.08) },
                  color: isHovered || isScrolled ? "#000" : "#fff",
                }}
                onClick={() => navigate("/account")}
              >
                <PersonIcon style={{ fontSize: "18px", color: "inherit" }} />
              </IconButton>
            )}
          </>
        )}

        {(islogin || IsB2CWebsiteChek) && <IconButton
          sx={{
            "&:hover": { bgcolor: alpha("#fff", 0.08) },
            color: isHovered || isScrolled ? "#000" : "#fff",
          }}
          onClick={() => navigate("/cartPage")}
        >
          <Badge badgeContent={cartCount} sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "#000",
              color: "#fff",
              borderRadius: "50%",
              padding: "0 6px",
              fontSize: "10px",
              width: "20px",
              height: "20px !important",
            }
          }}>
            <ShoppingBagIcon style={{ fontSize: "18px", color: "inherit" }} />
          </Badge>
        </IconButton>}
        {islogin && <IconButton
          sx={{
            "&:hover": { bgcolor: alpha("#fff", 0.08) },
            color: isHovered || isScrolled ? "#000" : "#fff",
          }}
          onClick={handleLogout}
        >
          <LogOut style={{ fontSize: "18px", color: "inherit" }} />
        </IconButton>}
        {!islogin && <IconButton
          sx={{
            "&:hover": { bgcolor: alpha("#fff", 0.08) },
            color: isHovered || isScrolled ? "#000" : "#fff",
          }}
          onClick={() => navigate("/LoginOption")}
        >
          <PersonIcon style={{ fontSize: "18px", color: "inherit" }} />
        </IconButton>}
      </Box>
    </>
  );
};

export default RightSideMenu;
