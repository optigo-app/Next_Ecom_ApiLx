"use client";

import React from "react";
import "./PrivacyPolicy.scss";

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

const px = (v) => (v ? `${v}px` : undefined);

const makeGetComp = (data) => (id) =>
  data?.components?.find((c) => c.id === id) || null;

/* Keeps "\n" line breaks from the editor. */
const renderFormattedContent = (content) => {
  if (!content) return null;
  const lines = String(content).split("\n");
  return lines.map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </React.Fragment>
  ));
};

const pickPolicyTemplate = (templates = []) => {
  const list = templates.filter(
    (t) =>
      t?.ContentType === "pagetemplate" &&
      t?.PageKey?.toLowerCase() === "privacy-policy"
  );
  if (!list.length) return null;

  const active = list.find((t) => t.IsActive) || list[0];
  const data = parseContentJson(active.ContentJson);
  if (!data) return null;

  // works for Policy1...PolicyN automatically, based on the registry
  const title = [active.Title, data.templateId].find(isPolicyTemplate) || null;

  return title ? { title, data } : null;
};

/* ================= Policy1 — header (optional bg image) + sections + declaration ================= */
function Policy1({ data }) {
  const getComp = makeGetComp(data);
  const header = getComp("section-1-main-header");
  const list = getComp("section-2-terms-list");
  const declaration = getComp("section-3-declaration");

  const h = header?.props || {};
  const t = list?.props || {};
  const d = declaration?.props || {};

  return (
    <div className="policy1-page">
      {header && (
        <div
          className="policy1-header"
          style={{
            padding: h.padding || "40px 5%",
            backgroundImage: h.backgroundImage ? `url("${h.backgroundImage}")` : "none",
          }}
        >
          <div className="policy1-header-inner">
            <h1
              className="policy1-heading"
              style={{
                fontSize: px(h.headingFontSize),
                color: h.headingColor || "#111827",
                textAlign: h.textAlign || "left",
              }}
            >
              {h.heading}
            </h1>
            <p
              className="policy1-header-content"
              style={{
                fontSize: px(h.contentFontSize),
                color: h.contentColor || "#374151",
                textAlign: h.textAlign || "left",
              }}
            >
              {h.content}
            </p>
          </div>
        </div>
      )}

      {list && (
        <div className="policy1-terms-list" style={{ gap: t.spacing || "48px" }}>
          {t.terms?.map((item, index) => (
            <div key={index} className="policy1-term-item">
              <h2
                className="policy1-term-heading"
                style={{
                  fontSize: px(t.headingFontSize),
                  color: t.headingColor || "#111827",
                }}
              >
                {item?.heading}
              </h2>
              <p
                className="policy1-term-content"
                style={{
                  fontSize: px(t.contentFontSize),
                  color: t.contentColor || "#4b5563",
                }}
              >
                {renderFormattedContent(item?.content)}
              </p>
            </div>
          ))}
        </div>
      )}

      {declaration && (
        <div className="policy1-declaration" style={{ padding: d.padding || "20px 5%" }}>
          <p
            style={{
              fontSize: px(d.fontSize),
              color: d.color || "#6b7280",
              fontStyle: d.fontStyle || "italic",
            }}
          >
            {d.text}
          </p>
        </div>
      )}
    </div>
  );
}

/* ================= Policy2 — clean / simple layout with divider ================= */
function Policy2({ data }) {
  const getComp = makeGetComp(data);
  const header = getComp("section-1-main-header");
  const list = getComp("section-2-terms-list");
  const declaration = getComp("section-3-declaration");

  const h = header?.props || {};
  const t = list?.props || {};
  const d = declaration?.props || {};

  return (
    <div className="policy2-page">
      {header && (
        <div className="policy2-header" style={{ padding: h.padding || "40px 5%" }}>
          <div className="policy2-header-inner">
            <h1
              className="policy2-heading"
              style={{
                fontSize: px(h.headingFontSize),
                color: h.headingColor || "#111827",
              }}
            >
              {h.heading}
            </h1>
            <p
              className="policy2-header-content"
              style={{
                fontSize: px(h.contentFontSize),
                color: h.contentColor || "#374151",
              }}
            >
              {h.content}
            </p>
          </div>
        </div>
      )}

      {list && (
        <div className="policy2-terms-list">
          {t.terms?.map((item, index) => (
            <div key={index} className="policy2-term-item">
              <h2
                className="policy2-term-heading"
                style={{
                  fontSize: px(t.headingFontSize),
                  color: t.headingColor || "#111827",
                }}
              >
                {item?.heading}
              </h2>
              <p
                className="policy2-term-content"
                style={{
                  fontSize: px(t.contentFontSize),
                  color: t.contentColor || "#374151",
                }}
              >
                {renderFormattedContent(item?.content)}
              </p>
            </div>
          ))}
        </div>
      )}

      {declaration && (
        <div className="policy2-declaration" style={{ padding: d.padding || "20px 5%" }}>
          <div className="policy2-declaration-line" />
          <p
            style={{
              fontSize: px(d.fontSize),
              color: d.color || "#6b7280",
              fontStyle: d.fontStyle || "normal",
            }}
          >
            {d.text}
          </p>
        </div>
      )}
    </div>
  );
}

/* ================= registry ================= */
const POLICY_TEMPLATES = {
  Policy1,
  Policy2,
};

const isPolicyTemplate = (id) =>
  Object.prototype.hasOwnProperty.call(POLICY_TEMPLATES, id);

export default function PrivacyPolicy({ templates = [] }) {
  const match = pickPolicyTemplate(templates);

  if (!match) {
    return <div className="policy-empty">No privacy policy template found.</div>;
  }

  const Template = POLICY_TEMPLATES[match.title];
  return (
    <div className="privacy-policy-container">
      <Template data={match.data} />
    </div>
  );
}