import React from 'react';
import Grid from '@mui/material/Grid';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
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
          <div className='elv_noWishlistData' style={{ paddingTop: "8rem" }}>
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
              <p className='elv_title' style={{ margin: "0 0 8px", fontSize: "1.15rem", fontWeight: 600, color: "var(--wl-text-secondary, #333)" }}>Your wishlist is empty</p>
              <p className='elv_desc' style={{ margin: "0 0 24px", color: "var(--wl-text-faint, #777)", fontSize: "0.9rem" }}>Save your favorite pieces here and find them anytime.</p>
              <button
                className='elv_browseOurCollectionbtn'
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
