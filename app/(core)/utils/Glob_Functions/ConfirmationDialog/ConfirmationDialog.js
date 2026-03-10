import React from 'react';
import ReusableConfirmModal from '@/app/components/ui/Modal';

const ConfirmationDialog = ({ open, onClose, onConfirm, title, content }) => {

  return <>
    <ReusableConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      type="close"
    />
  </>
};

export default ConfirmationDialog;
