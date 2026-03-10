import React from 'react';
import './smr_wishlist.scss';
import { Box, Skeleton, Grid, Card, CardContent } from '@mui/material';

const SkeletonLoader = ({length = 4}) => {
  const skeletonArray = new Array(length).fill(0);

  return (
    <Grid container spacing={1} className="smr_addwishlistSkeltonMainBox">
      {skeletonArray.map((_, index) => (
        <Grid item size={{
          xs : 6 , sm :4 , md : 3
        }} key={index}>
          <Card className='smr_addwishlistSkelton'>
            <Skeleton
              className='smr_addwishlistSkelton'
              variant="rectangular"
              animation="wave" />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SkeletonLoader;
