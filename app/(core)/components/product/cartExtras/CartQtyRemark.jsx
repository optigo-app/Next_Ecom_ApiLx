"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, CircularProgress, TextField, Typography } from "@mui/material";
import QuantityStepper from "@/app/components/testcheckout/components/QuantityStepper";

const labelSx = {
  fontSize: "0.78rem",
  fontWeight: 600,
  color: "#333",
  letterSpacing: "0.3px",
  textTransform: "uppercase",
  mb: 0.8,
};

/**
 * Quantity + remark inputs for the product detail page.
 *  - Not in cart: values only live in state and are sent with ADDTOCART.
 *  - In cart: changes are passed up with `isInCart` and the caller debounces
 *    the Quantity / Remark API calls (no explicit save button).
 * The remark box keeps a local draft and pushes it up on a debounce so typing
 * never re-renders the whole detail page per keystroke.
 */
export default function CartQtyRemark({
  isInCart = false,
  quantity = 1,
  onQuantityChange,
  remark = "",
  onRemarkChange,
  isSaving = false,
}) {
  const [draft, setDraft] = useState(remark ?? "");
  const draftRef = useRef(draft);
  const focusedRef = useRef(false);
  const pushTimer = useRef(null);
  const lastPushed = useRef(remark ?? "");
  draftRef.current = draft;

  // Re-sync from props only when not focused and the value actually came from
  // outside (seed / server refresh), not from our own push.
  useEffect(() => {
    if (!focusedRef.current && (remark ?? "") !== lastPushed.current) {
      lastPushed.current = remark ?? "";
      setDraft(remark ?? "");
    }
  }, [remark]);

  const push = (val) => {
    lastPushed.current = val;
    onRemarkChange?.(val, isInCart);
  };

  const handleChange = (e) => {
    const v = e.target.value;
    setDraft(v);
    clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(() => push(v), 400);
  };

  const handleBlur = () => {
    focusedRef.current = false;
    clearTimeout(pushTimer.current);
    pushTimer.current = null;
    if (draft !== lastPushed.current) push(draft);
  };

  useEffect(
    () => () => {
      clearTimeout(pushTimer.current);
      if (lastPushed.current !== draftRef.current)
        onRemarkChange?.(draftRef.current, isInCart);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
      <Box>
        <Typography sx={labelSx}>Quantity</Typography>
        <QuantityStepper
          variant="square"
          value={quantity}
          commitOnType
          onChange={(next) => onQuantityChange?.(next, isInCart)}
        />
      </Box>

      <Box>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography sx={labelSx}>Remark</Typography>
          {isInCart && (
            <Typography
              component="span"
              sx={{
                fontSize: "0.68rem",
                color: isSaving ? "#b8860b" : "#888",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {isSaving ? (
                <>
                  <CircularProgress size={10} thickness={6} sx={{ color: "#b8860b" }} />
                  Saving…
                </>
              ) : (
                "Autosaves as you type"
              )}
            </Typography>
          )}
        </Box>
        <TextField
          fullWidth
          multiline
          minRows={2}
          maxRows={4}
          size="small"
          placeholder="Add a note for this item"
          value={draft}
          onFocus={() => {
            focusedRef.current = true;
          }}
          onBlur={handleBlur}
          onChange={handleChange}
          inputProps={{ maxLength: 500 }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "2px",
              fontSize: "0.9rem",
              "& fieldset": { borderColor: "#dcdcdc" },
              "&:hover fieldset": { borderColor: "#999" },
              "&.Mui-focused fieldset": { borderColor: "#000", borderWidth: 1 },
            },
          }}
        />
      </Box>
    </Box>
  );
}
