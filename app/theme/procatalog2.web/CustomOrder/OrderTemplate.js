import dayjs from "dayjs";

export function generateOrderEmail(formData, diamondOptions) {
  const companyLogoUrl = "https://b2b.eliorjewel.com/WebSiteStaticImage/logoIcon/webLogo.png";
  const customerName = formData.name || "Guest";
  const designNumber = formData.designNumber || "Not Set";
  const productColor = formData.color || "Not Set";
  const karat = formData.karats || "Not Set";
  const rhodiumOption = formData.rhodium === "Other" ? `Other: ${formData.otherRhodium}` : formData.rhodium;
  const stampingOption = formData.stamping === "Other" ? `Other: ${formData.otherStamping}` : formData.stamping;
  const deliveryDateTime = formData.deliveryDate ? dayjs(formData.deliveryDate).format("DD/MM/YYYY") : "Not Set";
  const deliveryTime = formData.deliveryTime ? dayjs(formData.deliveryTime).format("hh:mm A") : "Not Set";
  const companyName = formData.company || "Not Set";
  const contactNumber = formData.mobile || "Not Set";
  const ProductSizeL =  formData.productSize || "Not Set"


  const diamondSelection =
    Object.entries(diamondOptions)
      .filter(([_, checked]) => checked)
      .map(([key]) => key.replace(/([A-Z])/g, " $1").trim())
      .join(", ") || "None";

  const instructions = formData.instructions || "No specific instructions provided.";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Order Request</title>
    <style>
        body { margin: 0; padding: 0; font-family: 'Google Sans', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5; color: #202124; }
        table { border-collapse: collapse; }
        a { text-decoration: none; color: #4285f4; }
        .label { font-weight: bold; color: #5f6368; }
        .value { color: #202124; }
        @media screen and (max-width: 600px) {
            .content-table { width: 100% !important; border: none !important; }
            .padding-container { padding: 20px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">

    <center>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 20px; margin-bottom: 20px;">
            <tr>
                <td align="center">
                    
                    <!-- Card Container -->
                    <table class="content-table" role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; margin-bottom: 24px;">
                        <tr>
                            <td class="padding-container" style="padding: 40px; border: 1px solid #dadce0; border-radius: 8px; background-color: #ffffff;">
                                
                                <!-- Company Logo -->
                                <table width="100%" role="presentation">
                                    <tr>
                                        <td align="left">
                                            <img src=${`https://b2b.eliorjewel.com/WebSiteStaticImage/logoIcon/webLogo.png` || companyLogoUrl} alt="Company Logo" style="display: block;  max-width: 400px; max-height: 120px;">
                                        </td>
                                    </tr>
                                </table>

                                <!-- Headline -->
                                <table width="100%" role="presentation" style="margin-top: 25px;">
                                    <tr>
                                        <td align="left" style="font-family: 'Google Sans', Roboto, Helvetica, Arial, sans-serif; font-size: 22px; line-height: 30px; color: #202124; font-weight: 600;">
                                            New Order Customize Request
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left" style="padding-top: 10px; font-family: Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #5f6368;">
                                            Hello Team, a new request has been submitted. Please review the details below.
                                        </td>
                                    </tr>
                                </table>

                                <!-- SECTION: Customer Information -->
                                <div style="height: 1px; background-color: #dadce0; width: 100%; margin-top: 25px; margin-bottom: 25px;"></div>
                                
                                <table width="100%" role="presentation">
                                    <tr>
                                        <td style="font-size: 18px; font-weight: bold; color: #202124; padding-bottom: 10px;">Customer Information</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; font-family: Roboto, sans-serif; font-size: 14px;">
                                            <span class="label">Customer Name:</span> <span class="value">${customerName}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; font-family: Roboto, sans-serif; font-size: 14px;">
                                            <span class="label">Contact:</span> <span class="value">${contactNumber}</span>
                                        </td>
                                    </tr>
                                </table>

                                <!-- SECTION: Order Specifications -->
                                <div style="height: 1px; background-color: #dadce0; width: 100%; margin-top: 25px; margin-bottom: 25px;"></div>

                                <table width="100%" role="presentation">
                                    <tr>
                                        <td style="font-size: 18px; font-weight: bold; color: #202124; padding-bottom: 10px;">Order Specifications</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; font-family: Roboto, sans-serif; font-size: 14px;">
                                            <span class="label">Design Number:</span> <span class="value">${designNumber}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; font-family: Roboto, sans-serif; font-size: 14px;">
                                            <span class="label">Product Color:</span> <span class="value">${productColor}</span>
                                        </td>
                                    </tr>
                                      <tr>
                                        <td style="padding: 5px 0; font-family: Roboto, sans-serif; font-size: 14px;">
                                            <span class="label">Product Size:</span> <span class="value">${ProductSizeL}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; font-family: Roboto, sans-serif; font-size: 14px;">
                                            <span class="label">Karat:</span> <span class="value">${karat}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; font-family: Roboto, sans-serif; font-size: 14px;">
                                            <span class="label">Delivery Date & Time:</span> <span class="value">${deliveryDateTime} / ${deliveryTime}</span>
                                        </td>
                                    </tr>
                                     <tr>
                                        <td style="padding: 5px 0; font-family: Roboto, sans-serif; font-size: 14px;">
                                            <span class="label">Rhodium:</span> <span class="value">${rhodiumOption}</span>
                                        </td>
                                    </tr>
                                     <tr>
                                        <td style="padding: 5px 0; font-family: Roboto, sans-serif; font-size: 14px;">
                                            <span class="label">Stamping:</span> <span class="value">${stampingOption}</span>
                                        </td>
                                    </tr>
                                </table>

                                <!-- SECTION: Material Source -->
                                <div style="height: 1px; background-color: #dadce0; width: 100%; margin-top: 25px; margin-bottom: 25px;"></div>

                                <table width="100%" role="presentation">
                                    <tr>
                                        <td style="font-size: 18px; font-weight: bold; color: #202124; padding-bottom: 10px;">Material Source</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; font-family: Roboto, sans-serif; font-size: 14px;">
                                            <span class="label">Diamonds/Color Stone By:</span> <span class="value">${diamondSelection}</span>
                                        </td>
                                    </tr>
                                </table>

                                <!-- SECTION: Instructions -->
                                <div style="height: 1px; background-color: #dadce0; width: 100%; margin-top: 25px; margin-bottom: 25px;"></div>

                                <table width="100%" role="presentation">
                                    <tr>
                                        <td style="font-size: 18px; font-weight: bold; color: #202124; padding-bottom: 10px;">Production Instructions</td>
                                    </tr>
                                    <tr>
                                        <td style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; font-family: Roboto, sans-serif; font-size: 14px; color: #444; line-height: 1.5;">
                                            ${instructions}
                                        </td>
                                    </tr>
                                </table>

                                <!-- Footer within Card -->
                                <table width="100%" role="presentation" style="margin-top: 30px;">
                                    <tr>
                                        <td align="left" style="font-family: Roboto, sans-serif; font-size: 14px; color: #5f6368;">
                                            Thank you,<br>
                                            <strong>${companyName}</strong>
                                        </td>
                                    </tr>
                                </table>

                            </td>
                        </tr>
                    </table>
                    <!-- End Card Container -->

                    <!-- Global Footer -->
                    <table role="presentation" width="100%" style="max-width: 550px;">
                        <tr>
                            <td align="center" style="font-family: Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: #9aa0a6; line-height: 18px; padding-bottom: 20px;">
                            <tr>
                            <td align="center" style="font-family: Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: #9aa0a6; line-height: 18px;">
                             <p style="margin: 0; font-size: 11px; color: #999;">
                  © Elior Jewels. All rights reserved.<br>
                </p>
                            </td>
                        </tr>    </td>
                        </tr>
                    </table>

                </td>
            </tr>
        </table>
    </center>
</body>
</html>
  `;
}

export function generateCustomerConfirmationEmail(formData, diamondOptions) {
  const companyLogoUrl = "https://b2b.eliorjewel.com/WebSiteStaticImage/logoIcon/webLogo.png";
  const customerName = formData.name || "Guest";
  const designNumber = formData.designNumber || "Not Set";
  const productColor = formData.color || "Not Set";
  const karat = formData.karats || "Not Set";
  const rhodiumOption = formData.rhodium === "Other" ? `Other: ${formData.otherRhodium}` : formData.rhodium;
  const stampingOption = formData.stamping === "Other" ? `Other: ${formData.otherStamping}` : formData.stamping;
  const deliveryDateTime = formData.deliveryDate ? dayjs(formData.deliveryDate).format("DD/MM/YYYY") : "Not Set";
  const deliveryTime = formData.deliveryTime ? dayjs(formData.deliveryTime).format("hh:mm A") : "Not Set";
  const companyName = formData.company || "Not Set";
  const ProductSizeL = formData.productSize

  const diamondSelection =
    Object.entries(diamondOptions)
      .filter(([_, checked]) => checked)
      .map(([key]) => key.replace(/([A-Z])/g, " $1").trim())
      .join(", ") || "None";

  const instructions = formData.instructions || "No specific instructions provided.";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Request Received</title>
    <style>
        /* General Resets */
        body { margin: 0; padding: 0; font-family: 'Google Sans', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5; color: #202124; }
        table { border-collapse: collapse; }
        a { text-decoration: none; color: #4285f4; }
        .label { font-weight: bold; color: #5f6368; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
        .value { color: #202124; font-size: 15px; font-weight: 500; }
        
        /* Mobile Responsiveness */
        @media screen and (max-width: 600px) {
            .content-table { width: 100% !important; border: none !important; }
            .padding-container { padding: 20px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">

    <center>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 20px; margin-bottom: 20px;">
            <tr>
                <td align="center">
                    
                    <!-- Card Container -->
                    <table class="content-table" role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; margin-bottom: 24px;">
                        <tr>
                            <td class="padding-container" style="padding: 40px; border: 1px solid #dadce0; border-radius: 8px; background-color: #ffffff;">
                                
                                <!-- Company Logo -->
                                <table width="100%" role="presentation">
                                    <tr>
                                        <td align="left">
                                       <img src=${`https://b2b.eliorjewel.com/WebSiteStaticImage/logoIcon/webLogo.png` || companyLogoUrl} alt="Company Logo" style="display: block;  max-width: 400px; max-height: 120px;">                                        </td>
                                    </tr>
                                </table>

                                <!-- Success Icon (Green Check) -->
                                <!-- Greeting & Intro -->
                                <table width="100%" role="presentation" style="margin-top: 20px;">
                                    <tr>
                                        <td align="left" style="font-family: 'Google Sans', Roboto, Helvetica, Arial, sans-serif; font-size: 22px; line-height: 30px; color: #202124;">
                                            Request Received
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left" style="padding-top: 20px; font-family: Roboto, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; color: #3c4043;">
                                            Dear <strong>${customerName}</strong>,<br><br>
                                            Thank you for submitting your custom order request. We have successfully received your details and our team will now verify the design and specifications.
                                        </td>
                                    </tr>
                                </table>

                                <!-- Divider -->
                                <div style="height: 1px; background-color: #dadce0; width: 100%; margin-top: 25px; margin-bottom: 25px;"></div>

                                <!-- Order Summary Header -->
                                <table width="100%" role="presentation">
                                    <tr>
                                        <td style="font-family: 'Google Sans', Roboto, sans-serif; font-size: 18px; color: #202124; padding-bottom: 15px;">
                                            Order Details Summary
                                        </td>
                                    </tr>
                                </table>

                                <!-- Data Table -->
                                <table width="100%" role="presentation" cellpadding="5">
                                    <tr>
                                        <td width="40%" class="label" style="padding-bottom: 10px;">Design Number</td>
                                        <td width="60%" class="value" style="padding-bottom: 10px;">${designNumber}</td>
                                    </tr>
                                    <tr>
                                        <td class="label" style="padding-bottom: 10px;">Product Color</td>
                                        <td class="value" style="padding-bottom: 10px;">${productColor}</td>
                                    </tr>
                                    <tr>
                                        <td class="label" style="padding-bottom: 10px;">Product Size</td>
                                        <td class="value" style="padding-bottom: 10px;">${ProductSizeL}</td>
                                    </tr>
                                    <tr>
                                        <td class="label" style="padding-bottom: 10px;">Karat</td>
                                        <td class="value" style="padding-bottom: 10px;">${karat}</td>
                                    </tr>
                                    <tr>
                                        <td class="label" style="padding-bottom: 10px;">Delivery Date & Time</td>
                                        <td class="value" style="padding-bottom: 10px;">${deliveryDateTime} / ${deliveryTime}</td>
                                    </tr>
                                    <tr>
                                        <td class="label" style="padding-bottom: 10px;">Rhodium</td>
                                        <td class="value" style="padding-bottom: 10px;">${rhodiumOption}</td>
                                    </tr>
                                    <tr>
                                        <td class="label" style="padding-bottom: 10px;">Stamping</td>
                                        <td class="value" style="padding-bottom: 10px;">${stampingOption}</td>
                                    </tr>
                                    <tr>
                                        <td class="label" style="padding-bottom: 10px;">Diamonds/Stone By:</td>
                                        <td class="value" style="padding-bottom: 10px;">${diamondSelection}</td>
                                    </tr>
                                </table>

                                <!-- Instructions Box -->
                                <table width="100%" role="presentation" style="margin-top: 15px;">
                                    <tr>
                                        <td class="label" style="padding-bottom: 8px;">Your Instructions:</td>
                                    </tr>
                                    <tr>
                                        <td style="background-color: #f1f3f4; padding: 15px; border-radius: 8px; font-family: Roboto, sans-serif; font-size: 14px; color: #444; line-height: 1.5; font-style: italic;">
                                            "${instructions}"
                                        </td>
                                    </tr>
                                </table>

                                <!-- Action / Contact Info -->
                                <table width="100%" role="presentation" style="margin-top: 30px;">
                                    <tr>
                                        <td align="left" style="font-family: Roboto, sans-serif; font-size: 14px; line-height: 22px; color: #5f6368;">
                                            If any of the above details need correction, please reply to this email or contact us immediately.<br>
                                            We look forward to crafting your jewellery as you imagined.
                                        </td>
                                    </tr>
                                </table>

                                <!-- Sign off -->
                                <table width="100%" role="presentation" style="margin-top: 25px;">
                                    <tr>
                                        <td align="left" style="font-family: 'Google Sans', Roboto, sans-serif; font-weight: bold; font-size: 16px; color: #202124;">
                                            Thank you,<br>${companyName}
                                        </td>
                                    </tr>
                                </table>

                            </td>
                        </tr>
                    </table>
                    <!-- End Card Container -->

                    <!-- Global Footer -->
                    <table role="presentation" width="100%" style="max-width: 550px;">
                        <tr>
                            <td align="center" style="font-family: Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: #9aa0a6; line-height: 18px; padding-bottom: 20px;">
                             <p style="margin: 0; font-size: 11px; color: #999;">
                  © Elior Jewels. All rights reserved.<br>
                </p>
                            </td>
                        </tr>
                    </table>

                </td>
            </tr>
        </table>
    </center>
</body>
</html>
  `;
}
