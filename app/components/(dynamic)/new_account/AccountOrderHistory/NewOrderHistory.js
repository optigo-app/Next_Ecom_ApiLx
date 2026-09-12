import React, { useEffect, useState } from "react";
import "./neworderhistory.scss";
import CircleIcon from "@mui/icons-material/Circle";
import {
  Box,
  Chip,
  CircularProgress,
  Stack,
  useMediaQuery,
  Card,
  CardHeader,
  Typography,
  CardContent,
  Paper,
  MenuList,
  MenuItem,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Grid,
} from "@mui/material";
import {
  getOrderHistory,
  getOrderItemDetails,
  handleOrderImageError,
} from "@/app/(core)/utils/API/AccountTabs/OrderHistory";
import Pako from "pako";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CommonAPI } from "@/app/(core)/utils/API/CommonAPI/CommonAPI";
import PrintIcon from "@mui/icons-material/Print";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { ExpandLess } from "@mui/icons-material";
import { formatAmount, formatAmount2 } from '@/app/(core)/utils/Glob_Functions/AccountPages/AccountPage';
import { formatRedirectTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";


const NewOrderHistory = () => {
  const {push ,pathname} = useNextRouterLikeRR();
  const [orderHistoryData, setOrderHistoryData] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [loaderOH, setLoaderOH] = useState(false);
  const [loaderOH2, setLoaderOH2] = useState(false);
  const [orderInfo, setOrderInfo] = useState(false);
  const [ukey, setUkey] = useState("");
  const [image_path, setImagePath] = useState("");
  const navigate = push;
  // const [openListStatus, setOpenListStatus] = useState(false);
  const [openListStatus, setOpenListStatus] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showPrint, setShowPrint] = useState(false);
  const [clickedPrintId, setClickedPrintId] = useState(null);
  const imageNotFound = './Assets/image-not-found.jpg';

  const smallDevice320px = useMediaQuery(
    "(max-width:320px),(max-width:360px),(max-width:375px),(max-width:400px),(max-width:430px)"
  );
  const smallDevice2 = useMediaQuery(
    "(max-width:320px),(max-width:360px),(max-width:375px),(max-width:400px),(max-width:430px),(max-width:480px)"
  );
  const smallDevice3 = useMediaQuery(
    "(max-width:320px),(max-width:360px),(max-width:375px),(max-width:400px),(max-width:430px),(max-width:480px),(max-width:515px)"
  );
  const smallDevice4 = useMediaQuery(
    "(max-width:320px),(max-width:360px),(max-width:375px),(max-width:400px),(max-width:430px),(max-width:480px),(max-width:515px)"
  );
  const max400px = useMediaQuery(
    "(max-width:320px),(max-width:360px),(max-width:375px),(max-width:410px)"
  );

  const [openTaxes, setOpenTaxes] = useState(null);
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const [storeInit, setstoreInit] = useState(null);
  const getStatusColor = (orderType) => {
    switch (orderType) {
      case 1:
        return "text_danger_oh";
      case 2:
        return "text_success_oh";
      case 3:
        return "text_primary_oh";
      default:
        return "text_primary_oh";
    }
  };

  const getData = async () => {
    setLoaderOH(true);
    let storeinit = JSON.parse(sessionStorage.getItem("storeInit"));
    let loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));
    const UserEmail = sessionStorage.getItem("registerEmail");
    setUkey(storeinit?.ukey);   
     setstoreInit(storeinit);
    // setImagePath(storeinit?.UploadLogicalPath)
    // setImagePath(storeinit?.DesignImageFolBackEnd);
    setImagePath(storeinit?.CDNDesignImageFol);

    try {
      const response = await getOrderHistory(storeinit, loginInfo, UserEmail);

if (response?.Status === "200" || response?.Status === 200 || response?.Status == 200) {
        if (response?.Data?.rd) {
          setOrderHistoryData(response?.Data?.rd);
          setLoaderOH(false);
        } else {
          setLoaderOH(true);
          setOrderHistoryData([]);
        }
      }
    } catch (error) {
      console.log(error);
      setLoaderOH(false);
      setOrderHistoryData([]);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleClick = (obj) => {
    setOrderDetails([]);
    if (obj?.TotalQuantity === 0) return "";
    else {
      setOrderInfo(orderInfo === obj?.id ? null : obj?.id);
      getOrderDetail(obj);
    }
  };

  const getOrderDetail = async (obj) => {
    setLoaderOH2(true);

    setOrderDetails([]);
    let storeinit = JSON.parse(sessionStorage.getItem("storeInit"));
    let loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));
    const UserEmail = sessionStorage.getItem("userEmail");
    try {
      const response2 = await getOrderItemDetails( obj, storeinit, loginInfo, UserEmail );

      if (response2?.Status === "200") {
        if (response2?.Data?.rd1) {
          setOrderDetails(response2?.Data?.rd1);
          setLoaderOH2(false);
        } else {
          setLoaderOH2(true);
          setOrderDetails([]);
          setLoaderOH2(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMoveToDetail = (productData,i) => {
    let loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));
console.log(pathname , "pathname")
    let obj = {
      a: productData?.autocode,
      b: productData?.designno,
      m: loginInfo?.MetalId,
      d: loginInfo?.cmboDiaQCid,
      c: loginInfo?.cmboCSQCid,
      f: {},
       in: i,
      i: productData?.MetalColorid,
      l: productData?.ImageExtension || "",
      count: productData?.ImageCount
    };
    let encodeObj = compressAndEncode(JSON.stringify(obj));

    productData?.TitleLine === undefined
      ? navigate(`/d/${productData?.designno}?p=${encodeObj}`)
      : navigate(`/d/${formatRedirectTitleLine(productData?.TitleLine)}${productData?.designno}?p=${encodeObj}`);
  };

  const compressAndEncode = (inputString) => {
    try {
      const uint8Array = new TextEncoder().encode(inputString);

      const compressed = Pako.deflate(uint8Array, { to: "string" });

      return btoa(String.fromCharCode.apply(null, compressed));
    } catch (error) {
      console.error("Error compressing and encoding:", error);
      return null;
    }
  };

  const handleApproveReject = async (e, status) => {
    let storeinit = JSON.parse(sessionStorage.getItem("storeInit"));
    let loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));
    let statusId = "";
    if (status === "approve") {
      statusId = 0;
    } else if (status === "reject") {
      statusId = 2;
    }

    const UserEmail = sessionStorage.getItem("registerEmail");

    const body = {
      con: `{\"id\":\"Store\",\"mode\":\"SetOrderStatus\",\"appuserid\":\"${UserEmail}\"}`,
      f: "Postman",
      p: `{\"FrontEnd_RegNo\":\"${storeinit?.FrontEnd_RegNo}\",\"Customerid\":\"${loginInfo?.id}\",\"orderno\":\"${e?.orderno}\",\"OrderStatusId\":\"${statusId}"\}`,
    };
    const response = await CommonAPI(body);
    let arr = [];

if (response?.Status === "200" || response?.Status === 200 || response?.Status == 200) {
      setOpenListStatus(false);
      setShowActions(false);
      orderHistoryData?.map((e) => {
        let obj = { ...e };
        if (obj?.orderno === response?.Data?.rd[0]?.orderno) {
          obj.OrderStatusName = response?.Data?.rd[0]?.OrderStatusName;
        }
        arr.push(obj);
      });

      setOrderHistoryData(arr);
    }
  };

  const openList = (id) => {
    setOpenListStatus(openListStatus === id ? null : id); // Toggle the list status by item id
  };

  const getStatusColor2 = (status) => {
    if (status?.toLowerCase() === "approved") {
      return "bg-success text-white";
    } else if (status?.toLowerCase() === "rejected") {
      return "bg-dark text-white";
    } else {
      return "_color3";
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
  };

  const [showActions, setShowActions] = useState(false);

  const handleToggleActions = (id) => {
    setShowActions(id);
    if (id === showActions) {
      setShowActions(false);
    } else {
      setShowActions(id);
    }
  };
  const handleToggleTaxes = (id) => {
    setOpenTaxes(openTaxes === id ? null : id); // Toggle taxes dropdown by item id
  };


  const checkImageAvailability = (url) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => resolve(false);
        img.src = url;
    });
};

  const [images, setImages] = useState([]);
  
  useEffect(() => {
    const fetchImages = async () => {
      const updatedImages = await Promise.all(orderDetails?.map(async (el) => {
        let finalImage = "";
        const checkColorimage = `${image_path}Design_Thumb/${el?.designno}~1${el?.metalcolorname ? `~${el.metalcolorname}` : ''}.jpg`;
        const checkImage = await checkImageAvailability(checkColorimage);
        if(checkImage){
          finalImage = checkImage;
        }
        else {
          const checkDefaultImage = `${image_path}Design_Thumb/${el?.designno}~1.jpg`;
          const checkImage = await checkImageAvailability(checkDefaultImage); 
          if(checkImage){
            finalImage = checkImage;
          }
          else
          {
            finalImage = imageNotFound;
          }
        }

        return {
          ...el,
          finalImage, 
        };
      }));
      setImages(updatedImages);
    };

    if (orderDetails?.length > 0) {
      fetchImages(); 
    }
  }, [orderDetails]); 
  
  return (
    <div className="orderHistory_Account_SMR">
      <div className=" orderHistory_acc">
        {loaderOH ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              height: "80vh",
              width: "100%",
              alignItems: "center",
            }}
          >
            <CircularProgress className="loadingBarManage" />
          </Box>
        ) : (
          <div>
            <div style={{ width: "100%" }}>
              {orderHistoryData?.length > 0
                ? orderHistoryData?.map((e, i) => {
                    return (
                      <Card variant="outlined" sx={{ boxShadow: "none", width: "100%", margin: "20px 0px", border: "1px solid #cacaca", }} key={i} >
               
                        <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'3px'}}>
                          <div style={{display:'flex'}}>
                            <div className="pd_s_noh_acc fs_head_acc start_noh_acc  mx_4_noh_acc">{e?.orderEntryDate}</div>
                            <div className="fs_head_acc start_noh_acc  mx_4_noh_acc" style={{fontWeight:'bold', color:'brown'}}>{e?.OrderPrefix}{e?.orderno}</div>
                            <div className="fs_head_acc start_noh_acc  mx_4_noh_acc">Item : <span style={{color:'brown', fontWeight:'bold'}}>{e?.TotalQuantity}</span></div>
                          </div>
                          {storeInit?.IsPriceShow == 1 && 
                          <div>
                            {<span className="fs_head_acc start_noh_acc  mx_4_noh_acc" style={{color:'black'}}><span className="fs_head_acc " style={{color:'black', fontWeight:'bold',paddingRight:'2px'}}>Total Amount : </span> <span className="fs_head_acc " style={{fontWeight:'bold', paddingRight:'5px'}} dangerouslySetInnerHTML={{__html: e?.Country_CurrencyCode}}></span> <span className="fs_head_acc " style={{fontWeight:'bold'}}>{formatAmount2(e?.orderAmountwithvat)}</span></span>}
                            <div className="fs_head_acc_tax start_noh_acc  lh_head_acc mx_4_noh_acc" style={{color:'grey', display:'flex', justifyContent:'flex-end', alignItems:'center'}}>(<span className="fs_head_acc_tax " style={{color:'grey', paddingRight:'2px'}}>+ Estimated Tax : </span> <span className="fs_head_acc_tax" style={{paddingRight:'5px'}} dangerouslySetInnerHTML={{__html: e?.Country_CurrencyCode}}></span> <span className="fs_head_acc_tax ">{formatAmount2(e?.totaltaxAmount)}</span>)</div>
                            {/* { max400px && <span className="fs_head_acc   mx_4_noh_acc" style={{color:'black', display:'flex', justifyContent:'flex-end', alignItems:'center'}}><span style={{color:'grey', paddingRight:'2px'}}>Total : </span> <span style={{fontWeight:'bold', paddingRight:'5px'}} dangerouslySetInnerHTML={{__html: e?.Country_CurrencyCode}}></span> <span style={{fontWeight:'bold'}}>{formatAmount2(e?.orderAmountwithvat)}</span></span>} */}
                          </div>
                }
                        </Box>
                        <CardContent sx={{ boxShadow: "none", paddingTop: "5px", paddingBottom: "10px", padding:'0px', padding:'0px 15px' }} className="fs_head_acc " >
                          { !max400px && <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", }} className="fs_head_acc minH_box_acc" >                           
                            <Box sx={{  display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", }} className="fs_head_acc w_20_noh_acc" >
                               <Typography style={{display:'flex', alignItems:'center', justifyContent:'flex-start', width:'100%'}}  className={` ${getStatusColor( e?.b2c_MasterManagement_ProgressStatusId )} fs_head_acc start_noh_acc`}>
                                <CircleIcon sx={{ fontSize:'7px !important', marginRight: "5px" }} />
                                {e?.b2c_MasterManagement_ProgressStatusName?.toUpperCase()}
                              </Typography>
                            </Box>
                           { <Box sx={{  display: "flex", flexDirection:'column', justifyContent: "center", alignItems: "flex-end", }} className="fs_head_acc w_80_noh_acc" > 
                            <>
                              {e?.IsPLW === 1 ? ( <>
                                <div className="" style={{display:'flex', alignItems:'center'}}>
                                  <div className={`sidebar ${sidebarOpen && openListStatus === e.id ? 'open' : ''}`} style={{display:'flex', flexDirection:'column'}}>
                                    <div className="d_flex_acc_new_oh" style={{padding:'2px'}}>
                                    {(showActions === e?.id) && (
                                      <>
                                          <Chip size="small" label="Approve" color="success" className="fs_head_acc2" sx={{margin:'0px 5px'}} onClick={() => handleApproveReject(e, 'approve')} />
                                          <Chip
                                            size="small"
                                            label="Reject"
                                            sx={{
                                              backgroundColor: 'black',
                                              color: 'white',
                                              margin:'0px 5px',
                                              '&:hover': {
                                                  backgroundColor: 'black',
                                                  color: 'white',
                                                  cursor: 'default',
                                                },
                                              }}
                                              className="fs_head_acc2"
                                          onClick={() => handleApproveReject(e, 'reject')}
                                        />
                                      </>
                                    )}
                                    { e?.IsPLW === 1 && <Chip size="small"  className={`${getStatusColor2(e?.OrderStatusName)} fw-normal fs_head_acc2`} label={e?.OrderStatusName === '' ? 'Retailer Approval Pending' : e?.OrderStatusName} />}
                                    </div>
                                </div>
                                <MoreVertIcon className="_color2 p-0" onClick={() => handleToggleActions(e.id)} />
                              </div>
                                <div className="minh_noh2">
                                  { e?.IsPLW === 1 ?
                                    <>
                                      <div className="center_noh" style={{padding:'0px', margin:'0px', width:'70px'}}><PrintIcon onClick={() => handlePrintOH(e?.id)}  /></div>
                                    </>
                                    : ''
                                  }
                                  { showPrint ? <div className="center_noh" style={{ fontSize:'7px', lineHeight:'7px'}}>{clickedPrintId === e?.id && 'Coming Soon...'}</div> : <div></div>}  

                                </div>
                              </>
                              )
                               : (
                                <div>&nbsp;</div>
                              )}
                            </>
                            </Box>}
                          </Box>}
                          { max400px && <Box className="fs_head_acc minH_box_acc" >                           
                            <Box sx={{  display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding:'5px 0px' }} className="fs_head_acc w_100_noh_acc" >
                               <Typography style={{display:'flex', alignItems:'center', justifyContent:'flex-start', width:'100%'}}  className={` ${getStatusColor( e?.b2c_MasterManagement_ProgressStatusId )} fs_head_acc start_noh_acc`}>
                                <CircleIcon sx={{ fontSize:'7px !important', marginRight: "5px" }} />
                                {e?.b2c_MasterManagement_ProgressStatusName?.toUpperCase()}
                              </Typography>
                            </Box>
                           { <Box sx={{  display: "flex", flexDirection:'column', justifyContent: "center", alignItems: "flex-start", paddingBottom:'10px' }} className="fs_head_acc w_100_noh_acc" > 
                            <>
                              {e?.IsPLW === 1 ? ( <>
                                <div className="w_100_noh_acc" style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                                  <div style={{display:'flex', alignItems:'center', flexDirection:'row-reverse'}}>
                                  <div className={`sidebar ${sidebarOpen && openListStatus === e.id ? 'open' : ''}`} style={{display:'flex', flexDirection:'column'}}>
                                    <div className="d_flex_acc_new_oh" style={{padding:'2px'}}>
                                    {(showActions === e?.id) && (
                                      <>
                                          <Chip size="small" label="Approve" color="success" className="fs_head_acc2" sx={{margin:'0px 5px'}} onClick={() => handleApproveReject(e, 'approve')} />
                                          <Chip
                                            size="small"
                                            label="Reject"
                                            sx={{
                                              backgroundColor: 'black',
                                              color: 'white',
                                              margin:'0px 5px',
                                              '&:hover': {
                                                  backgroundColor: 'black',
                                                  color: 'white',
                                                  cursor: 'default',
                                                },
                                              }}
                                              className="fs_head_acc2"
                                          onClick={() => handleApproveReject(e, 'reject')}
                                        />
                                      </>
                                    )}
                                    { e?.IsPLW === 1 && <Chip size="small"  className={`${getStatusColor2(e?.OrderStatusName)} fw-normal fs_head_acc2`} label={e?.OrderStatusName === '' ? 'Retailer Approval Pending' : e?.OrderStatusName} />}
                                    </div>
                                  </div>
                                  <MoreVertIcon className="_color2 p-0" onClick={() => handleToggleActions(e.id)} />
                                  </div>
                                </div>
                              </>
                              )
                               : (
                                <div>&nbsp;</div>
                              )}
                            </>
                            </Box>}
                          </Box>}
                        </CardContent>
                        <Accordion
                          className="fs_head_acc"
                          expanded={expandedAccordion === e?.id}
                          onChange={() => {
                            handleClick(e);
                            setExpandedAccordion(
                              expandedAccordion === e?.id ? null : e?.id
                              )
                            }

                          }
                        >
                          <AccordionSummary
                            expandIcon={expandedAccordion !== e?.id ? <ExpandMoreIcon /> : null}
                            aria-controls="panel1-content"
                            id="panel1-header"
                            expanded={expandedAccordion === e?.id}
                            className="fs_head_acc"
                          >
                            {/* {expandedAccordion === e?.id
                              ? <ExpandLess />
                              : <ExpandMoreIcon />} */}
                          </AccordionSummary>
                          <AccordionDetails
                            sx={{
                              paddingBottom: "10px",
                            }}
                          >
                            {
                              orderInfo === e?.id ? (<>
                              {
                                loaderOH2 ? (
                                  <Box sx={{display:'flex', justifyContent:'center', paddingTop:'10px'}}>
                                    <CircularProgress className="loadingBarManage" />
                                  </Box>
                                ) : (
                                  <>
                                  <Grid container spacing={4}>
                                  {images?.length > 0 && images?.map((el, index) => (
                                    <Grid
                                      item
                                      key={index}
                                      xs={12}
                                      sm={orderDetails?.length === 1 ? 6 : 6}
                                      md={orderDetails?.length === 1 ? 6 : 4}
                                      lg={orderDetails?.length === 1 ? 3 : 3}
                                      xl={orderDetails?.length === 1 ? 3 : 3}
                                    >
                                      <Card sx={{display:'flex', alignItems:'center'}} >
                                      <img 
                                          src={el.finalImage} 
                                          onError={handleOrderImageError} 
                                          alt="designimage" 
                                          style={{ maxHeight: '90px', maxWidth: '90px', marginRight: '10px' }} 
                                          onClick={() => handleMoveToDetail(el ,index)} 
                                          draggable={true}
                                          onContextMenu={(e) => e.preventDefault()}
                                      />
                                          {/* <img src={`${image_path}Design_Thumb/${el?.designno}~${1}${el?.metalcolorname ? `~${el.metalcolorname}` : ''}.jpg`} onError={handleOrderImageError} alt="#designimage" style={{maxHeight:'90px', maxWidth:'90px', marginRight:'10px'}} onClick={() => handleMoveToDetail(el)} /> */}
                                          {/* <img src={`${image_path}${el?.imgrandomno}${btoa(el?.autocode)}/Red_Thumb/${el?.DefaultImageName}`} onError={handleOrderImageError} alt="#designimage" style={{maxHeight:'90px', maxWidth:'90px', marginRight:'10px'}} onClick={() => handleMoveToDetail(el)} /> */}
                                          <div>
                                          <div>{el?.designno} - {`Quantity ${el?.quantity}`}</div>  
                                            <div>{el?.metaltypename?.toUpperCase()?.split(" ")[1]} {el?.metalcolorname?.toUpperCase()} {el?.metaltypename?.toUpperCase()?.split(" ")[0]}</div>
                                            {storeInit?.IsPriceShow == 1 &&  <div style={{fontWeight:'bold'}}><span style={{paddingRight:'5px'}} dangerouslySetInnerHTML={{ __html: e?.Country_CurrencyCode }}></span> 
                                            {formatAmount2(el?.TotalUnitCostWithDiscount)}</div>
                }
                                          </div>
                                      </Card>
                                    </Grid>
                                  ))}
                                </Grid>
                                </>
                                )
                              }
                              </>) : ''
                            }
                            { <Typography Typography className="fs_head_acc" style={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center', color:'grey'}} onClick={() => {
                              setExpandedAccordion(false)
                              handleClick(e);
                            }}><ExpandLess /></Typography>}
                          </AccordionDetails>
                        </Accordion>
                      </Card>
                    );
                  })
                : <div style={{width:'100%', textAlign:'center', fontWeight:'bold', color:'brown', height:'50vh', display:'flex', justifyContent:'center', alignItems:'center'}}>Data Not Present</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewOrderHistory;

                                          // return <CardContent sx={{boxShadow: "none", padding:'0px', paddingBottom:'0px'}} key={ind}>
                                          //           <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom:'0px'}} className="fs_head_acc">
                                          //               <Box sx={{width:'33.33%', display:'flex', justifyContent:'flex-start', alignItems:'center'}}><img src="http://zen/R50B3/UFS/demostoreQI9S5BDATC0M1KYJH_uKey/Design_Image/EK121002_1.png" alt="#orderImg" className="orderImgAcc" /></Box>
                                          //               <Box sx={{width:'33.33%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}} className="fs_head_acc">
                                          //                   <Typography className="fs_head_acc"> {el?.metaltypename} {el?.metalcolorname}</Typography>
                                          //                   <Typography className="fs_head_acc"> {el?.designno}</Typography>
                                          //                   <Typography className="fs_head_acc"><span dangerouslySetInnerHTML={{ __html: e?.Country_CurrencyCode }}></span> {formatAmount(el?.TotalUnitCostWithDiscount)}</Typography>
                                          //               </Box>
                                          //               <Box sx={{width:'33.33%', display:'flex', justifyContent:'flex-end', alignItems:'center'}}  className="fs_head_acc">Other</Box>
                                          //           </Box>
                                          //           <Typography Typography className="fs_head_acc" style={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}} onClick={() => setExpandedAccordion(false)}><ExpandLess /></Typography>
                                          //          </CardContent>


                                          // order history changes 7-8-24 backup
            //                               <div style={{ width: "100%" }}>
            //   {orderHistoryData?.length > 0
            //     ? orderHistoryData?.map((e, i) => {
            //         return (
            //           <Card variant="outlined" sx={{ boxShadow: "none", width: "100%", margin: "20px 0px", border: "1px solid #cacaca", }} key={i} >
            //             {/* <CardHeader sx={{ backgroundColor:'#f4f4f4', boxShadow: "none", borderBottom:'1px solid #cacaca', borderLeft:'0px', borderRight:'0px'}} */}
            //             {/* title={ */}
            //             {/* { !smallDevice2 ? <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 5px", }} >
            //               <Typography className="fs_head_acc wdate_smr_acc_noh" sx={{ width: "33.33%", display: "flex", justifyContent: "flex-start", alignItems: "center", paddingLeft:'10px' }} >
            //                 {e?.orderEntryDate?.toUpperCase()}
            //               </Typography>
            //               <Typography sx={{ width: "33.33%", display: "flex", justifyContent: "center", alignItems: "center", }} className={` ${getStatusColor( e?.b2c_MasterManagement_ProgressStatusId )} fs_head_acc wstatus_smr_acc_noh`} >
            //                 <CircleIcon sx={{ fontSize:'10px !important', marginRight: "5px" }} />{" "}
            //                 {e?.b2c_MasterManagement_ProgressStatusName?.toUpperCase()}
            //               </Typography>
            //               <Typography className="fs_head_acc wprice_smr_acc_noh" sx={{ width: "33.33%", display: "flex", flexDirection:'column', justifyContent: "center", alignItems: "flex-end", position: "relative", paddingRight:'10px'}}  >
            //                 <div style={{userSelect:'none'}} onClick={() => handleToggleTaxes(e?.id)}>
            //                   <span style={{cursor:'pointer'}}>TOTAL : </span>
            //                   <span style={{ color: "rgb(73 73 73)", fontWeight: "500", cursor:'pointer' }} > &nbsp; <span dangerouslySetInnerHTML={{ __html: e?.Country_CurrencyCode, }} ></span>{" "} {formatAmount(e?.orderAmountwithvat)} </span>{" "}
            //                   <span> <ExpandMoreIcon style={{color:'grey', cursor:'pointer'}} /> </span>
            //                 </div>
            //                 <div className="lh_head_acc" style={{color:'rgb(73 73 73)'}}>{formatAmount(e?.totaltaxAmount)}</div>
            //                 {openTaxes === e?.id && (
            //                   <Paper size="small" sx={{ position: "absolute", right: "10px", top: "25px", }} className="fs_head_acc" >
            //                     <MenuList>
            //                       <MenuItem className="fs_head_acc" sx={{ padding: "0px 5px", width: "100%", minWidth: "160px", }} size="small" > <span style={{ width: "50%", fontSize: "12px" }} className="fs_head_acc">
            //                          Sub Total : </span>{" "} <span className="d_end_oh fs_head_acc" style={{ width: "50%", fontSize: "12px" }} > {formatAmount(e?.orderAmount)} </span> 
            //                       </MenuItem>
            //                       <MenuItem className="fs_head_acc" sx={{ padding: "0px 5px", width: "100%", minWidth: "160px", }} size="small" > <span style={{ width: "50%", fontSize: "12px" }} className="fs_head_acc">
            //                          Estimated Tax : </span>{" "} <span className="d_end_oh fs_head_acc" style={{ width: "50%", fontSize: "12px" }} > {formatAmount(e?.totaltaxAmount)} </span> 
            //                       </MenuItem>
            //                       <MenuItem className="fs_head_acc" sx={{ padding: "0px 5px", width: "100%", minWidth: "160px", }} size="small" > <span style={{ width: "50%", fontSize: "12px" }} className="fs_head_acc"> 
            //                          Grand Total : </span>{" "} <span className="d_end_oh fs_head_acc" style={{ width: "50%", fontSize: "12px" }} > {" "} {formatAmount(e?.orderAmountwithvat)} </span> 
            //                       </MenuItem>
            //                     </MenuList>
            //                   </Paper>
            //                 )}
            //               </Typography>
            //             </Box> : ''} */}
            //             {/* } */}
            //             {/* // ></CardHeader> */}
            //             <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1px'}}>
            //               <div className="pd_s_noh_acc fs_head_acc start_noh_acc w_100_noh_acc">{e?.orderEntryDate}</div>
            //               <div></div>
            //               <div></div>
            //             </Box>
            //             <CardContent sx={{ boxShadow: "none", paddingTop: "5px", paddingBottom: "10px", }} className="fs_head_acc" >
            //               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", }} className="fs_head_acc" >
            //                { !smallDevice4 && <Box sx={{ width: "33.33%", display: "flex", justifyContent: "flex-start", alignItems: "center", }} >
            //                   <img
            //                     src="http://zen/R50B3/UFS/demostoreQI9S5BDATC0M1KYJH_uKey/Design_Image/EK121002_1.png"
            //                     alt="#orderImg"
            //                     className="orderImgAcc"
            //                     loading="eager"
            //                   />
            //                 </Box>}
            //                 <Box sx={{ width: "33.33%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", }} className="fs_head_acc w_50_noh w_100_noh_acc" >
           
                           
            //                   { smallDevice2 && <Typography style={{display:'flex', alignItems:'center'}}  className={` ${getStatusColor( e?.b2c_MasterManagement_ProgressStatusId )} fs_head_acc start_noh_acc w_100_noh_acc`}>
            //                     <CircleIcon sx={{ fontSize:'7px !important', marginRight: "5px" }} />
            //                     {e?.b2c_MasterManagement_ProgressStatusName?.toUpperCase()}
            //                   </Typography>}
            //                   { smallDevice2 && <Typography className="fs_head_acc start_noh_acc w_100_noh_acc">
            //                     {e?.orderEntryDate}
            //                   </Typography>}
            //                   <Typography className="fs_head_acc start_noh_acc w_100_noh_acc" style={{fontWeight:'bold'}}>
            //                     {" "}
            //                     {e?.OrderPrefix}
            //                     {e?.orderno}
            //                   </Typography>
            //                   <Typography className="fs_head_acc start_noh_acc w_100_noh_acc">
            //                     Item : <span style={{color:'brown', fontWeight:'bold'}}>{e?.TotalQuantity}</span>
            //                   </Typography>
            //                 </Box>
            //                {  <Box sx={{ width: "33.33%", display: "flex", flexDirection:'column', justifyContent: "center", alignItems: "flex-end", }} className="fs_head_acc w_50_noh" > 
            //                 <>
            //                   {e?.IsPLW === 1 ? ( <>
            //                     <div className="minh_noh" style={{display:'flex', alignItems:'center'}}>
            //                       <div className={`sidebar ${sidebarOpen && openListStatus === e.id ? 'open' : ''}`} style={{display:'flex', flexDirection:'column'}}>
            //                         <div className="d_flex_acc_new_oh" style={{padding:'2px'}}>

            //                         {(showActions === e?.id) && (
            //                           <>
                                          

            //                               <Chip size="small" label="Approve" color="success" className="fs_head_acc2" sx={{margin:'0px 5px'}} onClick={() => handleApproveReject(e, 'approve')} />
            //                               <Chip
            //                                 size="small"
            //                                 label="Reject"
            //                                 sx={{
            //                                   backgroundColor: 'black',
            //                                   color: 'white',
            //                                   margin:'0px 5px',
            //                                   '&:hover': {
            //                                       backgroundColor: 'black',
            //                                       color: 'white',
            //                                       cursor: 'default',
            //                                     },
            //                                   }}
            //                                   className="fs_head_acc2"
            //                               onClick={() => handleApproveReject(e, 'reject')}
            //                             />
                                    
            //                           </>
            //                         )}
            //                         { e?.IsPLW === 0 && <Chip size="small"  className={`${getStatusColor2(e?.OrderStatusName)} fw-normal fs_head_acc2`} label={e?.OrderStatusName} />}
            //                         </div>
            //                     </div>
            //                     <MoreVertIcon className="_color2 p-0" onClick={() => handleToggleActions(e.id)} />
            //                   </div>
            //                     <div className="minh_noh2">
            //                       { e?.IsPLW === 1 ?
            //                         <>
            //                           <div className="center_noh" style={{padding:'0px', margin:'0px', width:'70px'}}><PrintIcon onClick={() => handlePrintOH(e?.id)}  /></div>
            //                         </>
            //                         : ''
            //                       }
            //                       { showPrint ? <div className="center_noh" style={{ fontSize:'7px', lineHeight:'7px'}}>{clickedPrintId === e?.id && 'Coming Soon...'}</div> : <div></div>}  

            //                     </div>
                              
            //                   </>
            //                   )
            //                    : (
            //                     <div>&nbsp;</div>
            //                   )}
            //                 </>
            //                 </Box>}
            //               </Box>
            //               { smallDevice2 && <Typography className="fs_head_acc" style={{position:'relative'}} onClick={() => handleToggleTaxes(e?.id)}>
            //                     <div style={{userSelect:'none', display:'flex', justifyContent:'center', alignItems:'center'}} className="pb_25_noh start_noh_acc" onClick={() => handleToggleTaxes(e?.id)}>
            //                       <span style={{cursor:'pointer'}}>TOTAL : </span>
            //                       <span style={{ color: "#4a9aa8", fontWeight: "500", cursor:'pointer' }} > &nbsp; <span dangerouslySetInnerHTML={{ __html: e?.Country_CurrencyCode, }} ></span>{" "} {formatAmount(e?.orderAmountwithvat)} </span>{" "}
            //                       <span> <ExpandMoreIcon style={{color:'grey', cursor:'pointer', fontSize:'12px'}} /> </span>
            //                     </div>
            //                     {/* {openTaxes === e?.id && (
            //                   <Paper size="small" sx={{ position: "absolute", right: "10px", top: "25px", }} className="fs_head_acc" >
            //                     <MenuList>
            //                       <MenuItem className="fs_head_acc" sx={{ padding: "0px 5px", width: "100%", minWidth: "160px", }} size="small" > <span style={{ width: "50%", fontSize: "12px" }} className="fs_head_acc">
            //                          Sub Total : </span>{" "} <span className="d_end_oh fs_head_acc" style={{ width: "50%", fontSize: "12px" }} > {formatAmount(e?.orderAmount)} </span> 
            //                       </MenuItem>
            //                       <MenuItem className="fs_head_acc" sx={{ padding: "0px 5px", width: "100%", minWidth: "160px", }} size="small" > <span style={{ width: "50%", fontSize: "12px" }} className="fs_head_acc">
            //                          Estimated Tax : </span>{" "} <span className="d_end_oh fs_head_acc" style={{ width: "50%", fontSize: "12px" }} > {formatAmount(e?.totaltaxAmount)} </span> 
            //                       </MenuItem>
            //                       <MenuItem className="fs_head_acc" sx={{ padding: "0px 5px", width: "100%", minWidth: "160px", }} size="small" > <span style={{ width: "50%", fontSize: "12px" }} className="fs_head_acc"> 
            //                          Grand Total : </span>{" "} <span className="d_end_oh fs_head_acc" style={{ width: "50%", fontSize: "12px" }} > {" "} {formatAmount(e?.orderAmountwithvat)} </span> 
            //                       </MenuItem>
            //                     </MenuList>
            //                   </Paper>
            //                 )} */}
            //                   </Typography>}
                         
            //             </CardContent>
            //             <Accordion
            //               className="fs_head_acc"
            //               expanded={expandedAccordion === e?.id}
            //               onChange={() => {
            //                 handleClick(e);
            //                 setExpandedAccordion(
            //                   expandedAccordion === e?.id ? null : e?.id
            //                   )
            //                 }

            //               }
            //             >
            //               <AccordionSummary
            //                 expandIcon={<ExpandMoreIcon />}
            //                 aria-controls="panel1-content"
            //                 id="panel1-header"
            //                 expanded={expandedAccordion === e?.id}
            //                 className="fs_head_acc"
            //               >
            //                 {expandedAccordion === e?.id
            //                   ? "View Less"
            //                   : "View More"}
            //               </AccordionSummary>
            //               <AccordionDetails
            //                 sx={{
            //                   paddingBottom: "10px",
            //                 }}
            //               >
            //                 {
            //                   orderInfo === e?.id ? (<>
            //                   {
            //                     loaderOH2 ? (
            //                       <Box sx={{display:'flex', justifyContent:'center', paddingTop:'10px'}}>
            //                         <CircularProgress className="loadingBarManage" />
            //                       </Box>
            //                     ) : (
            //                       <>
            //                       <Grid container spacing={4}>
            //                       {orderDetails?.length > 0 && orderDetails?.map((el, index) => (
            //                         <Grid
            //                           item
            //                           key={index}
            //                           xs={12}
            //                           sm={orderDetails?.length === 1 ? 6 : 6}
            //                           md={orderDetails?.length === 1 ? 6 : 4}
            //                           lg={orderDetails?.length === 1 ? 3 : 3}
            //                           xl={orderDetails?.length === 1 ? 3 : 3}
            //                         >
            //                           <Card sx={{display:'flex', alignItems:'center'}} onClick={() => handleMoveToDetail(el)}>
            //                               <img src={`${image_path}${el?.imgrandomno}${btoa(el?.autocode)}/Red_Thumb/${el?.DefaultImageName}`} onError={handleOrderImageError} alt="#designimage" style={{maxHeight:'90px', maxWidth:'90px', marginRight:'10px'}} />
            //                               <div>
            //                                 <div>{el?.designno}</div>
            //                                 <div>{el?.metaltypename} {el?.metalcolorname}</div>
            //                                 <div style={{fontWeight:'bold'}}><span style={{paddingRight:'5px'}} dangerouslySetInnerHTML={{ __html: e?.Country_CurrencyCode }}></span> 
            //                                 {formatAmount(el?.TotalUnitCostWithDiscount)}</div>
            //                               </div>
            //                           </Card>
            //                         </Grid>
            //                       ))}
            //                     </Grid>
            //                     </>
            //                     )
            //                   }
            //                   </>) : ''
            //                 }
            //                 { orderDetails?.length > 1 && <Typography Typography className="fs_head_acc" style={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center', color:'grey'}} onClick={() => {
            //                   setExpandedAccordion(false)
            //                   handleClick(e);
            //                 }}><ExpandLess /></Typography>}
            //               </AccordionDetails>
            //             </Accordion>
            //           </Card>
            //         );
            //       })
            //     : ""}
            // </div>