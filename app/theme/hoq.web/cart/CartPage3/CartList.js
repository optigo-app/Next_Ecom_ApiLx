import React, { useEffect, useState } from 'react';
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
  multiSelect,
  showRemark,
  productRemark,
  onRemove,
  handleAddReamrk,
  handleRemarkChange,
  handleSave,
  handleCancel,
}) => {

  return (
    <div className="Hoq3_RightCartList">
      <div className='Hoq3_tablelable'>
        <p>Image</p>
        <p>Product Details</p>
        <p>Price</p>
        <p>Total Price</p>
      </div>

      <>
        <div className='Hoq3_cartListMapDiv'>
          {items.map((item, index) => (
            <CartItem
              key={item.id}
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
              productRemark={productRemark}
              handleAddReamrk={handleAddReamrk}
              handleRemarkChange={handleRemarkChange}
              handleSave={handleSave}
              handleCancel={handleCancel}
              openHandleUpdateCartModal={openHandleUpdateCartModal}
            />
          ))}
        </div>
      </>
    </div>
  );
};

export default CartList;
