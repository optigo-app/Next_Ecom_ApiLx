"use client";
import React, { useEffect, useState } from "react";
import "./../../../../fgstore.web/bespoke-jewelry/Bespokejewelry.scss";
import { BespokeAPI } from "@/app/(core)/utils/API/Bespoke/BespokeAPI";
import { toast } from "react-toastify";
import InquiryModal from "./InquiryModal";

const BespokeInquiry = ({ open, onClose }) => {
  const [error, setError] = useState({});
  const [formData, setFormData] = useState({
    FullName: "",
    EmailId: "",
    mobileno: "",
    WebSite: "",
    Be_In_Message: "",
  });

  const [file, setFile] = useState();
  const [loading, setLoading] = useState();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = (file) => {
    const newErrors = {};

    if (!formData.FullName) newErrors.FullName = "Full Name is required";
    if (!formData.EmailId) newErrors.EmailId = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.EmailId)) newErrors.EmailId = "Invalid email address";
    if (!formData.mobileno) newErrors.mobileno = "Phone is required";
    else if (!/^\d{10}$/.test(formData.mobileno)) newErrors.mobileno = "Phone must be exactly 10 digits";
    if (!formData.Be_In_Message) newErrors.Be_In_Message = "Additional information is required";

    if (file) {
      if (file.size > 10000000) {
        newErrors.file = "File size exceeds 10MB";
      }
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        newErrors.file = "Only JPG, PNG, and PDF files are allowed";
      }
    }

    return newErrors;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

    if (file) {
      console.log(file, "file")
      if (file.size > 10000000) {
        setError((prev) => ({ ...prev, file: "File size exceeds 10MB" }));
      } else if (!allowedTypes.includes(file.type)) {
        setError((prev) => ({ ...prev, file: "Only JPG, PNG, and PDF files are allowed" }));
      } else {
        setFile(file);
        setError((prev) => ({ ...prev, file: "" }));
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      await BespokeAPI(formData, file).then((res) => {
        if (res?.stat_msg === "success") {
          toast.success("Bespoke form submitted Successfully");
          setLoading(false);
        } else {
          toast.error("Something went wrong");
        }
      }).catch((err) => {
        console.log(err, "err")
        toast.error("Something went wrong");
        setLoading(false);
      }).finally(()=>{
        setLoading(false);
        onClose();
        resetForm();
      })

    } else {
      setError(formErrors);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      website: "",
      additionalInfo: "",
      file: null,
    });
  };
  return (
    <>
      <InquiryModal
        open={open} onClose={onClose} formData={formData} handleChange={handleChange} handleFileChange={handleFileChange} handleSubmit={handleSubmit} error={error} loading={loading} />
    </>
  );
};

export default BespokeInquiry;
