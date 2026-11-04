
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MdDateRange } from "react-icons/md";
import './VimalAppointment.scss';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { ImClock2 } from "react-icons/im";
import { storImagePath } from '@/app/(core)/utils/Glob_Functions/GlobalFunction';
import { BookAppointment } from '@/app/(core)/utils/API/BookAppointment/BookAppointment';
import { toast } from 'react-toastify';



const Appointment = () => {
    const IsSetupFor =true
    // const { appointmentBanner } = useHomeBannerImages();

    const [selectedbox, setselectedbox] = useState({
        id: "",
        name: "",
    });
    const [selectedDate, setSelectedDate] = useState();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [minDateTime, setMinDateTime] = useState('');

    const scrollToRef = useRef(null);

    const [formData, setFormData] = useState({
        // titlename: '',
        firstname: '',
        lastname: '',
        EmailId: '',
        mobileno: '',
        JewelleryType: '',
        AppointmentMessage: '',
        AppointmentDateTime: '',
        // location: '',
    });

    const inputRef = useRef(null);

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '';
        const [date, time] = dateTimeString.split('T');
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year} ${time}`;
    };

    const handleReset = () => {
        setFormData({
            firstname: '',
            lastname: '',
            EmailId: '',
            mobileno: '',
            JewelleryType: '',
            AppointmentMessage: '',
            AppointmentDateTime: '',
        })
        setselectedbox({
            id: "",
            name: "",
        })
    }

    useEffect(() => {
        const today = new Date();
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(today.getDate() + 3);
        const formatDate = (date) => {
            return date.toISOString().slice(0, 16);
        };
        setMinDateTime(formatDate(threeDaysFromNow));
    }, []);

    const handleChange = (event) => {
        const { id, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
        if (value) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [id]: '',
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formErrors = validate();
        if (Object.keys(formErrors).length === 0) {
            setLoading(true)
            const formattedData = {
                ...formData,
                JewelleryType: selectedbox?.name,
                AppointmentDateTime: formatDateTime(formData?.AppointmentDateTime)
            }
            await BookAppointment(formattedData).then((res) => {
                if (res?.stat_msg === 'success') {
                    toast.success("Appointment Booked Successfully");
                    setLoading(false)
                    handleReset();
                    window.scroll({
                        top: 0,
                        behavior: "smooth",
                    });
                } else {
                    toast.error("Something went wrong");
                    setLoading(false);
                    handleReset();
                    window.scroll({
                        top: 0,
                        behavior: "smooth",
                    });
                }
            })
        } else {
            setErrors(formErrors);
        }
    };

    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.showPicker()
        }
    };

    const validate = () => {
        const newErrors = {};
        // if (!formData.titlename) newErrors.titlename = 'Title Name is required';
        if (!formData.firstname) newErrors.firstname = 'First Name is required';
        if (!formData.lastname) newErrors.lastname = 'Last Name is required';
        if (!formData.EmailId) {
            newErrors.EmailId = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.EmailId)) {
            newErrors.EmailId = 'Invalid email address';
        }
        if (!formData.mobileno) {
            newErrors.mobileno = 'Phone is required';
        } else if (!/^\d{10}$/.test(formData.mobileno)) {
            newErrors.mobileno = 'Phone must be a 10-digit number';
        }
        if (selectedbox?.id === undefined || selectedbox?.id === null || selectedbox?.id === '' || !selectedbox?.name) {
            newErrors.selectedbox = 'Please select your subject.';
        }
        if (!formData.AppointmentDateTime) {
            newErrors.AppointmentDateTime = 'Date & Time is required';
        }
        return newErrors;
    };


    useEffect(() => {
        window.scrollTo({
            behavior: "smooth",
            top: 0
        });
    }, []);


    // const appointment = [
    //     { src: `${storImagePath()}/images/HomePage/Appointment/Collection.jpg`, alt: "Collection" },
    //     { src: `${storImagePath()}/images/HomePage/Appointment/Engagement_Ring.jpg`, alt: "Engagement Ring" },
    //     { src: `${storImagePath()}/images/HomePage/Appointment/Fine_Jewellery.jpg`, alt: "Fine Jewellery" },
    //     { src: `${storImagePath()}/images/HomePage/Appointment/Gold_Jewellery.jpg`, alt: "Gold Jewellery" },
    //     { src: `${storImagePath()}/images/HomePage/Appointment/High_Jewellery.jpg`, alt: "High Jewellery" },
    //     { src: `${storImagePath()}/images/HomePage/Appointment/Men's_Jewellery.jpg`, alt: "Men's Jewellery" },
    //     { src: `${storImagePath()}/images/HomePage/Appointment/Wedding_Ring.jpg`, alt: "Wedding Ring" },
    //     { src: `${storImagePath()}/images/HomePage/Appointment/Others.jpg`, alt: "Others" },
    // ];

    const appointment = [
        { src: `WebSiteStaticImage/collections/vimaldiamond/Collections.png`, alt: "Collection" },
        { src: `WebSiteStaticImage/collections/vimaldiamond/Engagement.png`, alt: "Engagement Ring" },
        { src: `WebSiteStaticImage/collections/vimaldiamond/Fine.png`, alt: "Fine Jewellery" },
        { src: `WebSiteStaticImage/collections/vimaldiamond/Gold.png`, alt: "Gold Jewellery" },
        { src: `WebSiteStaticImage/collections/vimaldiamond/High.png`, alt: "High Jewellery" },
        { src: `WebSiteStaticImage/collections/vimaldiamond/Men.png`, alt: "Men's Jewellery" },
        { src: `WebSiteStaticImage/collections/vimaldiamond/Others.png`, alt: "Wedding Ring" },
        { src: `WebSiteStaticImage/collections/vimaldiamond/Wedding.png`, alt: "Others" },
    ];

    return (
        <div className="eleev_appointment_page">
            <div className="elvee_banner_app"
                style={{
                    padding: IsSetupFor ? "0 2rem" : "0 7rem",
                    backgroundColor: IsSetupFor ? '#fafafa' : ''
                }}
            >
                <div className="content">
                    <p>
                        Visit our Jewelry stores to schedule a personalized consultation at one of our stores to discover the perfect ethically sourced fine jewelry piece for your milestone moments.
                    </p>
                </div>
                <div className="image"
                    style={{
                        width: IsSetupFor ? '100%' : ''
                    }}
                >
                    <img src="/WebSiteStaticImage/Banner/vimalgolddiamond/appointBanner1.png" alt="aa"
                        style={{
                            maxHeight: IsSetupFor ? '600px' : undefined
                        }}
                    />
                    {/* <img src={`${storImagePath()}/images/HomePage/Appointment/Book_Appointment.jpg`} alt="aa" /> */}
                </div>
            </div>
            <div className="grid_col_2_elvee">
                <div className="grid_content_banner">
                    <h1>Book an Appointment</h1>
                    <p>Our commitment is to provide you with the highest level of jewelry care services. Our experts will be delighted to offer you advice and services to personalize your jewels, restore them, or simply preserve their beauty and longevity.</p>
                </div>
                <div className="grid_layout_card">
                    <div className="service_bar_1">
                        <h2>Select your subject</h2>
                    </div>
                    <div className="layout_elvee_grid">
                        {appointment.map((val, i) => {
                            return (
                                <div
                                    key={i}
                                    onClick={(e) => {
                                        setselectedbox({ id: i, name: val?.alt });
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            selectedbox: '',
                                        }));
                                        if (scrollToRef.current) {
                                            window.scrollTo({
                                                top: scrollToRef.current.offsetTop,  // Scroll to the element's position
                                                behavior: "smooth",  // Smooth scrolling
                                            });
                                        }
                                    }}
                                    style={selectedbox?.id === i ? { border: "2.5px solid rgb(0, 0, 34)" } : {}}
                                    className="elvee_card_app"
                                    id="JewelleryType"
                                >
                                    <div className="image_card_elevee">
                                        <img src={val.src} alt={val.alt} />
                                    </div>
                                    <h3 className="det_elvee_card">{val.alt}</h3>
                                </div>
                            )
                        })}
                    </div>
                    {errors.selectedbox && <span className="for_error-message_box" style={{ marginTop: '1rem', display: 'block' }}>{errors.selectedbox}</span>}
                    <div ref={scrollToRef} style={{ marginTop: "30px" }}>
                        <div className="from_elvee_appointmnet">
                            <div className="service_bar">
                                <span>Your Appointment Data & Time</span>
                            </div>
                            <div className="time_grid_elvee">
                                {/* <label className='elv_lab_1'>
                                <input
                                    type="date"
                                    ref={dateRef}
                                    value={selectedDate}
                                    style={{ display: 'none' }} // Hide the input field
                                    onChange={(e) => {
                                        setSelectedDate(e.target.value);
                                        console.log('Selected date:', e.target.value); // Debugging line
                                    }}
                                />
                                <input
                                    type="text"
                                    value={selectedDate}
                                    placeholder="Date: dd/mm/yy"
                                    onClick={() => dateRef.current && dateRef.current.focus()} // Focus instead of click
                                    readOnly // Make it read-only to prevent typing
                                />
                                <MdDateRange
                                    className='elv_date_icon'
                                    onClick={() => dateRef.current && dateRef.current.focus()} // Focus instead of click
                                    size={26}
                                />
                            </label> */}
                                <div className="elvee_input_from">
                                    <label className='elv_lab_2'>
                                        <input
                                            type="datetime-local"
                                            id="AppointmentDateTime"
                                            value={formData.AppointmentDateTime}
                                            min={minDateTime}
                                            onChange={handleChange}
                                            ref={inputRef}
                                            placeholder="Time: hh:mm" />
                                        <ImClock2 className='elv_date_icon' size={26} onClick={() => {
                                            inputRef.current.showPicker();
                                        }} />
                                    </label>
                                    {errors.AppointmentDateTime && <p className="for_error-message">{errors.AppointmentDateTime}</p>}
                                </div>
                                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DateTimePicker']} sx={{ width: '48%' }}>
                                    <DateTimePicker
                                        className="elv_date_time_picker"
                                        label="Select date and time"
                                        value={selectedDate}
                                        onChange={(newValue) => setSelectedDate(newValue)}
                                    />
                                </DemoContainer>
                            </LocalizationProvider> */}
                            </div>
                            <div className="service_bar">
                                <span>Your Details</span>
                            </div>
                            <form className="form_grid_elvee" onSubmit={handleSubmit}>
                                {/* <input
                                type="text"
                                id="titlename"
                                value={formData.titlename}
                                onChange={handleChange}
                                placeholder="Title:"
                                className="elvee_input_from" /> */}
                                <div className="elvee_input_from">
                                    <input
                                        type="text"
                                        id="firstname"
                                        value={formData.firstname}
                                        onChange={handleChange}
                                        placeholder="First Name:"

                                    />
                                    {errors.firstname && <p className="for_error-message">{errors.firstname}</p>}
                                </div>
                                <div className="elvee_input_from">
                                    <input
                                        type="text"
                                        id="lastname"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                        placeholder="Last Name:"
                                        className="elvee_input_from" />
                                    {errors.lastname && <p className="for_error-message">{errors.lastname}</p>}
                                </div>
                                <div className="elvee_input_from">
                                    <input
                                        type="tel"
                                        id="mobileno"
                                        value={formData.mobileno}
                                        onChange={handleChange}
                                        placeholder="Phone:"
                                        className="elvee_input_from" />
                                    {errors.mobileno && <p className="for_error-message">{errors.mobileno}</p>}
                                </div>
                                <div className="elvee_input_from">
                                    <input
                                        type="email"
                                        id="EmailId"
                                        value={formData.EmailId}
                                        onChange={handleChange}
                                        placeholder="Email ID:"
                                        className="elvee_input_from" />
                                    {errors.EmailId && <p className="for_error-message">{errors.EmailId}</p>}
                                </div>
                                <div className="elvee_input_from">
                                    <input
                                        type="text"
                                        id="AppointmentMessage"
                                        value={formData.AppointmentMessage}
                                        onChange={handleChange}
                                        placeholder="Message: (optional)"
                                        className="elvee_input_from" />
                                    {errors.AppointmentMessage && <p className="for_error-message">{errors.AppointmentMessage}</p>}
                                </div>
                                <div className="btn_el_vee">
                                    <button disabled={loading} style={{ backgroundColor: loading ? "#00487C" : "#00185a" }} type="submit">{loading ? "Booking Appointment" : "Book Appointment"}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Appointment;
