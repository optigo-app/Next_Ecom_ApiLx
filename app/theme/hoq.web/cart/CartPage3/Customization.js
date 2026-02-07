import React, { useEffect, useState } from 'react';
import './Hoq3_cartPage.scss';
import { Divider, Skeleton } from '@mui/material';
import QuantitySelector from './QuantitySelector';
import { toast } from 'react-toastify';
import { formatter, formatTitleLine } from '@/app/(core)/utils/Glob_Functions/GlobalFunction';

const Customization = ({
  ispriceloding,
  selectedItem,
  diamondData,
  qtyCount,
  handleIncrement,
  handleDecrement,
  sizeCombo,
  CurrencyData,
  mrpbasedPriceFlag,
  handleMetalTypeChange,
  handleMetalColorChange,
  handleDiamondChange,
  handleColorStoneChange,
  handleSizeChange,
  decodeEntities,
  onUpdateCart
}) => {

  const [metalTypeCombo, setMetalTypeCombo] = useState([]);
  const [metalColorCombo, setMetalColorCombo] = useState([]);
  const [ColorStoneCombo, setColorStoneCombo] = useState([]);
  const [diamondQualityColorCombo, setDiamondQualityColorCombo] = useState([]);
  const [storeInitData, setStoreInitData] = useState();
  const [diadata, setDiaData] = useState({});
  const [loading, setLoading] = useState(false);


  const loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));


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


  return (
    <>
      {(selectedItem?.StockId == 0 && selectedItem?.IsMrpBase == 0) ? (
        <div className="Hoq3_CartCusto_R-details">
          <p className='Hoq3_cart-Titleline'>{selectedItem?.designno != "" && selectedItem?.designno}{formatTitleLine(selectedItem?.TitleLine) && " - " + selectedItem?.TitleLine}</p>
          <Divider className='Hoq3_dividerline' />
          {storeInitData?.IsProductWebCustomization == 1 &&
            <div className="Hoq3_Cart-options">
              {storeInitData?.IsMetalCustomization == 1 &&
                <div className="option">
                  <label htmlFor="metal-type">Metal Type:</label>
                  <select id="metal-type" name={selectedItem?.id} value={selectedItem?.metaltypename} onChange={handleMetalTypeChange}>
                    {selectedItem?.StockId != 0 ? (
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
                    {selectedItem?.StockId != 0 ? (
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
                        {selectedItem?.StockId != 0 ? (
                          <option value={selectedItem?.diamondquality + ',' + selectedItem?.diamondcolor}>{(selectedItem?.diamondquality)?.replace(/,/g, ' - ') + ',' + selectedItem?.diamondcolor}</option>
                        ) :
                          <>
                            {diamondQualityColorCombo?.map(option => (
                              <option key={option?.ColorId + ',' + option?.QualityId} value={option?.Quality + ',' + option?.color}> {option?.Quality + ',' + option?.color}</option>
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
                      <select id="diamond" name={selectedItem?.id} value={selectedItem?.colorstonequality + ',' + selectedItem?.colorstonecolor} onChange={handleColorStoneChange}>
                        {selectedItem?.StockId != 0 ? (
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
                    {selectedItem?.StockId != 0 ? (
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
          <div className='Hoq3_cartQtyPricemainDev'>
            <QuantitySelector selectedItem={selectedItem} handleIncrement={handleIncrement} handleDecrement={handleDecrement} qtyCount={qtyCount} />
            {storeInitData?.IsPriceShow == 1 &&
              <div className="product-price">
                {!ispriceloding ? (
                  <span>
                    <span className="Hoq3_currencyFont">{loginInfo?.CurrencyCode ?? storeInitData?.CurrencyCode}</span>&nbsp;
                    {formatter(selectedItem?.FinalCost)}
                  </span>
                ) :
                  <Skeleton className='Hoq3_CartSkelton' variant="text" width="80%" animation="wave" />
                }
              </div>
            }
          </div>
          <div className='Hoq3_UpdateCartBtn'>
            <button onClick={() => handleUpdateCart(selectedItem)}>Save</button>
          </div>
        </div>
      ) :
        <div className="Hoq3_CartCusto_R-details">
          <p className='Hoq3_cart-Titleline'>{formatTitleLine(selectedItem?.TitleLine) && selectedItem?.TitleLine}</p>
          <Divider className='Hoq3_dividerline' />
          {selectedItem?.Sol_StockNo != "" &&
            <div className='Hoq3_diaTitleLine'>
              <span>
                {diadata?.carat}{" "}
                Carat {diadata?.colorname} {diadata?.clarityname}{" "}
                {diadata?.cutname} Cut {diadata?.shapename} Diamond
              </span>
            </div>
          }
          <div className="Hoq3_StockCart-options">
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
            {(selectedItem?.Dwt != "0" || selectedItem?.Dpcs != "0") &&
              <div className="option">
                <label htmlFor="diamond">Diamond:</label>
                <span>{(selectedItem?.diamondquality)?.replace(/,/g, ' - ') + ',' + selectedItem?.diamondcolor}</span>
              </div>
            }
            {(selectedItem?.CSwt != "0" || selectedItem?.CSpcs != "0") &&
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
          <div className="Hoq3_stockPriceQtyDiv">
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
            <div>
              {storeInitData?.IsPriceShow == 1 &&
                <div className="Hoq3_Stockproduct-price">
                  {!ispriceloding ? (
                    <span>
                      {loading == false &&
                        <>
                          <span className="Hoq3_currencyFont">{loginInfo?.CurrencyCode ?? storeInitData?.CurrencyCode}</span>&nbsp;
                          {formatter(((selectedItem?.FinalCost)))}
                        </>
                      }
                    </span>
                  ) :
                    <Skeleton className='Hoq3_CartSkelton' variant="text" width="80%" animation="wave" />
                  }
                </div>
              }
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default Customization;
