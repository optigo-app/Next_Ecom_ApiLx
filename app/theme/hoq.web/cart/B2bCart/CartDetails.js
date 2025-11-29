import React, { useEffect, useState } from "react";
import "./hoq_cartPage.scss";
import Customization from "./Customization";
import { CardMedia, Skeleton } from "@mui/material";

const CartDetails = ({
  ispriceloding,
  selectedItem,
  CartCardImageFunc,
  qtyCount,
  handleIncrement,
  handleDecrement,
  multiSelect,
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
}) => {

  const storeinitData = JSON.parse(sessionStorage.getItem('storeInit'));
  const CDNDesignImageFolThumb = storeinitData?.CDNDesignImageFolThumb;
  const fullImagePath = `${CDNDesignImageFolThumb}${selectedItem?.designno}~1.jpg`;
  const CDNDesignImageFol = storeinitData?.CDNDesignImageFol;
  const fullImagePath1 = `${CDNDesignImageFol}${selectedItem?.designno}~1.${selectedItem?.ImageExtension}`;
  const [imageLoading, setImageLoading] = useState(true);
  const [metalType, setMetalType] = useState(selectedItem?.metaltypename);

  const handleColorTypeWrapper = (value) => {
    setMetalType(value); // ensures useEffect runs ONLY when metalType changes
    handleMetalColorChange(value);
  };

  const noImageFound = "./image-not-found.jpg";

  const isLoading = selectedItem?.loading;

  const defaultUrl = selectedItem?.images?.replace("/Design_Thumb", "");
  const firstPart = defaultUrl?.replace(/\.[^/.]+$/, "");
  const secondPart = selectedItem?.ImageExtension;
  const finalSelectedUrl = `${firstPart}.${secondPart}`;
  const metalColorCombo = JSON.parse(sessionStorage.getItem('MetalColorCombo'));
  const fetchColorCode = metalColorCombo?.find((item) => item?.metalcolorname === selectedItem?.metalcolorname);

  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    if (!selectedItem || !storeinitData) return;

    setImageLoading(true);

    try {
      let imageURL = selectedItem?.images
        ? finalSelectedUrl
        : selectedItem?.ImageCount > 1
          ? `${storeinitData?.CDNDesignImageFol}${selectedItem?.designno}~1~${fetchColorCode?.colorcode}.${selectedItem?.ImageExtension}`
          : `${storeinitData?.CDNDesignImageFol}${selectedItem?.designno}~1.${selectedItem?.ImageExtension}`;
      console.log("TCL: imageURL", imageURL)

      const img = new Image();

      img.onload = () => {
        setImgSrc(imageURL);
        setImageLoading(false);
      };

      img.onerror = (e) => {
        const currentSrc = e.target.src;

        if (selectedItem?.ImageCount > 0 && !currentSrc.includes(fullImagePath1)) {
          e.target.src = fullImagePath1;
          return;
        }

        if (!currentSrc.includes("image-not-found.jpg")) {
          e.target.src = noImageFound;
        }

        setImageLoading(false);
      };

      img.src = imageURL;
    } catch (err) {
      console.error("Image load error:", err);
      setImageLoading(false); // only here on real error
    }
  }, [selectedItem?.designno, metalType]);


  return (
    <div className="hoq_cart-container">
      <div className="hoq_Cart-imageDiv">
        {/* <img src={selectedItem?.imageUrl} alt="Cluster Diamond" className='hoq_cartImage' /> */}
        {imageLoading ? (
          <div
            style={{
              width: "100%",
              height: "400px",
            }}
            className="image-skeleton-wrapper"
          >
            <Skeleton
              animation="wave"
              variant="rectangular"
              width="100%"
              height="100%"
            />
          </div>
        ) : (
          <img
            src={imgSrc}
            alt=""
            className="hoq_cartDetailImage"
            onError={(e) => {
              const current = e.target.src;
              if (!current.includes(fullImagePath1) && selectedItem?.ImageCount > 0) {
                e.target.src = fullImagePath1;
                return;
              }
              if (!current.includes("image-not-found.jpg")) {
                e.target.src = noImageFound;
              }
            }}
            onClick={() => handleMoveToDetail(selectedItem)}
            loading="eager"
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
        handleMetalColorChange={handleColorTypeWrapper}
        handleDiamondChange={handleDiamondChange}
        handleColorStoneChange={handleColorStoneChange}
        handleSizeChange={handleSizeChange}
        decodeEntities={decodeEntities}
        onUpdateCart={onUpdateCart}
      />
    </div>
  );
};

export default CartDetails;
<style>
  {`
  @media (max-width: 1750px) {
    .image-skeleton-wrapper { height: 350px !important; }
  }
  @media (max-width: 1500px) {
    .image-skeleton-wrapper { height: 300px !important; }
  }
  @media (max-width: 1100px) {
    .image-skeleton-wrapper { height: 250px !important; }
  }
`}
</style>