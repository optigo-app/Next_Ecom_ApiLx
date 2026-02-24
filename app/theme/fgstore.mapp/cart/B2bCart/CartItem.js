import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Checkbox, Grid, Skeleton, useMediaQuery } from '@mui/material';
import RemarkModal from './RemarkModal';
import { GetCountAPI } from '@/app/(core)/utils/API/GetCount/GetCountAPI';
import { formatter } from '@/app/(core)/utils/Glob_Functions/GlobalFunction';
import { useStore } from '@/app/(core)/contexts/StoreProvider';

const CartItem = ({
  item,
  index,
  onSelect,
  isSelected,
  selectedItem,
  multiSelect,
  onRemove,
  itemLength,
  productRemark,
  handleRemarkChange,
  handleSave,
  storeinit,
  visiterId
}) => {

  const { setCartCountNum, loginUserDetail } = useStore();
  const noImageFound = "/image-not-found.jpg";

  const [open, setOpen] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const [remark, setRemark] = useState(item.Remarks || '');
  const setCartCountVal = setCartCountNum;
  const storeInitData = storeinit;


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
        ? `${CDNDesignImageFolThumb}${item?.designno}~1~${item?.metalcolorname}.jpg`
        : `${CDNDesignImageFolThumb}${item?.designno}~1.jpg`;

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

  return (
    <Grid
      item
      size={{ xs: 6, sm: itemLength <= 2 ? 6 : 6, md: itemLength <= 2 ? 6 : 6, lg: itemLength <= 2 ? 6 : 4, xxl: itemLength <= 2 ? 6 : 3 }}
      className='smr_cartListCardGrid'>
      <Card className={itemLength <= 3 ? 'smr_cartListCard' : 'smr_cartListCard'}
        key={item?.id}
        sx={{
          boxShadow: !multiSelect && !isMobileScreen && selectedItem?.id == item?.id && 'rgb(175 130 56 / 68%) 1px 1px 1px 0px, rgb(175 130 56 / 68%) 0px 0px 0px 1px !important',
        }}
      >
        <Box className="smr_mui_CartBox" sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', position: 'relative' }}>
          {/* {imageSrc !== undefined && */}
          {isLoading === true ? (
            <CardMedia
              sx={{
                width: "13rem",
                height: "11rem",
                '@media (max-width: 570px)': {
                  width: "100%",
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
            <CardMedia
              component="img"
              image={imgSrc}
              alt=" "
              loading='eager'
              sx={{
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                '&:focus': { outline: 'none' },
                '&:active': { outline: 'none' },
              }}
              draggable={true}
              onContextMenu={(e) => e.preventDefault()}
              className='smr_cartListImage'
              onClick={() => onSelect(item)}
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
            />
          )}
          <div className='smr_rightContentDataDiv'>
            <CardContent className='smr_cartcontentData' onClick={() => onSelect(item)}>
              <Typography variant="body2" className='smr_DesignNoTExt'>
                {item?.designno} {item?.StockNo != "" &&
                  <span className='smr_DesignNoTExt'>({item?.StockNo})</span>
                }
              </Typography>
              <div className='smr_cartlistdetails' style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div>
                  {storeInitData?.IsGrossWeight == 1 &&
                    <Typography variant="body2" className='smr_card-ContentsData'>
                      GWT: {(item?.Gwt || 0)?.toFixed(3)}
                    </Typography>
                  }
                  {storeInitData?.IsMetalWeight == 1 &&
                    <>
                      {Number(item?.Nwt) !== 0 && (
                        <Typography variant="body2" className='smr_card-ContentsData'>
                          NWT: {(item?.Nwt || 0)?.toFixed(3)}{' '}
                        </Typography>
                      )}
                    </>
                  }
                </div>
                <div>
                  {storeInitData?.IsDiamondWeight == 1 &&
                    <>
                      {(item?.Dwt != "0" || item?.Dpcs != "0") &&
                        <>
                          <Typography variant="body2" className='smr_card-ContentsData'>
                            DWT: {(item?.Dwt || 0)?.toFixed(3)} / {(item?.Dpcs || 0)}
                          </Typography>
                        </>
                      }
                    </>
                  }
                  {storeInitData?.IsStoneWeight == 1 &&
                    <>
                      {(item?.CSwt != "0" || item?.CSpcs != "0") &&
                        <>
                          <Typography variant="body2" className='smr_card-ContentsData'>
                            CWT: {(item?.CSwt || 0)?.toFixed(3)} / {(item?.CSpcs || 0)}{' '}
                          </Typography>
                        </>
                      }
                    </>
                  }
                </div>
              </div>
              <Box className="smr_PriceBox">
                <>
                  {storeInitData?.IsPriceShow == 1 &&
                    <span className='smr_currencyFontPrice'>
                      <span className="smr_currencyFont">{loginInfo?.CurrencyCode ?? storeInitData?.CurrencyCode}</span>&nbsp;
                      {/* <span
                        className="smr_currencyFont"
                        dangerouslySetInnerHTML={{
                          __html: decodeEntities(
                            CurrencyData?.Currencysymbol
                          ),
                        }}
                      /> */}
                      {formatter(item?.UnitCostWithMarkUp)}
                    </span>
                  }
                </>
              </Box>
              {item?.Remarks !== "" && (
                <Typography variant="body2" className='smr_remarktext'>
                  <span>Remark:</span> {truncateText(item?.Remarks || productRemark, 40)}
                </Typography>
              )}
            </CardContent>
            <Box className="smr_cartbtngroupReRm">
              <button
                className='smr_ItemRemarkbtn'
                onClick={() => handleOpen()}
                style={{ border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {item?.Remarks ? "Update Remark" : "Add Remark"}
              </button>
              <button
                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                className='smr_ReomoveCartbtn' variant="body2" onClick={() => handleRemoveItem(item, index)} >
                Remove
              </button>
            </Box>
          </div>
        </Box>
        <div>
          {multiSelect &&
            <Checkbox
              checked={multiSelect && isSelected}
              onChange={() => onSelect(item)}
              sx={{
                color: "rgba(125, 127, 133, 0.4) !important",
                position: 'absolute',
                bottom: 0,
                left: 2
              }}
            />
          }
        </div>
        {item?.StockId != 0 &&
          <div className="smr_inStockbadgeDiv">
            <span className="smr_inStockbadgeSpan">In Stock</span>
          </div>
        }
      </Card>
      <RemarkModal
        open={open}
        onClose={handleClose}
        remark={remark}
        onRemarkChange={handleRemarkChangeInternal}
        onSave={handleSaveInternal}
      />
    </Grid>
  );
};

export default CartItem;
