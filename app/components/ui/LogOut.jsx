import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const LogOutModal = ({ open, onClose, onConfirm }) => {
  const modalConfig = {
    title: "Confirm Logout",
    icon: <LogoutIcon color="error" />,
    message: "Are you sure you want to log out of your account? You will need to sign in again to access.",
    confirmText: "Logout",
    cancelText: "Cancel",
    confirmColor: "error",
    cancelColor: "inherit",
  };

  const { title, icon, message, confirmText, cancelText, confirmColor, cancelColor } = modalConfig;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="confirm-modal-title"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle id="confirm-modal-title" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {icon}
        {title}
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ color: "#4B5563" }}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color={cancelColor}>
          {cancelText}
        </Button>
        <Button onClick={onConfirm} variant="contained" color={confirmColor}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogOutModal;
