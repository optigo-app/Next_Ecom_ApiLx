import React from 'react';
import './ProductSkelton.scss';
import { Skeleton, Card, CardContent, Grid, CardMedia, useMediaQuery } from '@mui/material';

const ProductListSkeleton = ({ fromPage }) => {
    const cardsArray = Array.from({ length: 6 }, (_, index) => index + 1);
    const isMobile = useMediaQuery('(max-width: 767px)');
    const isDesktop = useMediaQuery('(max-width: 1440px)');

    return (
        // <div className="elv_skeltonMainDiv_prodlistPage">
        //     {/* <Grid container spacing={2}>    
        //         <Grid sx={{display: isDesktop ? 'none' : 'block'}}  item xs={3}> */}
        //             <Card className='elv_skeltoncards'>
        //                 <CardContent>
        //                     <Skeleton animation="wave" variant="text" width={'80%'} height={20} style={{ marginBottom: '20px' }} />
        //                     <Skeleton animation="wave" variant="text" width={'60%'} height={20} />
        //                     <Skeleton animation="wave" variant="text" width={'80%'} height={20} style={{ marginBottom: '20px' }} />
        //                     <Skeleton animation="wave" variant="text" width={'60%'} height={20} />
        //                     <Skeleton animation="wave" variant="text" width={'80%'} height={20} style={{ marginBottom: '20px' }} />
        //                     <Skeleton animation="wave" variant="text" width={'60%'} height={20} />
        //                     <Skeleton animation="wave" variant="text" width={'80%'} height={20} style={{ marginBottom: '20px' }} />
        //                     <Skeleton animation="wave" variant="text" width={'60%'} height={20} />
        //                     <Skeleton animation="wave" variant="text" width={'80%'} height={20} style={{ marginBottom: '20px' }} />
        //                     <Skeleton animation="wave" variant="text" width={'60%'} height={20} />
        //                     <Skeleton animation="wave" variant="text" width={'80%'} height={20} style={{ marginBottom: '20px' }} />
        //                     <Skeleton animation="wave" variant="text" width={'60%'} height={20} />
        //                     <Skeleton animation="wave" variant="text" width={'80%'} height={20} style={{ marginBottom: '20px' }} />
        //                     <Skeleton animation="wave" variant="text" width={'60%'} height={20} />

        //                 </CardContent>
        //             </Card>
        //         {/* </Grid> */}
        //         {/* <Grid item xs={isDesktop ? 12 : 9} container spacing={2}>
        //             {cardsArray.map((item) => (
        //                 <Grid item xs={isMobile ? 6 : 4} key={item}>
        //                     <Card className={fromPage === "Prodlist" ? "elv_skeltoncards_listpage":'elv_skeltoncards'}>
        //                         <CardMedia style={{width:'100%', height:'40vh'}} className='elv_cardMainSkeleton'>
        //                             <Skeleton animation="wave" variant="rect" width={'100%'} height='40vh' />
        //                         </CardMedia>
        //                         <CardContent>
        //                             <Skeleton animation="wave" variant="text" width={'80%'} height={20} style={{ marginBottom: '10px' }} />
        //                             <Skeleton animation="wave" variant="text" width={'60%'} height={20} />
        //                         </CardContent>
        //                     </Card>
        //                 </Grid>
        //             ))}
        //         </Grid> */}

        //     {/* </Grid> */}
        // </div>

        <div style={{ width: '20%'}}>
            <Grid item xs={12}>
                    <Grid item xs={isMobile ? 6 : 4} >
                        <Card className='elv_skeltoncards'>
                            <CardContent className='elv_card_contnt'>
                                <Skeleton animation="wave" variant="text" width={'100%'} height={20} style={{ marginBottom: '20px' }} />
                                <Skeleton animation="wave" variant="text" width={'60%'} height={20} />
                                <Skeleton animation="wave" variant="text" width={'100%'} height={20} style={{ marginBottom: '20px' }} />
                                <Skeleton animation="wave" variant="text" width={'60%'} height={20} />
                                <Skeleton animation="wave" variant="text" width={'100%'} height={20} style={{ marginBottom: '20px' }} />
                                <Skeleton animation="wave" variant="text" width={'60%'} height={20} />
                                <Skeleton animation="wave" variant="text" width={'100%'} height={20} style={{ marginBottom: '20px' }} />
                                <Skeleton animation="wave" variant="text" width={'60%'} height={20} />
                                <Skeleton animation="wave" variant="text" width={'100%'} height={20} style={{ marginBottom: '20px' }} />
                                <Skeleton animation="wave" variant="text" width={'60%'} height={20} />
                                <Skeleton animation="wave" variant="text" width={'100%'} height={20} style={{ marginBottom: '20px' }} />
                                <Skeleton animation="wave" variant="text" width={'60%'} height={20} />
                                <Skeleton animation="wave" variant="text" width={'100%'} height={20} style={{ marginBottom: '20px' }} />
                                <Skeleton animation="wave" variant="text" width={'60%'} height={20} />

                            </CardContent>
                        </Card>
                    </Grid>
            </Grid>
        </div>
    );
};

export default ProductListSkeleton;
