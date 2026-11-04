import { useStore } from '@/app/(core)/contexts/StoreProvider';
import { useState, useEffect } from 'react';
import { Box, CardMedia, Skeleton, Typography } from '@mui/material';
import Customization from './Customization';

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
  handleMoveToDetail }) => {

  const { storeInit } = useStore();

  // useEffect(() => {
  //   console.log("TCL: selectedItem", selectedItem)
  // }, [selectedItem])

  const noImageFound = "/image-not-found.jpg";
  const CDNDesignImageFolThumb = storeInit?.CDNDesignImageFolThumb;
  const fullImagePath = `${CDNDesignImageFolThumb}${selectedItem?.designno}~1.jpg`;
  const isLoading = selectedItem?.loading;

  const defaultUrl = selectedItem?.images && typeof selectedItem?.images === 'string'
    ? selectedItem.images.replace("/Design_Thumb", "")
    : "";
  const firstPart = defaultUrl?.split(".")[0];
  const secondPart = selectedItem?.ImageExtension;
  const finalSelectedUrl = `${firstPart}.${secondPart}`;

  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    let imageURL = selectedItem?.images
      ? finalSelectedUrl
      : selectedItem?.ImageCount > 1
        ? `${CDNDesignImageFolThumb}${selectedItem?.designno}~1~${selectedItem?.metalcolorname}.jpg`
        : `${CDNDesignImageFolThumb}${selectedItem?.designno}~1.jpg`;

    const img = new Image();
    img.onload = () => setImgSrc(imageURL);
    img.onerror = () => {
      if (selectedItem?.ImageCount > 0) {
        setImgSrc(fullImagePath || noImageFound);
      } else {
        setImgSrc(noImageFound);
      }
    };
    img.src = imageURL;
  }, [selectedItem, CDNDesignImageFolThumb, finalSelectedUrl]);

  return (
    <Box className="elv_cart-container"
      sx={{
        width: '100%',
        bgcolor: '#f4f4f4e8',
        borderRadius: 4,
        py: 2,
        px: 2,
        position: 'sticky',
        top: 85,
        zIndex: 100,
        boxSizing: 'border-box'
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: '#fff', py: 2, width: '100%', borderRadius: 4, mb: 1.6 }}>
        <Box>
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: 700, letterSpacing: -0.2, px: 2 }}
          >
            Customization
          </Typography>
        </Box>
      </Box>
      <div className="elv_Cart-imageDiv">

        {/* {imageSrc !== undefined && (
          <img src={imageSrc} alt="Cluster Diamond" className='elv_cartImage' onClick={() => handleMoveToDetail(selectedItem)} />
        )} */}
        {isLoading === true ? (
          <Skeleton variant="rectangular" sx={{ width: "100%", height: 350, borderRadius: 2, bgcolor: "#fafafa" }} />
        ) : (
          <img
            src={imgSrc}
            alt=""
            className='elv_cartImage'
            onClick={() => handleMoveToDetail(selectedItem)}
            onError={(e) => {
              const imgEl = e.target;
              if (!imgEl.dataset.triedFullImage && fullImagePath) {
                imgEl.src = fullImagePath;
                imgEl.dataset.triedFullImage = "true";
              } else if (!imgEl.dataset.triedNoImage) {
                imgEl.src = noImageFound;
                imgEl.dataset.triedNoImage = "true";
              }
            }}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            loading='eager'
          />
        )}

      </div>
      <Box
        sx={{
          width: '100%',
          py: 1,
          display: 'flex',
          alignItems: 'center',
          px: 1
        }}
      >
        <Typography
          sx={{
            textAlign: "left",
            fontWeight: 600,
            color: "#1A1A1A", // modern deep-dark tone
            fontSize: {
              xs: 14,   // mobile
              sm: 15,   // small screens
              md: 16,   // medium screens
              lg: 17,   // desktops
            },
            lineHeight: 1.3,
            letterSpacing: "0.2px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {selectedItem?.designno}
        </Typography>
      </Box>

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
      />
    </Box>
  );
};

export default CartDetails;



