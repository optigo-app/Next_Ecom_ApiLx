import { useState, useMemo, useRef } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Modal,
  Fade,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";

const FileUploadField = ({
  label,
  name,
  file,
  required = false,
  handleFileChange = () => {},
  handleDocRemove = () => {},
  error = false,
}) => {
  const [openPreview, setOpenPreview] = useState(false);
  const fileInputRef = useRef(null);

  const { previewUrl, previewType, previewMessage } = useMemo(() => {
    if (!file)
      return {
        previewUrl: null,
        previewType: null,
        previewMessage: "No file uploaded",
      };

    const ext = file.name?.split(".").pop().toLowerCase();
    const url = URL.createObjectURL(file);

    if (["jpg", "jpeg", "png"].includes(ext))
      return { previewUrl: url, previewType: "image" };
    if (ext === "pdf") return { previewUrl: url, previewType: "pdf" };
    return {
      previewUrl: null,
      previewType: "unsupported",
      previewMessage: "Preview not supported",
    };
  }, [file]);

  const renderPreviewContent = () => {
    if (previewType === "image")
      return (
        <Box
          component="img"
          src={previewUrl}
          alt="Preview"
          sx={{
            width: "100%",
            height: "auto",
            maxHeight: "80vh",
            borderRadius: "12px",
            objectFit: "contain",
          }}
        />
      );

    if (previewType === "pdf")
      return (
        <iframe
          src={previewUrl}
          title="PDF Preview"
          style={{
            width: "100%",
            height: "80vh",
            border: "none",
            borderRadius: "12px",
          }}
        />
      );

    return (
      <Typography
        variant="body2"
        sx={{
          color: "rgba(255,255,255,0.8)",
          fontSize: 14,
          textAlign: "center",
          p: 2,
        }}
      >
        {previewMessage}
      </Typography>
    );
  };

  const handleInputChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileChange(e);
    }
  };

  const handleRemoveFile = () => {
    handleDocRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // ✅ Reset input to allow re-upload of same file
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Tooltip
  title={
    previewType
      ? previewType === "unsupported"
        ? previewMessage
        : "Click to preview"
      : "Upload a file"
  }
  arrow
>
  <IconButton
    component={!file ? "label" : "button"} // ✅ only act as label when no file
    onClick={() => file && setOpenPreview(true)}
    sx={{
      justifyContent: "center",
      alignItems: "center",
      display: "flex",
      gap: 1,
      border:
      error
        ? "1.5px solid #ef4444"
        : file
        ? "1.5px solid #10b981"
        : "1.5px solid rgba(255,255,255,0.1)",
      bgcolor: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(12px)",
      color: file ? "#10b981" : "#9ca3af",
      fontWeight: 500,
      fontSize: "0.95rem",
      transition: "all 0.25s ease",
      "&:hover": {
        bgcolor: "rgba(255,255,255,0.06)",
        borderColor: file
          ? "#10b981"
          : "rgba(255,255,255,0.2)",
      },
    }}
  >
    {file ? <CheckIcon sx={{ color: "#10b981" }} /> : <UploadIcon />}
    {!file && (
      <input
        ref={fileInputRef}
        type="file"
        name={name}
        hidden
        onChange={handleInputChange}
        accept=".pdf,.jpg,.jpeg,.png"
      />
    )}
  </IconButton>
</Tooltip>


        {file && (
          <IconButton
            variant="outlined"
            onClick={handleRemoveFile}
            sx={{
              ml: 1,
              color: "#f87171",
              "&:hover": {
                color: "#ef4444",
                bgcolor: "rgba(255,255,255,0.05)",
              },
            }}
          >
            <RemoveCircleRoundedIcon />
          </IconButton>
        )}
      </Box>

      {/* Modern Modal Preview */}
      <Modal
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        closeAfterTransition
      >
        <Fade in={openPreview}>
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: "70%", md: "60%", lg: "50%" },
              bgcolor: "rgba(20,20,22,0.9)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              borderRadius: "16px",
              backdropFilter: "blur(16px)",
              p: 2,
              outline: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              maxHeight: "90vh",
              overflow: "hidden",
            }}
          >
            {renderPreviewContent()}

            <IconButton
              onClick={() => setOpenPreview(false)}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "rgba(255,255,255,0.8)",
                "&:hover": {
                  color: "#fff",
                  bgcolor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              <RemoveCircleRoundedIcon />
            </IconButton>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default FileUploadField;
