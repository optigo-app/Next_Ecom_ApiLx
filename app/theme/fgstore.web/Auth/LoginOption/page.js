import { Box } from "@mui/material";
import "./LoginOption.modul.scss";
import { FaMobileAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import Link from "next/link";

const LoginOption = ({ params, searchParams }) => {
  const loginRedirect = searchParams?.LoginRedirect || searchParams?.search || "";
  const redirectEmailUrl = `/ContinueWithEmail${loginRedirect ? `?LoginRedirect=${encodeURIComponent(loginRedirect)}` : ""}`;
  const redirectMobileUrl = `/ContinueWithMobile${loginRedirect ? `?LoginRedirect=${encodeURIComponent(loginRedirect)}` : ""}`;

  return (
    <div className="smr_Loginoption">
      <div className="loginDailog">
        <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
          <p className="loginDiTile">Log in or sign up in seconds</p>
          <p style={{ textAlign: "center", color: "#7d7f85" }}>Use your email or mobile number to continue with the organization.</p>

          <div className="smilingLoginOptionMain">
            <Box sx={{ textDecoration: "none", width: "25% !important" }} component={Link} href={redirectEmailUrl} className="loginMail">
              <IoMdMail className="IoMdMail_fg" style={{ height: 25, width: 25 }} />
              <p style={{ margin: 0, fontSize: 20, fontWeight: 500, paddingLeft: 25 }}>Continue with email</p>
            </Box>

            <Box sx={{ textDecoration: "none", width: "25% !important" }} component={Link} href={redirectMobileUrl} className="loginMobile">
              <FaMobileAlt className="FaMobileAlt_fg" style={{ height: 25, width: 25, marginRight: 10 }} />
              <p style={{ margin: 0, fontSize: 20, fontWeight: 500, paddingLeft: 25 }}>Log in with mobile</p>
            </Box>
          </div>

          <p style={{ marginTop: 40, fontSize: 14, color: "#7d7f85", textAlign: "center" }}>By continuing, you agree to our Terms of Use. Read our Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginOption;
