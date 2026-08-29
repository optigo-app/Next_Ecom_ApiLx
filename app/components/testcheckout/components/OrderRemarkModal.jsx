"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

export default function OrderRemarkModal({ open, onClose, initialRemark, onSave }) {
  const [remark, setRemark] = useState("");

  useEffect(() => {
    setRemark(initialRemark || "");
  }, [initialRemark, open]);

  const handleSave = () => {
    onSave(remark.trim());
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1.1rem" }}>Order Remark</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Order Instructions / Remarks"
          type="text"
          fullWidth
          multiline
          rows={3}
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          variant="outlined"
          placeholder="Special delivery instructions or order notes..."
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: "#777" }}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" className="btnColorProCat">
          Save Remark
        </Button>
      </DialogActions>
    </Dialog>
  );
}
