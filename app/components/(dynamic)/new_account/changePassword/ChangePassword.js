'use client';
import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SecurityIcon from '@mui/icons-material/Security';
import CheckIcon from '@mui/icons-material/Check';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import './changepassword.scss';
import { handleChangePassword } from '@/app/(core)/utils/API/AccountTabs/changePassword';
import { toast } from 'react-toastify';
import {
  handlePasswordInputChangeAcc,
  validateChangePassword,
} from '@/app/(core)/utils/Glob_Functions/AccountPages/AccountPage';
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
import Cookies from 'js-cookie';
import { useStore } from '@/app/(core)/contexts/StoreProvider';
import { getSession } from '@/app/(core)/utils/FetchSessionData';

export default function ChangePassword() {
  const { push } = useNextRouterLikeRR();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [passwordError, setPasswordError] = useState('');
  const navigation = push;
  const [isLoading, setIsLoading] = useState(false);
  const [customerID, setCustomerID] = useState('');
  const { setislogin } = useStore();

  const handleLogout = () => {
    setislogin(false);
    Cookies.remove('userLoginCookie');
    sessionStorage.setItem('LoginUser', false);
    sessionStorage.removeItem('loginUserDetail');
    sessionStorage.removeItem('remarks');
    sessionStorage.removeItem('selectedAddressId');
    sessionStorage.removeItem('orderNumber');
    sessionStorage.removeItem('registerEmail');
    sessionStorage.removeItem('UploadLogicalPath');
    sessionStorage.removeItem('remarks');
    sessionStorage.removeItem('registerMobile');
    sessionStorage.removeItem('allproductlist');
    sessionStorage.clear();
    Cookies.remove('userLoginCookie');
    Cookies.remove('LoginUser');
    navigation('/');
  };

  useEffect(() => {
    const storedEmail = getSession('registerEmail');
    const storedData = getSession('loginUserDetail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setEmail(storedData?.userid || storedData?.email1 || storedData?.email || '');
    }
    setCustomerID(storedData?.id || '');
  }, []);

  const validatePassword = (value) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[^\w\d\s]).{8,}$/;
    return passwordRegex.test(value);
  };

  const handleTogglePasswordVisibility = (fieldName) => {
    if (fieldName === 'password') {
      setShowPassword(!showPassword);
    } else if (fieldName === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    } else if (fieldName === 'oldPassword') {
      setShowOldPassword(!showOldPassword);
    }
  };

  function hashPasswordSHA1(pwd) {
    return CryptoJS.SHA1(pwd).toString(CryptoJS.enc.Hex);
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const { errors: valErrors, isValid } = validateChangePassword({
      oldPassword,
      password,
      confirmPassword,
    });

    if (isValid) {
      const hashedOldPassword = hashPasswordSHA1(oldPassword);
      const hashedPassword = hashPasswordSHA1(password);
      const hashedConfirmPassword = hashPasswordSHA1(confirmPassword);
      setIsLoading(true);
      try {
        const storeInit = getSession('storeInit');
        const { FrontEnd_RegNo } = storeInit || {};

        if (passwordError === '') {
          const response = await handleChangePassword(
            hashedOldPassword,
            hashedPassword,
            hashedConfirmPassword,
            FrontEnd_RegNo,
            customerID,
            email
          );
          localStorage.setItem('log', JSON.stringify(response));
          if (response?.Data?.rd[0]?.stat === 1) {
            toast.success('Password updated successfully! Please login with your new password.');
            handleLogout();
          } else {
            const errorMsg =
              response?.Data?.rd[0]?.stat_msg ||
              response?.Data?.rd[0]?.msg ||
              'Enter Valid Old Password';
            setErrors((prevErrors) => ({ ...prevErrors, oldPassword: errorMsg }));
            toast.error(errorMsg);
          }
        } else {
          toast.error('Password does not meet requirements');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(valErrors);
    }
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '4px',
      bgcolor: '#ffffff',
      fontSize: '0.92rem',
      transition: 'all 0.15s ease-in-out',
      '& fieldset': {
        borderColor: '#d1d5db',
      },
      '&:hover fieldset': {
        borderColor: '#9ca3af',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#0b291d',
        borderWidth: '1.5px',
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.88rem',
      color: '#6b7280',
      '&.Mui-focused': { color: '#0b291d' },
    },
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '540px' }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        {/* Old Password */}
        <TextField
          id="outlined-old-password-input"
          label="Current Password"
          placeholder="Enter current password"
          type={showOldPassword ? 'text' : 'password'}
          autoComplete="current-password"
          fullWidth
          value={oldPassword}
          onChange={(e) =>
            handlePasswordInputChangeAcc(
              e,
              'oldPassword',
              {
                password,
                confirmPassword,
                oldPassword,
                setPassword,
                setConfirmPassword,
                setOldPassword,
              },
              setErrors
            )
          }
          error={!!errors.oldPassword}
          helperText={errors.oldPassword}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon sx={{ fontSize: 19, color: '#9ca3af' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle current password visibility"
                  onClick={() => handleTogglePasswordVisibility('oldPassword')}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  size="small"
                >
                  {showOldPassword ? (
                    <VisibilityOff sx={{ fontSize: 20, color: '#6b7280' }} />
                  ) : (
                    <Visibility sx={{ fontSize: 20, color: '#6b7280' }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={inputStyle}
        />

        {/* New Password */}
        <TextField
          id="outlined-password-input"
          label="New Password"
          placeholder="Enter new password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          fullWidth
          value={password}
          onChange={(e) =>
            handlePasswordInputChangeAcc(
              e,
              'password',
              {
                password,
                confirmPassword,
                oldPassword,
                setPassword,
                setConfirmPassword,
                setOldPassword,
              },
              setErrors
            )
          }
          error={!!errors.password}
          helperText={errors.password}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SecurityIcon sx={{ fontSize: 19, color: '#9ca3af' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle new password visibility"
                  onClick={() => handleTogglePasswordVisibility('password')}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  size="small"
                >
                  {showPassword ? (
                    <VisibilityOff sx={{ fontSize: 20, color: '#6b7280' }} />
                  ) : (
                    <Visibility sx={{ fontSize: 20, color: '#6b7280' }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={inputStyle}
        />

        {/* Confirm Password */}
        <TextField
          id="outlined-confirm-password-input"
          label="Confirm New Password"
          placeholder="Re-enter new password"
          type={showConfirmPassword ? 'text' : 'password'}
          autoComplete="new-password"
          fullWidth
          value={confirmPassword}
          onChange={(e) =>
            handlePasswordInputChangeAcc(
              e,
              'confirmPassword',
              {
                password,
                confirmPassword,
                oldPassword,
                setPassword,
                setConfirmPassword,
                setOldPassword,
              },
              setErrors
            )
          }
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon sx={{ fontSize: 19, color: '#9ca3af' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={() => handleTogglePasswordVisibility('confirmPassword')}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  size="small"
                >
                  {showConfirmPassword ? (
                    <VisibilityOff sx={{ fontSize: 20, color: '#6b7280' }} />
                  ) : (
                    <Visibility sx={{ fontSize: 20, color: '#6b7280' }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={inputStyle}
        />

        {/* Password Requirements Guidance Box */}
        <Box
          sx={{
            p: 2,
            bgcolor: '#f9fafb',
            borderRadius: '4px',
            border: '1px solid #f3f4f6',
          }}
        >
          <Typography sx={{ fontSize: '0.8rem', color: '#4b5563', lineHeight: 1.5 }}>
            <strong>Password requirements:</strong>
            <br />
            • At least 8 characters in length
            <br />
            • Must contain uppercase, lowercase, number, and special character
          </Typography>
        </Box>

        {/* Submit Button */}
        <Box sx={{ mt: 1 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={16} sx={{ color: '#fff' }} />
              ) : (
                <CheckIcon sx={{ fontSize: 18 }} />
              )
            }
            sx={{
              bgcolor: '#0b291d',
              color: '#ffffff',
              borderRadius: '4px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.92rem',
              px: 4,
              py: 1.25,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#144230',
                boxShadow: 'none',
              },
            }}
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}