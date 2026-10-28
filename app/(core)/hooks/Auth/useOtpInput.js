"use client";

import { useEffect, useRef } from 'react';

/** Shared keyboard, focus, editing, and paste behavior for OTP inputs. */
export default function useOtpInput({
  length = 6,
  value,
  otp,
  onChange,
  setOtp,
  onSubmit,
}) {
  const rawValue = value !== undefined && value !== null ? value : (otp ?? '');
  const actualValue = typeof rawValue === 'string' ? rawValue : String(rawValue);
  const updateValue = onChange || setOtp || (() => {});
  const inputRefs = useRef(new Array(length).fill(null));

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const focusInput = (index) => inputRefs.current[index]?.focus();
  const selectInput = (index) => inputRefs.current[index]?.select();

  const handleKeyDown = (event, index) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        if (index > 0) {
          focusInput(index - 1);
          selectInput(index - 1);
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (index < length - 1) {
          focusInput(index + 1);
          selectInput(index + 1);
        }
        break;
      case 'Delete':
      case 'Backspace':
        event.preventDefault();
        if (event.key === 'Backspace' && index > 0) {
          focusInput(index - 1);
          selectInput(index - 1);
        }
        updateValue((previous = '') => {
          const text = String(previous ?? '');
          return text.slice(0, index) + text.slice(index + 1);
        });
        break;
      case 'Enter':
        event.preventDefault();
        if (index === length - 1 && typeof onSubmit === 'function') onSubmit();
        break;
      default:
        break;
    }
  };

  const handleChange = (event, index) => {
    const enteredValue = event.target.value;
    let targetIndex = 0;

    while (
      targetIndex <= index &&
      inputRefs.current[targetIndex]?.value &&
      targetIndex < index
    ) {
      targetIndex += 1;
    }

    updateValue((previous = '') => {
      const digits = String(previous ?? '').split('');
      digits[targetIndex] = enteredValue[enteredValue.length - 1];
      return digits.join('');
    });

    if (enteredValue !== '' && index < length - 1) focusInput(index + 1);
  };

  const handleClick = (_event, index) => selectInput(index);

  const handlePaste = (event, index) => {
    event.preventDefault();
    const clipboard = event.clipboardData;
    if (!clipboard?.types?.includes('text/plain')) return;

    const pastedText = clipboard.getData('text/plain').substring(0, length).trim();
    let targetIndex = 0;
    while (
      targetIndex <= index &&
      inputRefs.current[targetIndex]?.value &&
      targetIndex < index
    ) {
      targetIndex += 1;
    }

    const digits = actualValue.split('');
    for (let position = targetIndex; position < length; position += 1) {
      digits[position] = pastedText[position - targetIndex] ?? ' ';
    }
    updateValue(digits.join(''));
  };

  return { actualValue, inputRefs, handleKeyDown, handleChange, handleClick, handlePaste };
}
