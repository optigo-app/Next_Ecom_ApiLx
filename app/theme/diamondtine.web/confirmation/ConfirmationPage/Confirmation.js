"use client";

import React, { useEffect, useState } from 'react'
import "./confirmation.scss"
import { FaPrint } from 'react-icons/fa';
import { handelOpenMenu } from '@/app/(core)/utils/Glob_Functions/Cart_Wishlist/handleOpenMenu';
import { GetCountAPI } from '@/app/(core)/utils/API/GetCount/GetCountAPI';
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
import { useStore } from '@/app/(core)/contexts/StoreProvider';

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