import React, { useEffect, useState } from 'react';
import './AppointmentForm.scss';
import { storImagePath } from '@/app/(core)/utils/Glob_Functions/GlobalFunction';
import { BookAppointment } from '@/app/(core)/utils/API/BookAppointment/BookAppointment';
import { toast } from 'react-toastify';

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
        JewelleryType: selectedItem?.title,
        RequestId: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRequestTypeChange = (requestType) => {
        setSelectRequest(requestType);
        setFormData(prevData => {
            const newData = {
                ...prevData,
                RequestId: requestType
            };
            return newData;
        });
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
                JewelleryType: '',
                RequestId: '',
            });
        }
    }, [loginDetail]);

    const handleChange = (event) => {
        const { id, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value,
        }));
        if (value) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [id]: '',
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
            setLoading({ load: true, index })
            const formattedData = {
                ...formData,
                AppointmentDateTime: formatDateTime(formData?.AppointmentDateTime)
            }
            await BookAppointment(formattedData).then((res) => {
                if (res?.stat_msg === 'success') {
                    setSelectedItem({});
                    toast.success("Appointment Booked Successfully");
                    setLoading({ load: false, index })
                } else {
                    toast.error("Something went wrong");
                    setLoading({ load: false, index });
                }
            })
            setIsSubmitting(false);
        } else {
            setErrors(formErrors);
        }
    };

    const handleEdit = () => {
        setSelectedItem({});
    }

    useEffect(() => {
        window.scrollTo({
            top: 250,
            behavior: "smooth"
        })
    }, [])

    return (
        <div className="hoq_form-container">
            <h2>Share details</h2>
            <div className="hoq_product-detail">
                <img src={`${storImagePath()}${selectedItem?.image}`} alt={selectedItem?.title} />
                <div className="hoq_product-info">
                    <a>{selectedItem?.title}</a>
                    <button className="hoq_edit-btn" onClick={handleEdit}>Edit</button>
                </div>
            </div>
            <form onSubmit={(e) => handleSubmit(e, formData?.RequestId)}>
                <div className='hoq_leftside'>
                    <div className="hoq_input-group">
                        <div className="hoq_input-field">
                            <label htmlFor="firstname">First Name*</label>
                            <input
                                type="text"
                                id="firstname"
                                placeholder="First Name"
                                value={formData.firstname}
                                onChange={handleChange}
                            />
                            {errors.firstname && <div className="hoq_error-message">{errors.firstname}</div>}
                        </div>
                        <div className="hoq_input-field">
                            <label htmlFor="lastname">Last Name*</label>
                            <input
                                type="text"
                                id="lastname"
                                placeholder="Last Name"
                                value={formData.lastname}
                                onChange={handleChange}
                            />
                            {errors.lastname && <div className="hoq_error-message">{errors.lastname}</div>}
                        </div>
                    </div>
                    <div className="hoq_input-group">
                        <div className="hoq_input-field">
                            <label htmlFor="EmailId">Email*</label>
                            <input
                                type="email"
                                id="EmailId"
                                placeholder="Email"
                                value={formData.EmailId}
                                onChange={handleChange}
                            />
                            {errors.EmailId && <div className="hoq_error-message">{errors.EmailId}</div>}
                        </div>
                        <div className="hoq_input-field">
                            <label htmlFor="mobileno">Phone*</label>
                            <input
                                type="tel"
                                id="mobileno"
                                placeholder="Phone"
                                value={formData.mobileno}
                                onChange={handleChange}
                            />
                            {errors.mobileno && <div className="hoq_error-message">{errors.mobileno}</div>}
                        </div>
                    </div>
                    <div className="hoq_input-group">
                        <div className="hoq_input-field">
                            <label htmlFor="AppointmentMessage">Message (Optional)</label>
                            <textarea
                                id="AppointmentMessage"
                                placeholder="Message"
                                value={formData.AppointmentMessage}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </div>
                </div>
                <div className='hoq_rightside'>
                    <div className="hoq_input-group">
                        <div className="hoq_input-field">
                            <label htmlFor="AppointmentDateTime">Select a Date & Time*</label>
                            <input
                                type="datetime-local"
                                id="AppointmentDateTime"
                                value={formData.AppointmentDateTime}
                                min={minDateTime}
                                onChange={handleChange}
                            />
                            {errors.AppointmentDateTime && <div className="hoq_error-message">{errors.AppointmentDateTime}</div>}
                        </div>
                    </div>
                    <div className="hoq_button-group">
                        <button type="submit" className="hoq_primary-btn" disabled={isSubmitting} onClick={() => handleRequestTypeChange('1')}>{loading?.index === '1' ? 'Booking Appointment' : 'Book Appointment'}</button>
                        <button type="button" className="hoq_secondary-btn" onClick={() => handleRequestTypeChange('2')}>{loading?.index === '2' ? 'Requesting A Callback' : 'Request A Callback'}</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AppointmentForm;
