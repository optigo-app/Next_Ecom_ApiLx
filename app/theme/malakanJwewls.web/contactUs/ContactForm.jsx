"use client";

import React, { useEffect, useState } from 'react';
import './ContactUs.modul.scss';
import { toast } from 'react-toastify';
import { wesbiteDomainName } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { ContactUsAPI } from "@/app/(core)/utils/API/ContactUs/ContactUsAPI";
import PageLoader from "@/app/(core)/utils/Glob_Functions/PageLoaderComponent/PageLoader";

export default function ContactUs() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        FullName: "",
        InQuiryCompanyName: "",
        EmailId: "",
        mobileno: "",
        InQuirySubject: "",
        Be_In_Message: "",
        Themeno: "1",
        domainname: wesbiteDomainName,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.FullName) newErrors.FullName = "Please enter your full name";
        if (!formData.InQuiryCompanyName) newErrors.InQuiryCompanyName = "Please enter your company name";
        if (!formData.EmailId) {
            newErrors.EmailId = "Please enter your email address";
        } else if (!/\S+@\S+\.\S+/.test(formData.EmailId)) {
            newErrors.EmailId = "Please enter a valid email address";
        }
        if (!formData.mobileno) {
            newErrors.mobileno = "Phone is required";
        } else if (!/^\d{10}$/.test(formData.mobileno)) {
            newErrors.mobileno = "Phone must be a 10-digit number";
        }
        if (!formData.InQuirySubject) newErrors.InQuirySubject = "Please enter the subject";
        if (!formData.Be_In_Message) newErrors.Be_In_Message = "Please enter your message";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            const res = await ContactUsAPI(formData);
            if (res?.stat_msg === "success") {
                toast.success("Got it! We've received your query. We'll be in touch shortly.");
                setFormData({
                    FullName: "",
                    InQuiryCompanyName: "",
                    EmailId: "",
                    mobileno: "",
                    InQuirySubject: "",
                    Be_In_Message: "",
                    Themeno: "1",
                    domainname: wesbiteDomainName,
                });
                window.scroll({
                    top: 0,
                    behavior: "smooth",
                });
            } else {
                toast.error("Something went wrong");
            }
        } catch (error) {
            toast.error("Server error. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        };
        scrollToTop();
    }, []);

    return (
        <div className='dt_contacus_main'>
            <div>
                <div className='dt_MainTitle_contactUs' style={{ marginBlock: '20px' }}>
                    <p style={{ fontSize: '40px', textAlign: 'center', fontFamily: 'FreightDispProBook-Regular,Times New Roman,serif' }}>Contact Us</p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <p style={{ width: '300px', textAlign: 'center', fontSize: '15px' }}>Have a comment, suggestion or question? Feel free to reach out to us and we’ll get back to you as soon as possible.</p>
                    </div>
                </div>

                <div className='dt_Sub_contactMain'>
                    <div className='dt_contactBoxMain'>
                        <div className='dt_Fo_contactBox1'>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                
                                <div className='dt_ContactMobile_ShowDiv'>
                                    <p className='Fo-contactBox1Title'>FULL NAME</p>
                                    <input
                                        type='text'
                                        
                                        className='dt_contactBox1InputBox'
                                        name='FullName'
                                        placeholder="Enter your name"
                                        value={formData.FullName}
                                        onChange={handleChange}
                                    />
                                    {errors.FullName && <p className='error'>{errors.FullName}</p>}
                                </div>

                                <div className='dt_ContactMobile_ShowDiv' style={{ marginTop: '25px' }}>
                                    <p className='Fo-contactBox1Title'>COMPANY NAME</p>
                                    <input
                                        type='text'
                                        className='dt_contactBox1InputBox'
                                        name='InQuiryCompanyName'
                                        placeholder="Enter company name"
                                        value={formData.InQuiryCompanyName}
                                        onChange={handleChange}
                                    />
                                    {errors.InQuiryCompanyName && <p className='error'>{errors.InQuiryCompanyName}</p>}
                                </div>

                                <div className='dt_ContactMobile_ShowDiv' style={{ marginTop: '25px' }}>
                                    <p className='Fo-contactBox1Title'>EMAIL ADDRESS</p>
                                    <input
                                        type='text'
                                        className='dt_contactBox1InputBox'
                                        name='EmailId'
                                        placeholder="Enter email address"
                                        value={formData.EmailId}
                                        onChange={handleChange}
                                    />
                                    {errors.EmailId && <p className='error'>{errors.EmailId}</p>}
                                </div>

                                <div className='dt_ContactMobile_ShowDiv' style={{ marginTop: '25px' }}>
                                    <p className='Fo-contactBox1Title'>PHONE NUMBER</p>
                                    <input
                                        type='text'
                                        className='dt_contactBox1InputBox'
                                        name='mobileno'
                                        maxLength={10}
                                        placeholder="Enter phone number"
                                        value={formData.mobileno}
                                        onChange={handleChange}
                                    />
                                    {errors.mobileno && <p className='error'>{errors.mobileno}</p>}
                                </div>

                                <div className='dt_ContactMobile_ShowDiv' style={{ marginTop: '25px' }}>
                                    <p className='Fo-contactBox1Title'>SUBJECT</p>
                                    <input
                                        type='text'
                                        className='dt_contactBox1InputBox'
                                        name='InQuirySubject'
                                        placeholder="Enter subject"
                                        value={formData.InQuirySubject}
                                        onChange={handleChange}
                                    />
                                    {errors.InQuirySubject && <p className='error'>{errors.InQuirySubject}</p>}
                                </div>

                                <div className='dt_ContactMobile_ShowDiv' style={{ marginTop: '25px' }}>
                                    <p className='Fo-contactBox1Title'>MESSAGE</p>
                                    <textarea
                                        className='dt_contactBox1InputBox_Mes'
                                        name='Be_In_Message'
                                        rows={4}
                                        placeholder="Write your message here..."
                                        value={formData.Be_In_Message}
                                        onChange={handleChange}
                                    />
                                    {errors.Be_In_Message && <p className='error'>{errors.Be_In_Message}</p>}
                                </div>

                                <button type="submit" disabled={loading} className='dt_contactBox1BtnSub'>
                                    {loading ? 'SUBMITTING...' : 'SUBMIT'}
                                </button>
                            </form>
                        </div>

                        <div className='Fo-contactBox2'>
                            <p className='dt_contactBox2TitleHave'>Have questions?</p>

                            <p style={{ fontSize: '15px', fontWeight: 600, color: '#7d7f85', margin: '0px' }}>
                                General inquiries
                            </p>

                            <p style={{ fontSize: '15px', color: '#7d7f85', margin: '0px', fontWeight: 600 }}>
                                Customer inquiries
                            </p>

                            <p style={{ color: '#7d7f85', fontSize: '15px', fontWeight: 600 }}>
                                Orders & Returns
                            </p>

                            <p className='dt_contactBox2Desc'>If you are looking for instant answers, check out our FAQ page for more information!</p>

                            <p className='dt_contactBox2Title'>Orders & Returns</p>
                            <p className='dt_contactBox2Desc'>Check out our FAQ page or our Orders & Returns page</p>
                            <p className='dt_contactBox2Desc'>Call us at 0000000000000</p>
                            <p className='dt_contactBox2Desc'>Email: contact@sonasons.com</p>
                            <p className='dt_contactBox2Title'>Studio Address</p>
                            <p className='dt_contactBox2Desc'>E-4, South EX-|| New Mars 0000000</p>

                            <div className='contact-map'>
                                <iframe
                                    src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.2828242419437!2d72.8191344!3d21.1809209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e438cc948fb%3A0x5712a989b70ef3a2!2sOrail%20Services%20-%20OptigoApps!5e0!3m2!1sen!2sin!4v1734596370112!5m2!1sen!2sin'
                                    style={{ border: "1px solid #f2f2f2" }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className='dt_contactus_map'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <PageLoader loading={loading} />
        </div>
    );
}