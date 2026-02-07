import React, { useEffect, useState } from 'react';
import CardMedia from '@mui/material/CardMedia';
import { RadioGroup, Skeleton, useMediaQuery } from '@mui/material';
import { GetCountAPI } from '@/app/(core)/utils/API/GetCount/GetCountAPI';
import Cookies from "js-cookie";
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
  openHandleUpdateCartModal
}) => {

  const { setCartCountNum } = useStore();

  const [open, setOpen] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const [remark, setRemark] = useState(item?.Remarks || '');
  const [isSelectedItems, setIsSelectedItems] = useState();
  const setCartCountVal = setCartCountNum;

  const [storeInitData, setStoreInitData] = useState();
  const visiterId = Cookies.get('visiterId');

  const noImageFound = "./image-not-found.jpg";

  // const CDNDesignImageFolThumb = storeInitData?.CDNDesignImageFolThumb;
  // const fullImagePath = `${CDNDesignImageFolThumb}${item?.designno}~1.jpg`;

  // const isLoading = item?.loading;

  useEffect(() => {
    const delay = (index + 1) * 200;

    const timer = setTimeout(() => {
      setisLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [index]);


  const CDNDesignImageFolThumb = storeInitData?.CDNDesignImageFolThumb;
  const fullImagePath = `${CDNDesignImageFolThumb}${item?.designno}~1.jpg`;
  // const defaultUrl = item?.images?.replace("/Design_Thumb", "");
  const defaultUrl = item?.images && typeof item?.images === 'string'
    ? item.images.replace("/Design_Thumb", "")
    : "";
  const firstPart = defaultUrl?.split(".")[0];
  const secondPart = item?.ImageExtension;
  const finalSelectedUrl = `${firstPart}.${secondPart}`;

  const [imgSrc, setImgSrc] = useState('');

  const imageSrc =
    typeof item?.images === "string" && item?.images.length > 0
      ? item.images
      : fullImagePath;

  useEffect(() => {
    let imageURL = item?.images
      ? finalSelectedUrl
      : item?.ImageCount > 1
        ? `${CDNDesignImageFolThumb}${item?.designno}~1~${item?.metalcolorname}.${item?.ImageExtension}`
        : `${CDNDesignImageFolThumb}${item?.designno}~1.${item?.ImageExtension}`;

    const img = new Image();
    img.onload = () => setImgSrc(imageURL);
    img.src = imageURL;
  }, [item, CDNDesignImageFolThumb, finalSelectedUrl]);

  const isLargeScreen = useMediaQuery('(min-width: 1600px)');
  const isMediumScreen = useMediaQuery('(min-width: 1038px) and (max-width: 1599px)');
  const isMobileScreen = useMediaQuery('(min-width: 320px) and (max-width: 1000px)');

  const loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));

  useEffect(() => {
    const storeinitData = JSON.parse(sessionStorage.getItem('storeInit'));
    setStoreInitData(storeinitData)
  }, [])

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


  function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }

  // useEffect(() => {
  //   if (item?.ImageCount > 0) {
  //     CartCardImageFunc(item).then((src) => {
  //       setImageSrc(src);
  //     });
  //   } else {
  //     setImageSrc(noImageFound);
  //   }
  // }, [item]);

  const diamondData = diamondValue?.find((dia) => dia?.stockno == item?.Sol_StockNo);


  return (
    <>
      <div className="Hoq3_cartMain-item" onClick={() => onSelect(item)}
        style={{
          // boxShadow: !multiSelect && !isMobileScreen && selectedItem?.id == item?.id && '0 3px 8px rgba(223, 100, 126, 0.54)'
          boxShadow: "none",
          border: !multiSelect && !isMobileScreen && selectedItem?.id == item?.id && '1px solid #7d7f85'
        }}
      >
        <div className="Hoq3_cart-item">
          <div className="Hoq3_cart-item__image">
            {isLoading === true ? (
              <div
                width="85%"
                height={150}
                sx={{
                  width: "85%",
                  height: "150px !important",
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
              </div>
            ) : (
              <img
                src={imageSrc}
                alt=" "
                style={{
                  border: 'none',
                  outline: 'none',
                  boxShadow: 'none',
                  '&:focus': { outline: 'none' },
                  '&:active': { outline: 'none' },
                }}
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
                loading="lazy"
              />
            )}
          </div>
          <div className="Hoq3_cart-item__details">
            <h3>
              {item?.designno != "" && item?.designno}
              {(item?.StockNo != "" && item?.StockNo != null) && ` (${item?.StockNo})`}
              {formatTitleLine(item?.TitleLine) && " - " + item?.TitleLine}
            </h3>
            <p>{item?.productDescription}</p>
            {/* {item?.sku != "" &&
            <p>SKU: {item?.sku}</p>
          } */}
            <div className="Hoq3_weightsContainer">
              {storeInitData?.IsGrossWeight == 1 &&
                <div className="Hoq3_weightPair">
                  <span className="Hoq3_weightLabel">Gwt:</span>
                  <span className="Hoq3_weightValue">{(item?.Gwt || 0)?.toFixed(3)}</span>
                </div>
              }
              {storeInitData?.IsMetalWeight == 1 &&
                <>
                  {Number(item?.Nwt) !== 0 && (
                    <div className="Hoq3_weightPair">
                      <span className="Hoq3_pipe">|</span>
                      <span className="Hoq3_weightLabel">Nwt:</span>
                      <span className="Hoq3_weightValue">{(item?.Nwt || 0)?.toFixed(3)}{' '}</span>
                    </div>
                  )}
                </>
              }
              {storeInitData?.IsDiamondWeight == 1 &&
                <>
                  {(item?.Dwt != "0" || item?.Dpcs != "0") &&
                    <div className="Hoq3_weightPair">
                      <span className="Hoq3_pipe">|</span>
                      <span className="Hoq3_weightLabel">Dwt:</span>
                      <span className="Hoq3_weightValue">{(item?.Dwt || 0)?.toFixed(3)} / {(item?.Dpcs || 0)}</span>
                    </div>
                  }
                </>
              }
              {storeInitData?.IsGrossWeight == 1 &&
                <>
                  {(item?.CSwt != "0" || item?.CSpcs != "0") &&
                    <div className="Hoq3_weightPair">
                      <span className="Hoq3_pipe">|</span>
                      <span className="Hoq3_weightLabel">Cwt:</span>
                      <span className="Hoq3_weightValue">{(item?.CSwt || 0)?.toFixed(3)} / {(item?.CSpcs || 0)}{' '}</span>
                    </div>
                  }
                </>
              }
            </div>
            <div style={{ display: 'flex' }} className="Hoq3_qtyDiv">
              <p className='Hoq3_ringSize'>Quantity: {item?.Quantity}</p>&nbsp;
              {(item?.Size != "" && item?.Size != undefined && item?.Size != null) &&
                <p className='Hoq3_ringSize'>Size: {item?.Size}</p>
              }
            </div>
            {/* <span className="Hoq3_change-size">CHANGE SIZE</span> */}
          </div>
          {storeInitData?.IsPriceShow == 1 &&
            <div className="Hoq3_cart-item__price">
              <p>{loginInfo?.CurrencyCode ?? storeInitData?.CurrencyCode}&nbsp;{formatter(item?.UnitCostWithMarkUp)}</p>
              <span className="Hoq3_price-excl-vat">(Excl. VAT)</span>
            </div>
          }
          <>
            {storeInitData?.IsPriceShow == 1 &&
              <div className="Hoq3_cart-item__total-price">
                <p>{loginInfo?.CurrencyCode ?? storeInitData?.CurrencyCode}&nbsp;{formatter(item?.FinalCost)}</p>
                <span className="Hoq3_price-excl-vat">(Excl. VAT)</span>
              </div>
            }
          </>
          <div className="Hoq3_cart-item__remove">
            <button className="Hoq3_remove-button" onClick={() => handleRemoveItem(diamondData, index)}>×</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartItem;
