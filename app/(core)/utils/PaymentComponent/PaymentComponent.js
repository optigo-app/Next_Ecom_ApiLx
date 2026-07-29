"use client";

import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    TextField,
    Button,
    Grid,
    Divider,
    Stack,
    ThemeProvider,
    Container,
    Paper,
    Avatar,
    Link,
    Skeleton,
} from '@mui/material';

import { theme } from './Theme';
import usePaymentLogic from './PaymentLogic';
import OrderRemarkModal from '@/app/(core)/utils/Glob_Functions/OrderRemark/OrderRemark';
import EnhancedPaymentDialog from './PaymentDialog';
// import './Payment.scss'

export default function PaymentComponent({ bgcolor, textColor, top, storeinit }) {
    const {
        handlePay,
        handleSaveInternal,
        handleRemarkChangeInternal,
        handleOpen,
        handleClose,
        handleChangeAddr,
        open,
        selectedPayment,
        selectedAddrData,
        taxAmmountData,
        orderRemakdata,
        orderRemark,
        currCode,
        formatter,
        errorMsg,
        selectedMode,
        setSelectedPayment,
        paymentMethods,
        isloding,
        isloder,
        isPloding,
    } = usePaymentLogic(storeinit);

    const { IsPriceShow } = storeinit;

    
    console.log("TCL: PaymentComponent ->selectedAddrData ",selectedAddrData )

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6, marginTop: top ?? "" }}>
                <Container maxWidth="xl">
                    {/* <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
                        Complete Your Purchase
                    </Typography> */}
                    <Grid container spacing={2}>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <Stack spacing={2}>
                                <Card sx={{
                                    maxHeight: '500px',
                                    overflow: 'auto'
                                }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Payment Method
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                            Choose your preferred payment option
                                        </Typography>
                                        <RadioGroup
                                            value={selectedPayment}
                                            onChange={(e) => setSelectedPayment(e.target.value)}
                                        >
                                            <Grid container spacing={2}>
                                                {paymentMethods.map((method) => (
                                                    <Grid item size={{ xs: 12, sm: 12, md: 12 }} key={method.id}>
                                                        <Paper
                                                            elevation={selectedPayment === method.id ? 3 : 1}
                                                            sx={{
                                                                p: 2,
                                                                boxShadow: 'rgba(99, 99, 99, 0.1) 0px 2px 8px 0px',
                                                                transition: 'all 0.3s',
                                                                border: selectedPayment == method.id ? '1px solid #000' : '1px solid transparent',
                                                                '&:hover': {
                                                                    bgcolor: 'action.hover',
                                                                },
                                                                bgcolor: selectedPayment == method.id ? '#f0f0f0' : 'transparent',
                                                            }}
                                                        >
                                                            <FormControlLabel
                                                                value={method.id}
                                                                control={<Radio sx={{ color: selectedPayment === method.id ? '#7d7f85' : 'grey' }} />}
                                                                label={
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                        <Avatar sx={{ bgcolor: method.color }}>
                                                                            <Box sx={{ color: '#fff' }}>
                                                                                {method.icon}
                                                                            </Box>
                                                                        </Avatar>
                                                                        <Box>
                                                                            <Typography variant="body1" fontWeight="bold" sx={{ textTransform: 'capitalize', color: '#000' }}>
                                                                                {method.GatewayName}
                                                                            </Typography>
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                {method.description}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                }
                                                                sx={{ m: 0, width: '100%' }}
                                                            />
                                                        </Paper>
                                                    </Grid>
                                                ))}
                                            </Grid>

                                        </RadioGroup>

                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Billing Address
                                        </Typography>
                                        <Grid container spacing={3} sx={{ mt: 1 }}>
                                            <Grid item size={{ xs: 12 }}>
                                                <label style={{ fontWeight: 'bold', color: '#7d7f85' }} htmlFor="fullName">Full Name</label>
                                                <TextField
                                                    disabled
                                                    readOnly
                                                    fullWidth
                                                    placeholder='Enter your full name'
                                                    value={`${selectedAddrData?.shippingfirstname || ''} ${selectedAddrData?.shippinglastname || ''}`}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item size={{ xs: 12 }}>
                                                <label style={{ fontWeight: 'bold', color: '#7d7f85' }} htmlFor="email">Street</label>
                                                <TextField
                                                    disabled
                                                    readOnly
                                                    fullWidth
                                                    placeholder='Enter your address'
                                                    value={selectedAddrData?.street}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item size={{ xs: 6 }}>
                                                <label style={{ fontWeight: 'bold', color: '#7d7f85' }} htmlFor="city">City</label>
                                                <TextField
                                                    disabled
                                                    readOnly
                                                    fullWidth
                                                    placeholder='Enter your city'
                                                    value={selectedAddrData?.city}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item size={{ xs: 6 }}>
                                                <label style={{ fontWeight: 'bold', color: '#7d7f85' }} htmlFor="state">State</label>
                                                <TextField
                                                    disabled
                                                    readOnly
                                                    fullWidth
                                                    placeholder='Enter your state'
                                                    value={selectedAddrData?.state}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item size={{ xs: 12 }}>
                                                <label style={{ fontWeight: 'bold', color: '#7d7f85' }} htmlFor="zip">Mobile No</label>
                                                <TextField
                                                    disabled
                                                    readOnly
                                                    fullWidth
                                                    placeholder='Enter your mobile number'
                                                    value={selectedAddrData?.shippingmobile}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Stack>
                        </Grid>

                        <Grid item size={{ xs: 12, md: 6 }}>
                            <Stack spacing={2}>
                                {IsPriceShow == 1 && <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Order Summary
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                            Review your order details
                                        </Typography>
                                        <Stack spacing={2}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography>Subtotal</Typography>
                                                {!isPloding ? (
                                                    <Typography fontWeight="bold">{currCode} {formatter(taxAmmountData?.TotalAmount)}</Typography>
                                                ) :
                                                    <Skeleton variant="text" height={30} width={100} />
                                                }
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography>Estimated Tax</Typography>
                                                {!isPloding ? (
                                                    <Typography fontWeight="bold">{currCode} {formatter(taxAmmountData?.TaxAmount)}</Typography>
                                                ) :
                                                    <Skeleton variant="text" height={30} width={100} />
                                                }
                                            </Box>
                                            <Divider />
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="h6">Total Amount</Typography>
                                                {!isPloding ? (
                                                    <Typography variant="h6">
                                                        {currCode} {formatter(Number((taxAmmountData?.TotalAmountWithTax)?.toFixed(3)))}
                                                    </Typography>
                                                ) :
                                                    <Skeleton variant="text" height={30} width={100} />
                                                }
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>}

                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <Box>
                                                <Typography variant="h6" gutterBottom>
                                                    Shipping Address
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                                    Where should we deliver?
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                className='btnColorProCat'
                                                onClick={handleChangeAddr}
                                                sx={{
                                                    bgcolor: bgcolor ? bgcolor : '',
                                                    fontSize: {
                                                        sm: '10px !important',
                                                        md: '14px !important',
                                                        xs: '10px !important',
                                                    },
                                                    // color: textColor,
                                                    // '&:hover': {
                                                    //     backgroundColor: bgcolor,
                                                    // },
                                                }}
                                            >
                                                Change Address
                                            </Button>
                                        </Box>
                                        {!isPloding ? (
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    bgcolor: '#f5f5f5',
                                                    p: 2,
                                                    borderRadius: 2,
                                                    mb: 2,
                                                }}
                                            >
                                                <Typography variant="body1" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                                                    {`${selectedAddrData?.shippingfirstname || ''} ${selectedAddrData?.shippinglastname || ''}`}

                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" >
                                                    {selectedAddrData?.street}
                                                    <br />
                                                    {selectedAddrData?.city}-{selectedAddrData?.zip}
                                                    <br />
                                                    {selectedAddrData?.state}
                                                    <br />
                                                    {selectedAddrData?.shippingmobile}
                                                </Typography>
                                            </Paper>
                                        ) :
                                            <Skeleton variant="image" height="120px" width='100%' />
                                        }
                                        <>
                                            <Link
                                                className="proCat_addorderRemarkbtn"
                                                variant="body2"
                                                onClick={handleOpen}
                                                sx={{ color: '#000', display: 'flex', justifyContent: 'end', cursor: 'pointer' }}
                                            >
                                                {orderRemakdata == "" ? "Add order Remark" : "Update order Remark"}
                                            </Link>
                                        </>
                                        {orderRemakdata &&
                                            <>
                                                <label style={{ fontWeight: 'bold', color: '#7d7f85' }} htmlFor="orderRemark">Order Remarks</label>
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        bgcolor: '#f5f5f5',
                                                        p: 2,
                                                        borderRadius: 2,
                                                        mb: 2,
                                                    }}
                                                >
                                                    <Typography variant="body2" color="text.secondary">
                                                        {orderRemakdata}
                                                    </Typography>
                                                </Paper>

                                            </>
                                        }
                                    </CardContent>
                                </Card>
                                <Button
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    sx={{
                                        py: 1.5, fontSize: '1.1rem'
                                        ,
                                        bgcolor: bgcolor ? bgcolor : '',
                                        // color: textColor,
                                        // '&:hover': {
                                        //     backgroundColor: bgcolor,
                                        // },
                                    }}
                                    onClick={handlePay}
                                    className='proCat_payOnAccountBtn btnColorProCat'
                                    disabled={isloding}
                                >
                                    {isloding ? 'LOADING...' : 'Place Order'}
                                    {isloding && <span className="loader"></span>}

                                </Button>
                                <Typography variant="body2" color="error" textAlign="center">{errorMsg}</Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
                <EnhancedPaymentDialog
                    open={isloding}
                    onClose={isloding}
                    mode={selectedMode}
                />

                <OrderRemarkModal
                    open={open}
                    onClose={handleClose}
                    remark={orderRemark}
                    onRemarkChange={handleRemarkChangeInternal}
                    onSave={handleSaveInternal}
                />
            </Box>
        </ThemeProvider>
    );
}
