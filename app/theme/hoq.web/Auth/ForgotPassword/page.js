"use client";

import "./ForgotPass.modul.scss";
import React, { useEffect, useState } from 'react'
import { Button, CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import CryptoJS from 'crypto-js';
import { ResetPasswordAPI } from '@/app/(core)/utils/API/Auth/ResetPasswordAPI';
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";


export default function ForgotPass() {

 const location = useNextRouterLikeRR();
  const navigation = location?.push;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('userEmailForPdList');
    if (storedEmail) {
      setEmail(storedEmail);
    }

  }, []); // 



  const handleInputChange = (e, setter, fieldName) => {
    const { value } = e.target;
    setter(value);
    if (fieldName === 'confirmPassword') {
      if (!value.trim()) {
        setErrors(prevErrors => ({ ...prevErrors, confirmPassword: 'Password is required' }));
      } else {
        setErrors(prevErrors => ({ ...prevErrors, confirmPassword: '' }));
      }
    }
  };

  const handlePasswordChange = (event) => {
    const { value } = event.target;
    setPassword(value);
    if (!validatePassword(value)) {
      setPasswordError('Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one number.');
    } else {
      setPasswordError('');
    }
  };


  const handleTogglePasswordVisibility = (fieldName) => {
    if (fieldName === 'password') {
      setShowPassword(!showPassword);
    } else if (fieldName === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  function hashPasswordSHA1(password) {
    const hashedPassword = CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);
    return hashedPassword;
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const validatePassword = (value) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return passwordRegex.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!password.trim()) {
      setPasswordError('Password is required');
      errors.password = 'Password is required';
    }
    if (!confirmPassword.trim()) {
      errors.confirmPassword = 'Confirm Password is required';
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match';
    }


    const queryParams = new URLSearchParams(window.location.search);
    const userid = queryParams.get('userid');

    if (Object.keys(errors).length === 0) {
      const hashedPassword = hashPasswordSHA1(password);
      setIsLoading(true);
      ResetPasswordAPI(userid, hashedPassword).then((response) => {
        if (response.Data.rd[0].stat === 1) {
          navigation('/ContinueWithEmail');
        } else {
          setIsLoading(false);
          alert(response.Data.rd[0].stat_msg);
        }
      }).catch((err) => console.log(err))


    } else {
      setErrors(errors);
    }
  };


  return (
    <div className='Hoq_forgotMain'>
      {isLoading && (
        <div className="loader-overlay">
          <CircularProgress className='loadingBarManage' />
        </div>
      )}
      <div >
        <div className='smr_forgotSubDiv'>
          <p style={{
            textAlign: 'center',
            padding: '60px',
            margin: '0px',
            fontSize: '40px',
            color: '#7d7f85',
          }}

            className='AuthScreenMainTitle'
          >Forgot Your Password</p>
          <p style={{
            textAlign: 'center',
            marginTop: '-60px',
            fontSize: '15px',
            color: '#7d7f85',
          }}

            className='AuthScreenSubTitle'
          >{ }</p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TextField
              autoFocus
              id="outlined-password-input"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className='smr_forgotBox'
              style={{ margin: '15px' }}
              value={password}
              onChange={handlePasswordChange}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSubmit();
                }
              }}
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleTogglePasswordVisibility('password')}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              id="outlined-confirm-password-input"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className='smr_forgotBox'
              style={{ margin: '15px' }}
              value={confirmPassword}
              onChange={(e) => handleInputChange(e, setConfirmPassword, 'confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{ // Set InputProps for icon
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleTogglePasswordVisibility('confirmPassword')}
                      onMouseDown={handleMouseDownConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <button className='createBtnRegister' onClick={handleSubmit}>Change Password</button>
            <Button style={{ marginTop: '10px', color: 'gray' }} onClick={() => navigation('/')}>CANCEL</Button>
          </div>

        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', paddingBlock: '30px' }}>
        <p style={{ margin: '0px', fontWeight: 500, width: '100px', color: 'white', cursor: 'pointer' }} onClick={() => window.scrollTo(0, 0)}>BACK TO TOP</p>
      </div>
    </div>
  )
}
