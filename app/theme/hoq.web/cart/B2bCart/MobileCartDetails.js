import React, { useEffect, useState } from "react";
import {
  Modal,
  Divider,
  Skeleton,
  Button,
  CardMedia,
} from "@mui/material";
import "./hoqMo_cartPage.scss";
import QuantitySelector from "./QuantitySelector";
import CloseIcon from "@mui/icons-material/Close";
import { formatter, formatTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";

const MobileCartDetails = ({
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
  open,
  handleClose,
}) => {
  const [metalTypeCombo, setMetalTypeCombo] = useState([]);
  const [metalColorCombo, setMetalColorCombo] = useState([]);
  const [ColorStoneCombo, setColorStoneCombo] = useState([]);
  const [diamondQualityColorCombo, setDiamondQualityColorCombo] = useState([]);
  const [storeInitData, setStoreInitData] = useState();
  const loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));
  const [imageSrc, setImageSrc] = useState();

  const noImageFound = './image-not-found.jpg';

  const CDNDesignImageFolThumb = storeInitData?.CDNDesignImageFolThumb;
  const fullImagePath = `${CDNDesignImageFolThumb}${selectedItem?.designno}~1.jpg`;
  const CDNDesignImageFol = storeInitData?.CDNDesignImageFol;
  const fullImagePath1 = `${CDNDesignImageFol}${selectedItem?.designno}~1.${selectedItem?.ImageExtension}`;

  const isLoading = selectedItem?.loading;
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const storeinitData = JSON.parse(sessionStorage.getItem("storeInit"));
    setStoreInitData(storeinitData);

    const metalTypeData = JSON.parse(sessionStorage.getItem("metalTypeCombo"));
    const metalColorData = JSON.parse(sessionStorage.getItem("MetalColorCombo"));
    const diamondQtyColorData = JSON.parse(
      sessionStorage.getItem("diamondQualityColorCombo")
    );
    const CSQtyColorData = JSON.parse(
      sessionStorage.getItem("ColorStoneQualityColorCombo")
    );
    setMetalTypeCombo(metalTypeData);
    setMetalColorCombo(metalColorData);
    setDiamondQualityColorCombo(diamondQtyColorData);
    setColorStoneCombo(CSQtyColorData);
  }, []);

  const SizeSorting = (SizeArr) => {
    let SizeSorted = SizeArr?.sort((a, b) => {
      const nameA = parseInt(a?.sizename?.toUpperCase()?.slice(0, -2), 10);
      const nameB = parseInt(b?.sizename?.toUpperCase()?.slice(0, -2), 10);

      return nameA - nameB;
    });

    return SizeSorted;
  };

  const defaultUrl = selectedItem?.images?.replace("/Design_Thumb", "");
  const firstPart = defaultUrl?.split(".")[0]
  const secondPart = selectedItem?.ImageExtension;
  const finalSelectedUrl = `${firstPart}.${secondPart}`;

  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    if (!selectedItem || !storeInitData) return;

    setImageLoading(true);

    try {
      let imageURL = selectedItem?.images
        ? finalSelectedUrl
        : selectedItem?.ImageCount > 1
          ? `${storeInitData?.CDNDesignImageFol}${selectedItem?.designno}~1~${selectedItem?.metalcolorname}.${selectedItem?.ImageExtension}`
          : `${storeInitData?.CDNDesignImageFol}${selectedItem?.designno}~1.${selectedItem?.ImageExtension}`;

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
  }, [selectedItem, finalSelectedUrl]);

  // useEffect(() => {
  //   if (selectedItem?.ImageCount > 0) {
  //     CartCardImageFunc(selectedItem).then((src) => {
  //       setImageSrc(src);
  //     });
  //   } else {
  //     setImageSrc(noImageFound);
  //   }
  // }, [selectedItem]);


  return (
    <Modal
      open={open}
      onClose={handleClose}
      className="hoq_cart-modal"
      sx={{ height: "100%", overflow: "auto", zIndex: 9999999 }}
    >
      <div
        className="hoq_cart-container"
        style={{ background: "#fff", padding: "20px", position: "relative" }}
      >
        <div className="hoq_Cart-imageDiv">
          {isLoading === true ? (
            <CardMedia
              className="dtMo_cart-image"
              width="100%"
              height={400}
              sx={{
                width: "100%",
                height: "400px !important",
                '@media (max-width: 570px)': {
                  width: "100%",
                  height: "300px !important",
                },
                '@media (max-width: 400px)': {
                  width: "100%",
                  height: "200px !important",
                },
              }}
            >
              <Skeleton
                animation="wave"
                variant="rect"
                width="100%"
                height="100%"
              />
            </CardMedia>
          ) : (
            <img
              // src={selectedItem?.images ? selectedItem?.images :
              //   selectedItem?.ImageCount > 1 ? `${storeInitData?.CDNDesignImageFolThumb}${selectedItem?.designno}~1~${selectedItem?.metalcolorname}.jpg` :
              //     `${storeInitData?.CDNDesignImageFolThumb}${selectedItem?.designno}~1.jpg`
              // }
              src={imgSrc}
              className="hoq_cartImage"
              onClick={() => handleMoveToDetail(selectedItem)}
              alt=" "
              style={{
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                '&:focus': { outline: 'none' },
                '&:active': { outline: 'none' },
              }}
              loading="eager"
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
            />
          )}
        </div>
        <>
          {(selectedItem?.StockId == 0 && selectedItem?.IsMrpBase == 0) ? (
            <div className="hoq_Cart_R-details">
              <p className="hoq_cart-Titleline">{formatTitleLine(selectedItem?.TitleLine) && selectedItem?.TitleLine}</p>
              <Divider />
              {storeInitData?.IsProductWebCustomization == 1 && (
                <div className="hoq_Cart-options">
                  {storeInitData?.IsMetalCustomization == 1 && (
                    <div className="option">
                      <label htmlFor="metal-type">Metal Type:</label>
                      <select
                        id="metal-type"
                        name={selectedItem?.id}
                        value={selectedItem?.metaltypename}
                        onChange={handleMetalTypeChange}
                      >
                        {mrpbasedPriceFlag == 1 ? (
                          <option value={selectedItem?.metaltypename}>
                            {selectedItem?.metaltypename}
                          </option>
                        ) : (
                          <>
                            {metalTypeCombo.map((option) => (
                              <option
                                key={option.Metalid}
                                value={option.metaltypename}
                              >
                                {option.metaltype}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                    </div>
                  )}
                  {storeInitData?.IsMetalCustomization == 1 && (
                    <div className="option">
                      <label htmlFor="metal-color">Metal Color:</label>
                      <select
                        name={selectedItem?.id}
                        id="metal-color"
                        value={selectedItem?.metalcolorname}
                        onChange={handleMetalColorChange}
                      >
                        {mrpbasedPriceFlag == 1 ? (
                          <option value={selectedItem?.metalcolorname}>
                            {selectedItem?.metalcolorname}
                          </option>
                        ) : (
                          <>
                            {metalColorCombo.map((option) => (
                              <option key={option.id} value={option.colorname}>
                                {" "}
                                {option.colorname}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                    </div>
                  )}
                  {storeInitData?.IsDiamondCustomization == 1 && (
                    <div className="option">
                      <label htmlFor="diamond">Diamond:</label>
                      <select
                        name={selectedItem?.id}
                        id="diamond"
                        value={
                          selectedItem?.diamondquality +
                          "#" +
                          selectedItem?.diamondcolor
                        }
                        onChange={handleDiamondChange}
                      >
                        {mrpbasedPriceFlag == 1 ? (
                          <option
                            value={
                              selectedItem?.diamondquality +
                              "#" +
                              selectedItem?.diamondcolor
                            }
                          >
                            {selectedItem?.diamondquality +
                              "#" +
                              selectedItem?.diamondcolor}
                          </option>
                        ) : (
                          <>
                            {diamondQualityColorCombo.map((option) => (
                              <option
                                key={option?.ColorId + "," + option?.QualityId}
                                value={option?.Quality + "#" + option?.color}
                              >
                                {" "}
                                {option?.Quality + "#" + option?.color}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                    </div>
                  )}
                  {storeInitData?.IsCsCustomization == 1 && (
                    <div className="option">
                      <label htmlFor="diamond">Color Stone:</label>
                      <select
                        name={selectedItem?.id}
                        id="diamond"
                        value={
                          selectedItem?.colorstonequality +
                          "#" +
                          selectedItem?.colorstonecolor
                        }
                        onChange={handleColorStoneChange}
                      >
                        {mrpbasedPriceFlag == 1 ? (
                          <option
                            value={
                              selectedItem?.colorstonequality +
                              "#" +
                              selectedItem?.colorstonecolor
                            }
                          >
                            {selectedItem?.colorstonequality +
                              "#" +
                              selectedItem?.colorstonecolor}
                          </option>
                        ) : (
                          <>
                            {ColorStoneCombo.map((option) => (
                              <option
                                key={option?.ColorId + "," + option?.QualityId}
                                value={option?.Quality + "#" + option?.color}
                              >
                                {option?.Quality + "#" + option?.color}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                    </div>
                  )}
                  {sizeCombo?.rd?.length !== 0 && (
                    <div className="option">
                      <label htmlFor="size">Size:</label>
                      <select
                        name={selectedItem?.id}
                        id="size"
                        value={selectedItem?.Size}
                        onChange={handleSizeChange}
                      >
                        {mrpbasedPriceFlag == 1 ? (
                          <option value={selectedItem?.Size}>
                            {selectedItem?.Size}
                          </option>
                        ) : (
                          <>
                            {sizeCombo?.rd?.map((option) => (
                              <option key={option?.id} value={option?.sizename}>
                                {option?.sizename}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                    </div>
                  )}
                </div>
              )}
              <div className="hoq_cartQtyPricemainDev">
                <QuantitySelector
                  selectedItem={selectedItem}
                  handleIncrement={handleIncrement}
                  handleDecrement={handleDecrement}
                  qtyCount={qtyCount}
                />
                {storeInitData?.IsPriceShow == 1 && (
                  <div className="product-price">
                    {!ispriceloding ? (
                      <span>
                        {/* <span
                          className="hoq_currencyFont"
                          dangerouslySetInnerHTML={{
                            __html: decodeEntities(
                              loginInfo?.CurrencyCode ?? storeInitData?.CurrencyCode
                            ),
                          }}
                        /> */}
                        {loginInfo?.CurrencyCode ?? storeInitData?.CurrencyCode}&nbsp;
                        {formatter(selectedItem?.FinalCost)}
                      </span>
                    ) : (
                      <Skeleton
                        className="hoq_CartSkelton"
                        variant="text"
                        width="80%"
                        animation="wave"
                      />
                    )}
                  </div>
                )}
              </div>
              <div className="hoq_UpdateCartBtn">
                <Button
                  className="hoq_cartUpdate-button"
                  onClick={() => onUpdateCart(selectedItem)}
                >
                  Save
                </Button>
              </div>
              <div className="hoq_CloseIcon" onClick={handleClose}>
                <CloseIcon />
              </div>
            </div>
          ) : (
            <div className="hoq_CartCusto_R-details">
              <p className="hoq_cart-Titleline">{formatTitleLine(selectedItem?.TitleLine) && selectedItem?.TitleLine}</p>
              <Divider />
              <div className="hoq_StockCart-options">
                {selectedItem?.metaltypename != "" && (
                  <div className="option">
                    <label htmlFor="metal-type">Metal Type:</label>
                    <span>{selectedItem?.metaltypename}</span>
                  </div>
                )}
                {selectedItem?.metaltypename != "" && (
                  <div className="option">
                    <label htmlFor="metal-color">Metal Color:</label>
                    <span>{selectedItem?.metalcolorname}</span>
                  </div>
                )}
                {selectedItem?.diamondquality != "" &&
                  selectedItem?.diamondcolor != "" && (
                    <div className="option">
                      <label htmlFor="diamond">Diamond:</label>
                      <span>
                        {selectedItem?.diamondquality?.replace(/,/g, " - ") +
                          "," +
                          selectedItem?.diamondcolor}
                      </span>
                    </div>
                  )}
                {selectedItem?.colorstonequality != "" &&
                  selectedItem?.colorstonecolor != "" && (
                    <div className="option">
                      <label htmlFor="diamond">Color Stone:</label>
                      <span>
                        {selectedItem?.colorstonequality +
                          "," +
                          selectedItem?.colorstonecolor}
                      </span>
                    </div>
                  )}
                {selectedItem?.Size != "" && (
                  <div className="option">
                    <label htmlFor="size">Size:</label>
                    <span>{selectedItem?.Size}</span>
                  </div>
                )}
              </div>
              <div className="hoq_stockPriceQtyDiv">
                {selectedItem?.IsMrpBase == 0 ? (
                  <div className="option">
                    <label htmlFor="qty">Qty:</label>
                    <span>{selectedItem?.Quantity}</span>
                  </div>
                ) :
                  <div>
                    <QuantitySelector selectedItem={selectedItem} handleIncrement={handleIncrement} handleDecrement={handleDecrement} qtyCount={qtyCount} />
                  </div>
                }
                <div className="">
                  {storeInitData?.IsPriceShow == 1 && (
                    <div className="hoq_Stockproduct-price">
                      {!ispriceloding ? (
                        <span>
                          {/* <span
                            className="hoq_currencyFont"
                            dangerouslySetInnerHTML={{
                              __html: decodeEntities(
                                CurrencyData?.Currencysymbol
                              ),
                            }}
                          /> */}
                          {loginInfo?.CurrencyCode ??
                            storeInitData?.CurrencyCode}{" "}
                          &nbsp; {formatter(selectedItem?.FinalCost)}
                        </span>
                      ) : (
                        <Skeleton
                          className="hoq_CartSkelton"
                          variant="text"
                          width="80%"
                          animation="wave"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div
                style={{
                  color: "#7d7f85",
                  position: "absolute",
                  top: 0,
                  right: 0,
                }}
                onClick={handleClose}
              >
                <CloseIcon />
              </div>
            </div>
          )}
        </>
      </div>
    </Modal>
  );
};

export default MobileCartDetails;