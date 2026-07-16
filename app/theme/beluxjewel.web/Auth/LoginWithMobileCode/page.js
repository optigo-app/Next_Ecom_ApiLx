"use client"
import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, TextField } from '@mui/material';
import './LoginWithMobileCode.modul.scss';
import { ContimueWithMobileAPI } from '@/app/(core)/utils/API/Auth/ContimueWithMobileAPI';
import { toast } from 'react-toastify';
import { LoginWithEmailAPI } from '@/app/(core)/utils/API/Auth/LoginWithEmailAPI';
import Cookies from 'js-cookie';
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
import OTP from './OTP';

export default function LoginWithMobileCode({ params, searchParams }) {
    const location = useNextRouterLikeRR();
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigation = location?.push;
    const [mobileNo, setMobileNo] = useState('');
    const [enterOTP, setEnterOTP] = useState('');
    const [resendTimer, setResendTimer] = useState(120);
    const [isLoginState, setIsLoginState] = useState(false)

    const search = searchParams?.LoginRedirect || searchParams?.loginRedirect || searchParams?.search || "";
    const updatedSearch = search?.replace('?LoginRedirect=', '');
    const redirectMobileUrl = `${decodeURIComponent(updatedSearch)}`;
    const cancelRedireactUrl = `/LoginOption?${search}`;


    useEffect(() => {
        const storedMobile = sessionStorage?.getItem('registerMobile') ?? '';
        if (storedMobile) setMobileNo(storedMobile);
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

    const handleInputChange = (e, setter, fieldName) => {
        const { value } = e.target;
        setter(value);
        if (fieldName === 'mobileNo') {
            if (!value.trim()) {
                setErrors(prevErrors => ({ ...prevErrors, otp: 'Code is required' }));
            } else {
                setErrors(prevErrors => ({ ...prevErrors, otp: '' }));
            }
        }
    };

    const handleSubmit = async () => {
        const visiterId = Cookies.get('visiterId');
        if (!enterOTP.trim()) {
            errors.otp = 'Code is required';
            return;
        }
        LoginWithEmailAPI('', mobileNo, enterOTP, 'otp_mobile_login', '', visiterId).then((response) => {
            if (response.Data.rd[0].stat == 1) {
                Cookies.set('LoginUser', true)
                sessionStorage.setItem('LoginUser', true)
                setIsLoginState(true)
                sessionStorage.setItem('loginUserDetail', JSON.stringify(response.Data.rd[0]));
                sessionStorage.setItem('registerMobile', mobileNo);

                if (redirectMobileUrl) {
                    window.location.href = redirectMobileUrl;
                } else {
                    window.location.href = '/';
                }

            } else {
                setErrors(prevErrors => ({ ...prevErrors, otp: response?.Data?.rd[0]?.stat_msg }));
            }
        }).catch((err) => console.log(err))
    };


    const handleResendCode = async () => {
        setResendTimer(120);
        setIsLoading(true);
        ContimueWithMobileAPI(mobileNo).then((response) => {
            setIsLoading(false);
            if (response.Data.rd[0].stat == 1) {
                toast.success('OTP send Sucssessfully');
            } else {
                alert('Error..')
            }
        }).catch((err) => console.log(err))
    };

    return (
        <div className='fg_smr_loginmobileCodeMain'>
            {isLoading && (
                <div className="loader-overlay">
                    <CircularProgress className='loadingBarManage' />
                </div>
            )}
            <div >
                <div className='smling-forgot-main'>
                    <p style={{
                        textAlign: 'center',
                        paddingBlock: '10px',
                        fontSize: '40px',
                        color: '#7d7f85',

                    }}
                        className='AuthScreenMainTitle'
                    >Login With Code</p>
                    <p style={{
                        textAlign: 'center',
                        fontSize: '15px',
                        color: '#7d7f85',

                    }}
                        className='AuthScreenSubTitle'
                    >Last step! To secure your account, enter the code we just sent to {mobileNo}.</p>
                    <div className='fg_opt_div' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                        <OTP separator={<span> </span>} value={enterOTP} onChange={setEnterOTP} length={6} onSubmit={handleSubmit} />

                        {errors.otp && (
                            <p style={{ color: 'red', marginTop: '5px' }}>{errors.otp}</p>
                        )}

                        <button className='submitBtnForgot_for btnColorProCat' style={{ marginTop: '20px' }} onClick={handleSubmit}>Login</button>
                        <p className='resend_msg' style={{ marginTop: '10px' }}>Didn't get the code ? {resendTimer === 0 ? <span style={{ fontWeight: 500, color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={handleResendCode}>Resend Code</span> : <span>Resend in {Math.floor(resendTimer / 60).toString().padStart(2, '0')}:{(resendTimer % 60).toString().padStart(2, '0')}</span>}</p>
                        <Button style={{ marginTop: '10px', color: 'gray' }} onClick={() => navigation(cancelRedireactUrl)}>CANCEL</Button>
                    </div>
                </div>
            </div>

        </div>
    );
}
