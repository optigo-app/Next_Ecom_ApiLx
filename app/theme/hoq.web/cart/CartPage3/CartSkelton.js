import React from 'react';
import { Grid, Skeleton } from '@mui/material';

const CartPageSkeleton = () => {
  return (
    <Grid container spacing={1} sx={{ padding: '0px 10px' }}>
      <Grid item
        size={{ xs: 12, md: 9 }}
        className='Hoq3_cartSkeltonListCardGrid'>
        <Grid container spacing={1}>
          {[...Array(9)].map((_, index) => (
            <Grid item size={{ xs: 12 }} key={index}>
              <Skeleton className='Hoq3_CartSkelton' variant="rectangular" width="100%" height={240} animation="wave" />
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Grid item size={{ xs: 12, md: 9 }}>
        <div className='Hoq3_cartskeltonRightSide'>
          <Skeleton className='Hoq3_CartSkelton' variant="rectangular" width="100%" height={500} animation="wave" />
          <Skeleton className='Hoq3_CartSkelton' variant="text" width="80%" animation="wave" />
          <Skeleton className='Hoq3_CartSkelton' variant="text" width="80%" animation="wave" />
          <Skeleton className='Hoq3_CartSkelton' variant="text" width="60%" animation="wave" />
        </div>
      </Grid>
    </Grid>
  );
};

export default CartPageSkeleton;
