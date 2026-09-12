"use client";
import React, { useEffect, useState } from "react";
import "./Account.scss";
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Paper,
  Container,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import YourProfile from "./YourProfile/YourProfile";
import ChangePassword from "./changePassword/ChangePassword";
import ManageAddress from "./address/ManageAddress";
import NewOrderHistory from "./AccountOrderHistory/NewOrderHistory";

import AccountLedger from "./AccountLeger/AccountLedger";
import Sales from "./Sales/Sales";
import DesignWiseSalesReport from "./DesignWiseSalesReport/DesignWiseSalesReport";
import SalesReport from "./SalesReport/SalesReport";
import QuotationJob from "./QuotationJob/QuotationJob";
import QuotationQuote from "./QuotationQuote/QuotationQuote";
import PendingMemo from "./PendingMemo/PendingMemo";

import { accountDetailPages, accountValidation } from "@/app/(core)/utils/Glob_Functions/AccountPages/AccountPage";
import Plm from "./PLM/Plm";
import Cookies from "js-cookie";
import { handleScrollTop } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import useGlobalPreventSave from "@/app/(core)/utils/Glob_Functions/useGlobalPreventSave";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import ReusableConfirmModal from "../../ui/Modal";
import AccountFooterSections from "./AccountFooterSections";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
      style={{ width: "100%", minWidth: 0 }}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 1, width: "100%", minWidth: 0, overflowX: "auto" }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `account-tab-${index}`,
    "aria-controls": `account-tabpanel-${index}`,
  };
}

