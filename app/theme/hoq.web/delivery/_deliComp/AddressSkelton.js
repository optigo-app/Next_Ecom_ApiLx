import React from 'react';
import './AddressSkelton.scss';
import { Skeleton, Grid, Card } from '@mui/material';

const SkeletonLoader = () => {
  const skeletonArray = new Array(4).fill(0);

  return (
    <Grid container spacing={2} className="smrMo_addCardSkeltonMainBox">
      {skeletonArray.map((_, index) => (
        <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
          <Card className='smrMo_addCardSkelton'>
            <Skeleton className='smrMo_addCardSkelton' variant="rectangular" width='100%' height={200} animation="wave" />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SkeletonLoader;
