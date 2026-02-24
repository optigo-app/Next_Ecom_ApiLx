import React, { useEffect, useState } from 'react';
import CardMedia from '@mui/material/CardMedia';
import { Skeleton, useMediaQuery } from '@mui/material';
import { GetCountAPI } from '@/app/(core)/utils/API/GetCount/GetCountAPI';
import { formatter, formatTitleLine } from '@/app/(core)/utils/Glob_Functions/GlobalFunction';
import { useStore } from '@/app/(core)/contexts/StoreProvider';

const CartItem = ({
  item,
  diamondValue,
  itemlength,
  index,
  CartCardImageFunc,
  onSelect,
  CurrencyData,
  decodeEntities,
  isSelected,
  selectedItem,
  selectedItemsLength,
  isActive,
  multiSelect,
  onRemove,
  itemLength,
  showRemark,
  productRemark,
  handleAddRemark,
  handleRemarkChange,
  handleSave,
  handleCancel,
  openHandleUpdateCartModal,
  storeInit,
  visiterId,
}) => {

  const noImageFound = "/image-not-found.jpg";
  const { loginUserDetail, setCartCountNum } = useStore();

  const [isLoading, setisLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [remark, setRemark] = useState(item?.Remarks || '');
  const [isSelectedItems, setIsSelectedItems] = useState();
  const setCartCountVal = setCartCountNum;
  const storeInitData = storeInit;

  useEffect(() => {
    const delay = (index + 1) * 200;

    const timer = setTimeout(() => {
      setisLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [index]);

  const CDNDesignImageFolThumb = storeInitData?.CDNDesignImageFolThumb;
  const fullImagePath = `${CDNDesignImageFolThumb}${item?.designno}~1.jpg`;
  const defaultUrl = item?.images && typeof item?.images === 'string'
    ? item.images.replace("/Design_Thumb", "")
    : "";
  const firstPart = defaultUrl?.split(".")[0];
  const secondPart = item?.ImageExtension;
  const finalSelectedUrl = `${firstPart}.${secondPart}`;

  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    let imageURL = item?.images
      ? finalSelectedUrl
      : item?.ImageCount > 1
        ? `${CDNDesignImageFolThumb}${item?.designno}~1~${item?.metalcolorname}.${item?.ImageExtension}`
        : `${CDNDesignImageFolThumb}${item?.designno}~1.${item?.ImageExtension}`;

    const img = new Image();
    img.onload = () => setImgSrc(imageURL);
    img.onerror = () => {
      if (item?.ImageCount > 0) {
        setImgSrc(fullImagePath || noImageFound);
      } else {
        setImgSrc(noImageFound);
      }
    };
    img.src = imageURL;
  }, [item, CDNDesignImageFolThumb, finalSelectedUrl]);

  const isMobileScreen = useMediaQuery('(min-width: 320px) and (max-width: 1000px)');

  const loginInfo = loginUserDetail;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleRemarkChangeInternal = (e) => {
    setRemark(e.target.value);
    handleRemarkChange(e);
  };

  const handleSaveInternal = () => {
    handleSave(item, remark);
    handleClose();
  };

  useEffect(() => {
    handleIsSelected()
  }, [isSelected])

  const handleIsSelected = () => {
    let isselected = selectedItem?.id == item?.id
    setIsSelectedItems()
  }


  const handleRemoveItem = async (item) => {
    const returnValue = await onRemove(item);
    if (returnValue?.msg == "success") {
      GetCountAPI(visiterId).then((res) => {
        setCartCountVal(res?.cartcount);
      })
    }
  };


  return (
    <>
      <div className="smr3_cartMain-item" onClick={() => onSelect(item)}
        style={{
          // boxShadow: !multiSelect && !isMobileScreen && selectedItem?.id == item?.id && '0 3px 8px rgba(223, 100, 126, 0.54)'
          boxShadow: "none",
          border: !multiSelect && !isMobileScreen && selectedItem?.id == item?.id && '1px solid #7d7f85'
        }}
      >
        <div className="smr3_cart-item">
          <div className="smr3_cart-item__image">
            {isLoading === true ? (
              <CardMedia
                width="85%"
                height={196}
                sx={{
                  width: "85%",
                  height: "196px !important",
                  '@media (max-width: 1000px)': {
                    width: "100%",
                    height: "100px !important",
                  },
                  '@media (max-width: 650px)': {
                    width: "15rem",
                    height: "200px !important",
                  },
                  '@media (max-width: 525px)': {
                    width: "12rem",
                    height: "200px !important",
                  },
                  '@media (max-width: 425px)': {
                    width: "20rem",
                    height: "200px !important",
                  },
                  '@media (max-width: 345px)': {
                    width: "18rem",
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
                src={imgSrc}
                alt=' '
                style={{
                  border: "none", outline: "none",
                  '&:focus': { outline: 'none' },
                  '&:active': { outline: 'none' },
                }}
                loading='lazy'
                onError={(e) => {
                  const imgEl = e.target;

                  // Prevent infinite loop
                  if (!imgEl.dataset.triedFullImage && fullImagePath) {
                    imgEl.src = fullImagePath;
                    imgEl.dataset.triedFullImage = "true";
                  } else if (!imgEl.dataset.triedNoImage) {
                    imgEl.src = noImageFound;
                    imgEl.dataset.triedNoImage = "true";
                  }
                }}
                draggable={true}
                onContextMenu={(e) => e.preventDefault()}
              />
            )}
          </div>
          <div className="smr3_cart-item__details">
            <h3>
              {item?.designno != "" && item?.designno}
              {(item?.StockNo != "" && item?.StockNo != null) && ` (${item?.StockNo})`}
              {formatTitleLine(item?.TitleLine) && " - " + item?.TitleLine}
            </h3>
            <p>{item?.productDescription}</p>
            {/* {item?.sku != "" &&
            <p>SKU: {item?.sku}</p>
          } */}
            <div className="smr3_weightsContainer">
              {storeInitData?.IsGrossWeight == 1 &&
                <div className="smr3_weightPair">
                  <span className="smr3_weightLabel">Gwt:</span>
                  <span className="smr3_weightValue">{(item?.Gwt || 0)?.toFixed(3)}</span>
                </div>
              }
              {storeInitData?.IsMetalWeight == 1 &&
                <>
                  {Number(item?.Nwt) !== 0 && (
                    <div className="smr3_weightPair">
                      <span className="smr3_pipe">|</span>
                      <span className="smr3_weightLabel">Nwt:</span>
                      <span className="smr3_weightValue">{(item?.Nwt || 0)?.toFixed(3)}{' '}</span>
                    </div>
                  )}
                </>
              }
              {storeInitData?.IsDiamondWeight == 1 &&
                <>
                  {(item?.Dwt != "0" || item?.Dpcs != "0") &&
                    <div className="smr3_weightPair">
                      <span className="smr3_pipe">|</span>
                      <span className="smr3_weightLabel">Dwt:</span>
                      <span className="smr3_weightValue">{(item?.Dwt || 0)?.toFixed(3)} / {(item?.Dpcs || 0)}</span>
                    </div>
                  }
                </>
              }
              {storeInitData?.IsGrossWeight == 1 &&
                <>
                  {(item?.CSwt != "0" || item?.CSpcs != "0") &&
                    <div className="smr3_weightPair">
                      <span className="smr3_pipe">|</span>
                      <span className="smr3_weightLabel">Cwt:</span>
                      <span className="smr3_weightValue">{(item?.CSwt || 0)?.toFixed(3)} / {(item?.CSpcs || 0)}{' '}</span>
                    </div>
                  }
                </>
              }
            </div>
            <div style={{ display: 'flex' }} className="smr3_qtyDiv">
              <p className='smr3_ringSize'>Quantity: {item?.Quantity}</p>&nbsp;
              {(item?.Size != "" && item?.Size != undefined && item?.Size != null) &&
                <p className='smr3_ringSize'>Size: {item?.Size}</p>
              }
            </div>
            {/* <span className="smr3_change-size">CHANGE SIZE</span> */}
          </div>
          {storeInitData?.IsPriceShow == 1 &&
            <div className="smr3_cart-item__price">
              <p>{loginInfo?.CurrencyCode ?? storeInitData?.CurrencyCode}&nbsp;{formatter(item?.UnitCostWithMarkUp)}</p>
              <span className="smr3_price-excl-vat">(Excl. VAT)</span>
            </div>
          }
          <>
            {storeInitData?.IsPriceShow == 1 &&
              <div className="smr3_cart-item__total-price">
                <p>{loginInfo?.CurrencyCode ?? storeInitData?.CurrencyCode}&nbsp;{formatter(item?.FinalCost)}</p>
                <span className="smr3_price-excl-vat">(Excl. VAT)</span>
              </div>
            }
          </>
          <div className="smr3_cart-item__remove">
            <button className="smr3_remove-button" onClick={() => handleRemoveItem(item)}>×</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartItem;
