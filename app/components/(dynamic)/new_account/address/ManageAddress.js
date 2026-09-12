'use client';
import React, { useEffect, useState } from 'react';
import './manageaddress.scss';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Radio,
  FormControlLabel,
  TextField,
  Typography,
  Paper,
  Chip,
  IconButton,
  InputAdornment 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import {
  getAddressData,
  handleAddAddress,
  handleDefaultSelectionAddress,
  handleDeleteAddress,
  handleEditAddress,
} from '@/app/(core)/utils/API/AccountTabs/manageAddress';
import ConfirmationDialog from '@/app/(core)/utils/Glob_Functions/ConfirmationDialog/ConfirmationDialog';
import {
  validateAddressFieldAccount,
  validateAddressFormAccount,
} from '@/app/(core)/utils/Glob_Functions/AccountPages/AccountPage';

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    fontSize: '0.9rem',
    bgcolor: '#ffffff',
    '& fieldset': { borderColor: '#d1d5db' },
    '&:hover fieldset': { borderColor: '#9ca3af' },
    '&.Mui-focused fieldset': { borderColor: '#0b291d', borderWidth: '1.5px' },
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.88rem',
    color: '#6b7280',
    '&.Mui-focused': { color: '#0b291d' },
  },
};

const textareaStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    fontSize: '0.9rem',
    bgcolor: '#ffffff',
    '& fieldset': { borderColor: '#d1d5db' },
    '&:hover fieldset': { borderColor: '#9ca3af' },
    '&.Mui-focused fieldset': { borderColor: '#0b291d', borderWidth: '1.5px' },
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.88rem',
    color: '#6b7280',
    '&.Mui-focused': { color: '#0b291d' },
  },
};

