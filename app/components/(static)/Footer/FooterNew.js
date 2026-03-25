import Link from "next/link";
import "./FooterNew.scss";

const FooterNew = ({ companyInfoData, storeData, extraFlag, logos }) => {
  const parsedSocialLinks = (() => {
    try {
      return companyInfoData?.SocialLinkObj ? JSON.parse(companyInfoData.SocialLinkObj) : [];
    } catch (error) {
      console.error("Error parsing SocialLinkObj:", error);
      return [];
    }
  })();


  return (
    <footer className="fg-footer">
      <div className="fg-footer__inner">
        {/* Left: Logo */}
        <div className="fg-footer__logo">
          <Link href="/">
            <img src={logos?.web} alt="Company Logo" className="fg-footer__logo-img" />
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="fg-footer__nav">
          <Link href="/terms-and-conditions" className="fg-footer__nav-link">
            Terms & Conditions
          </Link>

          <Link href="/aboutUs" className="fg-footer__nav-link">
            About Us
          </Link>
          <Link href="/contactUs" className="fg-footer__nav-link">
            Contact Us
          </Link>
        </nav>

        {/* Right: Social Icons */}
        <div className="fg-footer__social">
          {parsedSocialLinks?.map((social, idx) => (
            <Link key={idx} href={social.SLink} target="_blank" rel="noopener noreferrer" className="fg-footer__social-link">
              <img src={social.SImgPath} alt={social.SName} className="fg-footer__social-img" />
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Copy */}
      <div className="fg-footer__copy">
        &#169; {new Date().getFullYear()}, {storeData?.companyname || "Company Name"}
      </div>
    </footer>
  );
};

export default FooterNew;


{/* <Link href="/privacyPolicy" className="fg-footer__nav-link">
            Privacy Policy
          </Link> */}