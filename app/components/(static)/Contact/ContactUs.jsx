"use client";

import React from "react";
import { Mail, Phone, MapPin, User } from "lucide-react";
import "./contact.scss";

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

/* Recursively look up a component by id (some templates nest fields in `children`). */
function findById(components, id) {
  for (const c of components || []) {
    if (c.id === id) return c;
    if (c.children) {
      const found = findById(c.children, id);
      if (found) return found;
    }
  }
  return null;
}

/* Same idea, first component matching a `type`. */
function findByType(components, type) {
  for (const c of components || []) {
    if (c.type === type) return c;
    if (c.children) {
      const found = findByType(c.children, type);
      if (found) return found;
    }
  }
  return null;
}

const ICONS = { phone: Phone, mail: Mail, mappin: MapPin, user: User };
const renderFieldIcon = (name) => {
  const Icon = ICONS[(name || "").toLowerCase()] || User;
  return <Icon size={18} />;
};

const pickContactTemplate = (templates = []) => {
  const list = templates.filter(
    (t) => t?.ContentType === "pagetemplate" && t?.PageKey === "contact-us"
  );
  if (!list.length) return null;

  const active = list.find((t) => t.IsActive) || list[0];
  const data = parseContentJson(active.ContentJson);
  if (!data) return null;

  // works for Contact1...ContactN automatically, based on the registry
  const title = [active.Title, data.templateId].find(isContactTemplate) || null;

  return title ? { title, data } : null;
};

