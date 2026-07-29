
"use client";

import React, { useEffect, useState } from "react";
import "./Contact.scss";

import { toast } from "react-toastify";
import { ContactUsAPI } from "@/app/(core)/utils/API/ContactUs/ContactUsAPI";
import { Box, CircularProgress } from "@mui/material";
 


 
const contactMode = 1;
const IsSetupFor = true;

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [names, setName] = useState({
        firstName: "",
        lastName: "",
    });

    const [formData, setFormData] = useState({
        FullName: "",
        EmailId: "",
        mobileno: "",
        Be_In_Message: "",
        Themeno: "3",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrors({
            ...errors,
            [name]: "",
        });
    };

    const handleDiffChange = (e) => {
        const { name, value } = e.target;
        setName({
            ...names,
            [name]: value,
        });
        setErrors({
            ...errors,
            [name]: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = {};
        if (!names?.firstName) {
            errors.firstName = "Please enter your first name";
        }
        if (!names?.lastName) {
            errors.lastName = "Please enter your last name";
        }
        if (!formData.EmailId) {
            errors.EmailId = "Please enter your email address";
        } else if (!/\S+@\S+\.\S+/.test(formData.EmailId)) {
            errors.EmailId = "Please enter a valid email address";
        }
        if (!formData.mobileno) {
            errors.mobileno = "Phone is required";
        } else if (!/^\d{10}$/.test(formData.mobileno)) {
            errors.mobileno = "Phone must be a 10-digit number";
        }
        if (!formData.Be_In_Message) {
            errors.Be_In_Message = "Please enter your message";
        }

        if (Object.keys(errors).length === 0) {
            setLoading(true);
            const formattedData = {
                ...formData,
                FullName: `${names?.firstName} ${names?.lastName}`,
            };
            await ContactUsAPI(formattedData).then((res) => {
                if (res?.stat_msg === "success") {
                    toast.success("Success! Thank you for contacting us. We’ve received your message and will get back to you shortly.");
                    setLoading(false);
                    window.scroll({
                        top: 0,
                        behavior: "smooth",
                    });
                } else {
                    toast.error("Something went wrong");
                    setLoading(false);
                    window.scroll({
                        top: 0,
                        behavior: "smooth",
                    });
                }
            });
            setFormData({
                FullName: "",
                EmailId: "",
                mobileno: "",
                Be_In_Message: "",
                Themeno: "3",
            });
            setName({
                firstName: "",
                lastName: "",
            });
        } else {
            setErrors(errors);
        }
    };

    useEffect(() => {
        window.scroll({
            top: 0,
            behavior: "smooth",
        });
    }, []);

   
    return (
        <div className="elvee_container">
            <img src="/WebSiteStaticImage/Banner/vimalgolddiamond/ContactUs.png" alt="Contact icons" className="elvee_contact-img" />
            {/* <img src={`${storImagePath()}/images/HomePage/Contact/ContactBanner.jpg`} alt="Contact icons" className="elvee_contact-img" /> */}

            <h1 className="elvee_heading-main">CONTACT US</h1>

            <div className="elvee_grid-container">
                {!IsSetupFor && (
                    <div className="elvee_grid-item">
                        <h2>Hours of Operation</h2>
                        <p>INDIA - 9:00am to 6:30pm (IST)</p>
                        <p>Mon-Sat (Excluding Holidays)</p>
                    </div>
                )}
                {IsSetupFor ? (
                    <>
                        <div className="elvee_grid-item">
                            <h2>Phone</h2>
                            <p>{contactMode === 0 ? "+91 99999 88888" : "+91 9811290235"}</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="elvee_grid-item">
                            <h2>Phone</h2>
                            <p>INDIA - (0261) 610-5100</p>
                        </div>
                    </>
                )}
                {IsSetupFor ? (
                    <>
                        <div className="elvee_grid-item">
                            <h2>Email Address</h2>
                            <p>{contactMode === 0 ? "galaxy@sonasons.com" : "info@vimalgoldanddiamond.com"}</p>
                        </div>
                    </>
                ) : (
                    <div className="elvee_grid-item">
                        <h2>General Inquiries</h2>
                        <p>INDIA - info@elvee.in</p>
                    </div>
                )}
                {IsSetupFor && (
                    <div className="elvee_grid-item">
                        <h2>Office Address</h2>
                        <p>{contactMode === 0 ? "Sonasons Galactic Headquarters" : "Vimal Gold And Diamond"}</p>
                        <p>
                            {contactMode === 0
                                ? "Plot 42, Nebula Boulevard, Sector 9, Stardust City, Kepler-186f, Mars, 99999"
                                : "2106, Desh Bandhu Gupta Rd, Block 47, Beadonpura, Karol Bagh, New Delhi, Delhi, 110005"}
                        </p>
                    </div>
                )}
            </div>

            <div className="elvee_contact-form">
                <h2>Contact Form</h2>
                <p>
                    Our Customer service team is waiting to assist you,
                    <br />
                    Please Fill out all fields
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="elvee_input_from">
                        <input type="text" placeholder="First Name: " name="firstName" value={names.firstName} onChange={handleDiffChange} className="elvee_input" />
                        {errors.firstName && <p className="for_error-message">{errors.firstName}</p>}
                    </div>
                    <div className="elvee_input_from">
                        <input type="text" placeholder="Last Name: " name="lastName" value={names.lastName} onChange={handleDiffChange} className="elvee_input" />
                        {errors.lastName && <p className="for_error-message">{errors.lastName}</p>}
                    </div>
                    <div className="elvee_input_from">
                        <input
                            type="tel"
                            name="mobileno"
                            value={formData.mobileno}
                            onChange={handleChange}
                            placeholder="Phone:"
                            className="elvee_input"
                            maxLength={10}
                            pattern="[0-9]{10}"
                            onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ""))} // Optional: Only allow numbers
                        />

                        {errors.mobileno && <p className="for_error-message">{errors.mobileno}</p>}
                    </div>
                    <div className="elvee_input_from">
                        <input type="email" name="EmailId" value={formData.EmailId} onChange={handleChange} placeholder="Email ID:" className="elvee_input" />
                        {errors.EmailId && <p className="for_error-message">{errors.EmailId}</p>}
                    </div>
                    {/* <input type="text" placeholder="Location :" className="elvee_input" />
                    <select className="elvee_input">
                        <option value="IN" defaultValue={'IN'} selected>India</option>
                        {CountryCode?.map((val, i) => {
                            return <option value={val?.code}>{val?.name}</option>
                        })}
                    </select> */}
                    <div className="elvee_input_from">
                        <textarea type="text" name="Be_In_Message" value={formData.Be_In_Message} onChange={handleChange} placeholder="Message: " className="elvee_input elvee_textarea" />
                        {errors.Be_In_Message && <p className="for_error-message">{errors.Be_In_Message}</p>}
                    </div>
                    <button type="submit" disabled={loading} className="elvee_button">
                        {loading ? "Sending" : "Send"}
                    </button>
                </form>
            </div>
            {IsSetupFor && (
                <Box
                    sx={{
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <iframe
                        src={contactMode === 0
                            ? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.2828242419437!2d72.8191344!3d21.1809209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e438cc948fb%3A0x5712a989b70ef3a2!2sOrail%20Services%20-%20OptigoApps!5e0!3m2!1sen!2sin!4v1734596370112!5m2!1sen!2sin"
                            : "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14005.185483771353!2d77.17787!3d28.6508434!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd1a09e5519d%3A0x3b79661648bf9139!2sVimal%20Gold%20And%20Diamond!5e0!3m2!1sen!2sin!4v1776339745027!5m2!1sen!2sin"
                        }
                        width={"100%"} height="450" style={{ border: 0 }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </Box>
            )}
   
            
        </div>
    );
}
