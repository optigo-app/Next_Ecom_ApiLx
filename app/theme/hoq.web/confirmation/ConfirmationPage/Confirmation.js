"use client";

import React, { useEffect, useState } from 'react'
import "./confirmation.scss"
import { FaPrint } from 'react-icons/fa';
import { handelOpenMenu } from '@/app/(core)/utils/Glob_Functions/Cart_Wishlist/handleOpenMenu';
import { GetCountAPI } from '@/app/(core)/utils/API/GetCount/GetCountAPI';
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
import { useStore } from '@/app/(core)/contexts/StoreProvider';
import { useConfetti } from '@/app/(core)/hooks/useConfetti';

const Confirmation = ({ storeinit }) => {
    const location = useNextRouterLikeRR();
    const navigate = location.push;
    const { triggerConfetti } = useConfetti();

    const ThankYouImage = "/thankyou.svg";

    const { setCartCountNum } = useStore();

    const [orderNo, setOrderNo] = useState();
    const storeInit = storeinit;
    const setCartCountVal = setCartCountNum;

    useEffect(() => {
        setTimeout(() => {
            triggerConfetti();
        }, 300)
    }, [])

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

        const handlePopState = (event) => {
            event.preventDefault();
            navigate('/cartPage');
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [location?.key])

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
        <div className="hoq_confirMaindiv">
            <div className="hoqMo_confirSecondMaindiv">
                <div className="hoqMo_thankYouContainer">
                    <div className="hoqMo_thankYouContent">
                        <div className="hoqMo_thankYouMessage">
                            <img src={ThankYouImage} className="hoq_orderCnfThankyouImage" />
                        </div>
                        <div className="orderNumber">
                            <p>
                                Your Order number is <span>{orderNo}</span>
                            </p>
                        </div>
                        <button
                            className="hoqMo_continueShoppingBtn"
                            onClick={handleNavigate}
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Confirmation;