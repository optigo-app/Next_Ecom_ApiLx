'use client';
import React, { useEffect, useRef, useState } from 'react';
import './CountryDropDown.scss';
import {
  Box,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  ClickAwayListener,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { getSession, setSession } from '../../FetchSessionData';

const CountryDropDown = ({
  emailRef,
  setMobileNo,
  mobileNo,
  mobileNoRef,
  IsMobileThrough,
  handleKeyDown,
  handleInputChange,
  Errors,
  setErrors,
  Countrycodestate,
  setCountrycodestate,
  setCountryShortName,
}) => {
  const [CountryDefault, setCountryDefault] = useState(10);
  const [Countrycode, setCountrycode] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const FetchCodeList = async () => {
      try {
        const response = getSession('CountryCodeListApi', []);
        setCountrycode(response);

        const defaultCountry = response?.find((val) => val?.IsDefault == 1) || response[0];
        const mob = getSession('Countrycodestate');

        if (mob) {
          if (typeof setCountrycodestate === 'function') {
            setCountrycodestate(mob);
          }
          const currentCountry = response?.find((val) => (val?.mobileprefix == mob || val?.MobilePrefix == mob));
          if (currentCountry) {
            setCountryDefault(currentCountry?.PhoneLength || currentCountry?.phonelength || 10);
            if (typeof setCountryShortName === 'function') {
              setCountryShortName(currentCountry?.CountryShortName || currentCountry?.countryshortname || "IND");
            }
          } else {
            setCountryDefault(defaultCountry?.PhoneLength || defaultCountry?.phonelength || 10);
          }
        } else {
          if (typeof setCountrycodestate === 'function') {
            setCountrycodestate(defaultCountry?.mobileprefix || "91");
          }
          if (typeof setCountryShortName === 'function') {
            setCountryShortName(defaultCountry?.CountryShortName || defaultCountry?.countryshortname || "IND");
          }
          setCountryDefault(defaultCountry?.PhoneLength || defaultCountry?.phonelength || 10);
        }
      } catch (error) {
        console.log(error);
      }
    };
    FetchCodeList();
  }, []);

  const handleCountrySelect = (val) => {
    if (val) {
      setCountrycodestate(val?.mobileprefix);
      if (typeof setCountryShortName === 'function') {
        setCountryShortName(val?.CountryShortName || val?.countryshortname || "IND");
      }
      setCountryDefault(val?.PhoneLength || val?.phonelength || 10);
      setOpen(false);
      setSearchQuery('');
      setMobileNo('');
      setErrors((prev) => ({
        ...prev,
        mobileNo: '',
      }));
    }
  };

  const handleMobileInputChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');

    if (numericValue.length > CountryDefault) {
      e.preventDefault();
      return;
    }

    e.target.value = numericValue;

    if (numericValue.length === CountryDefault) {
      setErrors((prev) => ({
        ...prev,
        mobileNo: '',
      }));
    } else if (numericValue?.length > 0 && numericValue?.length < CountryDefault) {
      setErrors((prev) => ({
        ...prev,
        mobileNo: `Mobile number must be ${CountryDefault} digits.`,
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        mobileNo: '',
      }));
    }
    handleInputChange(e, setMobileNo, 'mobileNo');
  };

  const filteredCountries = Countrycode.filter((c) => {
    const term = searchQuery.toLowerCase();
    const name = (c?.countryname || '').toLowerCase();
    const prefix = (c?.mobileprefix || '').toString();
    return name.includes(term) || prefix.includes(term);
  });

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box
        ref={dropdownRef}
        sx={{
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-start',
          width: '100%',
          position: 'relative',
        }}
      >
        {/* Country Code Trigger Box */}
        <Box
          onClick={() => !IsMobileThrough && setOpen(!open)}
          sx={{
            flex: '0 0 82px',
            height: '53px',
            borderRadius: '4px',
            border: '1px solid',
            borderColor: open ? '#111827' : '#d1d5db',
            bgcolor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 1,
            cursor: IsMobileThrough ? 'default' : 'pointer',
            transition: 'border-color 0.15s ease-in-out',
            '&:hover': {
              borderColor: IsMobileThrough ? '#d1d5db' : '#9ca3af',
            },
            userSelect: 'none',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.92rem',
              fontWeight: 500,
              color: '#111827',
              letterSpacing: '0.02em',
            }}
          >
            +{Countrycodestate || '91'}
          </Typography>
          {!IsMobileThrough && (
            <KeyboardArrowDownIcon
              sx={{
                fontSize: 18,
                color: '#6b7280',
                ml: 0.25,
                transform: open ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s',
              }}
            />
          )}
        </Box>

        {/* Floating Country Code Search Dropdown Menu */}
        {open && !IsMobileThrough && (
          <Paper
            elevation={4}
            sx={{
              position: 'absolute',
              top: '58px',
              left: 0,
              width: { xs: '260px', sm: '300px' },
              maxHeight: '280px',
              bgcolor: '#ffffff',
              borderRadius: '4px',
              border: '1px solid #e5e7eb',
              zIndex: 1300,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Search Box */}
            <Box sx={{ p: 1, borderBottom: '1px solid #f3f4f6', bgcolor: '#fafafa' }}>
              <TextField
                autoFocus
                size="small"
                fullWidth
                placeholder="Search country or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 18, color: '#9ca3af' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    bgcolor: '#ffffff',
                    fontSize: '0.85rem',
                    borderRadius: '4px',
                    '& fieldset': { borderColor: '#e5e7eb' },
                  },
                }}
              />
            </Box>

            {/* List of Countries */}
            <Box sx={{ overflowY: 'auto', flex: 1, maxHeight: '220px' }}>
              {filteredCountries.length > 0 ? (
                filteredCountries.map((item, idx) => (
                  <Box
                    key={idx}
                    onClick={() => handleCountrySelect(item)}
                    sx={{
                      py: 1,
                      px: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      color: '#111827',
                      '&:hover': {
                        bgcolor: '#f3f4f6',
                      },
                    }}
                  >
                    <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 400 }}>
                      {item?.countryname}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#6b7280',
                        bgcolor: '#f3f4f6',
                        px: 0.75,
                        py: 0.25,
                        borderRadius: '3px',
                      }}
                    >
                      +{item?.mobileprefix}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography sx={{ p: 2, textAlign: 'center', fontSize: '0.85rem', color: '#9ca3af' }}>
                  No countries found
                </Typography>
              )}
            </Box>
          </Paper>
        )}

        {/* Mobile Number Text Input */}
        <TextField
          name="user-mobileNo"
          id="outlined-basic-mobileNo"
          label="Mobile Number"
          placeholder="Enter mobile number"
          variant="outlined"
          autoComplete="tel"
          type="text"
          inputMode="numeric"
          fullWidth
          value={mobileNo}
          inputRef={mobileNoRef}
          onKeyDown={(e) => handleKeyDown(e, emailRef)}
          onChange={handleMobileInputChange}
          error={!!Errors.mobileNo}
          helperText={Errors.mobileNo}
          disabled={IsMobileThrough}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SmartphoneOutlinedIcon sx={{ fontSize: 19, color: '#9ca3af' }} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: '4px',
              bgcolor: '#ffffff',
              fontSize: '0.92rem',
              '& fieldset': { borderColor: '#d1d5db' },
              '&:hover fieldset': { borderColor: '#9ca3af' },
              '&.Mui-focused fieldset': { borderColor: '#111827', borderWidth: '1.5px' },
            },
          }}
          FormHelperTextProps={{ sx: { ml: 0, fontSize: '0.78rem' } }}
          sx={{ flex: 1 }}
        />
      </Box>
    </ClickAwayListener>
  );
};

export default CountryDropDown;
