// PaymentLogic.js
"use client";

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// import { useRecoilValue, useSetRecoilState } from 'recoil';
// import { CartCount, smr_loginState } from '../../../Recoil/atom';
import { handlePaymentAPI } from '@/app/(core)/utils/API/OrderFlow/PlaceOrderAPI';
import { fetchEstimateTax } from '@/app/(core)/utils/API/OrderFlow/GetTax';
import { fetchRazorPayData } from '@/app/(core)/utils/API/OrderFlow/RazorPayAPI';
import { handleVerifySignature } from '@/app/(core)/utils/API/OrderFlow/RazorPayVerificationAPI';
import { handleOrderRemark } from '@/app/(core)/utils/API/OrderRemarkAPI/OrderRemarkAPI';
import Cookies from "js-cookie";
import { formatter } from '@/app/(core)/utils/Glob_Functions/GlobalFunction';

// for paymentIcon
import { SiPaytm } from "react-icons/si";
import { SiPhonepe } from "react-icons/si";
import { BsPaypal } from "react-icons/bs";
import { FaStripeS } from "react-icons/fa";
import { BsCreditCard } from "react-icons/bs";
import { BsCreditCard2Front } from "react-icons/bs";
import { SiRazorpay } from "react-icons/si";
import PaymentsIcon from '@mui/icons-material/Payments';
import { CreditCard, LocalShipping } from '@mui/icons-material';
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
import { useStore } from '@/app/(core)/contexts/StoreProvider';

