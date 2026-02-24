import React, { useEffect, useState, useCallback } from 'react';
import './smr3_cartPage.scss';
import Customization from './Customization';
import { CardMedia, Skeleton } from '@mui/material';

const CartDetails = ({
  ispriceloding,
  selectedItem,
  qtyCount,
  handleIncrement,
  handleDecrement,
  handleAddReamrk,
  productRemark,
  sizeCombo,
  showRemark,
  CurrencyData,
  mrpbasedPriceFlag,
  handleRemarkChange,
  handleSave,
  handleCancel,
  handleMetalTypeChange,
  handleMetalColorChange,
  handleDiamondChange,
  handleColorStoneChange,
  handleSizeChange,
  onUpdateCart,
  decodeEntities,
  handleMoveToDetail,
  storeInit,
  visiterId,
}) => {
  const noImageFound = "/image-not-found.jpg";
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(noImageFound);
  const [imageLoading, setImageLoading] = useState(true);

  const storeinitData = storeInit || {};
  const CDNDesignImageFol = storeinitData?.CDNDesignImageFol || '';

  // Memoize the image loading logic
  const loadImage = useCallback(() => {
    if (!selectedItem) {
      setImgSrc(noImageFound);
      setImageLoading(false);
      return;
    }

    setImageLoading(true);

    let imageURL;
    if (selectedItem.images) {
      const defaultUrl = selectedItem.images.replace("/Design_Thumb", "");
      const firstPart = defaultUrl.split(".")[0];
      imageURL = `${firstPart}.${selectedItem.ImageExtension}`;
    } else {
      imageURL = selectedItem.ImageCount > 1
        ? `${CDNDesignImageFol}${selectedItem.designno}~1~${selectedItem.metalcolorname}.${selectedItem.ImageExtension}`
        : `${CDNDesignImageFol}${selectedItem.designno}~1.${selectedItem.ImageExtension}`;
    }

    const img = new Image();
    img.onload = () => {
      setImgSrc(img.src);
      setImageLoading(false);
    };
    img.onerror = () => {
      const fallbackImage = selectedItem.ImageCount > 0
        ? `${CDNDesignImageFol}${selectedItem.designno}~1.${selectedItem.ImageExtension}`
        : noImageFound;

      // Try fallback image
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        setImgSrc(fallbackImg.src);
        setImageLoading(false);
      };
      fallbackImg.onerror = () => {
        setImgSrc(noImageFound);
        setImageLoading(false);
      };
      fallbackImg.src = fallbackImage;
    };

    img.src = imageURL;
  }, [selectedItem, CDNDesignImageFol, noImageFound]);

  // Handle loading state and image loading
  useEffect(() => {
    if (!selectedItem) {
      setIsLoading(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      loadImage();
    }, 200);

    return () => {
      clearTimeout(timer);
      setImgSrc(noImageFound);
      setImageLoading(true);
    };
  }, [loadImage]);

  const keyToCheck = "stockno"
  if (!selectedItem) {
    return (
      <div className="smr3_cart-container">
        <div className="smr3_Cart-imageDiv">
          <Skeleton
            animation="wave"
            variant="rectangular"
            width="100%"
            height="400px"
            sx={{
              '@media (max-width: 1750px)': {
                width: "360px",
                height: "350px",
              },
              '@media (max-width: 1500px)': {
                width: "310px",
                height: "300px",
              },
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="smr3_cart-container">
      <div className="smr3_Cart-imageDiv">
        {isLoading || imageLoading ? (
          <div
            style={{
              width: "100%",
              height: "400px",
            }}
          >
            <Skeleton
              animation="wave"
              variant="rectangular"
              width="100%"
              height="100%"
              sx={{
                '@media (max-width: 1750px)': {
                  width: "100%",
                  height: "350px",
                },
                '@media (max-width: 1500px)': {
                  width: "100%",
                  height: "300px",
                },
                '@media (max-width: 1100px)': {
                  width: "100%",
                  height: "250px",
                },
              }}
            />
          </div>
        ) : (
          <img
            src={imgSrc}
            style={{
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              '&:focus': { outline: 'none' },
              '&:active': { outline: 'none' },
            }}
            alt=" "
            draggable={true}
            onContextMenu={(e) => e.preventDefault()}
            className='smr3_cartDetailImage'
            onClick={() => handleMoveToDetail(selectedItem)}
            loading='lazy'
            onError={(e) => {
              const imgEl = e.target;

              // Prevent infinite loop
              if (!imgEl.dataset.triedFullImage && fullImagePath1) {
                imgEl.src = fullImagePath1;
                imgEl.dataset.triedFullImage = "true";
              } else if (!imgEl.dataset.triedNoImage) {
                imgEl.src = noImageFound;
                imgEl.dataset.triedNoImage = "true";
              }
            }}
          />
        )}
      </div>
      <Customization
        ispriceloding={ispriceloding}
        selectedItem={selectedItem}
        handleIncrement={handleIncrement}
        handleDecrement={handleDecrement}
        qtyCount={qtyCount}
        showRemark={showRemark}
        productRemark={productRemark}
        sizeCombo={sizeCombo}
        CurrencyData={CurrencyData}
        mrpbasedPriceFlag={mrpbasedPriceFlag}
        handleAddReamrk={handleAddReamrk}
        handleRemarkChange={handleRemarkChange}
        handleSave={handleSave}
        handleCancel={handleCancel}
        handleMetalTypeChange={handleMetalTypeChange}
        handleMetalColorChange={handleMetalColorChange}
        handleDiamondChange={handleDiamondChange}
        handleColorStoneChange={handleColorStoneChange}
        handleSizeChange={handleSizeChange}
        decodeEntities={decodeEntities}
        onUpdateCart={onUpdateCart}
        storeInit={storeInit}
        visiterId={visiterId}
      />
    </div>
  );
};

export default CartDetails;

