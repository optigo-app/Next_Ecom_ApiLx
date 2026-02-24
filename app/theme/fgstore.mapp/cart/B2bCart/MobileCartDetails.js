import React, { useEffect, useState } from 'react';
import { Modal, Divider, Skeleton, Button, CardMedia } from '@mui/material';
import './smrMo_cartPage.scss';
import QuantitySelector from './QuantitySelector';
import CloseIcon from "@mui/icons-material/Close";
import { toast } from 'react-toastify';
import { formatter, formatTitleLine } from '@/app/(core)/utils/Glob_Functions/GlobalFunction';
import { useStore } from '@/app/(core)/contexts/StoreProvider';

const MobileCartDetails = ({
  ispriceloding,
  selectedItem,
  qtyCount,
  handleIncrement,
  handleDecrement,
  sizeCombo,
  storeinit,
  mrpbasedPriceFlag,
  handleMetalTypeChange,
  handleMetalColorChange,
  handleDiamondChange,
  handleColorStoneChange,
  handleSizeChange,
  onUpdateCart,
  handleMoveToDetail,
  open,
  handleClose
}) => {

  const noImageFound = "/image-not-found.jpg";
  const { loginUserDetail } = useStore();

  const [metalTypeCombo, setMetalTypeCombo] = useState([]);
  const [metalColorCombo, setMetalColorCombo] = useState([]);
  const [ColorStoneCombo, setColorStoneCombo] = useState([]);
  const [diamondQualityColorCombo, setDiamondQualityColorCombo] = useState([]);
  const storeInitData = storeinit;
  const loginInfo = loginUserDetail;

  const CDNDesignImageFolThumb = storeInitData?.CDNDesignImageFolThumb;
  const fullImagePath = `${CDNDesignImageFolThumb}${selectedItem?.designno}~1.jpg`;
  const CDNDesignImageFol = storeInitData?.CDNDesignImageFol;
  const fullImagePath1 = `${CDNDesignImageFol}${selectedItem?.designno}~1.${selectedItem?.ImageExtension}`;

  const isLoading = selectedItem?.loading;

  useEffect(() => {
    const metalTypeData = JSON.parse(sessionStorage.getItem('metalTypeCombo'));
    const metalColorData = JSON.parse(sessionStorage.getItem('MetalColorCombo'));
    const diamondQtyColorData = JSON.parse(sessionStorage.getItem('diamondQualityColorCombo'));
    const CSQtyColorData = JSON.parse(sessionStorage.getItem('ColorStoneQualityColorCombo'));
    setMetalTypeCombo(metalTypeData);
    setMetalColorCombo(metalColorData);
    setDiamondQualityColorCombo(diamondQtyColorData);
    setColorStoneCombo(CSQtyColorData);
  }, [])

  const handleUpdateCart = async (selectedItem) => {
    const resUpdate = await onUpdateCart(selectedItem)
    if (resUpdate?.msg == "success") {
      toast.success('Cart Updated Successfully');
    }
  }

  const defaultUrl = selectedItem?.images?.replace("/Design_Thumb", "");
  const firstPart = defaultUrl?.split(".")[0]
  const secondPart = selectedItem?.ImageExtension;
  const finalSelectedUrl = `${firstPart}.${secondPart}`;

  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    let imageURL = selectedItem?.images
      ? finalSelectedUrl
      : selectedItem?.ImageCount > 1
        ? `${storeInitData?.CDNDesignImageFol}${selectedItem?.designno}~1~${selectedItem?.metalcolorname}.${selectedItem?.ImageExtension}`
        : `${storeInitData?.CDNDesignImageFol}${selectedItem?.designno}~1.${selectedItem?.ImageExtension}`;

    const img = new Image();
    img.onload = () => setImgSrc(imageURL);
    img.onerror = () => {
      if (selectedItem?.ImageCount > 0) {
        setImgSrc(fullImagePath1 || noImageFound);
      } else {
        setImgSrc(noImageFound);
      }
    };
    img.src = imageURL;
  }, [selectedItem, storeInitData, finalSelectedUrl]);

  return (
    <Modal open={open} onClose={handleClose} className="smrMo_cart-modal" sx={{ height: '100%', overflow: 'auto' }}>
      <div className="smrMo_cart-container" style={{ background: "#fff", padding: '20px', position: "relative" }}>
        <div className="smrMo_Cart-imageDiv">
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
              alt=" "
              className='smrMo_cartImage'
              onClick={() => handleMoveToDetail(selectedItem)}
              style={{
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                '&:focus': { outline: 'none' },
                '&:active': { outline: 'none' },
              }}
              loading="eager"
              draggable={true}
              onContextMenu={(e) => e.preventDefault()}
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
        <>
          {(selectedItem?.StockId == 0 && selectedItem?.IsMrpBase == 0) ? (
            <div className="smrMo_Cart_R-details">
              <p className='smrMo_cart-Titleline'>{formatTitleLine(selectedItem?.TitleLine) && selectedItem?.TitleLine}</p>
              <Divider />
              {storeInitData?.IsProductWebCustomization == 1 &&
                <div className="smrMo_Cart-options">
                  {storeInitData?.IsMetalCustomization == 1 &&
                    <div className="option">
                      <label htmlFor="metal-type">Metal Type:</label>
                      <select id="metal-type" name={selectedItem?.id} value={selectedItem?.metaltypename} onChange={handleMetalTypeChange}>
                        {mrpbasedPriceFlag == 1 ? (
                          <option value={selectedItem?.metaltypename}>{selectedItem?.metaltypename}</option>
                        ) :
                          <>
                            {metalTypeCombo.map(option => (
                              <option key={option.Metalid} value={option.metaltypename}>{option.metaltype}</option>
                            ))}
                          </>
                        }
                      </select>
                    </div>
                  }
                  {storeInitData?.IsMetalCustomization == 1 &&
                    <div className="option">
                      <label htmlFor="metal-color">Metal Color:</label>
                      <select id="metal-color" name={selectedItem?.id} value={selectedItem?.metalcolorname} onChange={handleMetalColorChange}>
                        {mrpbasedPriceFlag == 1 ? (
                          <option value={selectedItem?.metalcolorname}>{selectedItem?.metalcolorname}</option>
                        ) :
                          <>
                            {
                              metalColorCombo?.map(option => (
                                <option key={option.id} value={option.colorname}> {option.colorname}</option>
                              ))
                            }
                          </>
                        }
                      </select>
                    </div>
                  }
                  {storeInitData?.IsDiamondCustomization == 1 &&
                    <>
                      {(selectedItem?.Dwt != "0" || selectedItem?.Dpcs != "0") &&
                        <div className="option">
                          <label htmlFor="diamond">Diamond:</label>
                          <select id="diamond" name={selectedItem?.id} value={selectedItem?.diamondquality + ',' + selectedItem?.diamondcolor} onChange={handleDiamondChange}>
                            {mrpbasedPriceFlag == 1 ? (
                              <option value={selectedItem?.diamondquality + ',' + selectedItem?.diamondcolor}>{selectedItem?.diamondquality + ',' + selectedItem?.diamondcolor}</option>
                            ) : (
                              <>
                                {diamondQualityColorCombo?.map(option => (
                                  <option key={option?.ColorId + ',' + option?.QualityId} value={option?.Quality + ',' + option?.color}>{option?.Quality + ',' + option?.color}</option>
                                ))}
                              </>
                            )}
                          </select>
                        </div>
                      }
                    </>
                  }
                  {storeInitData?.IsCsCustomization == 1 &&
                    <>
                      {(selectedItem?.CSwt != "0" || selectedItem?.CSpcs != "0") &&
                        <div className="option">
                          <label htmlFor="diamond">Color Stone:</label>
                          <select id="diamond" name={selectedItem?.id} value={selectedItem?.colorstonequality + ',' + selectedItem?.colorstonecolor} onChange={handleColorStoneChange}>
                            {mrpbasedPriceFlag == 1 ? (
                              <option value={selectedItem?.colorstonequality + ',' + selectedItem?.colorstonecolor}>{selectedItem?.colorstonequality + ',' + selectedItem?.colorstonecolor}</option>
                            ) :
                              <>
                                {ColorStoneCombo?.map(option => (
                                  <option key={option?.ColorId + ',' + option?.QualityId} value={option?.Quality + ',' + option?.color}>{option?.Quality + ',' + option?.color}</option>
                                ))}
                              </>
                            }
                          </select>
                        </div>
                      }
                    </>
                  }
                  {sizeCombo?.rd?.length !== 0 &&
                    <div className="option">
                      <label htmlFor="size">Size:</label>
                      <select id="size" name={selectedItem?.id} value={selectedItem?.Size} onChange={handleSizeChange}>
                        {mrpbasedPriceFlag == 1 ? (
                          <option value={selectedItem?.Size}>{selectedItem?.Size}</option>
                        ) :
                          <>
                            {sizeCombo?.rd?.map(option => (
                              <option key={option?.id} value={option?.sizename}>{option?.sizename}</option>
                            ))}
                          </>
                        }
                      </select>
                    </div>
                  }
                </div>
              }
              <div className='smrMo_cartQtyPricemainDev'>
                <QuantitySelector selectedItem={selectedItem} handleIncrement={handleIncrement} handleDecrement={handleDecrement} qtyCount={qtyCount} />
                {storeInitData?.IsPriceShow == 1 &&
                  <div className="product-price">
                    {!ispriceloding ? (
                      <span>
                        {loginInfo?.CurrencyCode ??
                          storeInitData?.CurrencyCode}{" "}
                        &nbsp; {formatter(selectedItem?.FinalCost)}
                      </span>
                    ) : (
                      <Skeleton className='smrMo_CartSkelton' variant="text" width="80%" animation="wave" />
                    )}
                  </div>
                }
              </div>
              <div className='smrMo_UpdateCartBtn'>
                <Button className="smrMo_cartUpdate-button" onClick={() => handleUpdateCart(selectedItem)}>Save</Button>
              </div>
              <div className='smrMo_CloseIcon' onClick={handleClose}>
                <CloseIcon />
              </div>
            </div>
          ) :
            <div className="smrMo_CartCusto_R-details">
              <p className='smrMo_cart-Titleline'>{formatTitleLine(selectedItem?.TitleLine) && selectedItem?.TitleLine}</p>
              <Divider />
              <div className="smrMo_StockCart-options">
                {selectedItem?.metaltypename != "" &&
                  <div className="option">
                    <label htmlFor="metal-type">Metal Type:</label>
                    <span>{selectedItem?.metaltypename}</span>
                  </div>
                }
                {selectedItem?.metaltypename != "" &&
                  <div className="option">
                    <label htmlFor="metal-color">Metal Color:</label>
                    <span>{selectedItem?.metalcolorname}</span>
                  </div>
                }
                {selectedItem?.diamondquality != "" && selectedItem?.diamondcolor != "" &&
                  <div className="option">
                    <label htmlFor="diamond">Diamond:</label>
                    <span>{(selectedItem?.diamondquality)?.replace(/,/g, ' - ') + ',' + selectedItem?.diamondcolor}</span>
                  </div>
                }
                {selectedItem?.colorstonequality != "" && selectedItem?.colorstonecolor != "" &&
                  <div className="option">
                    <label htmlFor="diamond">Color Stone:</label>
                    <span>{selectedItem?.colorstonequality + ',' + selectedItem?.colorstonecolor}</span>
                  </div>
                }
                {selectedItem?.Size != "" &&
                  <div className="option">
                    <label htmlFor="size">Size:</label>
                    <span>{selectedItem?.Size}</span>
                  </div>
                }
              </div>
              <div className="smrMo_stockPriceQtyDiv">
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
                <div className=''>
                  {storeInitData?.IsPriceShow == 1 &&
                    <div className="smrMo_Stockproduct-price">
                      {!ispriceloding ? (
                        <span>
                          {loginInfo?.CurrencyCode ??
                            storeInitData?.CurrencyCode}{" "}
                          &nbsp; {formatter(selectedItem?.FinalCost)}
                        </span>
                      ) :
                        <Skeleton className='smrMo_CartSkelton' variant="text" width="80%" animation="wave" />
                      }
                    </div>
                  }
                </div>
              </div>
              <div style={{ color: '#7d7f85', position: 'absolute', top: 0, right: 0 }} onClick={handleClose}>
                <CloseIcon />
              </div>
            </div>
          }
        </>
      </div>
    </Modal>
  );
};

export default MobileCartDetails;
