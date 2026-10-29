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

const InputElement = styled('input')(
  ({ theme }) => `
  width: 45px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 3;
  padding: 8px 0px;
  border-radius: 3px;
  text-align: center;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 4px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
    };

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);

export default OTP;
