import React from 'react';
import Grid from '@mui/material/Grid';
import WishlistItems from './WishlistItems';
import { Backdrop, useMediaQuery } from '@mui/material';

const WishlistData = ({
  isWLLoading,
    items,
    itemInCart,
    updateCount,
    countDataUpdted,
    itemsLength,
    currency,
    decodeEntities,
    handelMenu,
    WishCardImageFunc,
    handleRemoveItem,
    handleWishlistToCart,
    handleMoveToDetail
}) => {

  const isMobileScreen = useMediaQuery("(max-width:699px)");

  return (
    // <div className="elv_WlListData">
    //   <>
    //     <Grid container spacing={1}>
    //       {items?.map(item => (
    //         <WishlistItems
    //           key={item.id}
    //           item={item}
    //           updateCount={updateCount}
    //           countDataUpdted={countDataUpdted}
    //           currency={currency}
    //           itemInCart={itemInCart}
    //           decodeEntities={decodeEntities}
    //           WishCardImageFunc={WishCardImageFunc}
    //           itemsLength={items?.length}
    //           handleRemoveItem={handleRemoveItem}
    //           handleWishlistToCart={handleWishlistToCart}
    //           handleMoveToDetail={handleMoveToDetail}
    //         />
    //       ))}
    //     </Grid>
    //     {items.length == 0 &&
    //       <div className='elv_noWishlistData'  style={{paddingTop:"8rem"}}>
    //         <p className='elv_title'>No Wishlist Found!</p>
    //         <p className='elv_desc'>Please First Add Product in Wishlist</p>
    //         <button className='elv_browseOurCollectionbtn' onClick={handelMenu}>Browse our collection</button>
    //       </div>
    //     }
    //   </>
    // </div>

    <div className='dt_MainWishDiv'  style={{backgroundColor:"#fdf6f6"}}>
    <div
      className="bg-imageCart"
      style={{
        backgroundImage: `/WebSiteStaticImage/Banner/diamondtine/TopBanner1.png`,
      }}
    >
      <div className="overlay" />
      <div className="text-container">
        <div className="textContainerData">
          <div style={{ textAlign: "center" }}>
            <p
              className="dt_WishdesignCounttext"
            >
              My Wishlist <br />
            </p>
          </div>
        </div>
      </div>
    </div>
    {
      isWLLoading ? (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="50vh">
          <Backdrop
            sx={{
              color: '#fff',
              backgroundColor: 'rgba(211, 211, 211, 0.4)',
              zIndex: (theme) => theme.zIndex.drawer + 1
            }}
            open={isWLLoading}
          >
            <CircularProgress sx={{ color: '#a8807c' }} />
          </Backdrop>
        </Box>
      ) : (
        <>
          {items?.length !== 0 ? (
            <>
              {!isMobileScreen ? (
                <div className="cart">
                  <div className="cart-items">
                    <table>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                      {items?.map(item => (
            <WishlistItems
              key={item.id}
              item={item}
              updateCount={updateCount}
              countDataUpdted={countDataUpdted}
              currency={currency}
              itemInCart={itemInCart}
              decodeEntities={decodeEntities}
              WishCardImageFunc={WishCardImageFunc}
              itemsLength={items?.length}
              handleRemoveItem={handleRemoveItem}
              handleWishlistToCart={handleWishlistToCart}
              handleMoveToDetail={handleMoveToDetail}
            />
          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) :
                <>
                  {items?.map(item => (
                    <ResponsiveWishUi
                      key={item.id}
                      item={item}
                      updateCount={updateCount}
                      countDataUpdted={countDataUpdted}
                      currency={CurrencyData}
                      itemInCart={itemInCart}
                      decodeEntities={decodeEntities}
                      WishCardImageFunc={WishCardImageFunc}
                      itemsLength={finalWishData?.length}
                      handleRemoveItem={handleRemoveItem}
                      handleWishlistToCart={handleWishlistToCart}
                      handleMoveToDetail={handleMoveToDetail}
                    />
                  ))}
                </>
              }
            </>
          ) : (
            <div>
              <div style={{ display: "flex", flexDirection: "column", marginInline: "20%" }}>
                <p className="my-5" style={{
                  fontSize: 16,
                  fontWeight: 500,
                  border: "1px dashed rgb(217, 217, 217)",
                  width: "100%",
                  padding: 10,
                  color: "rgb(167, 167, 167)"
                }}>
                  Your Wishlist is currently empty.
                </p>
                <button className="dt_browseBtnMore" onClick={handelMenu}>Return to Shop</button>
              </div>
            </div>
          )}
        </>
      )
    }

 
  </div>
  );
};

export default WishlistData;
