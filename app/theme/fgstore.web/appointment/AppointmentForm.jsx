import React, { useEffect, useState } from 'react';
import './AppointmentForm.scss';
import { storImagePath } from '@/app/(core)/utils/Glob_Functions/GlobalFunction';
import { BookAppointment } from '@/app/(core)/utils/API/BookAppointment/BookAppointment';
import { toast } from 'react-toastify';
import {
    TextField,
    Button,
    Box,
    Typography,
    Grid,
    InputLabel,
    CircularProgress
} from '@mui/material';

const AppointmentForm = ({ selectedItem, setSelectedItem }) => {
    const [loginDetail, setLoginDetail] = useState(null);
    const [selectRequest, setSelectRequest] = useState('');
    const [loading, setLoading] = useState({
        load: false,
        index: 0
    });
    const [minDateTime, setMinDateTime] = useState('');
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        EmailId: '',
        mobileno: '',
        AppointmentMessage: '',
        AppointmentDateTime: '',
        JewelleryType: selectedItem?.title || '',
        RequestId: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRequestTypeChange = (requestType) => {
        setSelectRequest(requestType);
        setFormData(prevData => ({
            ...prevData,
            RequestId: requestType
        }));
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '';
        const [date, time] = dateTimeString.split('T');
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year} ${time}`;
    };

    useEffect(() => {
        const islogin = JSON.parse(sessionStorage.getItem("loginUserDetail"));
        setLoginDetail(islogin);
    }, []);

    useEffect(() => {
        const today = new Date();
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(today.getDate() + 3);
        const formatDate = (date) => {
            return date.toISOString().slice(0, 16);
        };
        setMinDateTime(formatDate(threeDaysFromNow));
    }, []);

    useEffect(() => {
        if (loginDetail) {
            setFormData({
                firstname: loginDetail.firstname ?? '',
                lastname: loginDetail.lastname ?? '',
                EmailId: loginDetail.userid ?? '',
                mobileno: loginDetail.mobileno ?? '',
                AppointmentMessage: '',
                AppointmentDateTime: '',
                JewelleryType: selectedItem?.title || '',
                RequestId: '',
            });
        }
    }, [loginDetail, selectedItem]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
        if (value) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: '',
            }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.firstname) newErrors.firstname = 'First Name is required';
        if (!formData.lastname) newErrors.lastname = 'Last Name is required';
        if (!formData.EmailId) newErrors.EmailId = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.EmailId)) newErrors.EmailId = 'Invalid email address';
        if (!formData.mobileno) newErrors.mobileno = 'Phone is required';
        if (!formData.AppointmentDateTime) newErrors.AppointmentDateTime = 'Date & Time is required';
        return newErrors;
    };

    const handleSubmit = async (event, index) => {
        event.preventDefault();
        const formErrors = validate();
        if (Object.keys(formErrors).length === 0) {
            setIsSubmitting(true);
            setLoading({ load: true, index });
            const formattedData = {
                ...formData,
                AppointmentDateTime: formatDateTime(formData?.AppointmentDateTime)
            };
            try {
                const res = await BookAppointment(formattedData);
                if (res?.stat == 1 || res?.stat_msg === 'success') {
                    setSelectedItem({});
                    toast.success("Appointment Booked Successfully");
                } else {
                    toast.error("Something went wrong");
                }
            } catch (error) {
                console.error("Booking error:", error);
                toast.error("Failed to book appointment");
            } finally {
                setLoading({ load: false, index: 0 });
                setIsSubmitting(false);
            }
        } else {
            setErrors(formErrors);
        }
    };

    const handleEdit = () => {
        setSelectedItem({});
    };

    useEffect(() => {
        window.scrollTo({
            top: 250,
            behavior: "smooth"
        });
    }, []);

    return (
        <Box className="form-container" sx={{ maxWidth: 800, margin: 'auto', p: 3, bgcolor: 'background.paper', boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
                Share details
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Box
                    component="img"
                    src={`${storImagePath()}${selectedItem?.image}`}
                    alt={selectedItem?.title}
                    sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1, mr: 3 }}
                />
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>{selectedItem?.title}</Typography>
                    <Button variant="outlined" size="small" onClick={handleEdit} sx={{ mt: 1 }}>
                        Edit
                    </Button>
                </Box>
            </Box>

            <form onSubmit={(e) => handleSubmit(e, formData?.RequestId)}>
                <Grid container spacing={3}>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="First Name*"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            error={!!errors.firstname}
                            helperText={errors.firstname}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Last Name*"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            error={!!errors.lastname}
                            helperText={errors.lastname}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Email*"
                            name="EmailId"
                            type="email"
                            value={formData.EmailId}
                            onChange={handleChange}
                            error={!!errors.EmailId}
                            helperText={errors.EmailId}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Phone*"
                            name="mobileno"
                            type="tel"
                            value={formData.mobileno}
                            onChange={handleChange}
                            error={!!errors.mobileno}
                            helperText={errors.mobileno}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Message (Optional)"
                            name="AppointmentMessage"
                            multiline
                            rows={4}
                            value={formData.AppointmentMessage}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Select a Date & Time*"
                            name="AppointmentDateTime"
                            type="datetime-local"
                            value={formData.AppointmentDateTime}
                            onChange={handleChange}
                            error={!!errors.AppointmentDateTime}
                            helperText={errors.AppointmentDateTime}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ min: minDateTime }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item size={{ xs: 12 }}>
                        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                disabled={isSubmitting}
                                onClick={() => handleRequestTypeChange('1')}
                                sx={{ flexGrow: 1, minHeight: 50 }}
                            >
                                {loading?.load && loading?.index === '1' ? <CircularProgress size={24} color="inherit" /> : 'Book Appointment'}
                            </Button>
                            <Button
                                type="submit"
                                variant="outlined"
                                color="primary"
                                size="large"
                                disabled={isSubmitting}
                                onClick={() => handleRequestTypeChange('2')}
                                sx={{ flexGrow: 1, minHeight: 50 }}
                            >
                                {loading?.load && loading?.index === '2' ? <CircularProgress size={24} color="inherit" /> : 'Request A Callback'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid >
            </form >
        </Box >
    );
};


export default AppointmentForm;
