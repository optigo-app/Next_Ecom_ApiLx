import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, CircularProgress, IconButton, InputAdornment, Button, Tabs, TextField, Stack } from '@mui/material'
import './changepassword.scss'
import { handleChangePassword } from '@/app/(core)/utils/API/AccountTabs/changePassword';
import { toast } from 'react-toastify';
import { handlePasswordChangeAcc, handlePasswordInputChangeAcc, validateChangePassword } from '@/app/(core)/utils/Glob_Functions/AccountPages/AccountPage';
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
import { getButtonStyle } from '@/app/(core)/constants/MobileAppTheme';

export default function ChangePassword() {
  const { push } = useNextRouterLikeRR()
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [passwordError, setPasswordError] = useState('');
  const naviagation = push;
  const [isLoading, setIsLoading] = useState(false);
  const [customerID, setCustomerID] = useState('');

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('registerEmail');
    if (storedEmail) setEmail(storedEmail);

    const storedData = sessionStorage.getItem('loginUserDetail');
    const data = JSON.parse(storedData);
    setCustomerID(data?.id);

  }, []); // 


  const validatePassword = (value) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[^\w\d\s]).{8,}$/;
    return passwordRegex.test(value);
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
    } else if (fieldName === 'oldPassword') {
      setShowOldPassword(!showOldPassword);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { errors, isValid } = validateChangePassword({ oldPassword, password, confirmPassword });

    if (isValid) {

      const hashedOldPassword = hashPasswordSHA1(oldPassword);
      const hashedPassword = hashPasswordSHA1(password);
      const hashedConfirmPassword = hashPasswordSHA1(confirmPassword);

      setIsLoading(true);
      try {

        const storeInit = JSON.parse(sessionStorage.getItem('storeInit'));

        const { FrontEnd_RegNo } = storeInit;

        // const combinedValue = JSON.stringify({
        //     oldpassword: `${hashedOldPassword}`, newpassword: `${hashedPassword}`, confirmpassword: `${hashedConfirmPassword}`, FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: `${customerID}`
        // });

        // // const encodedCombinedValue = btoa(combinedValue);
        // const encodedCombinedValue = (combinedValue);
        // const body = {
        //     "con": `{\"id\":\"\",\"mode\":\"CHANGEPASS\",\"appuserid\":\"${email}\"}`,
        //     "f": "Account (changePassword)",
        //     "p": encodedCombinedValue
        // }

        // console.log(body);
        // const response = await CommonAPI(body);

        if (passwordError === '') {

          const response = await handleChangePassword(hashedOldPassword, hashedPassword, hashedConfirmPassword, FrontEnd_RegNo, customerID, email);

          if (response?.Data?.rd[0]?.stat === 1) {
            sessionStorage.setItem('LoginUser', 'false');
            naviagation('/')
            window.location.reload()
          } else {
            setErrors(prevErrors => ({ ...prevErrors, oldPassword: 'Enter Valid Old Password' }));
          }

        } else {
          toast.error('Password Not Updated');
        }

      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(errors);
    }
  };

  return <>
    <Box sx={{ px: 2, py: 3, maxWidth: 420, mx: "auto" }}>

      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "rgba(255,255,255,0.6)",
            zIndex: 10
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <Stack spacing={2} alignItems="center">

        <TextField
          fullWidth
          label="Old Password"
          type={showOldPassword ? "text" : "password"}
          autoComplete="current-password"
          value={oldPassword}
          onChange={(e) =>
            handlePasswordInputChangeAcc(
              e,
              "oldPassword",
              { password, confirmPassword, oldPassword, setPassword, setConfirmPassword, setOldPassword },
              setErrors
            )
          }
          error={!!errors.oldPassword}
          helperText={errors.oldPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => handleTogglePasswordVisibility("oldPassword")}
                  onMouseDown={handleMouseDownConfirmPassword}
                  edge="end"
                >
                  {showOldPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <TextField
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          value={password}
          onChange={(e) =>
            handlePasswordInputChangeAcc(
              e,
              "password",
              { password, confirmPassword, oldPassword, setPassword, setConfirmPassword, setOldPassword },
              setErrors
            )
          }
          error={!!errors.password}
          helperText={errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => handleTogglePasswordVisibility("password")}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <TextField
          fullWidth
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          autoComplete="current-password"
          value={confirmPassword}
          onChange={(e) =>
            handlePasswordInputChangeAcc(
              e,
              "confirmPassword",
              { password, confirmPassword, oldPassword, setPassword, setConfirmPassword, setOldPassword },
              setErrors
            )
          }
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => handleTogglePasswordVisibility("confirmPassword")}
                  onMouseDown={handleMouseDownConfirmPassword}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={
            getButtonStyle(true, {
              mt: 1,
              py: 1.5
            })
          }
        >
          Change Password
        </Button>

      </Stack>
    </Box>

  </>

  return (
    <div className='changePassword_Account_SMR'>
      <div>
        {isLoading && (
          <div className="loader-overlay">
            <CircularProgress className='loadingBarManage' />
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
          <TextField
            id="outlined-confirm-password-input"
            label="Old Password"
            type={showOldPassword ? 'text' : 'password'}
            autoComplete="current-password"
            className='labgrowRegister'
            style={{ margin: '15px' }}
            value={oldPassword}
            // onChange={(e) => handleInputChange(e, setOldPassword, 'oldPassword')}
            // onChange={(e) => handlePasswordInputChangeAcc(e, 'oldPassword', { setOldPassword, setPassword, setConfirmPassword }, errors, setErrors)}
            // error={!!errors.oldPassword}
            // helperText={errors.oldPassword}
            onChange={(e) =>
              handlePasswordInputChangeAcc(e, 'oldPassword', { password, confirmPassword, oldPassword, setPassword, setConfirmPassword, setOldPassword }, setErrors)
            }
            error={!!errors.oldPassword}
            helperText={errors.oldPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => handleTogglePasswordVisibility('oldPassword')}
                    onMouseDown={handleMouseDownConfirmPassword}
                    edge="end"
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            id="outlined-password-input"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            className='labgrowRegister'
            style={{ margin: '15px' }}
            value={password}
            // onChange={handlePasswordChange}
            // onChange={(e) => handlePasswordInputChangeAcc(e, 'password', { setPassword, setConfirmPassword, setOldPassword }, errors, setErrors)}
            // error={!!passwordError}
            // helperText={passwordError}
            onChange={(e) =>
              handlePasswordInputChangeAcc(e, 'password', { password, confirmPassword, oldPassword, setPassword, setConfirmPassword, setOldPassword }, setErrors)
            }
            error={!!errors.password}
            helperText={errors.password}
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
            className='labgrowRegister'
            style={{ margin: '15px' }}
            value={confirmPassword}
            // onChange={(e) => handleInputChange(e, setConfirmPassword, 'confirmPassword')}
            // onChange={(e) => handlePasswordInputChangeAcc(e, 'confirmPassword', { setPassword, setConfirmPassword, setOldPassword }, errors, setErrors)}
            // error={!!errors.confirmPassword}
            // helperText={errors.confirmPassword}
            onChange={(e) =>
              handlePasswordInputChangeAcc(e, 'confirmPassword', { password, confirmPassword, oldPassword, setPassword, setConfirmPassword, setOldPassword }, setErrors)
            }
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

          <button className='ForgotPassBtn' onClick={handleSubmit}>Change Password</button>
        </div>
      </div>

    </div>
  )
}