const usePaymentLogic = (storeinit) => {
    const location = useNextRouterLikeRR();
    const navigate = location.push;

    const { loginUserDetail, islogin: isLogin } = useStore();

    const [isloding, setIsloding] = useState(false);
    const [isloder, setIsloder] = useState(false);
    const [isPloding, setIsPloding] = useState(false);
    const [selectedMode, setSelectedMode] = useState(0);
    const [selectedAddrData, setSelectedAddrData] = useState(null);
    const [taxAmmountData, setTaxAmountData] = useState(null);
    const [orderRemark, setOrderRemark] = useState('');
    const [orderRemakdata, setOrderRemarkData] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const islogin = isLogin;
    const loginInfo = loginUserDetail;
    const storeInit = storeinit;
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
    let currCode = loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode


    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // for paymentIcon
    const paymentMethodsInfo = {
        1: { icon: <BsPaypal />, description: 'Pay securely with PayPal', color: '#003087' },
        2: { icon: <BsCreditCard2Front />, description: 'Pay with EBS', color: '#0051BA' },
        3: { icon: <LocalShipping />, description: 'Pay when you receive', color: '#FFD700' },
        4: { icon: <SiPaytm />, description: 'Pay using Paytm wallet', color: '#02b3ea' },
        5: { icon: <PaymentsIcon />, description: 'Pay with Eazypay', color: '#5C6BC0' },
        6: { icon: <CreditCard />, description: 'Pay using PayUMoney', color: '#2196F3' },
        7: { icon: <BsCreditCard />, description: 'Pay with Payeezy', color: '#FF4081' },
        8: { icon: <FaStripeS />, description: 'International payments via Stripe', color: '#6058f7' },
        9: { icon: <SiPhonepe />, description: 'Pay with PhonePe', color: '#5c249a' },
        10: { icon: <SiRazorpay />, description: 'Pay with Razorpay', color: '#3395ff' },
    };

    useEffect(() => {
        const masterpaymentData = sessionStorage?.getItem("payMaster");
        if (masterpaymentData) {
            try {
                const parsedData = JSON.parse(masterpaymentData);
                const paymentMethodsWithIndex = parsedData
                    .filter(method => method.isactive === 1)
                    .map((method) => {
                        const paymentInfo = paymentMethodsInfo[method.id];
                        return {
                            ...method,
                            icon: paymentInfo?.icon,
                            color: paymentInfo?.color,
                            description: paymentInfo?.description,
                            index: getPaymentMethodIndex(method.id),
                        };
                    })
                    .sort((a, b) => a.index - b.index);

                setPaymentMethods(paymentMethodsWithIndex);
            } catch (error) {
                console.error("Error parsing payment methods:", error);
            }
        }


    }, []);

    // for payment display order
    const getPaymentMethodIndex = (id) => {
        switch (id) {
            case 10: return 1; // Razorpay
            case 9: return 2;  // PhonePe
            case 4: return 3;  // Paytm
            case 8: return 4;  // Stripe
            case 1: return 5;  // PayPal
            case 2: return 6;  // EBS
            case 3: return 10; // Payeezy
            case 5: return 8;  // Eazypay
            case 6: return 9;  // PayUMoney
            case 7: return 7;  // Offline
            default: return null; // Default for any other payment methods
        }
    };

   // for remark
    useEffect(() => {
        const GetOrderRemark = sessionStorage.getItem('orderRemark')
        if (GetOrderRemark) {
            setOrderRemarkData(GetOrderRemark)
            setOrderRemark(GetOrderRemark)
        }
    }, [])

    // for tax amount
    useEffect(() => {
        const selectedAddressData = JSON.parse(sessionStorage.getItem('selectedAddressId')) ?? "";
        setSelectedAddrData(selectedAddressData);
        setIsPloding(true);
        const fetchData = async () => {
            try {
                const taxData = await fetchEstimateTax();
                setTaxAmountData(taxData[0]);
            } catch (error) {
                console.error('Error fetching tax data:', error);
            } finally {
                setIsPloding(false);
            }
            const selectedAddressData = JSON.parse(sessionStorage.getItem('selectedAddressId')) ?? "";
            setSelectedAddrData(selectedAddressData);
        };

        fetchData();
    }, []);

    // for remark
    const handleRemarkChangeInternal = (e) => {
        setOrderRemark(e.target.value);
    };

    // for remark
    // const handleOrderRemarkFun = async (trimmedRemark) => {
    //     try {
    //         const response = await handleOrderRemark(trimmedRemark);
    //         const resStatus = response?.Data?.rd[0];
    //         if (resStatus?.stat === 1) {
    //             setOrderRemarkData(resStatus?.orderremarks);
    //             sessionStorage.setItem('orderRemark', trimmedRemark ?? "");
    //         }
    //     } catch (error) {
    //         console.error("Error:", error);
    //     }
    // };
     const handleOrderRemarkFun = async (trimmedRemark) => {
        try {
            const response = await handleOrderRemark(trimmedRemark);
            const resStatus = response?.Data?.rd[0];
            if (resStatus?.stat === 1) {
                setOrderRemarkData(resStatus?.orderremarks);
                sessionStorage.setItem('orderRemark', resStatus?.orderremarks ?? "");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };


    // for remark
    const handleSaveInternal = () => {
        const trimmedRemark = orderRemark?.trim();
        handleOrderRemarkFun(trimmedRemark);
        handleClose();
    };

    // for razorpay payment
    const handleRazorpayPayment = async (razorPayData, visiterId, taxAmmountData) => {
        try {
            setErrorMsg('')
            const orderResponse = await fetchRazorPayData(razorPayData);
            if (orderResponse?.Status == 401) {
                setErrorMsg(orderResponse?.Message)
                setTimeout(() => {
                    setErrorMsg('')
                }, 5000);
                setIsloding(false);
                return;
            }
            const orderId = orderResponse?.Attributes?.id;
            setSelectedMode(2);
            if (orderId) {
                const options = {
                    key: loginInfo?.razorpay_key ?? "",
                    amount: Math.round(parseFloat(taxAmmountData?.TotalAmountWithTax) * 100),
                    currency: loginInfo?.CurrencyCode ?? "",
                    name: storeInit?.companyname ?? "Company",
                    image: storeInit?.favicon,
                    order_id: orderId ?? "",
                    prefill: {
                        name: `${razorPayData?.addressData?.shippingfirstname} ${razorPayData?.addressData?.shippinglastname}`,
                        email: loginInfo?.userId ?? "",
                        contact: loginInfo?.mobileno ?? "",
                    },
                    handler: async function (paymentResponse) {
                        await verifyAndProcessPayment(paymentResponse, visiterId, loginInfo, taxAmmountData);
                    },
                    modal: {
                        ondismiss: function () {
                            console.log("Payment cancelled by user.");
                            setIsloding(false);
                        },
                    },
                    theme: { color: '#98b8d94a' },
                };
                const pay = new window.Razorpay(options);
                pay.open();
            }
        } catch (error) {
            console.error('Razorpay Payment Error:', error);
            toast.error('Razorpay payment failed!');
        }
    };

    // for razorpay payment
    const verifyAndProcessPayment = async (paymentResponse, visiterId, loginInfo, taxAmmountData) => {
        try {
            setIsloder(true);
            setSelectedMode(3);
            const razorpayData = {
                razorpay_payment_id: paymentResponse?.razorpay_payment_id,
                razorpay_order_id: paymentResponse?.razorpay_order_id,
                razorpay_signature: paymentResponse?.razorpay_signature,
            };
            const verificationResponse = await handleVerifySignature(razorpayData);
            const vstatus = verificationResponse?.Data?.signature[0]?.state;
            if (vstatus === 1) {
                let mode = 'pay with Razorpay'
                const paymentResponse = await handlePaymentAPI(visiterId, islogin, mode);
                if (paymentResponse?.Data?.rd?.[0]?.stat === 1) {
                    const orderNumber = paymentResponse.Data?.rd[0]?.orderno;
                    sessionStorage.setItem('orderNumber', orderNumber);
                    // const cartCount = await GetCountAPI();
                    // setCartCountVal(cartCount?.cartcount);
                    navigate('/confirmation', { replace: true });
                }
                setIsloder(false);
            } else {
                alert('Payment verification failed.');
            }
        } catch (error) {
            console.error('Verification Error:', error);
            toast.error('Error verifying payment.');
        }
    };

    // for offline payment
    const handleOfflinePayment = async (visiterId, islogin) => {
        try {
            setSelectedMode(2)
            let mode = 'Cash on Delivery'
            const paymentResponse = await handlePaymentAPI(visiterId, islogin, mode);
            if (paymentResponse?.Data?.rd?.[0]?.stat === 1) {
                const orderNumber = paymentResponse.Data?.rd[0]?.orderno;
                sessionStorage.setItem('orderNumber', orderNumber);
                setIsloding(false);
                navigate('/confirmation', { replace: true });
                sessionStorage.removeItem("orderRemark");
            } else {
                toast.error('Payment unsuccessful. Please try again.');
            }
        } catch (error) {
            console.error('Offline Payment Error:', error);
            toast.error('Offline payment failed!');
        }
    };

    // for payment
    const handlePay = async () => {
        if (selectedPayment != null) {
            const razorPayData = {
                description: orderRemakdata,
                price: Math.round(parseFloat(taxAmmountData?.TotalAmountWithTax) * 100),
                addressData: selectedAddrData,
            };
            const visiterId = Cookies.get('visiterId');
            setIsloding(true);
            setSelectedMode(1);

            const paymentMethods = {
                10: () => handleRazorpayPayment(razorPayData, visiterId, taxAmmountData),
                9: () => {
                    alert('Coming Soon PhonePe...');
                    setIsloding(false);
                },
                8: () => {
                    alert('Coming Soon Stripe...');
                    setIsloding(false);
                },
                7: () => {
                    alert('Coming Soon Payeezy...');
                    setIsloding(false);
                },
                6: () => {
                    alert('Coming Soon PayUMoney...');
                    setIsloding(false);
                },
                5: () => {
                    alert('Coming Soon Eazypay...');
                    setIsloding(false);
                },
                4: () => {
                    alert('Coming Soon Paytm...');
                    setIsloding(false);
                },
                3: () => handleOfflinePayment(visiterId, islogin),
                2: () => {
                    alert('Coming Soon EBS...');
                    setIsloding(false);
                },
                1: () => {
                    alert('Coming Soon PayPal...');
                    setIsloding(false);
                },
            };

            const executePayment = paymentMethods[selectedPayment] || (() => alert('Coming Soon'));
            await executePayment();
        } else {
            alert('Please select a payment method.');
        }
    };

    const handleChangeAddr = () => {
        navigate('/delivery');
    };

    return {
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
        formatter,
        currCode,
        errorMsg,
        selectedMode,
        setOrderRemark,
        setSelectedPayment,
        paymentMethods,
        isloding,
        isloder,
        isPloding,
    };
};

export default usePaymentLogic;
