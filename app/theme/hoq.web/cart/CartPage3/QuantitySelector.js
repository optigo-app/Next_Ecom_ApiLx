import React, { useState } from 'react';
import './Hoq3_cartPage.scss';
import './Hoq_quantity.scss';

const QuantitySelector = ({ selectedItem, qtyCount, handleIncrement, handleDecrement, }) => {

  return (
    <div className="Hoq3_cart-quantity">
      <button className="bttn bttn-left" onClick={() => handleDecrement(selectedItem)}>
        <span>-</span> 
      </button>
      <input
        type="number"
        className="input"
        id="input"
        value={selectedItem?.Quantity}
        readOnly
      />
      <button className="bttn bttn-right" onClick={() => handleIncrement(selectedItem)}>
        <span>+</span>
      </button>
    </div>
  );
};

export default QuantitySelector;
