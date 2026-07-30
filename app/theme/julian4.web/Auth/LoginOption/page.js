import { Box } from "@mui/material";
import "./LoginOption.modul.scss";
import { FaMobileAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import Link from "next/link";

const LoginOption = ({ params, searchParams }) => {
  const loginRedirect = searchParams?.LoginRedirect || searchParams?.loginRedirect || searchParams?.search || "";

  const redirectEmailUrl = `/ContinueWithEmail${loginRedirect ? `?LoginRedirect=${encodeURIComponent(loginRedirect)}` : ""}`;
  const redirectMobileUrl = `/ContinueWithMobile${loginRedirect ? `?LoginRedirect=${encodeURIComponent(loginRedirect)}` : ""}`;


  return (
    <div className="elve_smr_Loginoption">
      <div className="loginDailog">
        <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
          <p className="loginDiTile">Log in or sign up in seconds</p>
          <p style={{ textAlign: "center", color: "#7d7f85", marginBottom: '15px' }}> Use your email or mobile number to continue with the organization.</p>
          <div className="smilingLoginOptionMain">
            <Box sx={{ textDecoration: "none" }} component={Link} href={redirectEmailUrl} className="loginMail">
              <IoMdMail className="IoMdMail_fg" style={{ height: 22, width: 22 }} />
              <p style={{ margin: 0, fontSize: 16, fontWeight: 500, paddingLeft: 12, whiteSpace: "nowrap" }}>Continue with email</p>
            </Box>

            <Box sx={{ textDecoration: "none" }} component={Link} href={redirectMobileUrl} className="loginMobile">
              <FaMobileAlt className="FaMobileAlt_fg" style={{ height: 22, width: 22 }} />
              <p style={{ margin: 0, fontSize: 16, fontWeight: 500, paddingLeft: 12, whiteSpace: "nowrap" }}>Log in with mobile</p>
            </Box>
          </div>
          <p style={{ marginTop: 40, fontSize: 14, color: "#7d7f85", textAlign: "center" }}>By continuing, you agree to our Terms of Use. Read our Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginOption;
