"use client";
import React, { useEffect, useState } from "react";
import Usewishlist from "@/app/(core)/utils/Glob_Functions/Cart_Wishlist/Wishlist";
import WishlistItems from "./WishlistItems";
import "./smr_wishlist.scss";
import WishlistData from "./WishlistData";
import SkeletonLoader from "./WishlistSkelton";
import ConfirmationDialog from "@/app/(core)/utils/Glob_Functions/ConfirmationDialog/ConfirmationDialog";
import { GetCountAPI } from "@/app/(core)/utils/API/GetCount/GetCountAPI";
import Cookies from "js-cookie";
import { useMediaQuery } from "@mui/material";
import { toast } from "react-toastify";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import MobileNavbar from './NavigationBar'
import { Box, Button, Typography } from "@mui/material";
import { getButtonStyle } from "@/app/(core)/constants/MobileAppTheme";


const Wishlist = ({ storeInit }) => {
  const {
    isWLLoading,
    wishlistData,
    CurrencyData,
    updateCount,
    countDataUpdted,
    itemInCart,
    finalWishData,
    decodeEntities,
    WishCardImageFunc,
    handleRemoveItem,
    handleRemoveAll,
    handleWishlistToCart,
    handleAddtoCartAll,
    handleMoveToDetail,
    handelMenu
  } = Usewishlist();
  const { setCartCountNum, setWishCountNum } = useStore()
  const [dialogOpen, setDialogOpen] = useState(false);
  const visiterId = Cookies.get('visiterId');
  const isMobileScreen = useMediaQuery('(max-width:768px)');


  const handleRemoveAllDialog = () => {
    setDialogOpen(true);
  };


  const handleConfirmRemoveAll = async () => {
    setDialogOpen(false);
    const returnValue = await handleRemoveAll();
    if (returnValue?.msg == "success") {
      GetCountAPI(visiterId).then((res) => {
        setWishCountNum(res?.wishcount);
      })
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };


  const handleAddtoCartAllfun = async () => {
    const returnValue = await handleAddtoCartAll();
    if (returnValue?.msg == "success") {
      toast.success("All wishlist items added in cart", {
        toastId: "wishlist-add-all-to-cart",
        position: "bottom-center",
        style: {
          width: "max-content",
          margin: "0 auto",
          minHeight: "35px",
          padding: "4px 16px",
          fontSize: "13px",
          borderRadius: "20px",
          marginBottom: "60px",
        }
      });
      GetCountAPI(visiterId).then((res) => {
        setCartCountNum(res?.cartcount);
      })
    }
  }

  useEffect(() => {
    setCSSVariable();
  }, [])

  const setCSSVariable = () => {
    const backgroundColor = storeInit?.IsPLW == 1 ? "#c4cfdb" : "#c0bbb1";
    document.documentElement.style.setProperty(
      "--background-color",
      backgroundColor
    );
  };

  return (
    <>
      <MobileNavbar />
      {finalWishData?.length !== 0 && (
        <Box
          sx={{
            p: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1.5,
            background: "#fff"
          }}
        >
          <Button
            variant="text"
            onClick={handleRemoveAllDialog}
            sx={{
              fontSize: "0.8rem",
              textTransform: "none",
              color: "#777"
            }}
          >
            CLEAR ALL
          </Button>

          <Button
            variant="contained"
            onClick={handleAddtoCartAllfun}
            sx={getButtonStyle(true, {
              py: 0.8,
              borderRadius: "8px"
            })}
          >
            ADD ALL TO CART
          </Button>
        </Box>
      )}
      <div className="smr_MainWlDiv">
        <div className="WlMainPageDiv">
          {!isWLLoading ? (
            <WishlistData
              isloding={isWLLoading}
              items={finalWishData}
              updateCount={updateCount}
              countDataUpdted={countDataUpdted}
              curr={CurrencyData}
              itemInCart={itemInCart}
              decodeEntities={decodeEntities}
              WishCardImageFunc={WishCardImageFunc}
              handleRemoveItem={handleRemoveItem}
              handleWishlistToCart={handleWishlistToCart}
              handleMoveToDetail={handleMoveToDetail}
              handelMenu={handelMenu}
              storeInit={storeInit}
            />
          ) : (
            <div style={{ marginTop: '20px' }}>
              <SkeletonLoader length={8} />
            </div>
          )}
          <ConfirmationDialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            onConfirm={handleConfirmRemoveAll}
            title="Confirm"
            content="Are you sure you want to remove all Items?"
          />
        </div>
      </div>
    </>
  );
};

export default Wishlist;
