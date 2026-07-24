import React from 'react';
import Grid from '@mui/material/Grid';
import WishlistItems from './WishlistItems';


const WishlistData = ({
  isloding,
  items,
  updateCount,
  countDataUpdted,
  itemInCart,
  curr,
  decodeEntities,
  handleRemoveItem,
  handleWishlistToCart,
  WishCardImageFunc,
  handleMoveToDetail,
  handelMenu
}) => {

  return (
    <div className="elv_WlListData">
      <>
        <Grid container spacing={1}>
          {items?.map(item => (
            <WishlistItems
              key={item.id}
              item={item}
              updateCount={updateCount}
              countDataUpdted={countDataUpdted}
              currency={curr}
              itemInCart={itemInCart}
              decodeEntities={decodeEntities}
              WishCardImageFunc={WishCardImageFunc}
              itemsLength={items?.length}
              handleRemoveItem={handleRemoveItem}
              handleWishlistToCart={handleWishlistToCart}
              handleMoveToDetail={handleMoveToDetail}
            />
          ))}
        </Grid>
        {items.length == 0 &&
          <div className='elv_noWishlistData'  style={{paddingTop:"8rem"}}>
            <p className='elv_title'>No Wishlist Found!</p>
            <p className='elv_desc'>Please First Add Product in Wishlist</p>
            <button className='elv_browseOurCollectionbtn' onClick={handelMenu}>Browse our collection</button>
          </div>
        }
      </>
    </div>
  );
};

export default WishlistData;
