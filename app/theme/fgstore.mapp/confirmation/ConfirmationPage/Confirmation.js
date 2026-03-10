"use client";

import React, { useEffect, useState } from 'react'
import "./confirmation.scss"
import { FaPrint } from 'react-icons/fa';
import { handelOpenMenu } from '@/app/(core)/utils/Glob_Functions/Cart_Wishlist/handleOpenMenu';
import { GetCountAPI } from '@/app/(core)/utils/API/GetCount/GetCountAPI';
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
import { useStore } from '@/app/(core)/contexts/StoreProvider';
import {
    Container,
    Paper,
    Box,
    Typography,
    Button,
    Stack
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";

const Confirmation = ({ storeinit }) => {
    const location = useNextRouterLikeRR();
    const navigate = location.push;

    const ThankYouImage = "/thankyou.svg";

    const { setCartCountNum } = useStore();

    const [orderNo, setOrderNo] = useState();
    const storeInit = storeinit;
    const setCartCountVal = setCartCountNum;

    // for cart count
    useEffect(() => {
        const fetchCartCount = async () => {
            try {
                const cartCount = await GetCountAPI();
                setCartCountVal(cartCount?.cartcount);
            } catch (error) {
                console.error("Error fetching cart count:", error);
            }
        };

        fetchCartCount();
    }, []);


    const setCSSVariable = () => {
        const backgroundColor = storeInit?.IsPLW == 1 ? "#c4cfdb" : "#c0bbb1";
        document.documentElement.style.setProperty(
            "--background-color",
            backgroundColor
        );
    };

    useEffect(() => {
        setCSSVariable();
        let orderNo = sessionStorage.getItem('orderNumber')
        setOrderNo(orderNo)
    }, [])

    const handleNavigate = async () => {
        const url = await handelOpenMenu()
        if (url) {
            navigate(url)
        } else {
            navigate('/')
        }
        sessionStorage.removeItem("TotalPriceData");
    }

    return <>
        <Container maxWidth="sm"
            sx={{
                minHeight: "100svh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    borderRadius: 3,
                    textAlign: "center",
                }}
            >
                <Stack spacing={3} alignItems="center">

                    <Box
                        component="img"
                        src={ThankYouImage}
                        alt="Thank you"
                        sx={{
                            width: 250,
                            height: "auto"
                        }}
                    />

                    <Typography variant="h6" fontWeight={600}>
                        Thank you for your order
                    </Typography>

                    <Typography variant="body1" color="text.secondary">
                        Your order number is{" "}
                        <Box component="span" sx={{ fontWeight: 600 }}>
                            {orderNo}
                        </Box>
                    </Typography>

                    {storeInit?.IsPLW != 0 && (
                        <Stack spacing={1} alignItems="center">
                            <Button
                                variant="outlined"
                                startIcon={<PrintIcon />}
                                sx={{
                                    textTransform: "none",
                                    borderRadius: 2
                                }}
                            >
                                Print
                            </Button>

                            <Typography variant="caption" color="text.secondary">
                                Coming soon...
                            </Typography>
                        </Stack>
                    )}

                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleNavigate}
                        sx={{
                            mt: 2,
                            px: 4,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 500
                        }}
                    >
                        Continue Shopping
                    </Button>

                </Stack>
            </Paper>
        </Container>
    </>

    return (
        <div className='smr_confirMaindiv'>
            <div className='smr_confirSecondMaindiv'>
                <div className="thankYouContainer">
                    <div className="thankYouContent">
                        <div className="thankYouMessage">
                            <img src={ThankYouImage} className='smr_orderCnfThankyouImage' />
                        </div>
                        <div className="orderNumber">
                            <p>Your Order number is <span>{orderNo}</span></p>
                        </div>
                        {storeInit?.IsPLW != 0 &&
                            <div className='smr_plwlPrintDiv'>
                                <button className="icon-button">
                                    <FaPrint className="icon" />
                                    Print
                                </button>
                                <p>Comming soon...</p>
                            </div>
                        }
                        <button className="smr_continueShoppingBtns" onClick={handleNavigate}>Continue Shopping</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Confirmation;