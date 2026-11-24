"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

export default function ProductRemarkModal({ open, onClose, initialRemark, onSave }) {
  const [remark, setRemark] = useState("");

  useEffect(() => {
    setRemark(initialRemark || "");
  }, [initialRemark, open]);

  const handleSave = () => {
    onSave(remark.trim());
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        className: "tc-root",
        sx: {
          bgcolor: "var(--tc-surface-beige)",
          borderRadius: "var(--tc-radius)",
          border: "1px solid var(--tc-border-warm)",
          boxShadow: "var(--tc-overlay-shadow)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "1.05rem",
          color: "var(--tc-text-warm)",
          pb: 1,
        }}
      >
        Product Remark
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Enter remark"
          type="text"
          fullWidth
          multiline
          rows={3}
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          variant="outlined"
          placeholder="e.g. Please engrave 'Love Forever'"
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "var(--tc-surface)",
              "& fieldset": { borderColor: "var(--tc-border-warm-strong)" },
              "&:hover fieldset": { borderColor: "var(--tc-border-focus)" },
              "&.Mui-focused fieldset": { borderColor: "var(--tc-border-focus-deep)", borderWidth: 1 },
            },
            "& .MuiInputLabel-root": { color: "var(--tc-text-warm-muted)" },
            "& .MuiInputLabel-root.Mui-focused": { color: "var(--tc-text-warm-accent)" },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ color: "var(--tc-text-warm-muted)", textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          className="btnColorProCat"
          sx={{ textTransform: "none", borderRadius: "8px" }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
