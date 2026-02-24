"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { wesbiteDomainName } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { ContactUsAPI } from "@/app/(core)/utils/API/ContactUs/ContactUsAPI";
import PageLoader from "@/app/(core)/utils/Glob_Functions/PageLoaderComponent/PageLoader";

export default function ContactForm() {
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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.FullName) newErrors.FullName = "Please enter your full name";
    if (!formData.InQuiryCompanyName)
      newErrors.InQuiryCompanyName = "Please enter your company name";
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
    if (!formData.InQuirySubject)
      newErrors.InQuirySubject = "Please enter the subject";
    if (!formData.Be_In_Message)
      newErrors.Be_In_Message = "Please enter your message";

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
      } else {
        toast.error("Something went wrong");
      }
    } catch {
      toast.error("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="smr_Fo_contactBox1">
      <form onSubmit={handleSubmit}>
        <div>
          <p className="Fo-contactBox1Title">FULL NAME</p>
          <input
            type="text"
            className="Fo-contactBox1InputBox"
            name="FullName"
            value={formData.FullName}
            onChange={handleChange}
          />
          {errors.FullName && <p className="error">{errors.FullName}</p>}
        </div>

        <div style={{ marginTop: "25px" }}>
          <p className="Fo-contactBox1Title">COMPANY NAME</p>
          <input
            type="text"
            className="Fo-contactBox1InputBox"
            name="InQuiryCompanyName"
            value={formData.InQuiryCompanyName}
            onChange={handleChange}
          />
          {errors.InQuiryCompanyName && (
            <p className="error">{errors.InQuiryCompanyName}</p>
          )}
        </div>

        <div style={{ marginTop: "25px" }}>
          <p className="Fo-contactBox1Title">EMAIL ADDRESS</p>
          <input
            type="text"
            className="Fo-contactBox1InputBox"
            name="EmailId"
            value={formData.EmailId}
            onChange={handleChange}
          />
          {errors.EmailId && <p className="error">{errors.EmailId}</p>}
        </div>

        <div style={{ marginTop: "25px" }}>
          <p className="Fo-contactBox1Title">PHONE NUMBER</p>
          <input
            type="text"
            className="Fo-contactBox1InputBox"
            name="mobileno"
            maxLength={10}
            value={formData.mobileno}
            onChange={handleChange}
          />
          {errors.mobileno && <p className="error">{errors.mobileno}</p>}
        </div>

        <div style={{ marginTop: "25px" }}>
          <p className="Fo-contactBox1Title">SUBJECT</p>
          <input
            type="text"
            className="Fo-contactBox1InputBox"
            name="InQuirySubject"
            value={formData.InQuirySubject}
            onChange={handleChange}
          />
          {errors.InQuirySubject && <p className="error">{errors.InQuirySubject}</p>}
        </div>

        <div style={{ marginTop: "25px" }}>
          <p className="Fo-contactBox1Title">MESSAGE</p>
          <input
            type="text"
            className="Fo-contactBox1InputBox"
            name="Be_In_Message"
            value={formData.Be_In_Message}
            onChange={handleChange}
          />
          {errors.Be_In_Message && <p className="error">{errors.Be_In_Message}</p>}
        </div>

        <button type="submit" disabled={loading} className="Fo-contactBox1BtnSub">
          {loading ? "SUBMITTING" : "SUBMIT"}
        </button>
      </form>

      <PageLoader loading={loading} />
    </div>
  );
}
