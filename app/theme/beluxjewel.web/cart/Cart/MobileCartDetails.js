import React, { useEffect, useState } from 'react';
import { Modal, Divider, Skeleton, Button, Select, MenuItem, InputLabel, FormControl, CardMedia } from '@mui/material';
import './elvMo_cartPage.modul.scss';
import QuantitySelector from './QuantitySelector';
import CloseIcon from "@mui/icons-material/Close";
import { toast } from 'react-toastify';
import { formatter, formatTitleLine } from '@/app/(core)/utils/Glob_Functions/GlobalFunction';
import noImageFound from "../../Assets/image-not-found.jpg"

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
  handleClose
}) => {

  const [metalTypeCombo, setMetalTypeCombo] = useState([]);
  const [metalColorCombo, setMetalColorCombo] = useState([]);
  const [ColorStoneCombo, setColorStoneCombo] = useState([]);
  const [diamondQualityColorCombo, setDiamondQualityColorCombo] = useState([]);
  const [storeInitData, setStoreInitData] = useState();
  const loginInfo = JSON.parse(sessionStorage.getItem('loginUserDetail'));
  const [imageSrc, setImageSrc] = useState();

  const CDNDesignImageFol = storeInitData?.CDNDesignImageFol;
  const fullImagePath = `${CDNDesignImageFol}${selectedItem?.designno}~1.${selectedItem?.ImageExtension}`;

  const isLoading = selectedItem?.loading;

  useEffect(() => {
    const storeinitData = JSON.parse(sessionStorage.getItem('storeInit'));
    setStoreInitData(storeinitData)
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

  const SizeSorting = (SizeArr) => {

    let SizeSorted = SizeArr?.sort((a, b) => {
      const nameA = parseInt(a?.sizename?.toUpperCase()?.slice(0, -2), 10);
      const nameB = parseInt(b?.sizename?.toUpperCase()?.slice(0, -2), 10);

      return nameA - nameB;
    })

    return SizeSorted

  }

  // useEffect(() => {
  //   if (storeInitData?.Themeno !== 3) {
  //     if (selectedItem?.ImageCount > 0) {
  //       CartCardImageFunc(selectedItem).then((src) => {
  //         setImageSrc(src);
  //       });
  //     } else {
  //       setImageSrc(noImageFound);
  //     }
  //   }
  // }, [selectedItem]);

  return (
    <Modal open={open} onClose={handleClose} className="elvMo_cart-modal" sx={{ height: '100%', overflow: 'auto', zIndex: 9999999 }}>
      <div className="elvMo_cart-container" style={{ background: "#fff", padding: '20px', position: "relative" }}>
        <div className="elvMo_Cart-imageDiv">
          {/* {imageSrc !== undefined && (
            <img
              src={imageSrc}
              alt="Cluster Diamond"
              className='elvMo_cartImage'
              onClick={() => handleMoveToDetail(selectedItem)}
              style={{ border: 'none' }}
              onError={(e) => e.target.src = noImageFound}
            />
          )} */}

          {isLoading === true ? (
            <CardMedia
              sx={{
                width: "100%",
                height: "25rem",
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
              src={selectedItem?.images ? selectedItem?.images :
                selectedItem?.ImageCount > 1 ? `${storeInitData?.CDNDesignImageFolThumb}${selectedItem?.designno}~1~${selectedItem?.metalcolorname}.jpg` :
                  `${storeInitData?.CDNDesignImageFolThumb}${selectedItem?.designno}~1.jpg`
              }
              alt="Cluster Diamond"
              className='elvMo_cartImage'
              onClick={() => handleMoveToDetail(selectedItem)}
              style={{ border: 'none' }}
              onError={(e) => {
                const current = e.target.src;

                // Level 1 → try CDN path
                if (!current.includes(fullImagePath) && selectedItem?.ImageCount > 0) {
                  e.target.src = fullImagePath;
                  return;
                }

                // Level 2 → try noImageFound
                if (!current.includes('image-not-found.jpg')) {
                  e.target.src = noImageFound;
                  return;
                }
              }}
              loading='lazy'
            />
          )}
        </div>
        <>
          {(selectedItem?.StockId == 0 && selectedItem?.IsMrpBase == 0) ? (
            <div className="elvMo_Cart_R-details">
              <p className='elvMo_cart-Titleline'>{formatTitleLine(selectedItem?.TitleLine) && selectedItem?.TitleLine}</p>
              <Divider sx={{ mb: 3 }} />
              {storeInitData?.IsProductWebCustomization == 1 &&
                <div className="elvMo_Cart-options">
                  {storeInitData?.IsMetalCustomization == 1 &&
                    <div className="option">
                      <label htmlFor="metal-type">Metal Type:</label>
                      <select id="metal-type" name={selectedItem?.id} value={selectedItem?.metaltypename} onChange={handleMetalTypeChange}>
                        {mrpbasedPriceFlag == 1 ? (
                          <option value={selectedItem?.metaltypename}>{selectedItem?.metaltypename}</option>
                        ) :
                          <>
                            {metalTypeCombo?.map(option => (
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
                          <select id="diamond" name={selectedItem?.id} value={selectedItem?.diamondquality + '#' + selectedItem?.diamondcolor} onChange={handleDiamondChange}>
                            {mrpbasedPriceFlag == 1 ? (
                              <option value={selectedItem?.diamondquality + '#' + selectedItem?.diamondcolor}>{selectedItem?.diamondquality + '#' + selectedItem?.diamondcolor}</option>
                            ) :
                              <>
                                {diamondQualityColorCombo?.map(option => (
                                  <option key={option?.ColorId + ',' + option?.QualityId} value={option?.Quality + '#' + option?.color}> {option?.Quality + '#' + option?.color}</option>
                                ))}
                              </>
                            }
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
                          <select id="diamond" name={selectedItem?.id} value={selectedItem?.colorstonequality + '#' + selectedItem?.colorstonecolor} onChange={handleColorStoneChange}>
                            {mrpbasedPriceFlag == 1 ? (
                              <option value={selectedItem?.colorstonequality + '#' + selectedItem?.colorstonecolor}>{selectedItem?.colorstonequality + '#' + selectedItem?.colorstonecolor}</option>
                            ) :
                              <>
                                {ColorStoneCombo?.map(option => (
                                  <option key={option?.ColorId + ',' + option?.QualityId} value={option?.Quality + '#' + option?.color}>{option?.Quality + '#' + option?.color}</option>
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
                          <option value={selectedItem?.size}>{selectedItem?.size}</option>
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
              {/* <div className='elvMo_cartQtyPricemainDev'>
                <QuantitySelector selectedItem={selectedItem} handleIncrement={handleIncrement} handleDecrement={handleDecrement} qtyCount={qtyCount} />
                {storeInitData?.IsPriceShow == 1 &&
                  <div className="product-price">
                    {!ispriceloding ? (
                      <span>
                        {loginInfo?.CurrencyCode ?? storeInitData?.CurrencyCode} &nbsp;
                        {formatter(selectedItem?.FinalCost)}
                      </span>
                    ) : (
                      <Skeleton className='elvMo_CartSkelton' variant="text" width="80%" animation="wave" />
                    )}
                  </div>
                }
              </div> */}
              <div className='elv_cartQtyPricemainDev'>
                <QuantitySelector selectedItem={selectedItem} handleIncrement={handleIncrement} handleDecrement={handleDecrement} qtyCount={qtyCount} />
                {storeInitData?.IsPriceShow == 1 &&
                  <div className="elv_product-price">
                    <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <span
                        className="elv_currencyFont"
                        dangerouslySetInnerHTML={{
                          __html: decodeEntities(
                            loginInfo?.CurrencyCode ?? storeInitData?.CurrencyCode
                          ),
                        }}
                      />
                      {ispriceloding ? (
                        <Skeleton className='elv_CartSkelton' variant="text" width="80%" animation="wave" />
                      ) : (
                        formatter(selectedItem?.FinalCost)
                      )}
                    </span>

                  </div>
                }
              </div>
              <div className='elvMo_UpdateCartBtn'>
                <Button className="elvMo_cartUpdate-button" onClick={() => handleUpdateCart(selectedItem)}>Save</Button>
              </div>
              <div className='elvMo_CloseIcon' onClick={handleClose}>
                <CloseIcon />
              </div>
            </div>
          ) :
            <div className="elvMo_CartCusto_R-details">
              <p className='elvMo_cart-Titleline'>{formatTitleLine(selectedItem?.TitleLine) && selectedItem?.TitleLine}</p>
              <Divider />
              <div className="elvMo_StockCart-options">
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
              {/* <div className="elvMo_stockPriceQtyDiv">
                <div className="option">
                  <label htmlFor="qty">Qty:</label>
                  <span>{selectedItem?.Quantity}</span>
                </div>
                <div className=''>
                  {storeInitData?.IsPriceShow == 1 &&
                    <div className="elvMo_Stockproduct-price">
                      {!ispriceloding ? (
                        <span>
                          {loginInfo?.CurrencyCode ?? storeInitData?.CurrencyCode} &nbsp;
                          {formatter(selectedItem?.FinalCost)}
                        </span>
                      ) :
                        <Skeleton className='elvMo_CartSkelton' variant="text" width="80%" animation="wave" />
                      }
                    </div>
                  }
                </div>
              </div> */}
              <div className='elv_cartQtyPricemainDev'>
                <QuantitySelector selectedItem={selectedItem} handleIncrement={handleIncrement} handleDecrement={handleDecrement} qtyCount={qtyCount} />
                {storeInitData?.IsPriceShow == 1 &&
                  <div className="elv_product-price">
                    <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <span
                        className="elv_currencyFont"
                        dangerouslySetInnerHTML={{
                          __html: decodeEntities(
                            loginInfo?.CurrencyCode ?? storeInitData?.CurrencyCode
                          ),
                        }}
                      />
                      {ispriceloding ? (
                        <Skeleton className='elv_CartSkelton' variant="text" width="80%" animation="wave" />
                      ) : (
                        formatter(selectedItem?.FinalCost)
                      )}
                    </span>

                  </div>
                }
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
