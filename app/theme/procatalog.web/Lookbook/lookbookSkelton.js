import { Box, Divider, Grid, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';

const LookbookSkeleton = ({ param }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <div>
            {param === 1 &&
                // <Box
                //     sx={{
                //         display: 'flex',
                //         justifyContent: 'center',
                //         alignItems: 'center',
                //         p: 2,
                //     }}
                // >
                //     <Grid container spacing={2}>
                //         <Grid item xs={12} md={6} >
                //             <Skeleton variant="rectangular" width="100%" height={600} animation="wave" sx={{ bgcolor: 'var(--skeleton-bg-color)' }} />
                //             <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                //                 {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, index) => (
                //                     <Skeleton
                //                         key={index}
                //                         variant="rectangular"
                //                         animation="wave"
                //                         width={60}
                //                         height={60}
                //                         sx={{ mx: 1, borderRadius: '5px', bgcolor: 'var(--skeleton-bg-color)', }}
                //                     />
                //                 ))}
                //             </Box>
                //         </Grid>

                //         {/* Product Details Section */}
                //         <Grid item xs={12} md={6}>
                //             <Box sx={{ p: 2 }}>
                //                 <Skeleton width={200} height={40} animation="wave" sx={{ bgcolor: 'var(--skeleton-bg-color)' }} />
                //                 <Divider sx={{ my: 2 }} />
                //                 <Skeleton width="100%" height={80} animation="wave" sx={{ bgcolor: 'var(--skeleton-bg-color)' }} />
                //                 <Skeleton width="100%" height={80} animation="wave" sx={{ bgcolor: 'var(--skeleton-bg-color)' }} />
                //                 <Skeleton width={100} height={40} animation="wave" sx={{ bgcolor: 'var(--skeleton-bg-color)' }} />
                //                 <Skeleton variant="rectangular" width={200} height={50} animation="wave" sx={{ bgcolor: 'var(--skeleton-bg-color)' }} />
                //             </Box>
                //         </Grid>
                //     </Grid>
                // </Box>
                <Box p={2}>
                    {/* Top Bar with Buttons */}
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={4}
                        flexWrap="wrap"
                        gap={2}
                    >
                        {/* SHOW FILTER Button */}
                        <Skeleton variant="rectangular" width={120} height={40} />

                        {/* Set View Button with 3 View Icons */}
                        <Box display="flex" alignItems="center" gap={1}>
                            <Skeleton variant="rectangular" width={100} height={40} />
                            <Skeleton variant="rectangular" width={30} height={30} />
                            <Skeleton variant="rectangular" width={30} height={30} />
                            <Skeleton variant="rectangular" width={30} height={30} />
                        </Box>
                    </Box>

                    <Grid container spacing={4}>
                        {/* Left Side - Image and Thumbnails */}
                        <Grid item size={{xs:12, md:7}}>
                            <Skeleton variant="rectangular" width="100%" height={isMobile ? 300 : 500} />

                            {/* Thumbnails */}
                            <Box mt={2} display="flex" gap={1} overflow="auto">
                                {[...Array(10)].map((_, index) => (
                                    <Skeleton key={index} variant="rectangular" width={60} height={60} />
                                ))}
                            </Box>
                        </Grid>

                        {/* Right Side - Product Details */}
                        <Grid item size={{xs:12, md:5}}>
                            <Skeleton variant="text" width="60%" height={40} />

                            {/* Product List */}
                            {[...Array(3)].map((_, index) => (
                                <Box key={index} display="flex" gap={2} mt={3}>
                                    <Skeleton variant="circular" width={60} height={60} />
                                    <Box flex={1}>
                                        <Skeleton variant="text" width="80%" height={20} />
                                        <Skeleton variant="text" width="60%" height={20} />
                                        <Skeleton variant="text" width="40%" height={20} />
                                    </Box>
                                </Box>
                            ))}

                            {/* Total + Button */}
                            <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
                                <Skeleton variant="text" width="40%" height={30} />
                                <Skeleton variant="rectangular" width={120} height={40} />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            }
            {param === 2 &&
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 2,
                    }}
                >
                    <Grid container spacing={2}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, index) => (
                            <Grid item size={{xs:12, md:6 ,sm:6}} key={index}>
                                <Box
                                    sx={{
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        p: 2,
                                    }}
                                >
                                    <Skeleton variant="rectangular" width="100%" height={300} animation="wave" sx={{ bgcolor: 'var(--skeleton-bg-color)' }} />
                                    <Skeleton variant="text" width="80%" sx={{ my: 1, bgcolor: 'var(--skeleton-bg-color)' }} />
                                    <Skeleton variant="text" width="60%" sx={{ bgcolor: 'var(--skeleton-bg-color)' }} />
                                    <Skeleton variant="text" width="40%" sx={{ bgcolor: 'var(--skeleton-bg-color)' }} />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            }
            {param === 3 &&
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 2,
                    }}
                >
                    <Grid container spacing={2}>
                        {[1, 2, 3, 4].map((_, index) => (
                            <Grid item size={{xs:12, md:12 ,sm:12}} key={index}>
                                <Box
                                    sx={{
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        p: 2,
                                    }}
                                >
                                    <Skeleton variant="rectangular" width="100%" height={300} animation="wave" sx={{ bgcolor: 'var(--skeleton-bg-color)' }} />
                                    <Skeleton variant="text" width="80%" sx={{ my: 1, bgcolor: 'var(--skeleton-bg-color)' }} />
                                    <Skeleton variant="text" width="60%" sx={{ bgcolor: 'var(--skeleton-bg-color)' }} />
                                    <Skeleton variant="text" width="40%" sx={{ bgcolor: 'var(--skeleton-bg-color)' }} />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            }
            <style jsx>{`
                :root {
                    --skeleton-bg-color: #f6f6f6;
                }
            `}</style>
        </div>
    );
}

export default LookbookSkeleton;
