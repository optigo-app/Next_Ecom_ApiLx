import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './Hoq3_RemarkModal.scss';

const RemarkModal = ({ open, onClose, remark, onRemarkChange, onSave }) => {

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="remark-modal-title"
      aria-describedby="remark-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: 800,
          width:500,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '8px',
        }}
        className="Hoq3_remarkModalBox"
      >
        <Typography id="remark-modal-title" variant="h6" component="h2">
          Add The Item Remark..
        </Typography>
        <TextField
          id="remark-modal-description"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={remark}
          onChange={onRemarkChange}
          sx={{ mt: 2 }}
          className='Hoq3_RemarkMoalInput'
        />
        <div className="Hoq3_projectRemarkBtn-group">
          <Button className="Hoq3_remarksave-btn" onClick={onSave}>
            Save
          </Button>
          <Button className="Hoq3_remarkcancel-btn" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default RemarkModal;
