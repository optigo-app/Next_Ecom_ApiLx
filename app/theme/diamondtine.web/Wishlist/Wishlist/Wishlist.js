'use client'
import React, { useEffect, useState } from 'react'
import './Wishlist.modul.scss';
import WishlistData from './WishlistData';
import Usewishlist from '@/app/(core)/utils/Glob_Functions/Cart_Wishlist/Wishlist';
import { GetCountAPI } from '@/app/(core)/utils/API/GetCount/GetCountAPI';
import Cookies from 'js-cookie'
import SkeletonLoader from './WishlistSkeleton';
import { Box, Button, CircularProgress, Modal, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import ConfirmationDialog from '@/app/(core)/utils/Glob_Functions/ConfirmationDialog/ConfirmationDialog';
import useGlobalPreventSave from '@/app/(core)/utils/Glob_Functions/useGlobalPreventSave';
import WishlistHeader from './New/WishlistHeader';
import { useStore } from '@/app/(core)/contexts/StoreProvider';
import { useBroadcaster } from '@/app/(core)/contexts/BoardCastContext';
import { useSnackbarStore } from '@/app/(core)/hooks/useSnackbar';

const ElveeWishlist = ({ storeInit }) => {
  const {
    isWLLoading,
    wishlistData,
    CurrencyData,
    updateCount,
    countDataUpdted,
    finalWishData,
    itemInCart,
    decodeEntities,
    WishCardImageFunc,
    handleRemoveItem,
    handleRemoveAll,
    handleWishlistToCart,
    handleAddtoCartAll,
    handleMoveToDetail,
    handelMenu
  } = Usewishlist();
  const { setCartCountNum, setWishCountNum } = useStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const visiterId = Cookies.get('visiterId');
  const { broadcast } = useBroadcaster();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const handleRemoveAllDialog = () => {
    setDialogOpen(true);
  };

  const handleConfirmRemoveAll = async () => {
    setDialogOpen(false);
    const returnValue = await handleRemoveAll();
    if (returnValue?.msg == "success") {
      GetCountAPI(visiterId).then((res) => {
        setWishCountNum(res?.wishcount);
        broadcast('UPDATE_WISH_COUNT', res?.wishcount);
      })
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };


  const handleAddtoCartAllfun = async () => {
    const returnValue = await handleAddtoCartAll();
    if (returnValue?.msg == "success") {
      showSnackbar('All wishlist items added in cart');
      GetCountAPI(visiterId).then((res) => {
        setCartCountNum(res?.cartcount);
        broadcast('UPDATE_CART_COUNT', res?.cartcount);
      })
    }
  }

  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, [])

  useGlobalPreventSave();
  return (
    <>
      {isWLLoading && (
        <div style={{
          width: " 100%",
          height: "100%",
          position: "fixed",
          zIndex: '100',
          background: '#83838333',
          overflow: 'hidden',
          top: 0
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', }}>
            <CircularProgress sx={{ color: '#2e2d2d' }} />
          </Box>
        </div>
      )}

      <Box
        sx={{
         
          width: "100%",
          bgcolor: '#fff',
          boxSizing: 'border-box'
        }}
      >
        <div className="elv_WlMainPageDiv">
          {/* {finalWishData?.length > 0 &&
            <WishlistHeader count={finalWishData?.length || 0} handleMovetoCartAll={handleAddtoCartAllfun} handleRemoveAll={handleRemoveAllDialog} />
          } */}
          {!isWLLoading ? (
            <WishlistData
              isloding={isWLLoading}
              items={finalWishData}
              updateCount={updateCount}
              countDataUpdted={countDataUpdted}
              currency={CurrencyData}
              itemInCart={itemInCart}
              decodeEntities={decodeEntities}
              WishCardImageFunc={WishCardImageFunc}
              itemsLength={finalWishData?.length}
              handleRemoveItem={handleRemoveItem}
              handleWishlistToCart={handleWishlistToCart}
              handleMoveToDetail={handleMoveToDetail}
              handelMenu={handelMenu}
            />

           
          ) : (
            <div style={{ marginBottom: '2rem' }}>
              <SkeletonLoader />
            </div>
          )}
          
        </div>
      </Box>
    </>
  )
}

export default ElveeWishlist