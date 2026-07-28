import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './Delivery.modul.scss';
import NewAddressModal from '../NewAddressModal/NewAddressModal';
import { useAddress } from '../../../../../../utils/Glob_Functions/OrderFlow/useAddress';
import { Breadcrumbs, Grid, Typography, useMediaQuery } from '@mui/material';
import CardSkeleton from './CardSkeleton';
import AddressCard from './AddressCard';
import DeleteDialog from './DeleteDialog';
import { OrderFlowCrumbs } from '../../Cart/OrderFlowCrumbs';
import { storImagePath } from '../../../../../../utils/Glob_Functions/GlobalFunction';

const Delivery = () => {
    const {
        addressData,
        open,
        openDelete,
        formData,
        errors,
        isEditMode,
        isLoading,
        handleOpen,
        handleClose,
        handleCancel,
        handleInputChange,
        handleSubmit,
        handleDelete,
        handleDeleteClick,
        handleDeleteClose,
        handleDefaultSelection,
        proceedToOrder
    } = useAddress();

    const navigate = useNavigate();
    const handleBackButton = (e) => {
        e.preventDefault();
        navigate(-1)
    }
    const isTabletResponsive = useMediaQuery('(max-width:1000px)');

    const [cartString, setCartString] = useState();

    // useEffect(() => {
    //     const getCartData = sessionStorage.getItem('iscartData');
    //     setCartString(getCartData)
    // }, [])

    // browse our collection
    const handelMenu = () => {
        let menudata = JSON.parse(sessionStorage.getItem('menuparams'));
        if (menudata) {
            console.log('otherparamsUrl--', menudata);
            const queryParameters1 = [
                menudata?.FilterKey && `${menudata?.FilterVal}`,
                menudata?.FilterKey1 && `${menudata?.FilterVal1}`,
                menudata?.FilterKey2 && `${menudata?.FilterVal2}`,
            ].filter(Boolean).join('/');

            const queryParameters = [
                menudata?.FilterKey && `${menudata?.FilterVal}`,
                menudata?.FilterKey1 && `${menudata?.FilterVal1}`,
                menudata?.FilterKey2 && `${menudata?.FilterVal2}`,
            ].filter(Boolean).join(',');

            const otherparamUrl = Object.entries({
                b: menudata?.FilterKey,
                g: menudata?.FilterKey1,
                c: menudata?.FilterKey2,
            })
                .filter(([key, value]) => value !== undefined)
                .map(([key, value]) => value)
                .filter(Boolean)
                .join(',');

            // const paginationParam = [
            //   `page=${menudata.page ?? 1}`,
            //   `size=${menudata.size ?? 50}`
            // ].join('&');

            let menuEncoded = `${queryParameters}/${otherparamUrl}`;
            const url = `/p/${menudata?.menuname}/${queryParameters1}/?M=${btoa(
                menuEncoded
            )}`;
            navigate(url)
        } else {
            navigate("/")
        }
    }
    return (
        <>
            <div className="elv_delivery_Main_div">
                <div className="elv_delivery_lists_div">
                    <div className="elv_delivery_lists_header">
                        <div className="elv_delivery_lists_header_breadcrumb">
                            <div className="elv_delivery_lists_name">
                                <div className="elv_delivery_details">
                                    <span className="elv_delivery_details_1">
                                        Delivery
                                        {/* <OrderFlowCrumbs param1={"My cart"} param2={'delivery'} param3={''} /> */}
                                    </span>
                                </div>
                            </div>
                            <div className="elv_delivery_lists_header_logo">
                                <span>
                                    <p className="elv_delivery_ptitle">
                                        <img
                                            className="elv_delivery_logo"
                                            src={`${storImagePath()}/images/HomePage/MainBanner/featuresImage.png`}
                                            alt="Logo"
                                        />
                                    </p>
                                </span>
                            </div>
                        </div>
                        <div className="elv_filteration_block_div">
                            <div className="elv_delblock_rows">
                                <div className="elv_delblock_rows_1" >
                                    <span className="elv_back_title" onClick={handleBackButton}>
                                        <span>Back</span>
                                    </span>
                                </div>
                                {/* {cartString ? (
                                    <> */}
                                <div className="elv_delblock_rows_2" >
                                    <span className="elv_address_title" onClick={() => handleOpen(null)}>
                                        <span>Add new Address</span>
                                    </span>
                                </div>
                                <div className="elv_delblock_rows_3" >
                                    <span className="elv_address_count">
                                        <span>{addressData?.length}&nbsp;</span>
                                        <span>Address</span>
                                    </span>
                                </div>
                                {/* <div className={isTabletResponsive ? 'elv_delblock_rows_4_hide' : "elv_delblock_rows_4"} >

                                        </div> */}
                                <div className="elv_delblock_rows_5" onClick={() => proceedToOrder(navigate)}>
                                    <span className="elv_continue_title">
                                        continue
                                    </span>
                                </div>
                                {/* </>
                                ) : ('')} */}


                            </div>
                        </div>
                        {/* {cartString ? (
                            <> */}
                        <div className='elv_TitleDetailMainDiv'>
                            <p className='elv_deliverydesc'>Order Will be delivered to selected address</p>
                        </div>
                        {!isLoading ? (
                            <div className='elv_getAddrMainDiv'>
                                <Grid container spacing={2}>
                                    {addressData?.map((data, index) => (
                                        <React.Fragment key={data.id} >
                                            <AddressCard
                                                key={data.id}
                                                name={data.name}
                                                address={data}
                                                index={index}
                                                handleOpen={handleOpen}
                                                handleDeleteClick={handleDeleteClick}
                                                handleDefaultSelection={handleDefaultSelection} />
                                        </React.Fragment>
                                    ))}
                                </Grid>
                            </div>
                        ) :
                            <CardSkeleton />
                        }
                        <NewAddressModal
                            open={open}
                            handleClose={handleClose}
                            handleCancel={handleCancel}
                            formData={formData}
                            handleInputChange={handleInputChange}
                            handleSubmit={handleSubmit}
                            errors={errors}
                            isEditMode={isEditMode}
                        />
                        <DeleteDialog
                            openDelete={openDelete}
                            handleDeleteClose={handleDeleteClose}
                            handleDelete={() => handleDelete()}
                        />
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
        </>
    )
}

export default Delivery