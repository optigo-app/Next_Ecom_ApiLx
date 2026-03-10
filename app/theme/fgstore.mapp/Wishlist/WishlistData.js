import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import WishlistItems from './WishlistItems';
import { Box, Button, Typography, ToggleButtonGroup, ToggleButton } from "@mui/material";
import ViewAgendaOutlinedIcon from "@mui/icons-material/ViewAgendaOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";

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
  handelMenu,
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
    <>
      {items?.length != 0 &&
        <>
          {items?.length !== 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <ToggleButtonGroup
                size="small"
                value={alignment}
                exclusive
                onChange={handleChange}
                aria-label="view mode"
                sx={{
                  background: "#f5f5f5",
                  borderRadius: "30px",
                  padding: "3px",
                  ".MuiToggleButton-root": {
                    border: "none",
                    borderRadius: "20px",
                    px: 1.5,
                    color: "#555",
                  },
                  ".Mui-selected": {
                    backgroundColor: "#000",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#000"
                    }
                  }
                }}
              >
                <ToggleButton value="1">
                  <ViewAgendaOutlinedIcon fontSize="small" />
                </ToggleButton>

                <ToggleButton value="2">
                  <GridViewOutlinedIcon fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          )}
        </>
      }
      <div className="smr_WlListData"
      style={{
        marginTop:"0.5rem"
      }}
      >
        <>
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
            <>
              <NoResults
                onClick={handelMenu}
              />
            </>
          }
        </>
      </div>
    </>
  );
};

export default WishlistData;

const NoResults = ({ onClick }) => {
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 200px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 3,
        backgroundColor: "#fff",
      }}
    >
      <Box
        component="img"
        src="/Assets/mepty_cart.svg"
        alt="No search results"
        sx={{
          width: 180,
          height: 180,
          mb: 3,
          opacity: 0.8,
        }}
      />

      <Typography
        variant="h6"
        sx={{ fontWeight: 600, mb: 1 }}
      >
        No Wishlist Found!
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 260, mb: 3 }}
      >
        Please First Add Product in Wishlist.
      </Typography>

      <Button
        variant="contained"
        size="medium"

        sx={{
          textTransform: "none",
          px: 4,
          boxShadow: 'none',
          bgcolor: '#1a6bff',
          fontWeight: 600,
          color: '#fff'
        }}
        onClick={onClick}
      >
        Browse our collection
      </Button>
    </Box>
  );
};
