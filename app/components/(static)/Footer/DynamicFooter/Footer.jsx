"use client";

import React from "react";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./Footer.scss";

/* ---------------- helpers ---------------- */
const parseContentJson = (raw) => {
  if (!raw) return null;
  if (typeof raw === "object") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const makeGetComp = (data) => (id) =>
  data?.components?.find((c) => c.id === id) || { props: {} };

const pickFooterTemplate = (templates = []) => {
  const list = templates.filter(
    (t) =>
      t?.ContentType === "pagetemplate" &&
      t?.PageKey?.toLowerCase() === "footer"
  );
  if (!list.length) return null;

  const active = list.find((t) => t.IsActive) || list[0];
  const data = parseContentJson(active.ContentJson);
  if (!data) return null;
 
  const title = [active.Title, data.templateId].find(isFooterTemplate) || null;

  return title ? { title, data } : null;
};


const FIXED_LINK_MAP = {
  about: "/aboutUs",
  aboutus: "/aboutUs",

  contact: "/contactUs",
  contactus: "/contactUs",

  termsandcondition: "/terms-and-conditions",
  termsandconditions: "/terms-and-conditions",
  termscondition: "/terms-and-conditions",
  termsconditions: "/terms-and-conditions",

  privacypolicy: "/privacyPolicy",
  privacy: "/privacyPolicy",
  faq: "/faq",
  FAQ: "/faq",
  Customize:"/customization",
  "Book an Appointment":"/appointment",
  "Customer Services":"/customer-service",
};

const normalizeLabel = (label = "") =>
  label
    .toString()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");

const resolveLinkUrl = (label, fallbackUrl) =>
  FIXED_LINK_MAP[normalizeLabel(label)] || fallbackUrl || "#";

 
const normalizeSocialData = (raw) => {
  const parsed = parseContentJson(raw);
 
  if (parsed?.ContentJson) return parseContentJson(parsed.ContentJson);
  return parsed;
};

const getActiveSocials = (socialData) => {
  if (!socialData) return [];
  const order = socialData.platformOrder || Object.keys(socialData.platforms || {});
  return order
    .map((key) => ({ key, ...(socialData.platforms?.[key] || {}) }))
    .filter((p) => p.enabled && p.url && p.iconUrl);
};

/* ---------------- shared: social icon links ---------------- */
function SocialLinks({ socialData, linkClass, size = 20, style }) {
  const target = socialData?.settings?.openInNewTab ? "_blank" : "_self";

  return getActiveSocials(socialData).map((social) => (
    <a
      key={social.key}
      href={social.url || "#"}
      target={target}
      rel="noopener noreferrer"
      className={linkClass}
      style={style}
    >
      <img
        src={social.iconUrl}
        alt={social.key}
        style={{ width: size, height: size, objectFit: "contain", display: "block" }}
      />
    </a>
  ));
}

 
function Footer1({ data, socialData }) {
  const getComp = makeGetComp(data);
  const logoSec = getComp("section-logo").props;
  const linksSec = getComp("section-links").props;
  const socialSec = getComp("section-social-icons").props;
  const copySec = getComp("section-copyright").props;

  const iconSize = parseInt(socialSec.iconSize) || 24;

  return (
    <footer className="f1-footer" style={{ backgroundColor: data?.backgroundColor || "#000000" }}>
      <div className="f1-inner">
        <div className="f1-top">
          <div className="f1-logo">
            <img
              src={logoSec.image}
              alt={logoSec.alt}
              style={{ height: logoSec.height, objectFit: logoSec.objectFit }}
            />
          </div>

          <div className="f1-links" style={{ gap: linksSec.gap }}>
            {linksSec.links?.map((link, idx) => (
              <a
                key={idx}
                href={resolveLinkUrl(link.label, link.url)}
                style={{ color: linksSec.textColor, fontSize: linksSec.fontSize }}
                className="f1-link-anchor"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="f1-socials" style={{ gap: socialSec.gap }}>
            <SocialLinks socialData={socialData} linkClass="f1-social-link" size={iconSize} />
          </div>
        </div>

        <div className="f1-copy">
          <p style={{ color: copySec.textColor, fontSize: copySec.fontSize }}>{copySec.content}</p>
        </div>
      </div>
    </footer>
  );
}

/* ================= Footer2 — company details + group links + account ================= */
function Footer2({ data }) {
  const getComp = makeGetComp(data);
  const companySec = getComp("section-company-details").props;
  const groupsSec = getComp("section-group-links").props;
  const accountSec = getComp("section-account").props;
  const copySec = getComp("section-copyright").props;

  return (
    <footer className="f2-footer" style={{ backgroundColor: data?.backgroundColor }}>
      <div className="f2-divider" />

      <div className="f2-grid">
        <div className="f2-col">
          <h3
            className="f2-heading"
            style={{ color: companySec.headingColor, fontSize: companySec.headingSize }}
          >
            {companySec.heading}
          </h3>
          <p className="f2-text">{companySec.text}</p>
          <a
            href={resolveLinkUrl(companySec.link?.label, companySec.link?.url)}
            className="f2-link-underline"
          >
            {companySec.link?.label}
          </a>
        </div>

        {groupsSec.groups?.map((group, gIdx) => (
          <div key={gIdx} className="f2-col">
            <h3
              className="f2-heading"
              style={{ color: groupsSec.headingColor, fontSize: groupsSec.headingSize }}
            >
              {group.heading}
            </h3>
            <ul className="f2-list">
              {group.links?.map((link, lIdx) => (
                <li key={lIdx}>
                  <a
                    href={resolveLinkUrl(link.label, link.url)}
                    style={{ color: groupsSec.textColor, fontSize: groupsSec.fontSize }}
                    className="f2-link-anchor"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="f2-col">
          <h3
            className="f2-heading"
            style={{ color: accountSec.headingColor, fontSize: accountSec.headingSize }}
          >
            {accountSec.heading}
          </h3>
          <ul className="f2-list">
            {accountSec.links?.map((link, idx) => (
              <li key={idx}>
                <a
                  href={resolveLinkUrl(link.label, link.url)}
                  style={{ color: accountSec.textColor, fontSize: accountSec.fontSize }}
                  className="f2-link-anchor"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="f2-copy">
        <p>{copySec.content}</p>
      </div>
    </footer>
  );
}

/* ================= Footer3 — logo + link groups + socials/contact details ================= */
function Footer3({ data, socialData }) {
  const getComp = makeGetComp(data);
  const logoSec = getComp("section-logo").props;
  const linksSec = getComp("section-links").props;
  const companySec = getComp("section-company-detail").props;
  const copySec = getComp("section-copyright").props;

  const iconSize = parseInt(companySec.iconSize) || 20;

  return (
    <footer className="f3-footer" style={{ backgroundColor: data?.backgroundColor || "#f8f7f5" }}>
      <div className="f3-row">
        <div className="f3-logo">
          <img src={logoSec.image} alt="logo" style={{ height: logoSec.height, objectFit: "contain" }} />
        </div>

        <div className="f3-links">
          {linksSec.groups?.map((group, gIdx) => (
            <ul key={gIdx} className="f3-link-list">
              {group.links?.map((link, lIdx) => (
                <li key={lIdx} className="f3-link-item">
                  <a
                    href={resolveLinkUrl(link.label, link.url)}
                    style={{ color: linksSec.textColor, fontSize: linksSec.fontSize }}
                    className="f3-link-anchor"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </div>

        <div className="f3-company">
          <div className="f3-social-row">
            <SocialLinks socialData={socialData} linkClass="f3-social-link" size={iconSize} />
          </div>

          <div className="f3-detail" style={{ color: companySec.textColor, fontSize: companySec.fontSize }}>
            <div className="f3-detail-row">
              <span><LocationOnOutlinedIcon fontSize="inherit" /></span>
              <p>{companySec.location}</p>
            </div>
            <div className="f3-detail-row">
              <span><PhoneOutlinedIcon fontSize="inherit" /></span>
              <p>{companySec.phone}</p>
            </div>
            <div className="f3-detail-row">
              <span><EmailOutlinedIcon fontSize="inherit" /></span>
              <p>{companySec.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="f3-copy" style={{ backgroundColor: copySec.backgroundColor }}>
        <p>{copySec.content}</p>
      </div>
    </footer>
  );
}

/* ================= Footer4 — logo/socials + office + group links + signup ================= */
function Footer4({ data, socialData }) {
  const getComp = makeGetComp(data);
  const logoSec = getComp("section-1-logo-social").props;
  const officeSec = getComp("section-2-company-details").props;
  const linksSec = getComp("section-3-group-links").props;
  const signupSec = getComp("section-4-signup").props;
  const copySec = getComp("section-copyright").props;

  return (
    <footer className="f4-footer" style={{ backgroundColor: data?.backgroundColor || "#ffffff" }}>
      <div className="f4-row">
        <div className="f4-col">
          {logoSec.logoUrl && (
            <img
              src={logoSec.logoUrl}
              alt="Logo"
              style={{ height: logoSec.logoHeight }}
              className="f4-logo-img"
            />
          )}
          <div className="f4-social-row">
            <SocialLinks socialData={socialData} linkClass="f4-social-link" />
          </div>
        </div>

        <div className="f4-col">
          <h4
            style={{ color: officeSec.headingColor, fontSize: officeSec.headingSize }}
            className="f4-heading"
          >
            {officeSec.heading}
          </h4>
          <div className="f4-detail-row">
            <span><LocationOnOutlinedIcon fontSize="inherit" /></span>
            <p style={{ color: officeSec.textColor, fontSize: officeSec.textSize }}>
              {officeSec.address}
            </p>
          </div>
          <div className="f4-detail-row">
            <span><PhoneOutlinedIcon fontSize="inherit" /></span>
            <p style={{ color: officeSec.textColor, fontSize: officeSec.textSize }}>
              {officeSec.phone}
            </p>
          </div>
        </div>

        <div className="f4-links-wrap">
          {linksSec.groups?.map((group, gIdx) => (
            <div key={gIdx} className="f4-col">
              <h4
                style={{ color: linksSec.headingColor, fontSize: linksSec.headingSize }}
                className="f4-heading"
              >
                {group.heading}
              </h4>
              <ul className="f4-list">
                {group.links?.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a
                      href={resolveLinkUrl(link.label, link.url)}
                      style={{ color: linksSec.linkColor, fontSize: linksSec.linkSize }}
                      className="f4-link-anchor"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="f4-col">
          <h4
            style={{ color: signupSec.headingColor, fontSize: signupSec.headingSize }}
            className="f4-heading"
          >
            {signupSec.heading}
          </h4>
          <p
            style={{ color: signupSec.descriptionColor, fontSize: signupSec.descriptionSize }}
            className="f4-desc"
          >
            {signupSec.description}
          </p>
          <div className="f4-signup-row">
            <input type="email" placeholder={signupSec.inputPlaceholder} className="f4-input" />
            <button
              type="button"
              className="f4-signup-btn"
              style={{
                backgroundColor: signupSec.buttonColor,
                color: signupSec.buttonTextColor,
                fontSize: signupSec.buttonSize,
              }}
            >
              {signupSec.buttonLabel}
            </button>
          </div>
        </div>
      </div>

      <div className="f4-copy">
        <p>{copySec.content}</p>
      </div>
    </footer>
  );
}

/* ================= Footer5 — navigation + QR + newsletter with bg image ================= */
function Footer5({ data, socialData }) {
  const getComp = makeGetComp(data);
  const navSec = getComp("section-navigation").props;
  const newsletterSec = getComp("section-newsletter").props;
  const copyrightSec = getComp("section-copyright").props;

  return (
    <footer className="f5-footer" style={{ backgroundColor: data?.backgroundColor || "#fcf7f2" }}>
      <div className="f5-split">
        <div className="f5-left">
          <div className="f5-nav-grid">
            <div
              className="f5-headings"
              style={{ color: navSec.headingColor, fontSize: navSec.headingSize }}
            >
              {navSec.groups?.map((group, index) => (
                <p key={index} className="f5-group-title">{group.title}</p>
              ))}

              <div className="f5-qr-box">
                <span className="f5-qr-icon"><QrCode2Icon fontSize="inherit" /></span>
                <div>
                  <h4 style={{ color: navSec.headingColor }} className="f5-qr-text">
                    {navSec.qrText}
                  </h4>
                  <p style={{ color: navSec.headingColor }} className="f5-qr-sub">
                    {navSec.qrSubtext}
                  </p>
                </div>
              </div>
            </div>

            <div className="f5-link-col">
              {navSec.groups
                ?.flatMap((g) => g.links || [])
                .map((link, lIdx) => (
                  <a
                    key={lIdx}
                    href={resolveLinkUrl(link.label, link.url)}
                    className="f5-link"
                    style={{ color: navSec.linkColor, fontSize: navSec.linkSize }}
                  >
                    {link.label}
                  </a>
                ))}
              <p className="f5-email" style={{ color: navSec.linkColor }}>
                {navSec.emailText}
              </p>
            </div>
          </div>

          <div className="f5-logo-wrap">
            {navSec.logoUrl && (
              <img
                src={navSec.logoUrl}
                alt="Logo"
                style={{ height: navSec.logoHeight }}
                className="f5-logo-img"
              />
            )}
          </div>
        </div>

        <div
          className="f5-right"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url(${newsletterSec.backgroundImage})`,
          }}
        >
          <div className="f5-newsletter-box">
            <h2 style={{ color: newsletterSec.headingColor, fontSize: newsletterSec.headingSize }}>
              {newsletterSec.heading}
            </h2>
            <div className="f5-newsletter-input-row">
              <input
                type="email"
                disabled
                placeholder={newsletterSec.placeholder}
                className="f5-newsletter-input"
              />
              <button type="button" className="f5-newsletter-arrow">
                <ArrowForwardIcon fontSize="inherit" />
              </button>
            </div>
            <div className="f5-social-row">
              <SocialLinks socialData={socialData} linkClass="f5-social-link" />
            </div>
          </div>
        </div>
      </div>

      <div
        className="f5-bottom-bar"
        style={{ color: copyrightSec.textColor, fontSize: copyrightSec.textSize }}
      >
        <span>{copyrightSec.regionText}</span>
        <p>{copyrightSec.copyrightText}</p>
      </div>
    </footer>
  );
}

/* ================= registry ================= */
const FOOTER_TEMPLATES = {
  Footer1,
  Footer2,
  Footer3,
  Footer4,
  Footer5,
};

const isFooterTemplate = (id) =>
  Object.prototype.hasOwnProperty.call(FOOTER_TEMPLATES, id);

export default function Footer({ templates = [], socialData = null }) {
  const match = pickFooterTemplate(templates);

  if (!match) {
    return <div className="footer-error">No footer template found.</div>;
  }

  const Template = FOOTER_TEMPLATES[match.title];
  return <Template data={match.data} socialData={normalizeSocialData(socialData)} />;
}