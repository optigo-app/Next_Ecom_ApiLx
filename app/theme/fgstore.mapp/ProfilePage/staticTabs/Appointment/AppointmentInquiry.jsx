"use client";

import React, { useEffect, useState } from "react";
import { BookAppointment } from "@/app/(core)/utils/API/BookAppointment/BookAppointment";
import { toast } from "react-toastify";
import InquiryModal from "./InquiryModal";

const AppointmentInquiry = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [minDateTime, setMinDateTime] = useState("");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    EmailId: "",
    mobileno: "",
    AppointmentMessage: "",
    AppointmentDateTime: "",
    JewelleryType: "",
    RequestId: "1", // Default to Book Appointment
  });

  useEffect(() => {
    const loginDetail = JSON.parse(sessionStorage.getItem("loginUserDetail"));
    if (loginDetail) {
      setFormData((prev) => ({
        ...prev,
        firstname: loginDetail.firstname ?? "",
        lastname: loginDetail.lastname ?? "",
        EmailId: loginDetail.userid ?? "",
        mobileno: loginDetail.mobileno ?? "",
      }));
    }
  }, [open]);

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
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleSelectInterest = (interest) => {
    setFormData((prev) => ({ ...prev, JewelleryType: interest }));
    setStep(2);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstname) newErrors.firstname = "First Name is required";
    if (!formData.lastname) newErrors.lastname = "Last Name is required";
    if (!formData.EmailId) newErrors.EmailId = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.EmailId))
      newErrors.EmailId = "Invalid email address";
    if (!formData.mobileno) newErrors.mobileno = "Phone is required";
    if (!formData.AppointmentDateTime)
      newErrors.AppointmentDateTime = "Date & Time is required";
    return newErrors;
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    const [date, time] = dateTimeString.split("T");
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year} ${time}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      const formattedData = {
        ...formData,
        AppointmentDateTime: formatDateTime(formData?.AppointmentDateTime),
      };
      try {
        const res = await BookAppointment(formattedData);
        if (res?.stat_msg === "success") {
          toast.success("Appointment Booked Successfully");
          setStep(3); // Success Step
        } else {
          toast.error("Something went wrong");
        }
      } catch (err) {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(formErrors);
    }
  };

  const handleClose = () => {
    setStep(1);
    setFormData((prev) => ({
      ...prev,
      JewelleryType: "",
      AppointmentMessage: "",
      AppointmentDateTime: "",
    }));
    setErrors({});
    onClose();
  };

  return (
    <InquiryModal
      open={open}
      onClose={handleClose}
      step={step}
      setStep={setStep}
      formData={formData}
      handleChange={handleChange}
      handleSelectInterest={handleSelectInterest}
      handleSubmit={handleSubmit}
      errors={errors}
      loading={loading}
      minDateTime={minDateTime}
    />
  );
};

export default AppointmentInquiry;
