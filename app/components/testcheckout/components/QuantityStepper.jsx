"use client";

import React, { useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

const REEL_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * QuantityStepper — pill stepper with round +/- buttons and a typable input.
 * The displayed value animates with a NumberFlow-like rolling digit effect
 * implemented with pure CSS transforms (each digit is a 0-9 reel that
 * translateY's to the active digit).
 *
 * Props:
 *  - value: committed quantity (number or numeric string)
 *  - onChange(next:number): fired on step click / input blur / Enter
 *  - min / max: clamp bounds (min defaults to 1)
 *  - disabled: greys out buttons & input (e.g. while API call in flight)
 */
export default function QuantityStepper({
  value = 1,
  onChange,
  min = 1,
  max,
  disabled = false,
  variant = "pill", // "pill" (compact rounded) | "square" (field-style box)
  commitOnType = false, // fire onChange for every valid typed number (caller debounces)
  sx = {},
}) {
  const isSquare = variant === "square";
  const parsed = parseInt(value, 10);
  const numValue = isNaN(parsed) ? null : parsed;
  const displayStr = numValue == null ? "" : String(numValue);

  const [focused, setFocused] = useState(false);
  const [text, setText] = useState(displayStr);

  // Keep the editable text in sync with external value while not typing
  useEffect(() => {
    if (!focused) setText(displayStr);
  }, [displayStr, focused]);

  const commit = (raw) => {
    let next = parseInt(raw, 10);
    if (isNaN(next)) next = min;
    next = Math.max(min, max != null ? Math.min(max, next) : next);
    setText(String(next));
    if (next !== numValue) onChange?.(next);
  };

  const step = (delta) => commit(String((numValue ?? min) + delta));

  return (
    <Box
      className="quantityStepper"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        width: "fit-content",
        flexShrink: 0,
        border: "1px solid var(--tc-border, #dcdcdc)",
        borderRadius: isSquare ? "10px" : "999px",
        bgcolor: "var(--tc-surface, #fff)",
        height: isSquare ? 42 : 30,
        px: isSquare ? 0.6 : 0.25,
        boxSizing: "border-box",
        opacity: disabled ? 0.6 : 1,
        transition: "border-color 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease",
        "&:focus-within": {
          borderColor: "var(--checkout-primary, #cca182)",
          boxShadow: "0 0 0 2px var(--checkout-primary-light-border, #edd8c7)",
        },
        ...sx,
      }}
    >
      <IconButton
        size="small"
        aria-label="decrease quantity"
        onClick={() => step(-1)}
        disabled={disabled || (numValue != null && numValue <= min)}
        sx={{
          width: isSquare ? 32 : 23,
          height: isSquare ? 32 : 23,
          borderRadius: isSquare ? "8px" : "50%",
          color: "var(--tc-text-muted, #555)",
          bgcolor: isSquare ? "transparent" : "var(--tc-surface-subtle, #f5f5f5)",
          transition: "transform 0.12s ease, background-color 0.2s ease",
          "&:hover": { bgcolor: isSquare ? "var(--tc-surface-subtle, #f5f5f5)" : "var(--tc-border-light, #ececec)", color: "var(--tc-text, #111)" },
          "&:active": { transform: "scale(0.88)" },
        }}
      >
        <RemoveIcon sx={{ fontSize: isSquare ? 16 : 13 }} />
      </IconButton>

      <Box
        sx={{
          position: "relative",
          minWidth: isSquare ? 44 : 22,
          alignSelf: "stretch",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: isSquare ? "0.95rem" : "0.8rem",
          fontWeight: 600,
          color: "var(--tc-text-body, #222)",
        }}
      >
        <Box
          component="input"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          aria-label="quantity"
          value={text}
          disabled={disabled}
          onFocus={(e) => {
            setFocused(true);
            setText(displayStr);
            e.target.select();
          }}
          onChange={(e) => {
            const v = e.target.value;
            if (!/^\d*$/.test(v)) return;
            setText(v);
            if (commitOnType) {
              const typed = parseInt(v, 10);
              if (!isNaN(typed) && typed >= min && typed !== numValue) {
                onChange?.(max != null ? Math.min(max, typed) : typed);
              }
            }
          }}
          onBlur={() => {
            setFocused(false);
            commit(text);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.target.blur();
            else if (e.key === "ArrowUp") {
              e.preventDefault();
              step(1);
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              step(-1);
            }
          }}
          sx={{
            width: "100%",
            height: "100%",
            border: "none",
            outline: "none",
            bgcolor: "transparent",
            textAlign: "center",
            font: "inherit",
            p: 0,
            // Hide raw text while unfocused — the animated digit reels render instead
            color: focused ? "var(--tc-text-body, #222)" : "transparent",
            caretColor: focused ? "var(--tc-text-body, #222)" : "transparent",
            "::selection": { bgcolor: "rgba(204,161,130,0.35)" },
          }}
        />

        {!focused && displayStr !== "" && (
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              lineHeight: "1em",
            }}
          >
            {displayStr.split("").map((digit, i) => (
              <Box
                component="span"
                key={i}
                sx={{
                  display: "inline-block",
                  height: "1em",
                  overflow: "hidden",
                  lineHeight: "1em",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    transform: `translateY(-${Number(digit)}em)`,
                    transition: "transform 0.32s cubic-bezier(0.2, 0.8, 0.2, 1)",
                  }}
                >
                  {REEL_DIGITS.map((n) => (
                    <Box
                      component="span"
                      key={n}
                      sx={{
                        height: "1em",
                        lineHeight: "1em",
                        textAlign: "center",
                      }}
                    >
                      {n}
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <IconButton
        size="small"
        aria-label="increase quantity"
        onClick={() => step(1)}
        disabled={disabled || (max != null && numValue != null && numValue >= max)}
        sx={{
          width: isSquare ? 32 : 23,
          height: isSquare ? 32 : 23,
          borderRadius: isSquare ? "8px" : "50%",
          color: "var(--tc-text-muted, #555)",
          bgcolor: isSquare ? "transparent" : "var(--tc-surface-subtle, #f5f5f5)",
          transition: "transform 0.12s ease, background-color 0.2s ease",
          "&:hover": { bgcolor: isSquare ? "var(--tc-surface-subtle, #f5f5f5)" : "var(--tc-border-light, #ececec)", color: "var(--tc-text, #111)" },
          "&:active": { transform: "scale(0.88)" },
        }}
      >
        <AddIcon sx={{ fontSize: isSquare ? 16 : 13 }} />
      </IconButton>
    </Box>
  );
}
