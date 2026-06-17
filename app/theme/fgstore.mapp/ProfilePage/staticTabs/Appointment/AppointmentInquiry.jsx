"use client";

import React, { useEffect, useState } from "react";
import { BookAppointment } from "@/app/(core)/utils/API/BookAppointment/BookAppointment";
import { toast } from "react-toastify";
import InquiryModal from "./InquiryModal";
import { getSession } from "@/app/(core)/utils/FetchSessionData";

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
    const loginDetail = getSession("loginUserDetail");
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
    const formatDate = (date) => {
      const pad = (num) => String(num).padStart(2, "0");
      const year = date.getFullYear();
      const month = pad(date.getMonth() + 1);
      const day = pad(date.getDate());
      const hours = pad(date.getHours());
      const minutes = pad(date.getMinutes());
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    setMinDateTime(formatDate(today));
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

    if (!formData.AppointmentDateTime) {
      newErrors.AppointmentDateTime = "Date & Time is required";
    } else {
      const selectedDate = new Date(formData.AppointmentDateTime);
      if (isNaN(selectedDate.getTime())) {
        newErrors.AppointmentDateTime = "Please enter a valid date and time";
      } else {
        const now = new Date();
        if (selectedDate < now) {
          newErrors.AppointmentDateTime = "Appointment date and time cannot be in the past";
        }
      }
    }
    return newErrors;
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    const dateObj = new Date(dateTimeString);
    if (isNaN(dateObj.getTime())) return "";
    const pad = (num) => String(num).padStart(2, "0");
    const day = pad(dateObj.getDate());
    const month = pad(dateObj.getMonth() + 1);
    const year = dateObj.getFullYear();
    const hours = pad(dateObj.getHours());
    const minutes = pad(dateObj.getMinutes());
    return `${day}-${month}-${year} ${hours}:${minutes}`;
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
