"use client";
import React, { useEffect, useState } from "react";
import "./Bespokejewelry.scss";
import InquiryModal from "./InquiryForm/InquiryModal";
import { BespokeAPI, BespokeFileUploadAPI } from "@/app/(core)/utils/API/Bespoke/BespokeAPI";
import { toast } from "react-toastify";
import PageLoader from "@/app/(core)/utils/Glob_Functions/PageLoaderComponent/PageLoader";

export const similingrockprocess = [
  {
    step: 1,
    img: `SimilingRock/static/1.png`,
    title: "Share Your Mind",
    Subtitle: "Your ring. Your way.",
    description: "At SimilingRock, we cherish your creative ideas. Share your vision with us, including your design preferences and how you envision your ring. We are dedicated to transforming your dream ring into reality, reflecting your unique style.",
  },
  {
    step: 2,
    img: `SimilingRock/static/2.png`,
    title: "Design",
    Subtitle: "CAD designs and/or sketches for your approval.",
    description: "Once we have your ideas, we will get down to work. We will provide you with detailed CAD drawings or sketches for your final approval. These sketches will be prepared by professionals with years of experience. With designs by your side you will get a clear idea of how your ring will turn into. SimilingRock believes in transparency in every step of the design process.",
  },
  {
    step: 3,
    img: `SimilingRock/static/3.png`,
    title: "Manufacture",
    Subtitle: "Your ring will be brought to life by experts in our workshops and your specifications will be catered.",
    description: "Once we have your approval on our proposed sketches, we will go ahead with manufacturing your ring. Details will be kept in mind and our goldsmiths will make sure that all your aspirations regarding your ring are met. Every ring is different and deserves special attention. A perfect blend of craftsmanship and design will give your ring the complementary shine and bling. With SimilingRock, you can be assured of quality & finesse.",
  },
  {
    step: 4,
    img: `SimilingRock/static/4.png`,
    title: "Completion",
    Subtitle: "Your dream ring is ready for collection.",
    description: "Your ring will be manufactured by our artisans and made available to you within the specified time committed to you. This whole process will be smooth and hassle-free owing to our reliable features of free shipping, free 30 Day returns and 60- Days free resizing. From the moment you conceived the idea of a tailor-made ring till the time you receive it, SimilingRock will be by your side.",
  },
];

const Bespokejewelry = ({ assetBase }) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState({});
  const storeInit = (() => {
    const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
    return storeInit;
  })();
  const [formData, setFormData] = useState({
    FullName: "",
    EmailId: "",
    mobileno: "",
    WebSite: "",
    Be_In_Message: "",
  });

  const [file, setFile] = useState();
  const [loading, setLoading] = useState();
  const [UploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const onOpen = () => {
    setOpen(true);
  };
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
    // if (!formData.website) newErrors.website = 'Website URL is required';
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
    let uploadedFileName = null;
    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      if (file) {
        const fileUpload = await BespokeFileUploadAPI(file, storeInit?.ukey);
        if (fileUpload?.success && fileUpload?.files?.length > 0) {
          setUploadedFile(fileUpload.files[0]);
          uploadedFileName = fileUpload.files[0]?.fileName;
        } else {
          toast.warning("File upload failed. Proceeding without file.");
        }
      }
      await BespokeAPI(formData, uploadedFileName, storeInit?.ukey).then((res) => {
        if (res?.stat_msg === "success") {
          toast.success("Bespoke form submitted Successfully");
          setLoading(false);
        } else {
          toast.error("Something went wrong");
        }
      });
      setOpen(false);
      resetForm();
      setLoading(false);
      setFile(null);
      setUploadedFile(null);
      uploadedFileName = null;

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
    <div className="hoq_Bespokejewelry">
      <>
        {open && (
          <InquiryModal
            open={open}
            setOpen={setOpen}
            formData={formData}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            error={error}
            loading={loading}
          />
        )}
        <Banner onOpen={onOpen} assetBase={assetBase} />
        <ColumnGrid onOpen={onOpen} assetBase={assetBase} />
      </>
      <PageLoader loading={loading} />
    </div>
  );
};

export default Bespokejewelry;

const Banner = ({ onOpen, assetBase }) => {
  const img = `${assetBase}/SimilingRock/static/pen.png`;
  return (
    <section className="bespoke-banner " style={{ background: `url(${img})` }}>
      <div className="overlay"></div>
      <div className="banner_content ">
        <h1 className="title">bespoke jewelry</h1>
        <div className="Parisienne">Turn your imagination into reality</div>
        <p className="para">With SimilingRock, you can tailor make your dream ring. We, at SimilingRock, make sure that all your ideas come to life with our special service to customize your ring. You just need to share your ideas and we’ll design and manufacture your ring and get it ready for collection in no time.</p>
        <button className="inquire_btn" onClick={onOpen}>
          inquire now
        </button>
      </div>
    </section>
  );
};
const ColumnGrid = ({ onOpen, assetBase }) => {
  return (
    <>
      <div className="ColumnGrid">
        {similingrockprocess?.map(({ Subtitle, description, step, title, img }, i) => {
          const image = `${assetBase}/${img}`;
          return (
            <div className="column_card">
              <div className="image_col">
                <img src={image} alt="" />
              </div>
              <div className="details_col">
                <h1 className="title_col">{title}</h1>
                <span className="subtitle_col">{Subtitle}</span>
                <p className="para_col">{description}</p>
              </div>
            </div>
          );
        })}
        <button className="inquire_btn" onClick={onOpen}>
          inquire now
        </button>
      </div>
    </>
  );
};
