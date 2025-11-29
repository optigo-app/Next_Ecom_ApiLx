
"use client";

import React from 'react';
import './Delivery.scss'
import AddressForm from './AddressForm';
import AddressCard from './AddressCard';
import { useAddress } from '@/app/(core)/utils/Glob_Functions/OrderFlow/useAddress';
import { Grid } from '@mui/material';
import SkeletonLoader from './AddressSkelton';
import ConfirmationDialog from '@/app/(core)/utils/Glob_Functions/ConfirmationDialog/ConfirmationDialog';
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
import { IoArrowBack } from 'react-icons/io5';
import DeleteDialog from './DeleteDialog';

const AddressManagement = () => {
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

    const location = useNextRouterLikeRR();
    const navigate = location.push;

    return (
        <div className="hoqMo_DeliverMainDiv">
            <p
                className="SmiCartListTitle"
                style={{
                    padding: " 25px 15px ",
                    margin: "25px ",
                    boxShadow: "none",
                    cursor: "pointer",
                }}
            >
                <IoArrowBack
                    style={{ height: "25px", width: "25px", marginRight: "10px" }}
                    onClick={() => navigate(-1)}
                />
                Select delivery address
            </p>
            <div className="hoqMo_secondMaindivAdd">
                <div className="hoqMo_addMainDiv">
                    {!isLoading ? (
                        <div className="hoqMo_getAddrMainDiv">
                            <Grid container spacing={2}>
                                {addressData?.map((data, index) => (
                                    <React.Fragment key={data.id}>
                                        <AddressCard
                                            key={data.id}
                                            name={data.name}
                                            address={data}
                                            index={index}
                                            handleOpen={handleOpen}
                                            handleDeleteClick={handleDeleteClick}
                                            handleDefaultSelection={handleDefaultSelection}
                                        />
                                    </React.Fragment>
                                ))}
                            </Grid>
                        </div>
                    ) : (
                        <SkeletonLoader />
                    )}
                    <AddressForm
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
                </div>
            </div>

            <div className="hoqMo_AddressBtnGroup">
                <button
                    fullWidth
                    className="hoqMo_AddNewAddrbtn"
                    onClick={() => handleOpen(null)}
                >
                    Add New Address
                </button>
                <button
                    fullWidth
                    className="hoqMo_ContinueOrderbtn"
                    onClick={() => proceedToOrder(navigate)}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default AddressManagement;
