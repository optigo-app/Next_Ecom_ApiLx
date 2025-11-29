import "./Stockitems.scss";
import { Checkbox } from "@mui/material";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import { formatter } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
const Stockitems = ({
  stockItemArr,
  storeInit,
  loginInfo,
  cartArr,
  handleCartandWish,
  check,
}) => {
  return (
    <div className="hoq_Stockitems">
      {stockItemArr?.length > 0 && storeInit?.IsStockWebsite === 1 && (
        <div className="hoq_stockItem_div">
          <p className="hoq_details_title"> Stock Items </p>
          <div className="hoq_stockitem_container">
            {/* 12 */}
            <table className="hoq_stockItem_table">
              <tr className="hoq_stockItem_table_tr">
                <th className="hoq_stockItem_table_td">SrNo</th>
                <th className="hoq_stockItem_table_td">Design No</th>
                {/* <th className="hoq_stockItem_table_td" >StockBarcode</th> */}
                <th className="hoq_stockItem_table_td">Job No</th>
                <th
                  className="hoq_stockItem_table_td"
                  style={{ textAlign: "center" }}
                >
                  Gross Wt/Net Wt/Dia Wt/CS Wt
                </th>
                <th className="hoq_stockItem_table_td">Metal Color-Purity</th>
                {check && <th className="hoq_stockItem_table_td">Price</th>}
                <th className="hoq_stockItem_table_td">Add To Cart</th>
              </tr>
              {stockItemArr?.map((ele, i) => (
                <tr className="hoq_stockItem_table_tr">
                  <td className="hoq_stockItem_table_td">
                    <span className="hoq_prod_designno">{ele?.SrNo}</span>
                  </td>
                  <td className="hoq_stockItem_table_td">
                    <span className="hoq_prod_designno">{ele?.designno}</span>
                  </td>
                  <td className="hoq_stockItem_table_td">
                    <span className="hoq_prod_designno">
                      {ele?.StockBarcode}
                    </span>
                  </td>
                  {/* <td className="hoq_stockItem_table_td">
                        <span className="hoq_prod_designno">
                        {ele?.JobNo}
                        </span>
                      </td> */}
                  <td className="hoq_stockItem_table_td">
                    <div className="hoq_prod_Allwt">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          letterSpacing: "1px",
                          gap: "3px",
                        }}
                        className="reponsive-tab"
                      >
                        {storeInit?.IsGrossWeight == 1 &&
                          Number(ele?.GrossWt) !== 0 && (
                            <>
                              <span className="hoq_prod_wt">
                                <span className="hoq_d_keys">GWT:</span>
                                <span className="hoq_d_val">
                                  {ele?.GrossWt?.toFixed(3)}
                                </span>
                              </span>
                            </>
                          )}

                        {Number(ele?.NetWt) !== 0 && (
                          <>
                            {storeInit?.IsGrossWeight == 1 &&
                              Number(ele?.GrossWt) !== 0 && <span>|</span>}
                            <span className="hoq_prod_wt">
                              <span className="hoq_d_keys">NWT:</span>
                              <span className="hoq_d_val">
                                {ele?.NetWt?.toFixed(3)}
                              </span>
                            </span>
                          </>
                        )}

                        {/* {storeInit?.IsGrossWeight == 1 &&
                              Number(ele?.GrossWt) !== 0 && (
                                <>
                                  <span>|</span>
                                  <span className="hoq_prod_wt">
                                    <span className="hoq_d_keys">GWT:</span>
                                    <span className="hoq_d_val">
                                      {ele?.GrossWt}
                                    </span>
                                  </span>
                                </>
                              )} */}
                        {storeInit?.IsDiamondWeight == 1 &&
                          Number(ele?.DiaWt) !== 0 && (
                            <>
                              <span>|</span>
                              <span className="hoq_prod_wt">
                                <span className="hoq_d_keys">DWT:</span>
                                <span className="hoq_d_val">
                                  {ele?.DiaWt?.toFixed(3)}
                                  {storeInit?.IsDiamondPcs === 1
                                    ? `/${ele?.DiaPcs}`
                                    : null}
                                </span>
                              </span>
                            </>
                          )}

                        {storeInit?.IsStoneWeight == 1 &&
                          Number(ele?.CsWt) !== 0 && (
                            <>
                              <span>|</span>
                              <span className="hoq_prod_wt">
                                <span className="hoq_d_keys">CWT:</span>
                                <span className="hoq_d_val">
                                  {ele?.CsWt?.toFixed(3)}
                                  {storeInit?.IsStonePcs === 1
                                    ? `/${ele?.CsPcs}`
                                    : null}
                                </span>
                              </span>
                            </>
                          )}
                      </div>
                    </div>
                  </td>
                  <td className="hoq_stockItem_table_td">
                    {/* <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'100%'}} className="hoq_stockItem_price_type_mt"> */}
                    <span>
                      {ele?.MetalColorName}-{ele?.metaltypename}
                      {ele?.metalPurity}
                      {/* {" "}/{" "} */}
                    </span>
                    {/* </div> */}
                  </td>
                  {check && (
                    <td className="hoq_stockItem_table_td">
                      <span>
                        <span className="hoq_currencyFont">
                          {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
                        </span>
                        &nbsp;
                        <span> {formatter(ele?.Amount)}</span>
                      </span>
                    </td>
                  )}
                  <td
                    className="hoq_stockItem_table_td"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      border: "none",
                    }}
                  >
                    <Checkbox
                      icon={
                        <LocalMallOutlinedIcon
                          sx={{
                            fontSize: "22px",
                            color: "#7d7f85",
                            opacity: ".7",
                          }}
                        />
                      }
                      checkedIcon={
                        <LocalMallIcon
                          sx={{
                            fontSize: "22px",
                            color: "#009500",
                          }}
                        />
                      }
                      disableRipple={false}
                      sx={{ padding: "10px" }}
                      onChange={(e) => handleCartandWish(e, ele, "Cart")}
                      checked={
                        cartArr[ele?.StockId] ?? ele?.IsInCart === 1
                          ? true
                          : false
                      }
                    />
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stockitems;

// 12
{
  /* <div className="hoq_stock_item_card">
                  {stockItemArr?.map((ele) => (
                    <div className="hoq_stockItemCard">
                      <div className="cart_and_wishlist_icon">
                        <Checkbox
                          icon={
                            <LocalMallOutlinedIcon
                              sx={{
                                fontSize: "22px",
                                color: "#7d7f85",
                                opacity: ".7",
                              }}
                            />
                          }
                          checkedIcon={
                            <LocalMallIcon
                              sx={{
                                fontSize: "22px",
                                color: "#009500",
                              }}
                            />
                          }
                          disableRipple={false}
                          sx={{ padding: "10px" }}

                          onChange={(e) => handleCartandWish(e, ele, "Cart")}
                          checked={cartArr[ele?.StockId] ?? ele?.IsInCart === 1 ? true : false}
                        />

                      </div>
                      <img
                        className="hoq_productCard_Image"
                        src={
                          storeInit?.DesignImageFol +
                          ele?.designno +
                          "_" +
                          "1" +
                          "." +
                          ele?.ImageExtension
                        }
                        alt={""}
                      />
                      <div className="hoq_stockutem_shortinfo" style={{display:'flex',flexDirection:'column',gap:'5px',paddingBottom:'5px'}}>
                      <span className="hoq_prod_designno">
                        {ele?.designno}
                      </span>
                      <div className="hoq_prod_Allwt">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            letterSpacing: "1px",
                            gap: "3px",
                          }}
                        >
                          <span className="hoq_prod_wt">
                            <span className="hoq_d_keys">NWT:</span>
                            <span className="hoq_d_val">{ele?.NetWt}</span>
                          </span>

                          {storeInit?.IsGrossWeight == 1 &&
                            Number(ele?.GrossWt) !== 0 && (
                              <>
                                <span>|</span>
                                <span className="hoq_prod_wt">
                                  <span className="hoq_d_keys">GWT:</span>
                                  <span className="hoq_d_val">
                                    {ele?.GrossWt}
                                  </span>
                                </span>
                              </>
                            )}
                          {storeInit?.IsDiamondWeight == 1 &&
                            Number(ele?.DiaWt) !== 0 && (
                              <>
                                <span>|</span>
                                <span className="hoq_prod_wt">
                                  <span className="hoq_d_keys">DWT:</span>
                                  <span className="hoq_d_val">
                                    {ele?.DiaWt}
                                    {storeInit?.IsDiamondPcs === 1
                                      ? `/${ele?.DiaPcs}`
                                      : null}
                                  </span>
                                </span>
                              </>
                            )}

                          {storeInit?.IsStoneWeight == 1 &&
                            Number(ele?.CsWt) !== 0 && (
                              <>
                                <span >|</span>
                                <span className="hoq_prod_wt">
                                  <span className="hoq_d_keys">CWT:</span>
                                  <span className="hoq_d_val">
                                    {ele?.CsWt}
                                    {storeInit?.IsStonePcs === 1
                                      ? `/${ele?.CsPcs}`
                                      : null}
                                  </span>
                                </span>
                              </>
                            )}
                        </div>
                      </div>

                      <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'100%'}} className="hoq_stockItem_price_type_mt">
                          <span>
                            {ele?.MetalColorName}-{ele?.metaltypename}{ele?.metalPurity} 
                            {" "}/{" "}
                            <span
                                className="hoq_currencyFont"
                                dangerouslySetInnerHTML={{
                                  __html: decodeEntities(
                                    storeInit?.Currencysymbol
                                  ),
                                }}
                              />
                             </span>
                             <span>{" "}{ele?.Amount}</span>
                      </div>
                      </div>
                    </div>
                  ))}
                </div> */
}
