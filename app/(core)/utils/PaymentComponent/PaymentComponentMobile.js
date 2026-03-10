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
    IconButton
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';

import { theme } from './Theme';
import usePaymentLogic from './PaymentLogic';
import OrderRemarkModal from '@/app/(core)/utils/Glob_Functions/OrderRemark/OrderRemark';
import EnhancedPaymentDialog from './PaymentDialog';

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
        isPloding,
    } = usePaymentLogic(storeinit);

    const { IsPriceShow } = storeinit;

    // Standard card styling for modern flat UI
    const cardStyle = {
        elevation: 0,
        sx: {
            borderRadius: 3,
            border: '1px solid #e0e0e0',
            overflow: 'hidden',
            bgcolor: '#ffffff'
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ bgcolor: '#f7f7f9', minHeight: '100vh', pt: 2, pb: 14, marginTop: top ?? "" }}>
                <Container maxWidth="sm" disableGutters sx={{ px: { xs: 2, sm: 3 } }}>
                    <Stack spacing={2.5}>

                        {/* 1. SHIPPING ADDRESS */}
                        <Paper {...cardStyle}>
                            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocationOnOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                        <Typography variant="subtitle1" fontWeight="700">
                                            Delivery Address
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="text"
                                        size="small"
                                        className='btnColorProCat'
                                        onClick={handleChangeAddr}
                                        sx={{ textTransform: 'none', fontWeight: 'bold' }}
                                    >
                                        Change
                                    </Button>
                                </Box>

                                {!isPloding ? (
                                    <Box sx={{ pl: 3 }}>
                                        <Typography variant="body2" fontWeight="600" sx={{ textTransform: 'capitalize', mb: 0.5 }}>
                                            {`${selectedAddrData?.shippingfirstname || ''} ${selectedAddrData?.shippinglastname || ''}`}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                            {selectedAddrData?.street}<br />
                                            {selectedAddrData?.city} - {selectedAddrData?.zip}<br />
                                            {selectedAddrData?.state}<br />
                                            Mobile: {selectedAddrData?.shippingmobile}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2, ml: 3.5 }} />
                                )}

                                <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

                          {/* Order Remarks */}
<Box
  sx={{
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 1,
  }}
>
  <Box
    sx={{
      flex: 1,
      minWidth: 0, 
    }}
  >
    {orderRemakdata ? (
      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight="bold"
        >
          Remark
        </Typography>

        <Typography
          variant="body2"
          sx={{
            wordBreak: "break-word",
            whiteSpace: "normal",
            overflowWrap: "anywhere",
          }}
        >
          "{orderRemakdata}"
        </Typography>
      </Box>
    ) : (
      <Typography variant="body2" color="text.secondary">
        No order remark added.
      </Typography>
    )}
  </Box>

  <Button
    size="small"
    onClick={handleOpen}
    startIcon={<EditOutlinedIcon />}
    sx={{
      textTransform: "none",
      flexShrink: 0,
    }}
  >
    {orderRemakdata ? "Edit" : "Add Note"}
  </Button>
