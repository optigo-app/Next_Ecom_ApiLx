import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Delivery.modul.scss";
import NewAddressModal from "../NewAddressModal/NewAddressModal";
import { useAddress } from "../../../../../../utils/Glob_Functions/OrderFlow/useAddress";
import { Breadcrumbs, Grid, Typography, useMediaQuery, Box } from "@mui/material";
import CardSkeleton from "./CardSkeleton";
import AddressCard from "./AddressCard";
import DeleteDialog from "./DeleteDialog";
import { OrderFlowCrumbs } from "../../Cart/OrderFlowCrumbs";
import { storImagePath } from "../../../../../../utils/Glob_Functions/GlobalFunction";
import DeliveryHeader from "./new/DeliveryHeader";
import AddNewAddressCard from "./new/AddAddressCard";

const Delivery = () => {
  const { addressData, open, openDelete, formData, errors, isEditMode, isLoading, handleOpen, handleClose, handleCancel, handleInputChange, handleSubmit, handleDelete, handleDeleteClick, handleDeleteClose, handleDefaultSelection, proceedToOrder } = useAddress();

  const navigate = useNavigate();
  const handleBackButton = (e) => {
    e.preventDefault();
    navigate(-1);
  };
  const isTabletResponsive = useMediaQuery("(max-width:1000px)");

  const [cartString, setCartString] = useState();

  // useEffect(() => {
  //     const getCartData = sessionStorage.getItem('iscartData');
  //     setCartString(getCartData)
  // }, [])

  // browse our collection
  const handelMenu = () => {
    let menudata = JSON.parse(sessionStorage.getItem("menuparams"));
    if (menudata) {
      console.log("otherparamsUrl--", menudata);
      const queryParameters1 = [menudata?.FilterKey && `${menudata?.FilterVal}`, menudata?.FilterKey1 && `${menudata?.FilterVal1}`, menudata?.FilterKey2 && `${menudata?.FilterVal2}`].filter(Boolean).join("/");

      const queryParameters = [menudata?.FilterKey && `${menudata?.FilterVal}`, menudata?.FilterKey1 && `${menudata?.FilterVal1}`, menudata?.FilterKey2 && `${menudata?.FilterVal2}`].filter(Boolean).join(",");

      const otherparamUrl = Object.entries({
        b: menudata?.FilterKey,
        g: menudata?.FilterKey1,
        c: menudata?.FilterKey2,
      })
        .filter(([key, value]) => value !== undefined)
        .map(([key, value]) => value)
        .filter(Boolean)
        .join(",");

      // const paginationParam = [
      //   `page=${menudata.page ?? 1}`,
      //   `size=${menudata.size ?? 50}`
      // ].join('&');

      let menuEncoded = `${queryParameters}/${otherparamUrl}`;
      const url = `/p/${menudata?.menuname}/${queryParameters1}/?M=${btoa(menuEncoded)}`;
      navigate(url);
    } else {
      navigate("/");
    }
  };
  return (
    <>
      <Box
        sx={{
          px: { xs: 1, sm: 2, md: 4 },
          width: "100%",
        }}
      >
        <div className="elv_delivery_Main_div">
          <DeliveryHeader addressCount={addressData?.length} handleBack={handleBackButton} handleContinue={() => proceedToOrder(navigate)} />
          <div className="">
            <div className="">
              <Box
                sx={{
                  width: "100%",
                  mt: 3,
                  mb: 4,
                  px: { xs: 2, sm: 0 },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#1a1a1a",
                    letterSpacing: "-0.2px",
                    mb: 1,
                  }}
                >
                  Delivery Address
                </Typography>

                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 400,
                    color: "#5b5b5b",
                    maxWidth: "500px",
                    lineHeight: 1.5,
                  }}
                >
                  Order will be delivered to your selected address below
                </Typography>
              </Box>

              {!isLoading ? (
                <div className="elv_getAddrMainDiv">
                  <Grid container spacing={2}>
                    <AddNewAddressCard handleAddNew={() => handleOpen(null)} />
                    {addressData?.map((data, index) => (
                      <React.Fragment key={data.id}>
                        <AddressCard key={data.id} name={data.name} address={data} index={index} handleOpen={handleOpen} handleDeleteClick={handleDeleteClick} handleDefaultSelection={handleDefaultSelection} />
                      </React.Fragment>
                    ))}
                  </Grid>
                </div>
              ) : (
                <CardSkeleton />
              )}
              <NewAddressModal open={open} handleClose={handleClose} handleCancel={handleCancel} formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} errors={errors} isEditMode={isEditMode} />
              <DeleteDialog openDelete={openDelete} handleDeleteClose={handleDeleteClose} handleDelete={() => handleDelete()} />
              {/* </>
                        ) :
                            <div className='elv_noCartlistData'>
                                <p className='elv_title'>No Data Found!</p>
                                <p className='elv_desc'>Please First Add Product in Cart</p>
                                <button className='elv_browseOurCollectionbtn' onClick={handelMenu}>Browse our collection</button>
                            </div>
                        } */}
            </div>
          </div>
        </div>
      </Box>
    </>
  );
};

export default Delivery;