/* ================= Contact1 — heading + form / info list / map ================= */
function Contact1({ data }) {
  const heading = findById(data?.components, "main-heading-contact");
  const formSection = findByType(data?.components, "form");
  const contentSection = findByType(data?.components, "content-group");
  const mapSection = findByType(data?.components, "map");

  return (
    <div className="ct-c1-page">
      <div className="ct-c1-header">
        <h1
          className="ct-c1-heading"
          style={{
            fontSize: `${heading?.props?.headingFontSize}px`,
            color: heading?.props?.headingColor,
          }}
        >
          {heading?.props?.heading}
        </h1>
        <p
          className="ct-c1-subtext"
          style={{
            fontSize: `${heading?.props?.contentFontSize}px`,
            color: heading?.props?.contentColor,
          }}
        >
          {heading?.props?.content}
        </p>
      </div>

      <div className="ct-c1-grid">
        {formSection && (
          <div className="ct-c1-form-col">
            <form className="ct-c1-form">
              {formSection.props?.fields?.map((field) => (
                <div key={field.id} className="ct-c1-field">
                  <label className="ct-c1-label">{field.label}</label>
                  {field.type === "textarea" ? (
                    <textarea className="ct-c1-textarea" placeholder={field.placeholder} />
                  ) : (
                    <input
                      type={field.type}
                      className="ct-c1-input"
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
              <div className="ct-c1-btn-wrap">
                <button
                  type="button"
                  className="ct-c1-btn"
                  style={{
                    backgroundColor: formSection.props?.buttonColor,
                    color: formSection.props?.buttonTextColor,
                  }}
                >
                  {formSection.props?.buttonText}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="ct-c1-info-col">
          <div className="ct-c1-info-list">
            {contentSection?.props?.sections?.map((section, idx) => (
              <div key={idx} className="ct-c1-info-item">
                <h3
                  className="ct-c1-info-heading"
                  style={{
                    fontSize: `${contentSection.props.headingFontSize}px`,
                    color: contentSection.props.headingColor,
                  }}
                >
                  {section.heading}
                </h3>
                <p
                  className="ct-c1-info-content"
                  style={{
                    fontSize: `${contentSection.props.fontSize}px`,
                    color: contentSection.props.contentColor,
                  }}
                >
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {mapSection && (
            <div className="ct-c1-map-wrap">
              <iframe
                title="map"
                src={mapSection.props?.mapUrl || mapSection.props?.url || "about:blank"}
                className="ct-c1-map"
                height={mapSection.props?.height || "300px"}
                style={{ border: 0, borderRadius: `${mapSection.props?.borderRadius || 0}px` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= Contact2 — hero banner + heading + info list + form ================= */
function Contact2({ data }) {
  const heroBanner = findByType(data?.components, "banner");
  const heading = findById(data?.components, "main-heading-contact");
  const formSection = findByType(data?.components, "form");
  const infoSection = findByType(data?.components, "content-group");

  return (
    <div className="ct-c2-page">
      {heroBanner && (
        <div
          className="ct-c2-hero"
          style={{
            height: heroBanner.props?.height || "300px",
            backgroundImage: `url(${heroBanner.props?.backgroundImage})`,
          }}
        >
          <div
            className="ct-c2-hero-overlay"
            style={{ backgroundColor: heroBanner.props?.overlayColor }}
          />
        </div>
      )}

      <div className="ct-c2-heading-wrap">
        <h1
          className="ct-c2-heading"
          style={{
            fontSize: `${heading?.props?.headingFontSize}px`,
            color: heading?.props?.headingColor,
          }}
        >
          {heading?.props?.heading}
        </h1>
        <p
          className="ct-c2-subtext"
          style={{
            fontSize: `${heading?.props?.contentFontSize}px`,
            color: heading?.props?.contentColor,
          }}
        >
          {heading?.props?.content}
        </p>
      </div>

      <div className="ct-c2-info-list">
        {infoSection?.props?.sections?.map((section, idx) => (
          <div key={idx} className="ct-c2-info-item">
            <h3
              className="ct-c2-info-heading"
              style={{
                fontSize: `${infoSection.props.headingFontSize}px`,
                color: infoSection.props.headingColor,
              }}
            >
              {section.heading}
            </h3>
            <div
              className="ct-c2-info-content"
              style={{
                fontSize: `${infoSection.props.contentFontSize}px`,
                color: infoSection.props.contentColor,
              }}
            >
              {section.content}
            </div>
          </div>
        ))}
      </div>

      <div className="ct-c2-layout">
        {formSection && (
          <div className="ct-c2-form-wrap">
            <div className="ct-c2-form-head">
              <h2 className="ct-c2-form-heading">{formSection.props?.formHeading}</h2>
              <p className="ct-c2-form-desc">{formSection.props?.formDescription}</p>
            </div>

            <form className="ct-c2-form">
              {formSection.props?.fields?.map((field) => (
                <div key={field.id} className="ct-c2-field" style={{ width: field.width }}>
                  {field.type === "textarea" ? (
                    <textarea className="ct-c2-textarea" placeholder={field.label} />
                  ) : (
                    <input type={field.type} className="ct-c2-input" placeholder={field.label} />
                  )}
                </div>
              ))}

              <div className="ct-c2-btn-wrap">
                <button
                  type="button"
                  className="ct-c2-btn"
                  style={{
                    backgroundColor: formSection.props?.buttonColor,
                    color: formSection.props?.buttonTextColor,
                  }}
                >
                  {formSection.props?.buttonText}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= Contact3 — heading + two cards: form / info + map ================= */
function Contact3({ data }) {
  const heading = findById(data?.components, "main-heading-contact");
  const formSection = findByType(data?.components, "form");
  const infoSection = findByType(data?.components, "content-group");

  return (
    <div className="ct-c3-page">
      <div className="ct-c3-heading-wrap">
        <h1
          className="ct-c3-heading"
          style={{
            fontSize: `${heading?.props?.headingFontSize}px`,
            color: heading?.props?.headingColor,
          }}
        >
          {heading?.props?.heading}
        </h1>
        <p
          style={{
            fontSize: `${heading?.props?.contentFontSize}px`,
            color: heading?.props?.contentColor,
          }}
        >
          {heading?.props?.content}
        </p>
      </div>

      <div className="ct-c3-grid">
        <div className="ct-c3-form-card">
          <div className="ct-c3-form-fields">
            {formSection?.props?.fields?.map((field) => (
              <div key={field.id} className="ct-c3-field">
                {field.type === "textarea" ? (
                  <textarea rows={4} className="ct-c3-textarea" placeholder={field.label} />
                ) : (
                  <input className="ct-c3-input" placeholder={field.label} />
                )}
              </div>
            ))}
            <button
              type="button"
              className="ct-c3-btn"
              style={{
                backgroundColor: formSection?.props?.buttonColor,
                color: formSection?.props?.buttonTextColor,
              }}
            >
              {formSection?.props?.buttonText}
            </button>
          </div>
        </div>

        <div className="ct-c3-info-card">
          <div className="ct-c3-info-list">
            {infoSection?.props?.sections?.map((section, idx) => (
              <div key={idx} className="ct-c3-info-item">
                <h3
                  className="ct-c3-info-heading"
                  style={{
                    color: infoSection.props.infoHeadingColor || "#111827",
                    fontSize: `${infoSection.props.infoHeadingSize || 18}px`,
                  }}
                >
                  {section.heading}
                </h3>
                <p
                  className="ct-c3-info-content"
                  style={{
                    color: infoSection.props.infoContentColor || "#4b5563",
                    fontSize: `${infoSection.props.infoContentSize || 16}px`,
                  }}
                >
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {infoSection?.props?.mapSection && (
            <div className="ct-c3-map-wrap">
              {infoSection.props.mapUrl ? (
                <iframe
                  title="Map"
                  src={infoSection.props.mapUrl}
                  width="100%"
                  height={infoSection.props.mapHeight || 200}
                  style={{ border: 0 }}
                  loading="lazy"
                />
              ) : (
                <div
                  className="ct-c3-map-placeholder"
                  style={{ height: `${infoSection.props.mapHeight || 200}px` }}
                >
                  <div className="ct-c3-map-placeholder-inner">
                    <MapPin className="ct-c3-map-icon" />
                    <p className="ct-c3-map-placeholder-text">Add URL in Sidebar</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= Contact4 — colored full-bleed split: info / form card ================= */
function Contact4({ data }) {
  const leftInfo = findById(data?.components, "section-left-info");
  const rightForm = findById(data?.components, "section-right-form");

  return (
    <div className="ct-c4-page" style={{ backgroundColor: data?.backgroundColor || "#4c3e72" }}>
      <div className="ct-c4-grid">
        <div className="ct-c4-left">
          <h1
            className="ct-c4-heading"
            style={{
              fontSize: `${leftInfo?.props?.headingFontSize}px`,
              color: leftInfo?.props?.headingColor,
            }}
          >
            {leftInfo?.props?.heading}
          </h1>
          <p
            className="ct-c4-desc"
            style={{
              fontSize: `${leftInfo?.props?.contentFontSize}px`,
              color: leftInfo?.props?.contentColor,
            }}
          >
            {leftInfo?.props?.content}
          </p>

          <div className="ct-c4-contact-rows">
            <div className="ct-c4-contact-row" style={{ color: leftInfo?.props?.contentColor }}>
              <Mail size={20} className="ct-c4-icon" />
              <span>{leftInfo?.props?.email}</span>
            </div>
            <div className="ct-c4-contact-row" style={{ color: leftInfo?.props?.contentColor }}>
              <Phone size={20} className="ct-c4-icon" />
              <span>{leftInfo?.props?.phone}</span>
            </div>
          </div>
        </div>

        <div
          className="ct-c4-right"
          style={{
            backgroundColor: rightForm?.props?.backgroundColor,
            borderRadius: `${rightForm?.props?.borderRadius}px`,
            padding: rightForm?.props?.padding,
          }}
        >
          <div className="ct-c4-form-head">
            <h2 className="ct-c4-form-heading">{rightForm?.props?.formHeading}</h2>
            <p className="ct-c4-form-sub">{rightForm?.props?.formSubheading}</p>
          </div>

          <div className="ct-c4-form-body">
            <div className="ct-c4-form-fields">
              {rightForm?.props?.fields?.map((field) => (
                <div
                  key={field.id}
                  className="ct-c4-field"
                  style={{ width: `calc(${field.width} - 8px)` }}
                >
                  <label className="ct-c4-label">{field.label}</label>
                  {field.type === "textarea" ? (
                    <textarea rows={4} placeholder={field.placeholder} className="ct-c4-textarea" />
                  ) : (
                    <input
                      type={field.type || "text"}
                      placeholder={field.placeholder}
                      className="ct-c4-input"
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="ct-c4-btn"
              style={{
                backgroundColor: rightForm?.props?.buttonColor,
                color: rightForm?.props?.buttonTextColor,
              }}
            >
              {rightForm?.props?.buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= Contact5 — hero + info/phone + icon-field form ================= */
const c5FieldStyle = {
  display: "flex",
  alignItems: "center",
  borderBottom: "1px solid #eeeeee",
  paddingBottom: "12px",
  gap: "16px",
};
const c5IconStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#888888",
  fontSize: "18px",
  minWidth: "24px",
};
const c5InputStyle = {
  width: "100%",
  border: "none",
  outline: "none",
  backgroundColor: "transparent",
  fontSize: "15px",
  color: "#333333",
  fontFamily: "inherit",
  padding: 0,
};

function Contact5({ data }) {
  const heroSection = findById(data?.components, "section-1-hero");
  const infoSection = findById(data?.components, "section-2-info");
  const formSection = findById(data?.components, "section-3-form");

  return (
    <div className="ct-c5-page" style={{ backgroundColor: data?.backgroundColor || "#f0f9f4" }}>
      <div
        className="ct-c5-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${
            heroSection?.props?.backgroundImage || ""
          }')`,
          padding: heroSection?.props?.padding || "100px 5%",
        }}
      >
        <div className="ct-c5-hero-inner">
          <h1
            className="ct-c5-hero-heading"
            style={{
              fontSize: `${heroSection?.props?.headingFontSize}px`,
              color: heroSection?.props?.headingColor,
            }}
          >
            {heroSection?.props?.heading}
          </h1>
          <p
            className="ct-c5-hero-subtext"
            style={{
              fontSize: `${heroSection?.props?.contentFontSize}px`,
              color: heroSection?.props?.contentColor,
            }}
          >
            {heroSection?.props?.subtext}
          </p>
        </div>
      </div>

      <div className="ct-c5-content">
        <div className="ct-c5-info">
          <h2
            className="ct-c5-info-heading"
            style={{
              fontSize: `${infoSection?.props?.headingFontSize}px`,
              color: infoSection?.props?.headingColor,
            }}
          >
            {infoSection?.props?.heading}
          </h2>
          <h3
            className="ct-c5-info-subheading"
            style={{
              fontSize: `${infoSection?.props?.subheadingFontSize || 20}px`,
              color: infoSection?.props?.subheadingColor || "#1f2937",
            }}
          >
            {infoSection?.props?.subheading}
          </h3>
          <p
            className="ct-c5-info-content"
            style={{
              fontSize: `${infoSection?.props?.contentFontSize}px`,
              color: infoSection?.props?.contentColor,
            }}
          >
            {infoSection?.props?.content}
          </p>

          <div className="ct-c5-phone-row">
            <div
              className="ct-c5-phone-icon"
              style={{ backgroundColor: formSection?.props?.buttonColor }}
            >
              <Phone size={24} />
            </div>
            <span className="ct-c5-phone-text">{infoSection?.props?.phoneDisplay}</span>
          </div>
        </div>

        <div
          className="ct-c5-form"
          style={{
            backgroundColor: formSection?.props?.backgroundColor,
            borderRadius: `${formSection?.props?.borderRadius}px`,
            padding: formSection?.props?.padding,
          }}
        >
          <div className="ct-c5-form-fields">
            {formSection?.props?.fields?.map((field) => (
              <div key={field.id} className="ct-c5-field" style={c5FieldStyle}>
                <span className="ct-c5-field-icon" style={c5IconStyle}>
                  {renderFieldIcon(field.icon)}
                </span>
                {field.type === "textarea" ? (
                  <textarea
                    placeholder={field.placeholder}
                    className="ct-c5-input"
                    style={{ ...c5InputStyle, resize: "none" }}
                    rows={1}
                  />
                ) : (
                  <input
                    placeholder={field.placeholder}
                    className="ct-c5-input"
                    style={c5InputStyle}
                  />
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            className="ct-c5-btn"
            style={{
              backgroundColor: formSection?.props?.buttonColor,
              color: formSection?.props?.buttonTextColor,
              borderRadius: `${formSection?.props?.buttonBorderRadius}px`,
            }}
          >
            {formSection?.props?.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= registry ================= */
const CONTACT_TEMPLATES = {
  Contact1,
  Contact2,
  Contact3,
  Contact4,
  Contact5,
};

const isContactTemplate = (id) =>
  Object.prototype.hasOwnProperty.call(CONTACT_TEMPLATES, id);

export default function ContactUs({ templates = [] }) {
  const match = pickContactTemplate(templates);

  if (!match) {
    return <div className="ct-error">No Contact Us template found.</div>;
  }

  const Template = CONTACT_TEMPLATES[match.title];
  return <Template data={match.data} />;
}