'use client';
import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  Paper,
  IconButton,
} from '@mui/material';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import PercentOutlinedIcon from '@mui/icons-material/PercentOutlined';
import CheckIcon from '@mui/icons-material/Check';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import './Plm.scss';

const Plm = () => {
  const [formData, setFormData] = useState({
    labelName: '',
    logo: null,
    markUp: 0,
    logoPreview: null,
  });

  const [showPreview, setShowPreview] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        logo: file,
        logoPreview: fileUrl,
      }));
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({
      ...prev,
      logo: null,
      logoPreview: null,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('labelName', formData?.labelName);
    data.append('file', formData?.logo);
    data.append('fileUrl', formData?.logoPreview);
    data.append('markUp', formData?.markUp);
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '4px',
      bgcolor: '#ffffff',
      fontSize: '0.92rem',
      transition: 'all 0.15s ease-in-out',
      '& fieldset': {
        borderColor: '#d1d5db',
      },
      '&:hover fieldset': {
        borderColor: '#9ca3af',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#0b291d',
        borderWidth: '1.5px',
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.88rem',
      color: '#6b7280',
      '&.Mui-focused': { color: '#0b291d' },
    },
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '600px' }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#111827',
            fontSize: '1.1rem',
            lineHeight: 1.2,
          }}
        >
          Private Label Setup
        </Typography>
        <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.82rem', mt: 0.25 }}>
          Configure your custom brand label, logo, and mark-up percentage
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        {/* Label Name */}
        <TextField
          id="labelName"
          name="labelName"
          label="Label Name"
          placeholder="e.g. My Luxury Label"
          variant="outlined"
          fullWidth
          required
          value={formData.labelName}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LabelOutlinedIcon sx={{ fontSize: 19, color: '#9ca3af' }} />
              </InputAdornment>
            ),
          }}
          sx={inputStyle}
        />

        {/* Upload Logo Container */}
        <Box>
          <Typography
            sx={{
              fontSize: '0.88rem',
              fontWeight: 600,
              color: '#374151',
              mb: 1,
            }}
          >
            Brand Logo *
          </Typography>

          {!formData.logoPreview ? (
            <Paper
              variant="outlined"
              component="label"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
                border: '1.5px dashed #d1d5db',
                borderRadius: '6px',
                bgcolor: '#fafafa',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  bgcolor: '#f3f4f6',
                  borderColor: '#0b291d',
                },
              }}
            >
              <CloudUploadOutlinedIcon sx={{ fontSize: 36, color: '#6b7280', mb: 1 }} />
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#111827' }}>
                Click to upload brand logo
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#6b7280', mt: 0.25 }}>
                SVG, PNG, JPG or WEBP (Max 5MB)
              </Typography>
              <input
                type="file"
                id="logo"
                name="logo"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                required
              />
            </Paper>
          ) : (
            <Paper
              variant="outlined"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                bgcolor: '#ffffff',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  component="img"
                  src={formData.logoPreview}
                  alt="Logo Preview"
                  sx={{
                    width: 54,
                    height: 54,
                    objectFit: 'contain',
                    borderRadius: '4px',
                    border: '1px solid #e5e7eb',
                    p: 0.5,
                    bgcolor: '#f9fafb',
                  }}
                />
                <Box>
                  <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#111827' }}>
                    {formData.logo?.name || 'Uploaded Logo'}
                  </Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: '#059669', fontWeight: 500 }}>
                    ✓ Ready to upload
                  </Typography>
                </Box>
              </Box>

              <IconButton
                onClick={handleRemoveFile}
                sx={{
                  color: '#dc2626',
                  '&:hover': { bgcolor: '#fef2f2' },
                }}
                title="Remove logo"
              >
                <DeleteOutlineIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Paper>
          )}
        </Box>

        {/* Mark Up (%) */}
        <TextField
          id="markUp"
          name="markUp"
          label="Mark Up (%)"
          placeholder="0"
          type="number"
          variant="outlined"
          fullWidth
          required
          value={formData.markUp}
          onChange={handleChange}
          inputProps={{
            min: 0,
            max: 100,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PercentOutlinedIcon sx={{ fontSize: 19, color: '#9ca3af' }} />
              </InputAdornment>
            ),
          }}
          sx={inputStyle}
        />

        {/* Save Button */}
        <Box sx={{ mt: 1 }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<CheckIcon sx={{ fontSize: 18 }} />}
            sx={{
              bgcolor: '#0b291d',
              color: '#ffffff',
              borderRadius: '4px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.92rem',
              px: 4,
              py: 1.25,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#144230',
                boxShadow: 'none',
              },
            }}
          >
            Save Setup
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Plm;
