import React, { useState } from 'react';
import './smr_cartPageB2c.scss';

const QuantitySelector = ({ cartData, qtyCount, handleIncrement, handleDecrement, }) => {

  return (
    <div className="smr_cartB2c-quantity">
      <button className="bttn bttn-left" onClick={() => handleDecrement(cartData)}>
        <span>-</span>
      </button>
      <input
        type="number"
        className="input"
        id="input"
        value={cartData?.Quantity}
        readOnly
      />
      <button className="bttn bttn-right" onClick={() => handleIncrement(cartData)}>
        <span>+</span>
      </button>
    </div>
  );
};

export default QuantitySelector;
