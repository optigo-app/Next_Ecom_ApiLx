import React from 'react';
import './AlbumSkeleton.scss';
import { Skeleton, Card, Grid, CardMedia } from '@mui/material';

const AlbumSkeleton = ({ fromPage }) => {
    const cardsArray = Array.from({ length: 20 }, (_, index) => index + 1);
    return (
        <div className='album_SkeltenShow'>
            <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', width: '100% !important', marginTop: '40px' }}>
                {cardsArray.map((item) => (
                    <Grid

                        sx={{
                            xs: 6,
                            sm: 4,
                            md: 3,
                            lg: 2.4
                        }}
                        key={item}
                        className='proCat_album_skle_Main'
                    >
                        <Card className="proCat_lookbookcards_listpage">
                            <CardMedia style={{ width: '100%', height: '30vh' }} className='cardMainSkeleton'>
                                <Skeleton animation="wave" variant="rect" width={'100%'} height='40vh' style={{ backgroundColor: '#e8e8e86e' }} />
                            </CardMedia>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default AlbumSkeleton;
