"use client";

import React, { useEffect } from 'react';
import Basket from './Drawer';
import useCart from '@/app/(core)/utils/Glob_Functions/Cart_Wishlist/Cart';
import { useStore } from '@/app/(core)/contexts/StoreProvider';

function Cart({ storeinit, visiterId }) {
  const {
    isloding,
    ispriceloding,
    cartData,
    selectedItem,
    selectedItems,
    multiSelect,
    openModal,
    showRemark,
    productRemark,
    qtyCount,
    sizeCombo,
    CurrencyData,
    countData,
    mrpbasedPriceFlag,
    openMobileModal,
    finalCartData,
    handlecloseMobileModal,
    CartCardImageFunc,
    handleSelectItem,
    handleIncrement,
    handleDecrement,
    handleMultiSelectToggle,
    handleOpenModal,
    handleCloseModal,
    handleRemarkChange,
    handleSave,
    handleCancel,
    handleAddReamrk,
    handleRemoveItem,
    handleRemoveAll,
    handleUpdateCart,
    handleCancelUpdateCart,
    handleMetalTypeChange,
    handleMetalColorChange,
    handleDiamondChange,
    handleColorStoneChange,
    handleSizeChange,
    decodeEntities,
    handleMoveToDetail,
    handelMenu
  } = useCart();

  const { cartOpenStateB2C, setCartOpenStateB2C } = useStore();

  const isOpen = cartOpenStateB2C;
  const setCartOpenState = setCartOpenStateB2C;

  const handleCloseDrawer = () => {
    setCartOpenState(false)
  }

  console.log("lpolo", storeinit)

  return (
    <div className="Hoq_CartPageMainB2cDiv">
      <Basket
        isOpen={isOpen}
        closeDrawer={handleCloseDrawer}
        items={finalCartData}
        qtyCount={qtyCount}
        CurrencyData={CurrencyData}
        CartCardImageFunc={CartCardImageFunc}
        showRemark={showRemark}
        productRemark={productRemark}
        onSelect={handleSelectItem}
        selectedItem={selectedItem}
        selectedItems={selectedItems}
        multiSelect={multiSelect}
        onRemove={handleRemoveItem}
        handleAddReamrk={handleAddReamrk}
        handleRemarkChange={handleRemarkChange}
        handleSave={handleSave}
        handleCancel={handleCancel}
        handleIncrement={handleIncrement}
        handleDecrement={handleDecrement}
        decodeEntities={decodeEntities}
        handelMenu={handelMenu}
        storeinit={storeinit}
        visiterId={visiterId}
      />
    </div>
  );
}

export default Cart;
