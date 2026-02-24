import React, { useEffect, useState } from 'react';
import Basket from './Drawer';
import useCart from '@/app/(core)/utils/Glob_Functions/Cart_Wishlist/Cart';
import { useStore } from '@/app/(core)/contexts/StoreProvider';

function Cart({ storeinit, visiterId }) {
  const {
    selectedItem,
    selectedItems,
    multiSelect,
    showRemark,
    productRemark,
    qtyCount,
    CurrencyData,
    finalCartData,
    CartCardImageFunc,
    handleSelectItem,
    handleIncrement,
    handleDecrement,
    handleRemarkChange,
    handleSave,
    handleCancel,
    handleAddReamrk,
    handleRemoveItem,
    decodeEntities,
    handelMenu
  } = useCart();

  const { cartOpenStateB2C, setCartOpenStateB2C } = useStore();

  const isOpen = cartOpenStateB2C;

  const handleCloseDrawer = () => {
    setCartOpenStateB2C(false)
  }

  return (
    <div className="smr_CartPageMainB2cDiv">
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
