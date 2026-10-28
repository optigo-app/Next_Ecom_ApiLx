import useOtpInput from '@/app/(core)/hooks/Auth/useOtpInput';
import * as React from 'react';
import { InputBase as BaseInput } from '@mui/material';
import { Box, styled } from '@mui/system';

function OTP({ separator = <span> </span>, length = 6, value, otp, onChange, setOtp, onSubmit }) {
  const { actualValue, inputRefs, handleKeyDown, handleChange, handleClick, handlePaste } =
    useOtpInput({ length, value, otp, onChange, setOtp, onSubmit });

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      {new Array(length).fill(null).map((_, index) => (
        <React.Fragment key={index}>
          <BaseInput
            slots={{ input: InputElement }}
            aria-label={`Digit ${index + 1} of OTP`}
            inputComponent={InputElement}
            inputProps={{
              ref: (element) => (inputRefs.current[index] = element),
              onKeyDown: (event) => handleKeyDown(event, index),
              onChange: (event) => handleChange(event, index),
              onClick: (event) => handleClick(event, index),
              onPaste: (event) => handlePaste(event, index),
              value: actualValue[index] ?? '',
            }}
            type="text"
            inputMode="numeric"
          />
          {index === length - 1 ? null : separator}
        </React.Fragment>
      ))}
    </Box>
  );
}

const blue = {
    100: '#DAECFF',
    200: '#80BFFF',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    700: '#0059B2',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const InputElement = styled('input')(({ theme }) => ({
    width: '100%',
    maxWidth: 60, // desktop max width
    minWidth: 36, // prevent too small on mobile
    fontFamily: '"IBM Plex Sans", sans-serif',
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 3,
    padding: '8px 4px',
    borderRadius: 4,
    textAlign: 'center',
    boxSizing: 'border-box',

    color: theme.palette.mode === 'dark' ? grey[300] : grey[900],
    backgroundColor: theme.palette.mode === 'dark' ? grey[900] : '#fff',
    border: `1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]
        }`,
    boxShadow:
        theme.palette.mode === 'dark'
            ? '0px 2px 4px rgba(0,0,0,0.5)'
            : '0px 2px 4px rgba(0,0,0,0.05)',

    transition: 'all 0.2s ease',

    '&:hover': {
        borderColor: blue[400],
    },

    '&:focus': {
        borderColor: blue[400],
        boxShadow:
            theme.palette.mode === 'dark'
                ? `0 0 0 3px ${blue[600]}`
                : `0 0 0 3px ${blue[200]}`,
        outline: 'none',
    },

    // 🔥 Responsive Breakpoints
    [theme.breakpoints.down('sm')]: {
        maxWidth: 45,
        fontSize: '0.8rem',
        padding: '6px 2px',
    },

    [theme.breakpoints.up('md')]: {
        maxWidth: 60,
    },
}));


export default OTP;
