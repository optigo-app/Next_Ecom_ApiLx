'use client';
import React, { useEffect, useState } from 'react';
import './YourProfile.scss';
import {
  TextField,
  CircularProgress,
  Box,
  Button,
  Typography,
  InputAdornment,
  Fade,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import { toast } from 'react-toastify';
import { saveEditProfile } from '@/app/(core)/utils/API/AccountTabs/YourProfile';
import {
  validateChangeYPAccount,
  validateUserDataYPAccount,
} from '@/app/(core)/utils/Glob_Functions/AccountPages/AccountPage';

export default function YourProfile() {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUserData, setEditedUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedUserData = sessionStorage.getItem('loginUserDetail');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      let obj = { ...parsedUserData };
      if (obj.mobileno) {
        obj.mobileno = obj.mobileno.replace(/-/g, '');
      }
      setUserData(obj);
      setEditedUserData(obj);
    }
  }, []);

  const handleEdit = () => {
    setEditedUserData({ ...userData });
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setEditedUserData((prevData) => ({
      ...prevData,
      [id]: value,
    }));

    // Validate the field
    const errorsCopy = { ...errors };
    errorsCopy[id] = validateChangeYPAccount(id, value);
    setErrors(errorsCopy);
  };

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();

    // Validate user data
    const { errors: valErrors, isValid } = validateUserDataYPAccount(editedUserData);

    if (isValid) {
      try {
        setIsLoading(true);
        const storedData = sessionStorage.getItem('loginUserDetail');
        const data = JSON.parse(storedData);
        const storeInit = JSON.parse(sessionStorage.getItem('storeInit')) || {};
        const { FrontEnd_RegNo } = storeInit;
        const response = await saveEditProfile(editedUserData, data, FrontEnd_RegNo);

        if (response?.Data?.rd[0]?.stat === 1) {
          toast.success('Profile updated successfully!');
          setUserData(editedUserData);
          sessionStorage.setItem('loginUserDetail', JSON.stringify(editedUserData));
          setEditMode(false);
        } else if (
          response?.Data?.rd[0]?.stat === 0 &&
          response?.Data?.rd[0]?.stat_msg?.toLowerCase() === 'mobileno alredy exists'
        ) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            mobileno: 'Mobile number already exists',
          }));
        } else {
          toast.error(response?.Data?.rd[0]?.stat_msg || 'Error in saving profile.');
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

  const handleCancel = () => {
    setEditedUserData({ ...userData });
    setEditMode(false);
    setErrors({});
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '4px',
      bgcolor: editMode ? '#ffffff' : '#f9fafb',
      fontSize: '0.92rem',
      transition: 'all 0.15s ease-in-out',
      '& fieldset': {
        borderColor: editMode ? '#d1d5db' : '#e5e7eb',
      },
      '&:hover fieldset': {
        borderColor: editMode ? '#9ca3af' : '#e5e7eb',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#0b291d',
        borderWidth: '1.5px',
      },
      '&.Mui-disabled': {
        bgcolor: '#f9fafb',
        '& fieldset': {
          borderColor: '#f3f4f6',
        },
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.88rem',
      color: '#6b7280',
      '&.Mui-focused': { color: '#0b291d' },
    },
  };

  const currentData = editMode ? editedUserData : userData;

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      {/* Top Header & Edit Action */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          flexWrap: 'wrap',
          gap: 1.5,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#111827',
              fontSize: '1.1rem',
              lineHeight: 1.2,
            }}
          >
            Personal Information
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.82rem', mt: 0.25 }}>
            {editMode ? 'Edit and save your personal details below' : 'View your registered personal details'}
          </Typography>
        </Box>

        {!editMode ? (
          <Button
            onClick={handleEdit}
            startIcon={<EditOutlinedIcon sx={{ fontSize: 18 }} />}
            sx={{
              textTransform: 'none',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
              color: '#0b291d',
              fontWeight: 600,
              fontSize: '0.88rem',
              px: 2.5,
              py: 0.8,
              bgcolor: '#ffffff',
              transition: 'all 0.15s ease-in-out',
              '&:hover': {
                bgcolor: '#f9fafb',
                borderColor: '#9ca3af',
              },
            }}
          >
            Edit
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={handleCancel}
              startIcon={<CloseIcon sx={{ fontSize: 17 }} />}
              sx={{
                textTransform: 'none',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
                color: '#6b7280',
                fontWeight: 600,
                fontSize: '0.85rem',
                px: 2,
                py: 0.75,
                '&:hover': { bgcolor: '#f9fafb' },
              }}
            >
              Cancel
            </Button>
          </Box>
        )}
      </Box>

      {/* Form Container */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          width: '100%',
        }}
      >
        {/* Row 1: First Name & Last Name */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
            gap: 2,
            width: '100%',
            minWidth: 0,
          }}
        >
          <TextField
            id={editMode ? 'firstname' : 'defaddress_shippingfirstname'}
            label="First Name"
            placeholder="Enter first name"
            variant="outlined"
            fullWidth
            disabled={!editMode}
            value={currentData?.firstname || ''}
            onChange={handleInputChange}
            error={!!errors.firstname}
            helperText={errors.firstname}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon sx={{ fontSize: 19, color: '#9ca3af' }} />
                </InputAdornment>
              ),
            }}
            sx={inputStyle}
          />

          <TextField
            id={editMode ? 'lastname' : 'defaddress_shippinglastname'}
            label="Last Name"
            placeholder="Enter last name"
            variant="outlined"
            fullWidth
            disabled={!editMode}
            value={currentData?.lastname || ''}
            onChange={handleInputChange}
            error={!!errors.lastname}
            helperText={errors.lastname}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon sx={{ fontSize: 19, color: '#9ca3af' }} />
                </InputAdornment>
              ),
            }}
            sx={inputStyle}
          />
        </Box>

        {/* Row 2: Email & Mobile */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
            gap: 2,
            width: '100%',
            minWidth: 0,
          }}
        >
          <TextField
            id="userid"
            label="Email Address"
            placeholder="Enter email address"
            variant="outlined"
            fullWidth
            disabled // Email cannot be modified directly
            value={currentData?.userid || currentData?.email || ''}
            onChange={handleInputChange}
            error={!!errors.userid}
            helperText={errors.userid}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon sx={{ fontSize: 19, color: '#9ca3af' }} />
                </InputAdornment>
              ),
            }}
            sx={inputStyle}
          />

          <TextField
            id={editMode ? 'mobileno' : 'defaddress_shippingmobile'}
            label="Mobile Phone"
            placeholder="Enter mobile number"
            variant="outlined"
            fullWidth
            disabled={!editMode}
            value={currentData?.mobileno || ''}
            onChange={handleInputChange}
            error={!!errors.mobileno}
            helperText={errors.mobileno}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneOutlinedIcon sx={{ fontSize: 19, color: '#9ca3af' }} />
                </InputAdornment>
              ),
            }}
            sx={inputStyle}
          />
        </Box>

        {/* Row 3: Street Address */}
        <TextField
          id={editMode ? 'street' : 'defaddress_street'}
          label="Street Address"
          placeholder="Enter your address"
          variant="outlined"
          fullWidth
          multiline
          rows={2.5}
          disabled={!editMode}
          value={currentData?.street || ''}
          onChange={handleInputChange}
          error={!!errors.street}
          helperText={errors.street}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                <HomeOutlinedIcon sx={{ fontSize: 19, color: '#9ca3af' }} />
              </InputAdornment>
            ),
          }}
          sx={inputStyle}
        />

        {/* Edit Mode Actions */}
        {editMode && (
          <Fade in={editMode}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
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
                  px: 3.5,
                  py: 1.25,
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#144230',
                    boxShadow: 'none',
                  },
                }}
              >
                {isLoading ? 'Updating...' : 'Update'}
              </Button>

              <Button
                onClick={handleCancel}
                sx={{
                  color: '#6b7280',
                  borderRadius: '4px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  px: 2.5,
                  py: 1.25,
                  '&:hover': { bgcolor: '#f3f4f6' },
                }}
              >
                Cancel
              </Button>
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
}
