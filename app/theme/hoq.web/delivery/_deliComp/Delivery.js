
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
        proceedToOrder,
        storeinit
    } = useAddress();

    const location = useNextRouterLikeRR();
    const navigate = location.push;
    const GoBack = location.back;

    return (
        <div className="hoqMo_DeliverMainDiv">
            {/* ── Page Header ── */}
            <div className="hoq_deliveryPageHeader">
                <button
                    className="hoq_backBtn"
                    onClick={() => GoBack()}
                    aria-label="Go back"
                >
                    <IoArrowBack />
                </button>
                <h1 className="hoq_deliveryTitle">Select Delivery Address</h1>
            </div>

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
