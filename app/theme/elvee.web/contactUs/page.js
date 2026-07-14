import ContactForm from "./ContactForm.jsx";
import "./ContactUs.modul.scss";
import { getContactUsContent } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions.js";
import VimalContectUs from "./VimalContectUs.jsx";
import {   isVimalDiamond } from "@/app/(core)/constants/ElveeFlag";
export default async function ContactUsPage() {
  const htmlContent = await getContactUsContent();


  if(isVimalDiamond){
    return (
      <VimalContectUs />
    )

  }else{
    return (
      <div className="fg_smr_contactMain_div">
  
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

  
}
