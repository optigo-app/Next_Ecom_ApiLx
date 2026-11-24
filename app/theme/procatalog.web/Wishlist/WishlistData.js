import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
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
                  color: 'var(--wl-surface, #fff)',
                },
                '.MuiToggleButton-root': {
                  borderRadius: '0px',
                  '&:not(.Mui-selected)': {
                    backgroundColor: 'transparent',
                    color: 'var(--wl-text-ink, #000)',
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
            <div style={{
              maxWidth: 420,
              margin: "0 auto",
              padding: "48px 32px",
              textAlign: "center",
              background: "var(--wl-surface-muted, #fafafa)",
              border: "1px dashed var(--wl-border, #dcdcdc)",
              borderRadius: 12,
            }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--wl-surface-warm, #faf4ee)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}>
                <FavoriteBorderIcon style={{ fontSize: 30, color: "var(--wl-accent, #cca182)" }} />
              </div>
              <p className='smr_title' style={{ margin: "0 0 8px", fontSize: "1.15rem", fontWeight: 600, color: "var(--wl-text-secondary, #333)" }}>Your wishlist is empty</p>
              <p className='smr_desc' style={{ margin: "0 0 24px", color: "var(--wl-text-faint, #777)", fontSize: "0.9rem" }}>Save your favorite pieces here and find them anytime.</p>
              <button
                className='smr_browseOurCollectionbtn'
                onClick={handelMenu}
                style={{
                  background: "var(--wl-accent, #cca182)",
                  color: "var(--wl-surface, #fff)",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 28px",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                Browse Our Collection
              </button>
            </div>
          </div>
        }
      </>
    </div>
  );
};

export default WishlistData;