const ManageAddress = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [addressData, setAddressData] = useState([]);
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editId, setEditId] = useState('');
  const [editAddressIndex, setEditAddressIndex] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    country: '',
    state: '',
    city: '',
    zipCode: '',
    mobileNo: '',
  });

  const handleDeleteAddressBtn = async () => {
    try {
      setOpenDelete(false);
      setIsLoading(true);
      const storedData = sessionStorage.getItem('loginUserDetail');
      const data = JSON.parse(storedData);
      const customerid = data?.id;
      const storeInit = JSON.parse(sessionStorage.getItem('storeInit')) || {};
      const { FrontEnd_RegNo } = storeInit;

      const response = await handleDeleteAddress(deleteId, data, FrontEnd_RegNo, customerid);
      if (response?.Data?.rd[0]?.stat === 1) {
        const updatedAddressData = addressData?.filter((item) => item?.id !== deleteId);
        setAddressData(updatedAddressData);
        fetchData();
        toast.success('Address deleted successfully');
      } else {
        toast.error('Error deleting address');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = (item, addressIndex = null, args) => {
    if (args === 'edit') {
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }

    if (addressIndex !== null && addressData.length > addressIndex) {
      setEditId(item.id);
      const address = addressData[addressIndex];
      if (address) {
        setFormData({
          firstName: address.shippingfirstname || '',
          lastName: address.shippinglastname || '',
          address: address.street || '',
          country: address.country || '',
          state: address.state || '',
          city: address.city || '',
          zipCode: address.zip || '',
          mobileNo: address.shippingmobile || '',
        });
        setEditAddressIndex(addressIndex);
      }
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        address: '',
        country: '',
        state: '',
        city: '',
        zipCode: '',
        mobileNo: '',
      });
      setEditAddressIndex(null);
    }
    setErrors({});
    setOpen(true);
  };

  const handleOpenDelete = (item) => {
    setDeleteId(item);
    setOpenDelete(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errorsCopy = validateAddressFormAccount(formData);
    setErrors(errorsCopy);

    const hasErrors = Object.values(errorsCopy).some((error) => error !== '');

    if (hasErrors) {
      return;
    }

    try {
      setIsLoading(true);
      const storedData = sessionStorage.getItem('loginUserDetail');
      const data = JSON.parse(storedData);
      const customerid = data?.id;
      const storeInit = JSON.parse(sessionStorage.getItem('storeInit')) || {};
      const { FrontEnd_RegNo } = storeInit;

      if (isEditMode) {
        const response = await handleEditAddress(editId, formData, FrontEnd_RegNo, customerid, storeInit, data);
        if (response?.Data?.rd[0]?.stat === 1) {
          toast.success('Address updated successfully');
          handleClose();
          fetchData();
        } else {
          toast.error(response?.Data?.rd[0]?.stat_msg || 'Error updating address');
        }
      } else {
        const response = await handleAddAddress(formData, FrontEnd_RegNo, customerid, storeInit, data);
        if (response?.Data?.rd[0]?.stat === 1) {
          toast.success('Address added successfully');
          handleClose();
          fetchData();
        } else {
          toast.error(response?.Data?.rd[0]?.stat_msg || 'Error adding address');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e, fieldName) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));

    const error = validateAddressFieldAccount(fieldName, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      address: '',
      country: '',
      state: '',
      city: '',
      zipCode: '',
      mobileNo: '',
    });
    setErrors({});
    setEditAddressIndex(null);
    setIsEditMode(false);
    setOpen(false);
  };

  const loginDetail = () => {
    try {
      const storedData = sessionStorage.getItem('loginUserDetail');
      const data = storedData ? JSON.parse(storedData) : {};
      return { id: data?.id || '', email: data?.userid || data?.email1 || data?.email || '' };
    } catch {
      return { id: '', email: '' };
    }
  };

  const handleDefaultSelection = async (addressId) => {
    setIsLoading(true);
    try {
      let loginCred = loginDetail();
      const storeInit = JSON.parse(sessionStorage.getItem('storeInit')) || {};
      const { FrontEnd_RegNo } = storeInit;

      const response = await handleDefaultSelectionAddress(loginCred, addressId, FrontEnd_RegNo);

      if (response?.Status === '200' && response?.Data?.rd) {
        setIsLoading(false);
        fetchData();
      } else {
        toast.error('No Data Found');
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const storedData = sessionStorage.getItem('loginUserDetail');
      const data = JSON.parse(storedData);
      const customerid = data.id;
      const storeInit = JSON.parse(sessionStorage.getItem('storeInit')) || {};
      const { FrontEnd_RegNo } = storeInit;

      const response = await getAddressData(FrontEnd_RegNo, customerid, data);

      if (response?.Data?.rd) {
        if (response?.Data?.rd?.length > 0) {
          let res = response?.Data?.rd?.find((e) => e?.isdefault === 1);

          let arr = [];
          if (res === undefined) {
            response?.Data?.rd?.forEach((a, i) => {
              let obj = { ...a };
              if (i === 0) {
                obj.isdefault = 1;
              }
              arr.push(obj);
            });
            setAddressData(arr);
          } else {
            setAddressData(response?.Data?.rd);
          }
        }
      } else {
        setAddressData([]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCloseDialog = () => {
    setOpenDelete(false);
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '4px',
      fontSize: '0.9rem',
      bgcolor: '#ffffff',
      '& fieldset': { borderColor: '#d1d5db' },
      '&:hover fieldset': { borderColor: '#9ca3af' },
      '&.Mui-focused fieldset': { borderColor: '#0b291d', borderWidth: '1.5px' },
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.88rem',
      color: '#6b7280',
      '&.Mui-focused': { color: '#0b291d' },
    },
  };

  const textareaStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '4px',
      fontSize: '0.9rem',
      bgcolor: '#ffffff',
      '& fieldset': { borderColor: '#d1d5db' },
      '&:hover fieldset': { borderColor: '#9ca3af' },
      '&.Mui-focused fieldset': { borderColor: '#0b291d', borderWidth: '1.5px' },
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.88rem',
      color: '#6b7280',
      '&.Mui-focused': { color: '#0b291d' },
    },
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Top Action Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          mb: 3,
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#111827',
              fontSize: '1.1rem',
              lineHeight: 1.2,
            }}
          >
            Saved Addresses ({addressData?.length || 0})
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.82rem', mt: 0.25 }}>
            Manage delivery and billing addresses for faster checkout
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={() => handleOpen('', null, 'add')}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            bgcolor: '#0b291d',
            color: '#ffffff',
            borderRadius: '4px',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.88rem',
            px: 2.5,
            py: 1,
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#144230',
              boxShadow: 'none',
            },
          }}
        >
          Add New Address
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={36} sx={{ color: '#0b291d' }} />
        </Box>
      ) : addressData?.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: '8px',
            bgcolor: '#fafafa',
            border: '1.5px dashed #d1d5db',
          }}
        >
          <LocationOnOutlinedIcon sx={{ fontSize: 48, color: '#9ca3af', mb: 1 }} />
          <Typography sx={{ fontWeight: 600, color: '#111827', mb: 0.5 }}>
            No addresses found
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#6b7280', mb: 2 }}>
            Add your primary shipping and billing address to get started.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen('', null, 'add')}
            sx={{
              bgcolor: '#0b291d',
              color: '#ffffff',
              borderRadius: '4px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.88rem',
              '&:hover': { bgcolor: '#144230' },
            }}
          >
            Add Address
          </Button>
        </Paper>
      ) : (
        /* Address Cards Grid */
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 2.5,
          }}
        >
          {addressData.map((item, index) => {
            const isDefault = item.isdefault === 1;

            return (
              <Paper
                key={item.id || index}
                elevation={0}
                sx={{
                  position: 'relative',
                  p: 2.5,
                  borderRadius: '6px',
                  border: isDefault ? '1.5px solid #0b291d' : '1px solid #e5e7eb',
                  bgcolor: isDefault ? '#fbfdfc' : '#ffffff',
                  boxShadow: isDefault
                    ? '0 2px 8px rgba(11, 41, 29, 0.06)'
                    : '0 1px 3px rgba(0, 0, 0, 0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: '#0b291d',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                  },
                }}
              >
                <Box>
                  {/* Top Bar: Name & Default Badge */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: '#111827',
                        fontSize: '0.98rem',
                        lineHeight: 1.3,
                      }}
                    >
                      {item?.shippingfirstname || ''} {item?.shippinglastname || ''}
                    </Typography>

                    {isDefault && (
                      <Chip
                        icon={<CheckCircleIcon sx={{ fontSize: '14px !important', color: '#0b291d !important' }} />}
                        label="Default"
                        size="small"
                        sx={{
                          bgcolor: '#e8f5e9',
                          color: '#0b291d',
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          height: '24px',
                        }}
                      />
                    )}
                  </Box>

                  {/* Address Body */}
                  <Typography
                    sx={{
                      fontSize: '0.85rem',
                      color: '#4b5563',
                      lineHeight: 1.5,
                      mb: 2,
                    }}
                  >
                    {item?.street && `${item.street}, `}
                    {item?.city && `${item.city}, `}
                    {item?.state && `${item.state} `}
                    {item?.zip && `- ${item.zip}, `}
                    {item?.country && item.country}
                  </Typography>

                  {/* Phone */}
                  {item?.shippingmobile && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontSize: '0.85rem',
                        color: '#374151',
                        mb: 2,
                      }}
                    >
                      <PhoneOutlinedIcon sx={{ fontSize: 16, color: '#9ca3af' }} />
                      <Typography sx={{ fontSize: 'inherit', fontWeight: 500 }}>
                        {item.shippingmobile}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Card Footer: Default Radio + Edit / Delete Actions */}
                <Box
                  sx={{
                    pt: 1.5,
                    borderTop: '1px solid #f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Radio
                        checked={isDefault}
                        onChange={() => handleDefaultSelection(item.id)}
                        size="small"
                        sx={{
                          p: 0.5,
                          color: '#9ca3af',
                          '&.Mui-checked': { color: '#0b291d' },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 500 }}>
                        {isDefault ? 'Default' : 'Set as default'}
                      </Typography>
                    }
                    sx={{ m: 0 }}
                  />

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<EditOutlinedIcon sx={{ fontSize: 15 }} />}
                      onClick={() => handleOpen(item, index, 'edit')}
                      sx={{
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#0b291d',
                        p: '3px 8px',
                        borderRadius: '3px',
                        border: '1px solid #e5e7eb',
                        '&:hover': { bgcolor: '#f3f4f6' },
                      }}
                    >
                      Edit
                    </Button>

                    {!isDefault && (
                      <Button
                        size="small"
                        startIcon={<DeleteOutlineIcon sx={{ fontSize: 15 }} />}
                        onClick={() => handleOpenDelete(item.id)}
                        sx={{
                          textTransform: 'none',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: '#dc2626',
                          p: '3px 8px',
                          borderRadius: '3px',
                          border: '1px solid #fecaca',
                          '&:hover': { bgcolor: '#fef2f2' },
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={openDelete}
        onClose={handleCloseDialog}
        onConfirm={handleDeleteAddressBtn}
        title="Delete Address"
        content="Are you sure you want to delete this address?"
      />

      {/* Add / Edit Address Modal Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: '8px',
            p: { xs: 0.5, sm: 1 },
            m: { xs: 1.5, sm: 2 },
            width: { xs: 'calc(100% - 24px)', sm: '100%' },
            maxHeight: '92vh',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 1,
            fontWeight: 700,
            fontSize: { xs: '1.05rem', sm: '1.15rem' },
            color: '#111827',
          }}
        >
          {isEditMode ? 'Edit Address' : 'Add New Address'}
          <IconButton onClick={handleClose} size="small">
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </DialogTitle>

        <Divider />

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ py: 2.5, px: { xs: 1.5, sm: 3 } }}>
            <Grid container spacing={2}>
              {/* First Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  id="firstName"
                  label="First Name"
                  placeholder="Enter first name"
                  fullWidth
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange(e, 'firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName || ''}
                  sx={inputStyle}
                />
              </Grid>

              {/* Last Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  id="lastName"
                  label="Last Name"
                  placeholder="Enter last name"
                  fullWidth
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange(e, 'lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName || ''}
                  sx={inputStyle}
                />
              </Grid>

              {/* Street Address */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  id="address"
                  label="Street Address"
                  placeholder="Enter flat / house / street address"
                  fullWidth
                  required
                  multiline
                  rows={2.5}
                  value={formData.address}
                  onChange={(e) => handleInputChange(e, 'address')}
                  error={!!errors.address}
                  helperText={errors.address || ''}
                  sx={textareaStyle}
                />
              </Grid>

              {/* City */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  id="city"
                  label="City"
                  placeholder="Enter city"
                  fullWidth
                  required
                  value={formData.city}
                  onChange={(e) => handleInputChange(e, 'city')}
                  error={!!errors.city}
                  helperText={errors.city || ''}
                  sx={inputStyle}
                />
              </Grid>

              {/* State */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  id="state"
                  label="State"
                  placeholder="Enter state"
                  fullWidth
                  required
                  value={formData.state}
                  onChange={(e) => handleInputChange(e, 'state')}
                  error={!!errors.state}
                  helperText={errors.state || ''}
                  sx={inputStyle}
                />
              </Grid>

              {/* Country */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  id="country"
                  label="Country"
                  placeholder="Enter country"
                  fullWidth
                  required
                  value={formData.country}
                  onChange={(e) => handleInputChange(e, 'country')}
                  error={!!errors.country}
                  helperText={errors.country || ''}
                  sx={inputStyle}
                />
              </Grid>

              {/* ZIP Code */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  id="zipCode"
                  label="PIN / ZIP Code"
                  placeholder="Enter postal code"
                  fullWidth
                  required
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange(e, 'zipCode')}
                  error={!!errors.zipCode}
                  helperText={errors.zipCode || ''}
                  sx={inputStyle}
                />
              </Grid>

              {/* Mobile Phone */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  id="mobileNo"
                  label="Mobile Phone"
                  placeholder="Enter 10-digit mobile number"
                  fullWidth
                  required
                  type="tel"
                  value={formData.mobileNo}
                  onChange={(e) => handleInputChange(e, 'mobileNo')}
                  error={!!errors.mobileNo}
                  helperText={errors.mobileNo || ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneOutlinedIcon sx={{ fontSize: 19, color: '#9ca3af' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputStyle}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <Divider />

          <DialogActions
            sx={{
              p: 2.5,
              gap: 1.5,
              flexDirection: { xs: 'column-reverse', sm: 'row' },
            }}
          >
            <Button
              onClick={handleClose}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                color: '#6b7280',
                borderRadius: '4px',
                textTransform: 'none',
                fontWeight: 600,
                px: 2.5,
                py: { xs: 1, sm: 0.75 },
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              sx={{
                width: { xs: '100%', sm: 'auto' },
                bgcolor: '#0b291d',
                color: '#ffffff',
                borderRadius: '4px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3.5,
                py: { xs: 1.1, sm: 0.75 },
                '&:hover': { bgcolor: '#144230' },
              }}
            >
              {isEditMode ? 'Update Address' : 'Save Address'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ManageAddress;