</Box>

                            </CardContent>
                        </Paper>


                        {/* 2. PAYMENT METHOD */}
                        <Paper {...cardStyle}>
                            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                <Typography variant="subtitle1" fontWeight="700" gutterBottom>
                                    Payment Method
                                </Typography>
                                <RadioGroup
                                    value={selectedPayment}
                                    onChange={(e) => setSelectedPayment(e.target.value)}
                                >
                                    <Stack spacing={1.5} sx={{ mt: 1 }}>
                                        {paymentMethods.map((method) => (
                                            <Paper
                                                key={method.id}
                                                elevation={0}
                                                sx={{
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    border: selectedPayment == method.id ? '2px solid #000' : '1px solid #e0e0e0',
                                                    bgcolor: selectedPayment == method.id ? '#fafafa' : 'transparent',
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                <FormControlLabel
                                                    value={method.id}
                                                    control={<Radio sx={{ color: selectedPayment === method.id ? '#000' : 'grey', '&.Mui-checked': { color: '#000' } }} />}
                                                    label={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                            <Avatar sx={{ width: 32, height: 32, bgcolor: method.color }}>
                                                                <Box sx={{ color: '#fff', transform: 'scale(0.8)' }}>
                                                                    {method.icon}
                                                                </Box>
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="body2" fontWeight="600" sx={{ textTransform: 'capitalize', color: '#000' }}>
                                                                    {method.GatewayName}
                                                                </Typography>
                                                                {method.description && (
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {method.description}
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                        </Box>
                                                    }
                                                    sx={{ m: 0, width: '100%' }}
                                                />
                                            </Paper>
                                        ))}
                                    </Stack>
                                </RadioGroup>
                            </CardContent>
                        </Paper>

                        {/* 3. BILLING DETAILS (Replaced bulky inputs with compact text) */}
                        <Paper {...cardStyle}>
                            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                    <ReceiptLongOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                    <Typography variant="subtitle1" fontWeight="700">
                                        Billing Details
                                    </Typography>
                                </Box>
                                <Paper elevation={0} sx={{ bgcolor: '#f5f5f5', p: 1.5, borderRadius: 2 }}>
                                    <Typography variant="body2" fontWeight="600">
                                        {`${selectedAddrData?.shippingfirstname || ''} ${selectedAddrData?.shippinglastname || ''}`}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        {selectedAddrData?.street} <br />
                                        {selectedAddrData?.city}, {selectedAddrData?.state} <br />
                                        Mobile: {selectedAddrData?.shippingmobile}
                                    </Typography>
                                </Paper>
                            </CardContent>
                        </Paper>

                        {/* 4. ORDER SUMMARY */}
                        {IsPriceShow == 1 && (
                            <Paper {...cardStyle} sx={{ ...cardStyle.sx, mb: 2 }}>
                                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                    <Typography variant="subtitle1" fontWeight="700" gutterBottom>
                                        Order Summary
                                    </Typography>
                                    <Stack spacing={1.5} sx={{ mt: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                                            {!isPloding ? (
                                                <Typography variant="body2" fontWeight="600">{currCode} {formatter(taxAmmountData?.TotalAmount)}</Typography>
                                            ) : <Skeleton variant="text" width={60} />}
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">Estimated Tax</Typography>
                                            {!isPloding ? (
                                                <Typography variant="body2" fontWeight="600">{currCode} {formatter(taxAmmountData?.TaxAmount)}</Typography>
                                            ) : <Skeleton variant="text" width={60} />}
                                        </Box>
                                        <Divider/>
                                         <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary"> Total Amount</Typography>
                                            {!isPloding ? (
                                                <Typography variant="body2" fontWeight="600">{currCode} {formatter(Number((taxAmmountData?.TotalAmountWithTax)?.toFixed(3)))}</Typography>
                                            ) : <Skeleton variant="text" width={60} />}
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Paper>
                        )}
                        
                        {/* Error Message */}
                        {errorMsg && (
                            <Typography variant="body2" color="error" textAlign="center" sx={{ mt: 1, px: 2 }}>
                                {errorMsg}
                            </Typography>
                        )}
                    </Stack>
                </Container>

                <Paper 
                    elevation={8} 
                    sx={{ 
                        position: 'fixed', 
                        bottom: 0, 
                        left: 0, 
                        right: 0, 
                        zIndex: 1000, 
                        borderRadius: '20px 20px 0 0',
                        p: { xs: 2, sm: 3 },
                        pb: { xs: 'calc(env(safe-area-inset-bottom) + 16px)', sm: 3 },
                    }}
                >
                    <Container maxWidth="sm" disableGutters>
                        <Grid container spacing={2} alignItems="center">
                            {IsPriceShow == 1 && (
                                <Grid item size={{
                                    xs : 6
                                }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight="600">
                                        Total Amount
                                    </Typography>
                                    {!isPloding ? (
                                        <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1.2 }}>
                                            {currCode} {formatter(Number((taxAmmountData?.TotalAmountWithTax)?.toFixed(3)))}
                                        </Typography>
                                    ) : (
                                        <Skeleton variant="text" height={30} width="80%" />
                                    )}
                                </Grid>
                            )}
                            
                                <Grid item size={{
                                    xs : 6
                                }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    color="primary"
                                    onClick={handlePay}
                                    disabled={isloding}
                                    sx={{ 
                                        py: 1.5, 
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        fontWeight: '700',
                                        textTransform: 'none',
                                        boxShadow: 'none'
                                    }}
                                >
                                    {isloding ? (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            Loading <span className="loader"></span>
                                        </span>
                                    ) : (
                                        'Place Order'
                                    )}
                                </Button>
                            </Grid>
                        </Grid>
                    </Container>
                </Paper>
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
// "use client";

// import React from 'react';
// import {
//     Box,
//     Card,
//     CardContent,
//     Typography,
//     Radio,
//     RadioGroup,
//     FormControlLabel,
//     TextField,
//     Button,
//     Grid,
//     Divider,
//     Stack,
//     ThemeProvider,
//     Container,
//     Paper,
//     Avatar,
//     Link,
//     Skeleton,
// } from '@mui/material';

// import { theme } from './Theme';
// import usePaymentLogic from './PaymentLogic';
// import OrderRemarkModal from '@/app/(core)/utils/Glob_Functions/OrderRemark/OrderRemark';
// import EnhancedPaymentDialog from './PaymentDialog';

// export default function PaymentComponent({ bgcolor, textColor, top, storeinit }) {
//     const {
//         handlePay,
//         handleSaveInternal,
//         handleRemarkChangeInternal,
//         handleOpen,
//         handleClose,
//         handleChangeAddr,
//         open,
//         selectedPayment,
//         selectedAddrData,
//         taxAmmountData,
//         orderRemakdata,
//         orderRemark,
//         currCode,
//         formatter,
//         errorMsg,
//         selectedMode,
//         setSelectedPayment,
//         paymentMethods,
//         isloding,
//         isloder,
//         isPloding,
//     } = usePaymentLogic(storeinit);

//     const { IsPriceShow } = storeinit;

//     return (
//         <ThemeProvider theme={theme}>
//             <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 2, marginTop: top ?? "", paddingBottom: '80px' }}>
//                 <Container maxWidth="xl">
//                     <Grid container spacing={2}>
//                         <Grid item size={{ xs: 12, md: 6 }}>
//                             <Stack spacing={2}>
//                                 <Card sx={{
//                                     maxHeight: '500px',
//                                     overflow: 'auto'
//                                 }}>
//                                     <CardContent>
//                                         <Typography variant="h6" >
//                                             Payment Method
//                                         </Typography>
//                                         <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                                             Choose your preferred payment option
//                                         </Typography>
//                                         <RadioGroup
//                                             value={selectedPayment}
//                                             onChange={(e) => setSelectedPayment(e.target.value)}
                                            
//                                         >
//                                             <Grid container spacing={2}>
//                                                 {paymentMethods.map((method) => (
//                                                     <Grid item size={{ xs: 12, sm: 12, md: 12 }} key={method.id}>
//                                                         <Paper
//                                                             elevation={selectedPayment === method.id ? 3 : 1}
//                                                             sx={{
//                                                                 p: 2,
//                                                                 boxShadow: 'rgba(99, 99, 99, 0.1) 0px 2px 8px 0px',
//                                                                 transition: 'all 0.3s',
//                                                                 border: selectedPayment == method.id ? '1px solid #000' : '1px solid transparent',
//                                                                 '&:hover': {
//                                                                     bgcolor: 'action.hover',
//                                                                 },
//                                                                 bgcolor: selectedPayment == method.id ? '#f0f0f0' : 'transparent',
//                                                             }}
//                                                         >
//                                                             <FormControlLabel
//                                                                 value={method.id}
//                                                                 control={<Radio sx={{ color: selectedPayment === method.id ? '#7d7f85' : 'grey' }} />}
//                                                                 label={
//                                                                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                                                                         <Avatar sx={{ bgcolor: method.color }}>
//                                                                             <Box sx={{ color: '#fff' }}>
//                                                                                 {method.icon}
//                                                                             </Box>
//                                                                         </Avatar>
//                                                                         <Box>
//                                                                             <Typography variant="body1" fontWeight="bold" sx={{ textTransform: 'capitalize', color: '#000' }}>
//                                                                                 {method.GatewayName}
//                                                                             </Typography>
//                                                                             <Typography variant="body2" color="text.secondary">
//                                                                                 {method.description}
//                                                                             </Typography>
//                                                                         </Box>
//                                                                     </Box>
//                                                                 }
//                                                                 sx={{ m: 0, width: '100%' }}
//                                                             />
//                                                         </Paper>
//                                                     </Grid>
//                                                 ))}
//                                             </Grid>

//                                         </RadioGroup>

//                                     </CardContent>
//                                 </Card>

//                                 <Card>
//                                     <CardContent>
//                                         <Typography variant="h6" gutterBottom>
//                                             Billing Address
//                                         </Typography>
//                                         <Grid container spacing={3} sx={{ mt: 1 }}>
//                                             <Grid item size={{ xs: 12 }}>
//                                                 <label style={{ fontWeight: 'bold', color: '#7d7f85' }} htmlFor="fullName">Full Name</label>
//                                                 <TextField
//                                                     disabled
//                                                     readOnly
//                                                     fullWidth
//                                                     placeholder='Enter your full name'
//                                                     value={`${selectedAddrData?.shippingfirstname || ''} ${selectedAddrData?.shippinglastname || ''}`}
//                                                     variant="outlined"
//                                                 />
//                                             </Grid>
//                                             <Grid item size={{ xs: 12 }}>
//                                                 <label style={{ fontWeight: 'bold', color: '#7d7f85' }} htmlFor="email">Email</label>
//                                                 <TextField
//                                                     disabled
//                                                     readOnly
//                                                     fullWidth
//                                                     placeholder='Enter your address'
//                                                     value={selectedAddrData?.street}
//                                                     variant="outlined"
//                                                 />
//                                             </Grid>
//                                             <Grid item size={{ xs: 6 }}>
//                                                 <label style={{ fontWeight: 'bold', color: '#7d7f85' }} htmlFor="city">City</label>
//                                                 <TextField
//                                                     disabled
//                                                     readOnly
//                                                     fullWidth
//                                                     placeholder='Enter your city'
//                                                     value={selectedAddrData?.city}
//                                                     variant="outlined"
//                                                 />
//                                             </Grid>
//                                             <Grid item size={{ xs: 6 }}>
//                                                 <label style={{ fontWeight: 'bold', color: '#7d7f85' }} htmlFor="state">State</label>
//                                                 <TextField
//                                                     disabled
//                                                     readOnly
//                                                     fullWidth
//                                                     placeholder='Enter your state'
//                                                     value={selectedAddrData?.state}
//                                                     variant="outlined"
//                                                 />
//                                             </Grid>
//                                             <Grid item size={{ xs: 12 }}>
//                                                 <label style={{ fontWeight: 'bold', color: '#7d7f85' }} htmlFor="zip">Mobile No</label>
//                                                 <TextField
//                                                     disabled
//                                                     readOnly
//                                                     fullWidth
//                                                     placeholder='Enter your mobile number'
//                                                     value={selectedAddrData?.shippingmobile}
//                                                     variant="outlined"
//                                                 />
//                                             </Grid>
//                                         </Grid>
//                                     </CardContent>
//                                 </Card>
//                             </Stack>
//                         </Grid>

//                         <Grid item size={{ xs: 12, md: 6 }}>
//                             <Stack spacing={2}>
//                                 {IsPriceShow == 1 && <Card>
//                                     <CardContent>
//                                         <Typography variant="h6" gutterBottom>
//                                             Order Summary
//                                         </Typography>
//                                         <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//                                             Review your order details
//                                         </Typography>
//                                         <Stack spacing={2}>
//                                             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                                                 <Typography>Subtotal</Typography>
//                                                 {!isPloding ? (
//                                                     <Typography fontWeight="bold">{currCode} {formatter(taxAmmountData?.TotalAmount)}</Typography>
//                                                 ) :
//                                                     <Skeleton variant="text" height={30} width={100} />
//                                                 }
//                                             </Box>
//                                             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                                                 <Typography>Estimated Tax</Typography>
//                                                 {!isPloding ? (
//                                                     <Typography fontWeight="bold">{currCode} {formatter(taxAmmountData?.TaxAmount)}</Typography>
//                                                 ) :
//                                                     <Skeleton variant="text" height={30} width={100} />
//                                                 }
//                                             </Box>
//                                             <Divider />
//                                             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                                                 <Typography variant="h6">Total Amount</Typography>
//                                                 {!isPloding ? (
//                                                     <Typography variant="h6">
//                                                         {currCode} {formatter(Number((taxAmmountData?.TotalAmountWithTax)?.toFixed(3)))}
//                                                     </Typography>
//                                                 ) :
//                                                     <Skeleton variant="text" height={30} width={100} />
//                                                 }
//                                             </Box>
//                                         </Stack>
//                                     </CardContent>
//                                 </Card>}

//                                 <Card>
//                                     <CardContent>
//                                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
//                                             <Box>
//                                                 <Typography variant="h6" gutterBottom>
//                                                     Shipping Address
//                                                 </Typography>
//                                                 <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//                                                     Where should we deliver?
//                                                 </Typography>
//                                             </Box>
//                                             <Button
//                                                 variant="contained"
//                                                 size="small"
//                                                 className='btnColorProCat'
//                                                 onClick={handleChangeAddr}
//                                                 sx={{
//                                                     // bgcolor: bgcolor ? bgcolor : '',
//                                                     fontSize: {
//                                                         sm: '10px !important',
//                                                         md: '14px !important',
//                                                         xs: '10px !important',
//                                                     },
//                                                     // color: textColor,
//                                                     // '&:hover': {
//                                                     //     backgroundColor: bgcolor,
//                                                     // },
//                                                 }}
//                                             >
//                                                 Change Address
//                                             </Button>
//                                         </Box>
//                                         {!isPloding ? (
//                                             <Paper
//                                                 elevation={0}
//                                                 sx={{
//                                                     bgcolor: '#f5f5f5',
//                                                     p: 2,
//                                                     borderRadius: 2,
//                                                     mb: 2,
//                                                 }}
//                                             >
//                                                 <Typography variant="body1" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
//                                                     {`${selectedAddrData?.shippingfirstname || ''} ${selectedAddrData?.shippinglastname || ''}`}

//                                                 </Typography>
//                                                 <Typography variant="body2" color="text.secondary" >
//                                                     {selectedAddrData?.street}
//                                                     <br />
//                                                     {selectedAddrData?.city}-{selectedAddrData?.zip}
//                                                     <br />
//                                                     {selectedAddrData?.state}
//                                                     <br />
//                                                     {selectedAddrData?.shippingmobile}
//                                                 </Typography>
//                                             </Paper>
//                                         ) :
//                                             <Skeleton variant="image" height="120px" width='100%' />
//                                         }
//                                         <>
//                                             <Link
//                                                 className="proCat_addorderRemarkbtn"
//                                                 variant="body2"
//                                                 onClick={handleOpen}
//                                                 sx={{ color: '#000', display: 'flex', justifyContent: 'end', cursor: 'pointer' }}
//                                             >
//                                                 {orderRemakdata == "" ? "Add order Remark" : "Update order Remark"}
//                                             </Link>
//                                         </>
//                                         {orderRemakdata &&
//                                             <>
//                                                 <label style={{ fontWeight: 'bold', color: '#7d7f85' }} htmlFor="orderRemark">Order Remarks</label>
//                                                 <Paper
//                                                     elevation={0}
//                                                     sx={{
//                                                         bgcolor: '#f5f5f5',
//                                                         p: 2,
//                                                         borderRadius: 2,
//                                                         mb: 2,
//                                                     }}
//                                                 >
//                                                     <Typography variant="body2" color="text.secondary">
//                                                         {orderRemakdata}
//                                                     </Typography>
//                                                 </Paper>

//                                             </>
//                                         }
//                                     </CardContent>
//                                 </Card>
//                                 <Button
//                                     variant="contained"
//                                     size="large"
//                                     fullWidth
//                                     sx={{
//                                         py: 1.5, fontSize: '1.1rem'
//                                         ,
//                                         // bgcolor: bgcolor ? bgcolor : '',
//                                         // color: textColor,
//                                         // '&:hover': {
//                                         //     backgroundColor: bgcolor,
//                                         // },
//                                     }}
//                                     onClick={handlePay}
//                                     className='proCat_payOnAccountBtn btnColorProCat'
//                                     disabled={isloding}
//                                 >
//                                     {isloding ? 'LOADING...' : 'Place Order'}
//                                     {isloding && <span className="loader"></span>}

//                                 </Button>
//                                 <Typography variant="body2" color="error" textAlign="center">{errorMsg}</Typography>
//                             </Stack>
//                         </Grid>
//                     </Grid>
//                 </Container>
//                 <EnhancedPaymentDialog
//                     open={isloding}
//                     onClose={isloding}
//                     mode={selectedMode}
//                 />

//                 <OrderRemarkModal
//                     open={open}
//                     onClose={handleClose}
//                     remark={orderRemark}
//                     onRemarkChange={handleRemarkChangeInternal}
//                     onSave={handleSaveInternal}
//                 />
//             </Box>
//         </ThemeProvider>
//     );
// }
