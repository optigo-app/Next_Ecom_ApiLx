import React, { useEffect, useState } from "react";
import "./orderhistory.scss";
import CircleIcon from "@mui/icons-material/Circle";
import { Box, Chip, CircularProgress, Stack, useMediaQuery } from "@mui/material";
import { formatAmount } from "@/app/(core)/utils/Glob_Functions/AccountPages/AccountPage";
import { getOrderHistory, getOrderItemDetails, handleOrderImageError } from "@/app/(core)/utils/API/AccountTabs/OrderHistory";
import { Card, Col, Container, Row } from "react-bootstrap";
import Pako from "pako";
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CommonAPI } from "@/app/(core)/utils/API/CommonAPI/CommonAPI";
import PrintIcon from '@mui/icons-material/Print';
import { formatRedirectTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";

const OrderHistory = () => {
  const {push} = useNextRouterLikeRR();
  const [orderHistoryData, setOrderHistoryData] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [loaderOH, setLoaderOH] = useState(false);
  const [loaderOH2, setLoaderOH2] = useState(false);
  const [orderInfo, setOrderInfo] = useState(false);
  const [ukey, setUkey] = useState('');
  const [image_path, setImagePath] = useState('');
  const navigate = push;
  // const [openListStatus, setOpenListStatus] = useState(false);
  const [openListStatus, setOpenListStatus] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
    const [storeInit, setstoreInit] = useState(null);
  const [showPrint, setShowPrint] = useState(false);
  const [clickedPrintId, setClickedPrintId] = useState(null);

  const smallDevice320px = useMediaQuery('(max-width:320px),(max-width:360px),(max-width:375px),(max-width:400px),(max-width:430px)');

  const getStatusColor = (orderType) => {
    switch (orderType) {
      case 1:
        return "text-danger";
      case 2:
        return "text-success";
      case 3:
        return "text-primary";
      default:
        return "text-primary";
    }
  };


  const getData = async () => {
    setLoaderOH(true);
    let storeinit = JSON.parse(sessionStorage.getItem("storeInit"));
    let loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));
    const UserEmail = sessionStorage.getItem("registerEmail");
    setUkey(storeinit?.ukey);
    // setImagePath(storeinit?.UploadLogicalPath)
    setImagePath(storeinit?.DesignImageFolBackEnd)
        setstoreInit(storeinit);

    try {
  
      const response = await getOrderHistory(storeinit, loginInfo, UserEmail);

if (response?.Status === "200" || response?.Status === 200 || response?.Status == 200) {
        if (response?.Data?.rd) {
          setOrderHistoryData(response?.Data?.rd);
          setLoaderOH(false);
        } else {
          setLoaderOH(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleClick = (obj) => {
    setOrderDetails([]);
    if (obj?.TotalQuantity === 0) return ''
    else {

      setOrderInfo(orderInfo === obj?.id ? null : obj?.id);
      getOrderDetail(obj);
    }
  };

  const getOrderDetail = async (obj) => {
    setLoaderOH2(true)
    
    setOrderDetails([]);
    let storeinit = JSON.parse(sessionStorage.getItem("storeInit"));
    let loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));
    const UserEmail = sessionStorage.getItem("userEmail");
    try {

      const response2 = await getOrderItemDetails(obj, storeinit, loginInfo, UserEmail);
      
      if (response2?.Status === '200') {
        if (response2?.Data?.rd1) {
          setOrderDetails(response2?.Data?.rd1);
          setLoaderOH2(false);

        } else {
          setLoaderOH2(true);
          setOrderDetails([]);
        }
      }

    } catch (error) {
      console.log(error);
    }
  };

  const handleMoveToDetail = (productData) => {

    let loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));

    let obj = {
      a: productData?.autocode,
      b: productData?.designno,
      m: loginInfo?.MetalId,
      d: loginInfo?.cmboDiaQCid,
      c: loginInfo?.cmboCSQCid,
      f: {}
    }
    let encodeObj = compressAndEncode(JSON.stringify(obj))

    productData?.TitleLine === undefined ?  navigate(`/d/${productData?.designno}?p=${encodeObj}`)
     : navigate(`/d/${formatRedirectTitleLine(productData?.TitleLine)}${productData?.designno}?p=${encodeObj}`);

  }

  const compressAndEncode = (inputString) => {
    try {
      const uint8Array = new TextEncoder().encode(inputString);

      const compressed = Pako.deflate(uint8Array, { to: 'string' });


      return btoa(String.fromCharCode.apply(null, compressed));
    } catch (error) {
      console.error('Error compressing and encoding:', error);
      return null;
    }
  };

  const handleApproveReject = async(e, status) => {
    let storeinit = JSON.parse(sessionStorage.getItem("storeInit"));
    let loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));
    let statusId = ''
    if(status === 'approve'){
        statusId = 0;
    }else if(status === 'reject'){
      statusId = 2;
    }

    const UserEmail = sessionStorage.getItem("registerEmail");

   const body = {
      "con":`{\"id\":\"Store\",\"mode\":\"SetOrderStatus\",\"appuserid\":\"${UserEmail}\"}`,
      "f":"Postman",
      "p":`{\"FrontEnd_RegNo\":\"${storeinit?.FrontEnd_RegNo}\",\"Customerid\":\"${loginInfo?.id}\",\"orderno\":\"${e?.orderno}\",\"OrderStatusId\":\"${statusId}"\}`
      }
      const response = await CommonAPI(body);
      let arr = [];

      if(response?.Status === '200'){
        setOpenListStatus(false);
        setShowActions(false)
         orderHistoryData?.map((e) => {
          let obj = {...e};
          if(obj?.orderno === response?.Data?.rd[0]?.orderno){
            obj.OrderStatusName = response?.Data?.rd[0]?.OrderStatusName;
          }
          arr.push(obj);
          
          
         })

         setOrderHistoryData(arr);
      }

  };

  const openList = (id) => {
    setOpenListStatus(openListStatus === id ? null : id); // Toggle the list status by item id
  };

  const getStatusColor2 = (status) => {
    if(status?.toLowerCase() === 'approved'){
      return "bg-success text-white";
    }else if(status?.toLowerCase() === 'rejected') {
      return "bg-dark text-white"
    }else{
      return "_color3"
    }
    // }else if(status?.toLowerCase() === 'approval pending'){
    //   return "_color3"
    // }else{
    //   return null
    // }
  };

  const handlePrintOH = (id) => {
    setShowPrint(!showPrint);
    setClickedPrintId(id);
  }

  const [showActions, setShowActions] = useState(false);

  const handleToggleActions = (id) => {
    setShowActions(id);
    if(id === showActions){
      setShowActions(false)
    }else{
      setShowActions(id);
    }
  };

  return (
    <div>
    
      {loaderOH ? (
        <Box sx={{ display: "flex", justifyContent: "center", paddingTop: "10px" }}><CircularProgress className='loadingBarManage' /></Box>
      ) : (
        <div className="orderedItems user-select-none">
          {orderHistoryData?.length > 0 ?
            orderHistoryData?.map((e) => {
              return (
                <div className="border orderHistory p-1 px-0 my-4" key={e?.id} >
                  <div className=" d-flex w-100 justify-content-between align-items-center p-1 d_block position-relative">
                    <div className="w_25_oh _w50_oh order_none" onClick={() => handleClick(e)}>
                      <div className="d-flex justify-content-start w-100 align-items-center py-2 d_block">
                        <div className="text-secondary fw-bold fs-5 ps-3 pe-5 fs_Small_2">
                          {e?.OrderPrefix}
                          {e?.orderno}
                        </div>
                        <div className={`d-flex align-items-center  ${getStatusColor(e?.b2c_MasterManagement_ProgressStatusId )} fs-5 fs_small fs_Small_2 pad_Setup`} style={{ textTransform: 'uppercase' }} >
                          <div className="px-2">
                            <CircleIcon sx={{ fontSize: "10px" }} />
                          </div>
                          {e?.b2c_MasterManagement_ProgressStatusName}
                        </div>
                      </div>
                      <div className="py-2 text-secondary ps-3 ">
                        Date &nbsp;&nbsp;:&nbsp;&nbsp;{" "}
                        <span className="text-danger">{e?.orderEntryDate}</span>
                      </div>
                      <div className="py-2 text-secondary ps-3">
                        items&nbsp;&nbsp; : &nbsp;&nbsp;(
                        <span className="text-danger">{e?.TotalQuantity}</span>)
                      </div>
                  
                    </div>
                    <div className="w-100 order_not_none">
                      <div className="d-flex justify-content-start w-100 align-items-center py-2 d_block">
                        <div className="text-secondary fw-bold  fs_Small_2 pad_xy_rh pad_start_oh" >
                          {e?.OrderPrefix}
                          {e?.orderno}
                        </div>
                        <div className={`d-flex align-items-center  ${getStatusColor(e?.b2c_MasterManagement_ProgressStatusId )} fs_12 `} style={{ textTransform: 'uppercase' }} >
                          <div className="px-2">
                            <CircleIcon sx={{ fontSize: "10px" }} />
                          </div>
                          {e?.b2c_MasterManagement_ProgressStatusName}
                        </div>
                      </div>
                      <div className="py-2 text-secondary ps-3 ">
                        Date &nbsp;&nbsp;:&nbsp;&nbsp;{" "}
                        <span className="text-danger">{e?.orderEntryDate}</span>
                      </div>
                      <div className="py-2 text-secondary ps-3">
                        items&nbsp;&nbsp; : &nbsp;&nbsp;(
                        <span className="text-danger">{e?.TotalQuantity}</span>)
                      </div>
                      {storeInit?.IsPriceShow == 1 &&  <div className="py-1 w-50 d-flex fs_price_oh _color fw-bold center_price px_change ps-4 ">
                        <div dangerouslySetInnerHTML={{ __html: e?.Country_CurrencyCode }} ></div>{" "}
                        <div className="px-1">{formatAmount(e?.orderAmountwithvat)}</div>
                    </div>
            }
                    </div>
                        {/* <MenuIcon className="_color2 " onClick={() => openList(e?.id)} /> */}
                      {/* { e?.IsPLW === 1 ? <div className="w-100 ps-4  d-flex align-items-center justify-content-end pe-4" >
                         <div className="" style={{zIndex:'1000'}}>
                            <Stack direction="row" spacing={1}>
                              <Chip size="small" label="Approve" color="success" onClick={() => handleApproveReject(e, 'approve')} />
                              <Chip size="small" label="Reject" 
                              sx={{backgroundColor:'black', color:'white',   '&:hover': {
                                    backgroundColor: 'black',
                                    color: 'white',
                                    cursor: 'default', // This ensures the cursor does not change on hover
                                  },}} onClick={() => handleApproveReject(e, 'reject')} />
                            </Stack>
                        </div> 
                        <MoreVertIcon className="_color2 " onClick={() => openList(e?.id)} />
                        </div> : <div>&nbsp;</div> } */}
                    { (!smallDevice320px) && <div className=" d-flex flex-column justify-content-around  w-50">
                            <div>
                              {e?.IsPLW === 1 ? (
                                <div className="w-100 ps-4 d-flex align-items-center justify-content-end pe-4">
                                  <div className={`sidebar ${sidebarOpen && openListStatus === e.id ? 'open' : ''}`}>
                                    <Stack direction="row" style={{paddingBottom:'1px'}} spacing={1}>
                                    {(showActions === e?.id) && (
                                        <>
                                          <Chip size="small" label="Approve" color="success" onClick={() => handleApproveReject(e, 'approve')} />
                                          <Chip
                                            size="small"
                                            label="Reject"
                                            sx={{
                                              backgroundColor: 'black',
                                              color: 'white',
                                              '&:hover': {
                                                backgroundColor: 'black',
                                                color: 'white',
                                                cursor: 'default',
                                              },
                                            }}
                                        onClick={() => handleApproveReject(e, 'reject')}
                                      />
                                    </>
                                  )}
                                </Stack>
                                </div>
                                <MoreVertIcon className="_color2" onClick={() => handleToggleActions(e.id)} />
                              </div>
                              ) : (
                                <div>&nbsp;</div>
                              )}
                            </div>
                
                      <div className="py-1 w-100 d_flex_oh fs_price_oh _color fw-bold center_price px_change ps-4 order_none d-flex align-items-center justify-content-end">
                           { e?.IsPLW === 1 && <Chip size="small"  className={`${getStatusColor2(e?.OrderStatusName)} fw-normal`} label={e?.OrderStatusName} />}
                          {/* { e?.OrderStatusId === 1 ? */}
                          {/* //  <div className={`p-1 ${getStatusColor2(e?.OrderStatusName)} rounded px-2`}>{e?.OrderStatusName}</div> */}
                           {/* { e?.IsPLW === 1 && <Chip size="small" className={`${getStatusColor2(e?.OrderStatusName)}`} label={e?.OrderStatusName === '' ? 'Approval Pending' : e?.OrderStatusName} />} */}
                          {/* //  :
                            // <div className={`p-1 ${getStatusColor2(e?.OrderStatusName)} rounded px-2`}>{e?.OrderStatusName}</div>}
                            // <div>&nbsp;</div>} */}
                      </div>
                      { e?.IsPLW === 1 ?  <div className="d-flex justify-content-end pe-4"><PrintIcon onClick={() => handlePrintOH(e?.id)}  /></div> : ''}
                      { e?.IsPLW === 1 && <span className="_colo2 w-100 d-flex justify-content-end" style={{fontSize:'7px', lineHeight:'7px', height:'8px'}}>
                        { showPrint && <>{clickedPrintId === e?.id && 'Coming Soon...'}</>}
                      </span> }
                      {storeInit?.IsPriceShow == 1 &&  <div className="py-1 w-50 d_flex_oh fs_price_oh _color fw-bold center_price px_change ps-4 order_none">
                          <div dangerouslySetInnerHTML={{ __html: e?.Country_CurrencyCode }} ></div>{" "}
                          <div className="px-1">{formatAmount(e?.orderAmountwithvat)}</div>
                      </div>
            }
                    </div>}

                  </div>

                  { smallDevice320px && <div className="w-100 d-flex justify-content-between align-items-center py-2"  style={{minHeight:'55px'}}>
                            <div>
                              {e?.IsPLW === 1 ? (
                                <div className="d-flex align-items-center flex-row-reverse">
                                  <div className={`sidebar d-flex flex-column ${sidebarOpen && openListStatus === e.id ? 'open' : ''}`}>
                                    {/* <Stack direction="col" style={{paddingBottom:'1px'}} spacing={1}> */}
                                    <div style={{padding:'2px'}}>

                                    {(showActions === e?.id) && (
                                      <>
                                          <Chip size="small" label="Approve" color="success" onClick={() => handleApproveReject(e, 'approve')} />
                                          <Chip
                                            size="small"
                                            label="Reject"
                                            sx={{
                                              backgroundColor: 'black',
                                              color: 'white',
                                              '&:hover': {
                                                backgroundColor: 'black',
                                                color: 'white',
                                                cursor: 'default',
                                              },
                                            }}
                                        onClick={() => handleApproveReject(e, 'reject')}
                                      />
                                    </>
                                  )}
                                            </div>
                                    {/* </Stack> */}
                                </div>
                                <MoreVertIcon className="_color2 p-0" onClick={() => handleToggleActions(e.id)} />
                              </div>
                              ) : (
                                <div>&nbsp;</div>
                              )}
                            </div>
                
                          <div className="d-flex align-items-center justify-content-end">
                              { e?.IsPLW === 1 && <Chip size="small"  className={`${getStatusColor2(e?.OrderStatusName)} fw-normal`} label={e?.OrderStatusName} />}
                              {/* { e?.OrderStatusId === 1 ? */}
                              {/* //  <div className={`p-1 ${getStatusColor2(e?.OrderStatusName)} rounded px-2`}>{e?.OrderStatusName}</div> */}
                              {/* { e?.IsPLW === 1 && <Chip size="small" className={`${getStatusColor2(e?.OrderStatusName)}`} label={e?.OrderStatusName === '' ? 'Approval Pending' : e?.OrderStatusName} />} */}
                              {/* //  :
                                // <div className={`p-1 ${getStatusColor2(e?.OrderStatusName)} rounded px-2`}>{e?.OrderStatusName}</div>}
                                // <div>&nbsp;</div>} */}
                          </div>
                          <div className="d-flex align-items-center text-break" style={{width:'18%'}}>  
                            { e?.IsPLW === 1 ?  <div className="d-flex justify-content-end"><PrintIcon size="small" onClick={() => handlePrintOH(e?.id)}  /></div> : ''}
                            { e?.IsPLW === 1 && <span className="_colo2 " style={{fontSize:'7px', lineHeight:'7px', height:'8px'}}>
                              { showPrint && <>{clickedPrintId === e?.id && 'Coming Soon...'}</>}
                            </span> }
                          </div>
                          
                    </div>}
              
                  <div className="">
      <div style={{ height: '10px', cursor: 'pointer' }} title="info" className="border-top"></div>
      {orderInfo === e?.id ? (
        <>
          {loaderOH2 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: '10px' }}>
              <CircularProgress className="loadingBarManage" />
            </Box>
          ) : (
            <div className="p_4_oh">
              <div className="d-flex flex-wrap align-items-center center_price_2 d_block ">
                <Container>
                  <Row className="g-4 pb-3">
                    {orderDetails?.length > 0 &&
                      orderDetails.map((el, index) => (
                        <Col key={index} xs={12}
                        // <Col key={index} xs={12} sm={6} md={4} lg={3} xl={3} className="col">
                        sm={orderDetails?.length === 1 ? 12 : 6}
                        md={orderDetails?.length === 1 ? 12 : 4}
                        lg={orderDetails?.length === 1 ? 12 : 3}
                        xl={orderDetails?.length === 1 ? 12 : 3}
                        >
                          <Card className="h-100" onClick={() => handleMoveToDetail(el)}>
                            <Card.Img
                              variant="top"
                              src={`${image_path}${el?.imgrandomno}${btoa(el?.autocode)}/Red_Thumb/${el?.DefaultImageName}`}
                              onError={handleOrderImageError}
                              alt="#designimage"
                              className="card-img-top h-100"
                            />
                            <Card.Body>
                              <Card.Title>
                                {el?.metaltypename} {el?.metalcolorname}
                              </Card.Title>
                              <Card.Text>{el?.designno}</Card.Text>
                              {storeInit?.IsPriceShow == 1 &&     <Card.Text>
                                <span dangerouslySetInnerHTML={{ __html: e?.Country_CurrencyCode }}></span> {formatAmount(el?.TotalUnitCostWithDiscount)}
                              </Card.Text>
            }
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                  </Row>
                </Container>
              </div>
              <div className="pt-2 _end">
                <div className="d_flex_oh justify-content-between align-items-center fs-4 w-25 w25_oh_2 fs_small order_none" style={{ width: '30% !important' }}>
                  <div style={{ width: '40%' }}>Total :</div>
                  {storeInit?.IsPriceShow == 1 && <div style={{ width: '60%' }} className="d-flex align-items-center">
                    <div className="pe-1" dangerouslySetInnerHTML={{ __html: e?.Country_CurrencyCode }}></div>
                    {formatAmount(e?.orderAmountwithvat)}
                  </div>
            }
                </div>
                <div className="d_flex_oh justify-content-between align-items-center text-secondary fs_small order_not_none">
                {storeInit?.IsPriceShow == 1 &&   <div className="d-flex align-items-center w-100 pe-4">
                    <div>Total :</div>
                    <div className="pe-1" dangerouslySetInnerHTML={{ __html: e?.Country_CurrencyCode }}></div>
                    {formatAmount(e?.orderAmountwithvat)}
                  </div>
            }
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        ''
      )}
                  </div>
                </div>
              );
            }) : <span className="w-100 d-flex justify-content-center align-items-center fs-5" style={{ marginTop: '15%' }}>Data Not Present</span>}
        </div>
      )}

    </div>
  );
};

export default OrderHistory;
