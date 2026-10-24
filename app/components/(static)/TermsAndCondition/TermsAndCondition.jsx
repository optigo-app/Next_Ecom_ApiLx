"use client";

import React from "react";
import { Mail } from "lucide-react";
import "./TermsCondition.scss";

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
  data?.components?.find((c) => c.id === id) || { props: {} };

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

const pickTermsTemplate = (templates = []) => {
  const list = templates.filter(
    (t) =>
      t?.ContentType === "pagetemplate" &&
      t?.PageKey?.toLowerCase() === "terms-condition"
  );
  if (!list.length) return null;

  const active = list.find((t) => t.IsActive) || list[0];
  const data = parseContentJson(active.ContentJson);
  if (!data) return null;

  // works for Terms1...TermsN automatically, based on the registry
  const title = [active.Title, data.templateId].find(isTermsTemplate) || null;

  return title ? { title, data } : null;
};

/* ================= Terms1 — hero header + terms list + declaration ================= */
function Terms1({ data }) {
  const getComp = makeGetComp(data);
  const header = getComp("section-1-main-header").props;
  const terms = getComp("section-2-terms-list").props;
  const declaration = getComp("section-3-declaration").props;

  const hasHeader = data?.components?.some((c) => c.id === "section-1-main-header");
  const hasTerms = data?.components?.some((c) => c.id === "section-2-terms-list");
  const hasDeclaration = data?.components?.some((c) => c.id === "section-3-declaration");

  return (
    <div className="tc1-page">
      {hasHeader && (
        <div
          className="tc1-header"
          style={{
            padding: header.padding || "100px 5%",
            backgroundImage: header.backgroundImage
              ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("${header.backgroundImage}")`
              : "linear-gradient(#333, #333)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="tc1-header-content">
            <h1
              className="tc1-header-heading"
              style={{
                fontSize: px(header.headingFontSize),
                color: header.headingColor || "#ffffff",
                textAlign: header.textAlign || "center",
              }}
            >
              {header.heading}
            </h1>
            <p
              className="tc1-header-description"
              style={{
                fontSize: px(header.contentFontSize),
                color: header.contentColor || "#ffffff",
                textAlign: header.textAlign || "center",
              }}
            >
              {header.content}
            </p>
          </div>
        </div>
      )}

      {hasTerms && (
        <div className="tc1-terms-list" style={{ gap: terms.spacing || "48px" }}>
          {terms.terms?.map((item, index) => (
            <div key={index} className="tc1-term-item">
              <h2
                className="tc1-term-heading"
                style={{
                  fontSize: px(terms.headingFontSize),
                  color: terms.headingColor || "#111827",
                }}
              >
                {item?.heading}
              </h2>
              <p
                className="tc1-term-content"
                style={{
                  fontSize: px(terms.contentFontSize),
                  color: terms.contentColor || "#253750",
                }}
              >
                {renderFormattedContent(item?.content)}
              </p>
            </div>
          ))}
        </div>
      )}

      {hasDeclaration && (
        <div
          className="tc1-declaration"
          style={{
            padding: declaration.padding,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontSize: px(declaration.fontSize),
              color: declaration.color || "#6b7280",
              fontStyle: declaration.fontStyle || "italic",
            }}
          >
            {declaration.text}
          </p>
        </div>
      )}
    </div>
  );
}

/* ================= Terms2 — simple heading + numbered terms + declaration/email ================= */
function Terms2({ data }) {
  const getComp = makeGetComp(data);
  const header = getComp("section-1-main-header").props;
  const terms = getComp("section-2-terms-list").props;
  const declaration = getComp("section-3-declaration").props;

  const hasHeader = data?.components?.some((c) => c.id === "section-1-main-header");
  const hasTerms = data?.components?.some((c) => c.id === "section-2-terms-list");
  const hasDeclaration = data?.components?.some((c) => c.id === "section-3-declaration");

  const headingStyle = {
    fontSize: px(terms.headingFontSize),
    color: terms.headingColor || "#111827",
  };

  return (
    <div className="tc2-page">
      {hasHeader && (
        <div
          className="tc2-header"
          style={{
            backgroundColor: header.backgroundColor || "transparent",
            padding: header.padding || "60px 5%",
          }}
        >
          <div className="tc2-header-inner">
            <h1
              className="tc2-header-heading"
              style={{
                fontSize: px(header.headingFontSize),
                color: header.headingColor || "#111827",
              }}
            >
              {header.heading}
            </h1>
          </div>
        </div>
      )}

      {hasTerms && (
        <div className="tc2-terms-list">
          {terms.terms?.map((item, index) => (
            <div key={index} className="tc2-term-item">
              <div className="tc2-term-heading-row">
                <span className="tc2-term-number" style={headingStyle}>
                  {index + 1}.
                </span>
                <h2 className="tc2-term-heading" style={headingStyle}>
                  {item?.heading}
                </h2>
              </div>
              <p
                className="tc2-term-content"
                style={{
                  fontSize: px(terms.contentFontSize),
                  color: terms.contentColor || "#253750",
                }}
              >
                {renderFormattedContent(item?.content)}
              </p>
            </div>
          ))}
        </div>
      )}

      {hasDeclaration && (
        <div className="tc2-declaration">
          <div className="tc2-declaration-line" />
          <p
            className="tc2-declaration-text"
            style={{
              fontSize: px(declaration.fontSize),
              color: declaration.color || "#6b7280",
              fontStyle: declaration.fontStyle || "italic",
            }}
          >
            {declaration.text}
          </p>

          {declaration.showEmailButton && declaration.email && (
            <div className="tc2-email-wrapper">
              <span className="tc2-email-label">Email:</span>
              <a href={`mailto:${declaration.email}`} className="tc2-email-button">
                <Mail size={16} />
                <span>{declaration.email}</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ================= Terms3 — centered document style ================= */
function Terms3({ data }) {
  const getComp = makeGetComp(data);
  const header = getComp("section-1-main-header").props;
  const terms = getComp("section-2-terms-list").props;

  const hasHeader = data?.components?.some((c) => c.id === "section-1-main-header");
  const hasTerms = data?.components?.some((c) => c.id === "section-2-terms-list");

  return (
    <div className="tc3-page">
      {hasHeader && (
        <div className="tc3-header" style={{ padding: header.padding || "60px 10% 20px 10%" }}>
          <h1
            className="tc3-header-heading"
            style={{
              fontSize: px(header.headingFontSize),
              color: header.headingColor || "#000000",
            }}
          >
            {header.heading}
          </h1>
          <p
            className="tc3-header-description"
            style={{
              fontSize: px(header.contentFontSize),
              color: header.contentColor || "#000000",
              textAlign: header.textAlign || "left",
            }}
          >
            {header.content}
          </p>
        </div>
      )}

      {hasTerms && (
        <div className="tc3-terms-list">
          {terms.terms?.map((item, index) => (
            <div key={index} className="tc3-term-item">
              <h2
                className="tc3-term-heading"
                style={{
                  fontSize: px(terms.headingFontSize),
                  color: terms.headingColor || "#000000",
                }}
              >
                {item?.heading}
              </h2>
              <div
                className="tc3-term-content"
                style={{
                  fontSize: px(terms.contentFontSize),
                  color: terms.contentColor || "#000000",
                }}
              >
                {renderFormattedContent(item?.content)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= registry ================= */
const TERMS_TEMPLATES = {
  Terms1,
  Terms2,
  Terms3,
};

const isTermsTemplate = (id) =>
  Object.prototype.hasOwnProperty.call(TERMS_TEMPLATES, id);

export default function TermsCondition({ templates = [] }) {
  const match = pickTermsTemplate(templates);

  if (!match) {
    return <div className="tc-empty">No terms and condition template found.</div>;
  }

  const Template = TERMS_TEMPLATES[match.title];
  return (
    <div className="terms-condition-container">
      <Template data={match.data} />
    </div>
  );
}