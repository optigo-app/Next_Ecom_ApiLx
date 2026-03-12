import axios from "axios";

/**
 * Send Email API
 */

const BASE_URL = "https://apilx.optigoapps.com/api/customsendemail" ;
//  : "http://newnextjs.web/api/customsendemail";
const CREDENTIAL_MAIL = "noreply@optigoapps.com";

export const sendEmail = async ({storeinit , subject, htmlTemplate = "", attachments, replyto, Mails, cust_subject, cust_htmlTemplate, CustomerMail }) => {
  try {
    const toEmail = [Mails];
    // const cust_toEmail = ["pobexo7826@emaxasp.com","optigoapi@gmail.com"];
    const customerToEmail = [CustomerMail];
    // const toEmail = ["ketoni9730@emaxasp.com", "optigoapi@gmail.com"]
    const formData = new FormData();
    attachments.forEach((file) => {
      formData.append("attachments", file);
    });
    attachments.forEach((file) => {
      formData.append("attachments1", file);
    });
    formData.append("fromEmail", CREDENTIAL_MAIL);
    formData.append("toEmail", JSON.stringify(toEmail));
    formData.append("cust_toEmail", JSON.stringify(customerToEmail));
    formData.append("ccEmail", "");
    formData.append("cust_ccEmail", "");
    formData.append("bccEmail", "");
    formData.append("cust_bccEmail", "");
    formData.append("replyTo", replyto);
    formData.append("subject", subject);
    formData.append("cust_subject", cust_subject);
    formData.append("message", "");
    formData.append("cust_message", "");
    formData.append("htmlTemplate", htmlTemplate);
    formData.append("cust_htmlTemplate", cust_htmlTemplate);
    formData.append("mode", "ELIOR_CUSTOM_ORDER");
    formData.append("ufcc", storeinit?.ufcc);

    const response = await axios.post(BASE_URL, formData, {
      headers: {
        YearCode: storeinit?.YearCode,
        sv: storeinit?.sv,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Send email failed:", error);
    throw error;
  }
};
