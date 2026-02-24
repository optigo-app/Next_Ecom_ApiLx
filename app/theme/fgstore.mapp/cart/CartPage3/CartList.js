import React from 'react';
import CartItem from './CartItem';

const CartList = ({
  items,
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
  storeInit,
  handleCancel,
}) => {

  return (
    <div className="smr3_RightCartList">
      <div className='smr3_tablelable'>
        <p>Image</p>
        <p>Product Details</p>
        <p>Price</p>
        <p>Total Price</p>
      </div>

      <>
        <div className='smr3_cartListMapDiv'>
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
              storeInit={storeInit}
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
