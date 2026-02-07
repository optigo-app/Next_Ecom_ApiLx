import React from 'react';
import './hoq_wishlist.scss';
import { Skeleton, Grid, Card } from '@mui/material';

const SkeletonLoader = () => {
  const skeletonArray = new Array(4).fill(0);
  const sizes = {
    xs: 6,
    sm: 4,
    md: 3,
  };

  return (
    <Grid container spacing={1} className="hoq_addwishlistSkeltonMainBox" marginBottom={"2rem"}>
      {skeletonArray.map((_, index) => (
        <Grid item key={index} {...sizes}>
          <Card className='hoq_addwishlistSkelton'>
            <Skeleton
              className='hoq_addwishlistSkelton'
              variant="rectangular"
              animation="wave" />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SkeletonLoader;