export default function Account({ Storeinit }) {
  const { loginUserDetail, islogin, setislogin } = useStore();
  const { push } = useNextRouterLikeRR();
  const [value, setValue] = useState(0);
  const [value1, setValue1] = useState(0);
  const [openLogoutModal, setopenLogoutModal] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [accountInner, setAccountInner] = useState(accountDetailPages());

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeSub = (event, newValue) => {
    setValue1(newValue);
  };

  useGlobalPreventSave();

  const handleLogout = () => {
    setislogin(false);
    Cookies.remove("userLoginCookie");
    sessionStorage.setItem("LoginUser", false);
    sessionStorage.removeItem("storeInit");
    sessionStorage.removeItem("loginUserDetail");
    sessionStorage.removeItem("remarks");
    sessionStorage.removeItem("selectedAddressId");
    sessionStorage.removeItem("orderNumber");
    sessionStorage.removeItem("registerEmail");
    sessionStorage.removeItem("UploadLogicalPath");
    sessionStorage.removeItem("remarks");
    sessionStorage.removeItem("registerMobile");
    sessionStorage.removeItem("allproductlist");
    sessionStorage.clear();
    Cookies.remove("userLoginCookie");
    Cookies.remove("LoginUser");
    window.location.href = "/";
  };

  const OpenLogoutModal = () => setopenLogoutModal(true);
  const CloseLogoutMode = () => setopenLogoutModal(false);

  const isB2B = accountValidation();

  // Navigation Items
  const navItems = [
    { label: "Your Profile", icon: <PersonOutlineIcon sx={{ fontSize: 20 }} />, index: 0 },
    { label: "Order History", icon: <ShoppingBagOutlinedIcon sx={{ fontSize: 20 }} />, index: 1 },
    { label: "Manage Addresses", icon: <LocationOnOutlinedIcon sx={{ fontSize: 20 }} />, index: 2 },
    ...(isB2B
      ? [{ label: "Account & Reports", icon: <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 20 }} />, index: 3 }]
      : []),
    {
      label: "Change Password",
      icon: <LockOutlinedIcon sx={{ fontSize: 20 }} />,
      index: isB2B ? 4 : 3,
    },
    ...(loginUserDetail?.IsPLWOn
      ? [{ label: "PLM", icon: <LayersOutlinedIcon sx={{ fontSize: 20 }} />, index: 7 }]
      : []),
  ];

  // Dynamic titles and subtitles
  const getTabHeader = () => {
    if (value === 0) return { title: "Account Information", subtitle: "Update your account details and profile information" };
    if (value === 1) return { title: "Order History", subtitle: "Track, review, and manage your past orders" };
    if (value === 2) return { title: "Manage Addresses", subtitle: "Manage your delivery and billing addresses" };
    if (isB2B && value === 3) return { title: "Financials & Reports", subtitle: "View your sales, quotes, and ledger statements" };
    if (value === (isB2B ? 4 : 3)) return { title: "Security & Password", subtitle: "Manage and change your account password" };
    if (value === 7) return { title: "PLM", subtitle: "Product lifecycle management" };
    return { title: "Your Account", subtitle: "Manage your account preferences" };
  };

  const currentHeader = getTabHeader();
  const userName =
    (loginUserDetail?.firstname ? `${loginUserDetail?.firstname} ${loginUserDetail?.lastname || ""}`.trim() : "") ||
    loginUserDetail?.fullname ||
    loginUserDetail?.name ||
    "Valued Customer";
  const userEmail = loginUserDetail?.userid || loginUserDetail?.email || "";

  return (
    <>
      <ReusableConfirmModal
        open={openLogoutModal}
        onConfirm={handleLogout}
        onClose={CloseLogoutMode}
      />

      <Box
        sx={{
          minHeight: "calc(100vh - 120px)",
          bgcolor: "#fbfbfc",
          py: { xs: 2, sm: 3.5, md: 5 },
          px: { xs: 2, sm: 3, md: 4 },
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Container
          maxWidth="xl"
          disableGutters
          sx={{
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 2.5, md: 3.5 },
              alignItems: "flex-start",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {/* Navigation Sidebar */}
            <Paper
              elevation={0}
              sx={{
                width: { xs: "100%", md: "260px", lg: "280px" },
                flexShrink: 0,
                boxSizing: "border-box",
                bgcolor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.03)",
                p: { xs: 2, sm: 2.5 },
                position: { xs: "relative", md: "sticky" },
                top: { md: "90px" },
                alignSelf: "flex-start",
                zIndex: 10,
              }}
            >
              {/* User Profile Summary Header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.5,
                  mb: 1.5,
                  bgcolor: "#f9fafb",
                  borderRadius: "6px",
                  border: "1px solid #f3f4f6",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#0b291d",
                    color: "#ffffff",
                    fontWeight: 700,
                    width: 40,
                    height: 40,
                    fontSize: "1rem",
                  }}
                >
                  {userName.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ overflow: "hidden" }}>
                  <Typography
                    variant="subtitle2"
                    noWrap
                    sx={{ fontWeight: 700, color: "#111827", fontSize: "0.92rem", lineHeight: 1.2 }}
                  >
                    {userName}
                  </Typography>
                  {userEmail && (
                    <Typography
                      variant="caption"
                      noWrap
                      sx={{ color: "#6b7280", fontSize: "0.78rem", display: "block", mt: 0.25 }}
                    >
                      {userEmail}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Divider sx={{ mb: 1.5, borderColor: "#f3f4f6" }} />

              {/* Vertical Menu Items (Clean Column for Mobile & Desktop) */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, width: "100%" }}>
                {navItems.map((item) => {
                  const isSelected = value === item.index;
                  return (
                    <Box
                      key={item.index}
                      onClick={() => {
                        setValue(item.index);
                        handleScrollTop();
                      }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        px: 2,
                        py: { xs: 1.1, sm: 1.25 },
                        borderRadius: "6px",
                        cursor: "pointer",
                        transition: "all 0.15s ease-in-out",
                        bgcolor: isSelected ? "#0b291d" : "transparent",
                        color: isSelected ? "#ffffff" : "#4b5563",
                        fontWeight: isSelected ? 600 : 500,
                        fontSize: "0.9rem",
                        width: "100%",
                        boxSizing: "border-box",
                        "&:hover": {
                          bgcolor: isSelected ? "#0b291d" : "#f3f4f6",
                          color: isSelected ? "#ffffff" : "#111827",
                        },
                      }}
                    >
                      <Box sx={{ color: isSelected ? "#ffffff" : "#6b7280", display: "flex" }}>
                        {item.icon}
                      </Box>
                      <Typography sx={{ fontSize: "inherit", fontWeight: "inherit", flex: 1 }}>
                        {item.label}
                      </Typography>
                    </Box>
                  );
                })}

                <Divider sx={{ my: 1, borderColor: "#f3f4f6" }} />

                {/* Log Out Button */}
                <Box
                  onClick={OpenLogoutModal}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 2,
                    py: { xs: 1.1, sm: 1.25 },
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.15s ease-in-out",
                    color: "#dc2626",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    width: "100%",
                    boxSizing: "border-box",
                    "&:hover": {
                      bgcolor: "#fef2f2",
                    },
                  }}
                >
                  <LogoutOutlinedIcon sx={{ fontSize: 20, color: "#dc2626" }} />
                  <Typography sx={{ fontSize: "inherit", fontWeight: "inherit" }}>
                    Log Out
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Right Main Content Panel */}
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                minWidth: 0,
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
                bgcolor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.03)",
                p: { xs: 2, sm: 3, md: 3.5 },
                minHeight: { md: "640px" },
                overflow: "hidden",
              }}
            >
              {/* Content Header */}
              <Box sx={{ mb: 3.5, pb: 2, borderBottom: "1px solid #f3f4f6" }}>
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 600,
                    color: "#111827",
                    fontSize: { xs: "1.35rem", sm: "1.65rem" },
                    lineHeight: 1.25,
                    mb: 0.5,
                  }}
                >
                  {currentHeader.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#6b7280", fontSize: "0.88rem" }}>
                  {currentHeader.subtitle}
                </Typography>
              </Box>

              {/* Tab Content Panels */}
              <Box>
                {/* 0. Your Profile */}
                <CustomTabPanel value={value} index={0}>
                  <YourProfile />
                </CustomTabPanel>

                {/* 1. Order History */}
                <CustomTabPanel value={value} index={1}>
                  <NewOrderHistory />
                </CustomTabPanel>

                {/* 2. Manage Addresses */}
                <CustomTabPanel value={value} index={2} className="manageAddressSec">
                  <ManageAddress />
                </CustomTabPanel>

                {/* 3. B2B Account / Sales / Reports Sub-tabs */}
                {isB2B && (
                  <CustomTabPanel value={value} index={3} className="accountSalesPage">
                    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                      <Tabs
                        value={value1}
                        className="accountTabSection"
                        variant="scrollable"
                        onChange={handleChangeSub}
                        aria-label="Account Subtabs"
                        sx={{
                          bgcolor: "#f9fafb",
                          borderRadius: "4px",
                          p: 0.5,
                          "& .MuiTabs-indicator": { bgcolor: "#0b291d" },
                          "& .MuiTab-root": {
                            textTransform: "none",
                            fontSize: "0.88rem",
                            fontWeight: 600,
                            color: "#6b7280",
                            "&.Mui-selected": { color: "#0b291d" },
                          },
                        }}
                        scrollButtons="auto"
                      >
                        {accountInner?.map((e, i) => {
                          if (Storeinit?.IsPriceShow == 0 && e.tabComp === "AccountLedger") {
                            return <Tab key={i} sx={{ display: "none" }} />;
                          }
                          return <Tab label={e?.tabLabel} {...a11yProps(i)} key={i} />;
                        })}
                      </Tabs>
                    </Box>

                    {accountInner?.map((e, i) => (
                      <React.Fragment key={i}>
                        {e?.id === 1163 && (
                          <CustomTabPanel value={value1} index={i} className="AcountSales">
                            <QuotationQuote />
                          </CustomTabPanel>
                        )}
                        {e?.id === 1164 && (
                          <CustomTabPanel value={value1} index={i} className="quotationFilters">
                            <QuotationJob />
                          </CustomTabPanel>
                        )}
                        {e?.id === 1157 && (
                          <CustomTabPanel value={value1} index={i} className="salesPage">
                            <Sales />
                          </CustomTabPanel>
                        )}
                        {e?.id === 1314 && (
                          <CustomTabPanel value={value1} index={i} className="salesReport">
                            <SalesReport />
                          </CustomTabPanel>
                        )}
                        {e?.id === 18129 && (
                          <CustomTabPanel value={value1} index={i}>
                            <PendingMemo />
                          </CustomTabPanel>
                        )}
                        {e?.id === 17020 && (
                          <CustomTabPanel value={value1} index={i} className="DesignWiseSalesReport">
                            <DesignWiseSalesReport />
                          </CustomTabPanel>
                        )}
                        {Storeinit?.IsPriceShow == 1 && e?.id === 1159 && (
                          <CustomTabPanel value={value1} index={i}>
                            <AccountLedger />
                          </CustomTabPanel>
                        )}
                      </React.Fragment>
                    ))}
                  </CustomTabPanel>
                )}

                {/* 4 / 3. Change Password */}
                <CustomTabPanel value={value} index={isB2B ? 4 : 3}>
                  <ChangePassword />
                </CustomTabPanel>

                {/* 7. PLM */}
                {loginUserDetail?.IsPLWOn && (
                  <CustomTabPanel value={value} index={7}>
                    <Plm />
                  </CustomTabPanel>
                )}
              </Box>
            </Paper>
          </Box>

          {/* Value Proposition Features & Newsletter Banner */}
          <AccountFooterSections />
        </Container>
      </Box>
    </>
  );
}
