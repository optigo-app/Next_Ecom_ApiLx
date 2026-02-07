import React from "react";
import "./InquiryModal.scss";
import { VscClose } from "react-icons/vsc";

const InquiryModal = ({ open, setOpen, handleSubmit, formData,
  handleChange, handleFileChange, error, loading }) => {

  return (
    <div className="hoq_inquiry-modal-container">
      <div className="hoq_modal-overlay">
        <div className="hoq_modal-content">
          <div className="hoq_modal-header">
            <h2>
              Please fill the details below and we will respond within 48 hours
            </h2>
            <button className="hoq_close-button" onClick={() => setOpen(false)}>
              <VscClose size={17} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="hoq_modal-form">
            <div className="hoq_form-group">
              <label htmlFor="FullName">Full Name*</label>
              <input
                id="FullName"
                name="FullName"
                value={formData?.FullName}
                onChange={handleChange}
              />
              {error?.FullName && <p className="hoq_error-message">{error.FullName}</p>}
            </div>
            <div className="hoq_form-group hoq_grid">
              <div>
                <label htmlFor="EmailId">EmailId*</label>
                <input
                  id="email"
                  name="EmailId"
                  type="email"
                  value={formData.EmailId}
                  onChange={handleChange}
                />
                {error?.EmailId && <p className="hoq_error-message">{error.EmailId}</p>}
              </div>
              <div>
                <label htmlFor="mobileno">Phone*</label>
                <input
                  id="mobileno"
                  name="mobileno"
                  type="text"
                  maxLength={10}
                  pattern="{0-9}[10]"
                  placeholder="+91 xxxx xxxx"
                  value={formData.mobileno}
                  onChange={handleChange}
                />
                {error?.mobileno && <p className="hoq_error-message">{error.mobileno}</p>}
              </div>
            </div>
            <div className="hoq_form-group">
              <label htmlFor="WebSite">Website URL (Optional)</label>
              <input
                id="WebSite"
                name="WebSite"
                placeholder="www.sonasons.one"
                value={formData.WebSite}
                onChange={handleChange}
              />
              {/* {error?.WebSite && <p className="hoq_error-message">{error.WebSite}</p>} */}
            </div>
            <div className="hoq_form-group">
              <label htmlFor="Be_In_Message">Additional Information*</label>
              <textarea
                id="Be_In_Message"
                name="Be_In_Message"
                value={formData.Be_In_Message}
                onChange={handleChange}
              />
              {error?.Be_In_Message && <p className="hoq_error-message">{error.Be_In_Message}</p>}
            </div>
            <div className="hoq_form-group">
              <label htmlFor="file">Attach File</label>
              <input
                id="file"
                type="file"
                accept=".jpg, .png, .pdf"
                onChange={handleFileChange}
              />
              {error?.file && <p className="hoq_error-message">{error.file}</p>}
              <p>Max File Size: 10MB. Accepted Formats: PNG, JPG, PDF</p>
            </div>
            <button type="submit" className="hoq_submit-button">
              {loading ? 'SUBMITING...' : 'SUBMIT'}
            </button>
          </form>


          <p className="hoq_privacy-policy">
            By submmiting this form you agree to our Terms & Conditions and the
            terms of your Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InquiryModal;
