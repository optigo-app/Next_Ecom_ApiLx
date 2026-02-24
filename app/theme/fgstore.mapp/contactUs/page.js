import ContactForm from "./ContactForm.jsx";
import "./ContactUs.modul.scss";
import { getContactUsContent } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions.js";

export default async function ContactUsPage() {
  const htmlContent = await getContactUsContent();

  return (
    <div className="smr_contactMain_div">
      <div className="Fo-contactMain">
        <div>
          <p
            style={{
              fontSize: "40px",
              margin: "0px",
              paddingTop: "30px",
              textAlign: "center",
              fontFamily: "FreightDispProBook-Regular,Times New Roman,serif",
            }}
          >
            Contact Us
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <p style={{ width: "300px", textAlign: "center", fontSize: "15px" }}>
              Have a comment, suggestion or question? Feel free to reach out to us and we’ll get
              back to you as soon as possible.
            </p>
          </div>

          <div className="smr_contactPage_BoxMain">
            {/* Left: Client form */}
            <ContactForm />

            {/* Right: Static HTML injected */}
            <div className="smr_Fo_contactBox2_main">
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
