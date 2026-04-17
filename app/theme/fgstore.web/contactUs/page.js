import ContactForm from "./ContactForm.jsx";
import "./ContactUs.modul.scss";
import { getContactUsContent } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions.js";

export default async function ContactUsPage() {
  const htmlContent = await getContactUsContent();

  return (
    <div className="fg_smr_contactMain_div">
      {/* <div className="smr-map-top">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.2828242419437!2d72.8191344!3d21.1809209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e438cc948fb%3A0x5712a989b70ef3a2!2sOrail%20Services%20-%20OptigoApps!5e0!3m2!1sen!2sin!4v1734596370112!5m2!1sen!2sin"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div> */}

      <div className="Fo-contactMain">
        <div className="smr_contact_inner">
          <h1 className="smr_contact_header_title">Contact Us</h1>
          <div className="smr_contact_header_desc_wrapper">
            <p className="smr_contact_header_desc">
              Have a comment, suggestion or question? Feel free to reach out to us and we’ll get
              back to you as soon as possible.
            </p>
          </div>

          <div className="smr_contactPage_BoxMain">
            {/* Left: Client form */}
            <div className="smr_Fo_contactBox1">
              <ContactForm />
            </div>

            {/* Right: Static HTML injected (Address etc) */}
            <div className="smr_Fo_contactBox2_main">
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
