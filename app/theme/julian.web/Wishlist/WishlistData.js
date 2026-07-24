import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import WishlistItems from './WishlistItems';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';


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
  handelMenu ,
  storeInit
}) => {
  const [alignment, setAlignment] = React.useState('1');


  const handleChange = (event, newAlignment) => {
    const element = document.querySelector('.smr_wlListGrid');
    element.classList.add('fade-out');

    setTimeout(() => {
      element.classList.remove('fade-out');
      // element.classList.add('fade-in');
      setAlignment(newAlignment);
    }, 400);
  };




  return (
    <div className="smr_WlListData">
      <>
        {items?.length != 0 &&
          <div className='smr_wlToggleButtonDiv'>
            <ToggleButtonGroup
              size="medium"
              value={alignment}
              exclusive
              onChange={handleChange}
              aria-label="Platform"
              className='smr_toggleWishButtonDiv'
              sx={{
                height: "35px",
                borderRadius: '0px',
                '.Mui-selected': {
                  backgroundColor: '#7d7f856e',
                  color: '#fff',
                },
                '.MuiToggleButton-root': {
                  borderRadius: '0px',
                  '&:not(.Mui-selected)': {
                    backgroundColor: 'transparent',
                    color: '#000',
                  }
                }
              }}
            >
              <ToggleButton value="1"><span style={{ padding: '0px 10px' }}>|</span></ToggleButton>
              <ToggleButton value="2"><span style={{ padding: '0px 10px' }}>||</span></ToggleButton>
            </ToggleButtonGroup>
          </div>
        }
        <Grid container spacing={2} className='smr_wlListGrid'>
          {items.map((item, index) => (
            <WishlistItems
              key={item.id}
              selectedValue={alignment}
              item={item}
              index={index}
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
              storeInit={storeInit}
            />
          ))}
        </Grid>
        {items.length == 0 &&
          <div className='smr_noWishlistData'>
            <p className='smr_title'>No Wishlist Found!</p>
            <p className='smr_desc'>Please First Add Product in Wishlist</p>
            <button className='smr_browseOurCollectionbtn' onClick={handelMenu}>Browse our collection</button>
          </div>
        }
      </>
    </div>
  );
};

export default WishlistData;
