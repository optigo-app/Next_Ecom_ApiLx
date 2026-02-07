"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Button, CircularProgress, Box } from '@mui/material';
import {  toast } from 'react-toastify';
import { LoginWithEmailCodeAPI } from '@/app/(core)/utils/API/Auth/LoginWithEmailCodeAPI';
import { LoginWithEmailAPI } from '@/app/(core)/utils/API/Auth/LoginWithEmailAPI';
import Cookies from 'js-cookie';
import OTP from './OTP'; // Make sure the path is correct
import './LoginWithEmailCode.modul.scss'
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';

export default function LoginWithEmailCode({ params, searchParams }) {
    const location = useNextRouterLikeRR();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(120);
    const navigation = location.push;
    const [isLoginState, setIsLoginState] = useState(false);
    const inputsRef = useRef([]);

    const search = JSON.parse(searchParams?.value)?.LoginRedirect ?? "";
    const updatedSearch = search.replace('?LoginRedirect=', '');
    const redirectEmailUrl = `${decodeURIComponent(updatedSearch)}`;
    const cancelRedireactUrl = `/LoginOption/${search}`;

    useEffect(() => {
        const fetchData = async () => {
            const storedEmail = sessionStorage.getItem('registerEmail');
            if (storedEmail) {
                setEmail(storedEmail);
                const value = sessionStorage.getItem('LoginCodeEmail');
                if (value === 'true') {
                    sessionStorage.setItem('LoginCodeEmail', 'false');
                    LoginWithEmailCodeAPI(storedEmail).then((response) => {
                        if (response.Data.Table1[0].stat === '1') {
                            toast.success('OTP sent successfully');
                        } else {
                            toast.error('OTP send error');
                        }
                    }).catch((err) => console.log(err));
                }
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (resendTimer > 0) {
            const interval = setInterval(() => {
                setResendTimer(prevTimer => {
                    if (prevTimer === 0) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [resendTimer]);

    console.log('otp',otp?.length);

    const handleSubmit = async () => {
        const visiterId = Cookies.get('visiterId');
        if (otp.length < 5) {
            setErrors({ otp: 'Please complete the code.' });
            return;
        }

        setIsLoading(true);
        LoginWithEmailAPI(email, '', otp, 'otp_email_login', '', visiterId).then((response) => {
            setIsLoading(false);
            if (response?.Data?.rd[0]?.stat === 1) {
                setIsLoginState(true);
                Cookies.set('LoginUser', true)
                sessionStorage.setItem('LoginUser', true);
                sessionStorage.setItem('loginUserDetail', JSON.stringify(response.Data.rd[0]));

                if (redirectEmailUrl) {
                    // navigation(redirectEmailUrl);
                    window.location.href = redirectEmailUrl;
                } else {
                    // navigation('/');
                    window.location.href = '/';
                }
            } else {
                setErrors({ otp: 'The code you entered is invalid.' });
            }
        }).catch((err) => {
            setIsLoading(false);
            console.log(err);
            setErrors({ otp: 'An error occurred while logging in. Please try again.' });
        });
    };

    const handleResendCode = async () => {
        setResendTimer(120);
        LoginWithEmailCodeAPI(email).then((response) => {
            if (response.Data.Table1[0].stat === '1') {
                sessionStorage.setItem('LoginCodeEmail', 'false');
                toast.success('OTP sent successfully');
            } else {
                toast.error('OTP send error');
            }
        }).catch((err) => console.log(err));
    };

    return (
        <div className='smr_loginwithemailCode' style={{  paddingTop: '10px' }}>
            {isLoading && (
                <div className="loader-overlay">
                    <CircularProgress className='loadingBarManage' />
                </div>
            )}
            <div >
                <div className='smling-forgot-main' >
                    <p style={{
                        textAlign: 'center',
                        paddingBlock: '60px',
                        marginTop: '15px',
                        fontSize: '40px',
                        color: '#7d7f85',
                        
                    }}
                        className='AuthScreenMainTitle'
                    >Login With Code</p>
                    <p style={{
                        textAlign: 'center',
                        marginTop: '-80px',
                        fontSize: '15px',
                        color: '#7d7f85',
                        
                    }}
                        className='AuthScreenSubTitle'
                    >Last step! To secure your account, enter the code we just sent to {email}.</p>

                    <div className='fg_opt_div' style={{ display: 'flex',  flexDirection: 'column', alignItems: 'center',marginTop: '20px' }}>
                        <OTP  separator={<span> </span>} value={otp} onChange={setOtp} length={6} onSubmit={handleSubmit}/>
                        {errors.otp && (
                            <p style={{ color: 'red', marginTop: '5px' }}>{errors.otp}</p>
                        )}
                        <button className='submitBtnForgot' onClick={handleSubmit}>Login</button>
                        <p className='fg_resnd_msg' style={{ marginTop: '10px' }}>Didn't get the code? {resendTimer === 0 ? <span style={{ fontWeight: 500, color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={handleResendCode}>Resend Code</span> : <span>Resend in {Math.floor(resendTimer / 60).toString().padStart(2, '0')}:{(resendTimer % 60).toString().padStart(2, '0')}</span>}</p>
                        <Button style={{ marginTop: '10px', color: 'gray' }} onClick={() => navigation(cancelRedireactUrl)}>CANCEL</Button>
                    </div>
                    {/* <Footer /> */}
                </div>
            </div>
            {/* <div style={{ display: 'flex', justifyContent: 'center', paddingBlock: '30px' }}>
                <p 
          className="backtotop_Smr"
                
                style={{ margin: '0px', fontWeight: 500, width: '100px', color: 'white', cursor: 'pointer' }} onClick={() => window.scrollTo(0, 0)}>BACK TO TOP</p>
            </div> */}
        </div>
    );
}



// import React, { useEffect, useState } from 'react';
// import { Button, CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './LoginWithEmailCode.modul.scss';
// import CryptoJS from 'crypto-js';
// import { LoginWithEmailCodeAPI } from '@/utils/API/Auth/LoginWithEmailCodeAPI';
// import Footer from '../../Home/Footer/Footer';
// import { LoginWithEmailAPI } from '@/utils/API/Auth/LoginWithEmailAPI';
// import { useSetRecoilState } from 'recoil';
// import { loginState } from '../../../Recoil/atom';
// import Cookies from 'js-cookie';

// export default function LoginWithEmailCode() {
//     const [email, setEmail] = useState('');
//     const [errors, setErrors] = useState({});
//     const [isLoading, setIsLoading] = useState(false);
//     const navigation = useNavigate();
//     const [mobileNo, setMobileNo] = useState('');
//     const [resendTimer, setResendTimer] = useState(120);
//     const setIsLoginState = useSetRecoilState(loginState)
//     const location = useLocation();

//     const search = location?.search
//     const updatedSearch = search.replace('?LoginRedirect=', '');
//     const redirectEmailUrl = `${decodeURIComponent(updatedSearch)}`;
//     const cancelRedireactUrl = `/LoginOption/${search}`;

//     useEffect(() => {
//         const fetchData = async () => {
//             const storedEmail = sessionStorage.getItem('registerEmail');
//             if (storedEmail) {
//                 setEmail(storedEmail);
//                 const value = sessionStorage.getItem('LoginCodeEmail');
//                 if (value === 'true') {
//                     sessionStorage.setItem('LoginCodeEmail', 'false');
//                     LoginWithEmailCodeAPI(storedEmail).then((response) => {
//                         if (response.Data.Table1[0].stat === '1') {
//                             toast.success('OTP send Sucssessfully');
//                         } else {
//                             toast.error('OTP send Error');
//                         }
//                     }).catch((err) => console.log(err))
//                 }
//             }
//         };
//         fetchData();
//     }, []);


//     useEffect(() => {
//         if (resendTimer > 0) {
//             const interval = setInterval(() => {
//                 setResendTimer(prevTimer => {
//                     if (prevTimer === 0) {
//                         clearInterval(interval);
//                         return 0;
//                     }
//                     return prevTimer - 1;
//                 });
//             }, 1000);
//             return () => clearInterval(interval);
//         }
//     }, [resendTimer]);
    
//     const handleInputChange = (e, setter, fieldName) => {
//         const { value } = e.target;
//         setter(value);
//         if (fieldName === 'mobileNo') {
//             if (!value.trim()) {
//                 setErrors(prevErrors => ({ ...prevErrors, mobileNo: 'Code is required' }));
//             } else {
//                 setErrors(prevErrors => ({ ...prevErrors, mobileNo: '' }));
//             }
//         }
//     };

//     const handleSubmit = async () => {
//         const visiterId = Cookies.get('visiterId');
//         if (!mobileNo.trim()) {
//             errors.mobileNo = 'Code is required';
//             return;
//         }
//         setIsLoading(true);
//         LoginWithEmailAPI(email, '', mobileNo, 'otp_email_login', '', visiterId).then((response) => {
//             setIsLoading(false);
//             if (response?.Data?.rd[0]?.stat === 1) {
//                 setIsLoginState(true)
//                 sessionStorage.setItem('LoginUser', true)
//                 sessionStorage.setItem('loginUserDetail', JSON.stringify(response.Data.rd[0]));

//                 if (redirectEmailUrl) {
//                     navigation(redirectEmailUrl);
//                 } else {
//                     navigation('/')
//                 }
//             } else {
//                 errors.mobileNo = 'Code is Invalid'
//             }
//         }).catch((err) => console.log(err))
//     };


//     const handleResendCode = async () => {
//         setResendTimer(120);
//         LoginWithEmailCodeAPI(email).then((response) => {
//             if (response.Data.Table1[0].stat === '1') {
//                 sessionStorage.setItem('LoginCodeEmail', 'false');
//                 toast.success('OTP send Sucssessfully');
//             } else {
//                 toast.error('OTP send Error');
//             }
//         }).catch((err) => console.log(err))
//     };

//     return (
//         <div className='smr_loginwithemailCode' style={{ backgroundColor: '#c0bbb1', paddingTop: '10px' }}>
//             {isLoading && (
//                 <div className="loader-overlay">
//                     <CircularProgress className='loadingBarManage' />
//                 </div>
//             )}
//             <div style={{ backgroundColor: '#c0bbb1' }}>
//                 <div className='smling-forgot-main'>
//                     <p style={{
//                         textAlign: 'center',
//                         paddingBlock: '60px',
//                         marginTop: '15px',
//                         fontSize: '40px',
//                         color: '#7d7f85',
//                         fontFamily: 'FreightDispProBook-Regular,Times New Roman,serif'
//                     }}
//                         className='AuthScreenMainTitle'
//                     >Login With Code</p>
//                     <p style={{
//                         textAlign: 'center',
//                         marginTop: '-80px',
//                         fontSize: '15px',
//                         color: '#7d7f85',
//                         fontFamily: 'FreightDispProBook-Regular,Times New Roman,serif'
//                     }}
//                         className='AuthScreenSubTitle'
//                     >Last step! To secure your account, enter the code we just sent to {email}.</p>

//                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
//                         <TextField
//                             autoFocus
//                             id="outlined-basic"
//                             label="Enter Code"
//                             variant="outlined"
//                             className='labgrowRegister'
//                             style={{ margin: '15px' }}
//                             onKeyDown={(event) => {
//                                 if (event.key === 'Enter') {
//                                     handleSubmit();
//                                 }
//                             }}
//                             value={mobileNo}
//                             onChange={(e) => handleInputChange(e, setMobileNo, 'mobileNo')}
//                             error={!!errors.mobileNo}
//                             helperText={errors.mobileNo}
//                         />

//                         <button className='submitBtnForgot' onClick={handleSubmit}>Login</button>
//                         <p style={{ marginTop: '10px' }}>Didn't get the code ? {resendTimer === 0 ? <span style={{ fontWeight: 500, color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={handleResendCode}>Resend Code</span> : <span>Resend in {Math.floor(resendTimer / 60).toString().padStart(2, '0')}:{(resendTimer % 60).toString().padStart(2, '0')}</span>}</p>
//                         <Button style={{ marginTop: '10px', color: 'gray' }} onClick={() => navigation(cancelRedireactUrl)}>CANCEL</Button>
//                     </div>
//                     <Footer />
//                 </div>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'center', paddingBlock: '30px' }}>
//                 <p style={{ margin: '0px', fontWeight: 500, width: '100px', color: 'white', cursor: 'pointer' }} onClick={() => window.scrollTo(0, 0)}>BACK TO TOP</p>
//             </div>
//         </div>
//     );
// }
