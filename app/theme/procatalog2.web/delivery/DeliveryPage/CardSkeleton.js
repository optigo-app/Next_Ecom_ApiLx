import React from 'react';
import './Delivery.modul.scss'
import { Box, Skeleton, Card, CardContent } from '@mui/material';

const CardSkeleton = () => {
  const skeletonArray = new Array(4).fill(0);

  return (
    <Box className="elv_addCardSkeltonMainBox">
      {skeletonArray.map((_, index) => (
        <Card className='elv_addCardSkelton' key={index}>
          <Skeleton className='elv_addCardSkelton' variant="rectangular" height={280} animation="wave" />
        </Card>
      ))}
    </Box>
  );
};

export default CardSkeleton;
