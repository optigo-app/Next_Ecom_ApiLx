import React, { useEffect, useState } from "react";
import "./hoq_wishlist.scss";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import { GetCountAPI } from "@/app/(core)/utils/API/GetCount/GetCountAPI";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { Skeleton } from "@mui/material";
import { formatTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { useStore } from "@/app/(core)/contexts/StoreProvider";

const WishlistItems = ({
  item,
  itemInCart,
  updateCount,
  countDataUpdted,
  itemsLength,
  currency,
  decodeEntities,
  WishCardImageFunc,
  handleRemoveItem,
  handleWishlistToCart,
  handleMoveToDetail,
  StoreInit,
}) => {

  const { setCartCountNum: setCartCountVal, setWishCountNum: setWishCountVal } = useStore();

  const visiterId = Cookies.get("visiterId");
  const loginUserDetail = JSON.parse(sessionStorage.getItem("loginUserDetail"));

  const noImageFound = "./image-not-found.jpg";

  const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
  const CDNDesignImageFolThumb = storeInit?.CDNDesignImageFolThumb;
  const fullImagePath = `${CDNDesignImageFolThumb}${item?.designno}~1.jpg`;

  const isLoading = item?.loading;

  const [resolvedImage, setResolvedImage] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      if (item?.images && typeof item.images.then === "function") {
        const url = await item.images;  // await the Promise here
        if (isMounted) setResolvedImage(url);
      } else if (typeof item?.images === "string") {
        setResolvedImage(item.images);
      } else {
        setResolvedImage(null);
      }
    };

    loadImage();

    return () => { isMounted = false; };
  }, [item]);

  const imageSrc =
    typeof resolvedImage === "string" && resolvedImage.length > 0
      ? resolvedImage
      : fullImagePath;

  const handleWishlistToCartFun = async (item) => {
    const returnValue = await handleWishlistToCart(item);
    if (returnValue?.msg == "success") {
      toast.success(<Toast />, {
        hideProgressBar: true,
        style: {
          borderRadius: "4px",
          padding: '-2px 45px',
          boxShadow: `rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px`,
          border: "2px solid white"
        },
      })
      GetCountAPI(visiterId).then((res) => {
        setCartCountVal(res?.cartcount);
      });
    }
  };

  const handleRemoveItemFun = async (item) => {
    const returnValue = await handleRemoveItem(item);
    if (returnValue?.msg == "success") {
      GetCountAPI(visiterId).then((res) => {
        setWishCountVal(res?.wishcount);
      });
    }
  };

  return (
    <CustomGrid itemsLength={itemsLength}>
      <Card className="hoq_WlListCard" square sx={{ border: "none" }}>
        <div className="cardContent">
          {/* {isLoading === true || !imageSrc ? (    */}
          {isLoading === true ? (
            <CardMedia
              style={{ width: "100%" }}
              className="hoq_WlListImage"
            >
              <Skeleton
                animation="wave"
                variant="rect"
                width="100%"
                height={300}
                sx={{
                  backgroundColor: "#e8e8e86e",
                  '@media (max-width: 1700px)': {
                    height: "250px !important",
                  },
                  '@media (max-width: 900px)': {
                    height: "200px !important",
                  },
                  '@media (max-width: 600px)': {
                    height: "150px !important",
                  },
                }}
              />
            </CardMedia>
          ) : (
            <CardMedia
              component="img"
              image={imageSrc}
              loading="lazy"
              alt=" "
              sx={{
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                '&:focus': { outline: 'none' },
                '&:active': { outline: 'none' },
              }}
              className="hoq_WlListImage"
              onClick={() => handleMoveToDetail(item)}
              onError={(e) => {
                const current = e.target.src;
                if (!current.includes(fullImagePath) && item?.ImageCount > 0) {
                  e.target.src = fullImagePath;
                  return;
                }
                if (!current.includes("image-not-found.jpg")) {
                  e.target.src = noImageFound;
                }
              }}
            />
          )}
          <CardContent
            className="hoq_cardContent"
            sx={{
              padding: "0 0px",
            }}
          >
            <div className="cardText">
              <Typography variant="body2" className="hoq_card-ContentData">
                {formatTitleLine(item?.TitleLine)} {(formatTitleLine(item?.TitleLine) && item?.designno) && '-'}
                {item?.designno != "" && item?.designno}
              </Typography>
              <Typography variant="body2" className="hoq_card-ContentData-1">
                {StoreInit?.IsGrossWeight == 1 && (
                  <>
                    {" "}
                    <span className="hoq_wishDT">GWT: </span>
                    <span className="hoq_wishDT">
                      {(item?.Gwt || 0).toFixed(3)}
                    </span>
                    <span className="hoq_pipe"> | </span>{" "}
                  </>
                )}
                <span className="hoq_wishDT">NWT: </span>
                <span className="hoq_wishDT">
                  {(item?.Nwt || 0).toFixed(3)}{" "}
                </span>

                {StoreInit?.IsDiamondWeight == 1 && (item?.Dwt != "0" || item?.Dpcs != "0") && (
                  <>
                    {" "}
                    <span className="hoq_pipe"> | </span>
                    <span className="hoq_wishDT">DWT: </span>
                    <span>
                      {(item?.Dwt || 0).toFixed(3)} /{" "}
                      {(item?.Dpcs || 0).toFixed(0)}
                    </span>
                  </>
                )}
                {(item?.CSwt != "0" || item?.CSpcs != "0") && (
                  <>
                    {" "}
                    <span className="hoq_pipe"> | </span>
                    <span className="hoq_wishDT">CWT: </span>
                    <span>
                      {(item?.CSwt || 0).toFixed(3)} /{" "}
                      {(item?.CSpcs || 0).toFixed(0)}{" "}
                    </span>
                  </>
                )}
              </Typography>
              <Typography variant="body2" className="hoq_card-ContentData">
                {item?.metalcolorname !== "" && (
                  <span>{item.metalcolorname}</span>
                )}
                {item?.metalcolorname !== "" && item?.metaltypename !== "" && (
                  <span> - </span>
                )}
                {item?.metaltypename !== "" && (
                  <span>{item?.metaltypename}</span>
                )}
                {StoreInit?.IsPriceShow && <>
                  {" / "}
                  <span
                    className="hoq_currencyFont"
                    dangerouslySetInnerHTML={{
                      __html: decodeEntities(
                        loginUserDetail?.CurrencyCode ?? StoreInit?.CurrencyCode
                      ),
                    }}
                  />
                  {item?.UnitCost !== "" && (
                    <span>{(item?.FinalCost).toLocaleString("en-IN")}</span>
                  )}
                </>}
              </Typography>
            </div>
            {/* <div className='designNoWlList'>
                            <p className='hoq_DesignNoTExt'>{item?.designno}</p>
                        </div> */}
          </CardContent>
          <div className="hoq_Wl-CartbtnDiv">
            <button
              className="hoq_Wl-Cartbtn"
              onClick={() => handleWishlistToCartFun(item)}
            >
              {item?.IsInCart != 1 ? "Add to cart +" : "Remove from cart"}
            </button>
          </div>
        </div>
        <div
          className="closeWlIconDiv"
          onClick={(e) => handleRemoveItemFun(item)}
        >
          <CloseIcon className="closeWlIcon" />
        </div>
      </Card>
    </CustomGrid>
  );
};

export default WishlistItems;

const Toast = () => (
  <div className="cust_hoq_toast">
    <div className="right">Wishlist items added in Cart.</div>
  </div>
);


const CustomGrid = ({ itemsLength, children }) => {
  const sizes = {
    xs: 6,                              // 2 items per row on mobile
    sm: itemsLength <= 2 ? 6 : 4,       // if only 2 items → bigger
    md: itemsLength <= 2 ? 4 : 4,
    lg: itemsLength <= 2 ? 3 : 3,       // 4 items per row on desktop
    xl: 2.4,                            // smoother spacing on big screens
  };

  return (
    <Grid item {...sizes} sx={{ borderRadius: 0 }}>
      {children}
    </Grid>
  );
};
