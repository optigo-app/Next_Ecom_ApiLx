import React, { useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import './smr_cartPageB2c.scss';
import CloseIcon from '@mui/icons-material/Close';
import CartTableData from "./CartTableData"
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
import { useStore } from '@/app/(core)/contexts/StoreProvider';

const Cart = ({
  isOpen,
  closeDrawer,
  items,
  qtyCount,
  CartCardImageFunc,
  CurrencyData,
  onRemove,
  decodeEntities,
  handleDecrement,
  handleIncrement,
  handelMenu,
  storeinit,
  visiterId,
}) => {

  const noImageFound = "/image-not-found.jpg";

  const location = useNextRouterLikeRR();
  const navigate = location.push;
  const { islogin, loginUserDetail } = useStore()

  const [totalPrice, setTotalPrice] = useState();
  const storeInitData = storeinit;
  const loginInfo = loginUserDetail;

  useEffect(() => {
    setTimeout(() => {
      if (items) {
        let priceData = items?.reduce((total, item) => total + item?.FinalCost, 0);
        setTotalPrice(priceData)
      }
    }, 300);
  }, [items])

  const redirectUrl = `/LoginOption/?LoginRedirect=/delivery`;
  const handlePlaceOrder = () => {
    let storeInit = storeinit;
    if (storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null) {
      navigate(redirectUrl);
      closeDrawer();
    } else {
      navigate("/delivery")
      let priceData = items?.reduce((total, item) => total + item?.FinalCost, 0);
      sessionStorage.setItem('TotalPriceData', priceData)
      closeDrawer();
    }
    window.scrollTo(0, 0);
  }

  const handleBrowse = () => {
    closeDrawer();
    handelMenu();
  }

  return (
    <div className="smr_B2cCart">
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={closeDrawer}
        PaperProps={{
          className: "smr_B2ccartPaperDrawer",
          style: {
            width: '40%',
          },
        }}
        className='smr_B2ccartDrawer'
      >
        <div className="smr_B2C-container">
          <div className='smr_b2cCartPageButonGp'>
            <div className='smr_b2ccartCloseIcon' onClick={closeDrawer}>
              <CloseIcon />
            </div>
            <div className='smr_cartB2cMainTitleBtn' >
              <p>Your Cart</p>
            </div>
          </div>
          <div className='smr_b2cCartTb'>
            {items?.length !== 0 ? (
              items?.map((item, index) => (
                <CartTableData
                  key={index}
                  cartData={item}
                  qtyCount={qtyCount}
                  CurrencyData={CurrencyData}
                  CartCardImageFunc={CartCardImageFunc}
                  noImageFound={noImageFound}
                  decodeEntities={decodeEntities}
                  handleIncrement={handleIncrement}
                  handleDecrement={handleDecrement}
                  onRemove={onRemove}
                  storeinit={storeinit}
                  visiterId={visiterId}
                />
              ))
            ) : (
              <div className='smr_noB2CcartData'>
                <p className='smr_title'>No Product Found!</p>
                <p className='smr_desc'>Please First Add Product in cart</p>
                <button className='smr_browseOurCollectionbtn' onClick={handleBrowse}>Browse our collection</button>
              </div>
            )}

          </div>
          <div>

          </div>
          {items?.length != 0 &&
            <div className='smr_B2cCheckoutBtnDiv'>
              <button className='smr_B2cCheckoutBtn' onClick={handlePlaceOrder}>
                {storeInitData?.IsPriceShow == 1 &&
                  <span>
                    {loginInfo?.CurrencyCode ?? storeInitData?.CurrencyCode}
                    {" "}{totalPrice}
                  </span>
                }{' - '}CHECKOUT</button>
            </div>
          }
        </div>
      </Drawer>
    </div>
  );
};

export default Cart;
