import React from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Stack
} from '@mui/material';

const RemarkModal = ({ open, onClose, remark, onRemarkChange, onSave }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '92%', sm: 420 },
          bgcolor: '#fff',
          borderRadius: '2px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 1,
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: '16px', color: '#222' }}>
            Add Remark
          </Typography>

          <Typography
            onClick={onClose}
            sx={{
              cursor: 'pointer',
              fontSize: '18px',
              color: '#999',
              '&:hover': { color: '#000' }
            }}
          >
            ✕
          </Typography>
        </Box>

        {/* Body */}
        <Box sx={{ px: 1, py: 1 }}>
          <TextField
            multiline
            rows={5}
            fullWidth
            value={remark}
            onChange={onRemarkChange}
            placeholder="Add a note for this item..."
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                background: '#fafafa',
                fontSize: '14px',
                border: 'none'
              },
              border: 'none',
              outline: 'none'
            }}
          />
        </Box>

        {/* Footer */}
        <Box
          sx={{
            px: 3,
            py: 1,
            borderTop: '1px solid #eee',
          }}
        >
          <Stack direction="row" spacing={1.5} justifyContent="flex-end">
            <Button
              onClick={onClose}
              variant="outlined"
              size="small"
              sx={{
                textTransform: 'none',
                borderRadius: '4px',
                borderColor: '#ccc',
                color: '#555',
                px: 2,
                '&:hover': {
                  borderColor: '#999',
                  background: '#f5f5f5'
                }
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={onSave}
              variant="contained"
              size="small"
              sx={{
                textTransform: 'none',
                borderRadius: '4px',
                px: 2.5,
                background: '#c20000',
                '&:hover': {
                  background: '#a00000'
                }
              }}
            >
              Save
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};

export default RemarkModal;