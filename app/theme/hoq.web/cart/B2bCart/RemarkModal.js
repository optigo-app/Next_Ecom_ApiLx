import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './hoq_RemarkModal.scss';

const RemarkModal = ({ open, onClose, remark, onRemarkChange, onSave }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="remark-modal-title"
      aria-describedby="remark-modal-description"
      sx={{
        zIndex : 999999,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: {
            xs: '90%',    
            sm: '80%',    
            md: '60%',    
            lg: '50%',    
            xl: '40%',    
          },
          p: {
            xs: 2,        // Padding of 2 on extra-small screens
            sm: 3,        // Padding of 3 on small screens
            md: 4,        // Padding of 4 on medium screens
            lg: 5,        // Padding of 5 on large screens
            xl: 6,        // Padding of 6 on extra-large screens
          },
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '8px',
        }}
        className="hoq_remarkModalBox"
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
          className='hoq_RemarkMoalInput'
        />
        <div className="hoq_projectRemarkBtn-group">
          <Button className="hoq_remarksave-btn" onClick={onSave}>
            Save
          </Button>
          <Button className="hoq_remarkcancel-btn" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default RemarkModal;
