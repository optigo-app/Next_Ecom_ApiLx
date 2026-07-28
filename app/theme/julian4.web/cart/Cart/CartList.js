import React from 'react';
import Grid from '@mui/material/Grid';
import CartItem from './CartItem';

const CartList = ({
  items,
  setOpenMobileModal,
  openHandleUpdateCartModal,
  CartCardImageFunc,
  onSelect,
  CurrencyData,
  decodeEntities,
  selectedItem,
  selectedItems,
  handleClose1,
  border,
  showRemark1,
  handleBorder,
  multiSelect,
  showRemark,
  productRemark,
  onRemove,
  handleAddReamrk,
  handleRemarkChange,
  handleSave,
  handleCancel, }) => {
  return (
    <>
      {items?.map((item, index) => (
        <Grid size={{
          xs: 12, sm: 6, md: 6, lg: 4
        }} key={item} >
          <CartItem
            item={item}
            index={index}
            CartCardImageFunc={CartCardImageFunc}
            CurrencyData={CurrencyData}
            decodeEntities={decodeEntities}
            onSelect={onSelect}
            selectedItem={selectedItem}
            selectedItemsLength={selectedItems?.length}
            isActive={selectedItems?.includes(item)}
            isSelected={multiSelect ? selectedItems?.includes(item) : selectedItem === item}
            multiSelect={multiSelect}
            onRemove={onRemove}
            itemLength={items?.length}
            showRemark={showRemark}
            border={border}
            handleBorder={handleBorder}
            showRemark1={showRemark1}
            productRemark={productRemark}
            handleClose1={handleClose1}
            handleAddReamrk={handleAddReamrk}
            handleRemarkChange={handleRemarkChange}
            handleSave={handleSave}
            handleCancel={handleCancel}
            openHandleUpdateCartModal={openHandleUpdateCartModal}
          />
        </Grid>
      ))}
    </>
  );
};

export default CartList;
