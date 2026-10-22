"use client";

import React, { useState } from "react";
import "./About.scss";

const cx = (...parts) => parts.filter(Boolean).join(" ");
const TEMPLATE_TITLES = ["About1", "About2", "About3", "About4", "About5"];

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

const pickAboutTemplate = (templates = []) => {
  const list = templates.filter(
    (t) => t?.ContentType === "pagetemplate" && t?.PageKey === "about-us"
  );
  if (!list.length) return null;

  const active = list.find((t) => t.IsActive) || list[0];
  const data = parseContentJson(active.ContentJson);
  if (!data) return null;

  const title = TEMPLATE_TITLES.includes(active.Title)
    ? active.Title
    : TEMPLATE_TITLES.includes(data.templateId)
    ? data.templateId
    : null;

  return title ? { title, data } : null;
};

const makeGetComp = (data) => (id) =>
  data?.components?.find((c) => c.id === id) || { props: {} };

/* ================= About1 ================= */
function About1({ data }) {
  const getComp = makeGetComp(data);
  const h1 = getComp("heading-1").props;
  const img = getComp("image-1").props;
  const h2 = getComp("heading-2").props;
  const t1 = getComp("text-1").props;
  const h3 = getComp("heading-3").props;
  const t2 = getComp("text-2").props;
  const list = getComp("list-1").props;

  return (
    <div>
      <div className="au-a1-card">
        <header className="au-a1-header" style={{ marginBottom: "32px" }}>
          <h1
            className="au-a1-heading"
            style={{
              fontSize: `${h1.fontSize || 0}px`,
              color: h1.color || "",
              textAlign: h1.textAlign || "left",
              wordBreak: "break-word",
              marginBottom: "20px",
              fontWeight: 700,
            }}
          >
            {h1.content || h1.heading}
          </h1>

          <div
            className="au-a1-image-wrap"
            style={{
              borderRadius: `${img.borderRadius ?? 8}px`,
              overflow: "hidden",
              maxWidth: "100%",
            }}
          >
            {img.src && (
              <img
                src={img.src}
                className="au-a1-ima"
                alt={img.alt || "header image"}
                style={{
                  width: "100%",
                  height: img.height || "auto",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            )}
          </div>
        </header>

        <section className="au-a1-section" style={{ marginBottom: "32px" }}>
          <h2
            className="au-a1-subheading"
            style={{
              fontSize: `${h2.fontSize || 22}px`,
              color: h2.color || "#ff0000",
              textAlign: h2.textAlign || "left",
              marginBottom: "12px",
              fontWeight: 600,
            }}
          >
            {h2.content || h2.heading}
          </h2>
          <p
            className="au-a1-text"
            style={{
              fontSize: `${t1.fontSize || 16}px`,
              color: t1.color || "#CCCCCC",
              textAlign: t1.textAlign || "left",
              lineHeight: t1.lineHeight || 1.5,
              margin: 0,
            }}
          >
            {t1.content || t1.text}
          </p>
        </section>

        <section className="au-a1-section">
          <h2
            className="au-a1-subheading"
            style={{
              fontSize: `${h3.fontSize || 22}px`,
              color: h3.color || "#000000",
              textAlign: h3.textAlign || "left",
              marginBottom: "12px",
              fontWeight: 600,
            }}
          >
            {h3.content || h3.heading}
          </h2>

          <p
            className="au-a1-text au-a1-text--spaced"
            style={{
              fontSize: `${t2.fontSize || 16}px`,
              color: t2.color || "#616161",
              textAlign: t2.textAlign || "left",
              lineHeight: t2.lineHeight || 1.5,
              marginBottom: "24px",
            }}
          >
            {t2.content || t2.text}
          </p>

          <div className="au-a1-list" style={{ display: "grid", gap: "20px" }}>
            {list.items?.map((item, index) => (
              <div
                key={index}
                className="au-a1-list-item"
                style={{
                  color: list.color || "#000000",
                  textAlign: list.textAlign || "left",
                }}
              >
                <h3
                  className="au-a1-item-title"
                  style={{
                    fontSize: `${(list.fontSize || 16) + 2}px`,
                    fontWeight: 700,
                    margin: "0 0 6px 0",
                  }}
                >
                  {typeof item === "string" ? item : item.title}
                </h3>
                {item?.content && (
                  <p
                    className="au-a1-item-content"
                    style={{
                      fontSize: `${list.fontSize || 16}px`,
                      color: list.color || "#000000",
                      lineHeight: list.lineHeight || 1.5,
                      margin: 0,
                    }}
                  >
                    {item.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ================= About2 ================= */
function A2Block({ headingProps, textProps, headingTag: H = "h3" }) {
  return (
    <section className="au-a2-section">
      <H
        className={H === "h2" ? "au-a2-sub-heading" : "au-a2-heading-underline"}
        style={{
          fontSize: `${headingProps.fontSize || 18}px`,
          color: headingProps.color || "#111111",
          textAlign: headingProps.textAlign || "left",
        }}
      >
        {headingProps.content || headingProps.heading}
      </H>
      <div className="au-a2-indent">
        <p
          className="au-a2-text"
          style={{
            fontSize: `${textProps.fontSize || 14}px`,
            color: textProps.color || "#333333",
            textAlign: textProps.textAlign || "left",
            lineHeight: textProps.lineHeight || 1.6,
          }}
        >
          {textProps.content || textProps.text}
        </p>
      </div>
    </section>
  );
}

function About2({ data }) {
  const getComp = makeGetComp(data);
  const main = getComp("main-heading").props;
  const promiseHeading = getComp("promise-heading").props;
  const promiseList = getComp("promise-list").props;

  return (
    <div className="au-a2-card">
      <div className="au-a2-inner">
        <h1
          className="au-a2-main-heading"
          style={{
            fontSize: `${main.fontSize || 32}px`,
            color: main.color || "#111111",
            textAlign: main.textAlign || "center",
          }}
        >
          {main.content || main.heading}
        </h1>

        <A2Block
          headingTag="h2"
          headingProps={getComp("sub-heading-1").props}
          textProps={getComp("intro-text").props}
        />
        <A2Block
          headingProps={getComp("advantage-heading").props}
          textProps={getComp("advantage-text").props}
        />
        <A2Block
          headingProps={getComp("vision-heading").props}
          textProps={getComp("vision-text").props}
        />

        <section className="au-a2-promise-section">
          <h3
            className="au-a2-heading-underline"
            style={{
              fontSize: `${promiseHeading.fontSize || 18}px`,
              color: promiseHeading.color || "#111111",
              textAlign: promiseHeading.textAlign || "left",
            }}
          >
            {promiseHeading.content || promiseHeading.heading}
          </h3>
          <ul
            className="au-a2-list"
            style={{
              color: promiseList.color || "#333333",
              fontSize: `${promiseList.fontSize || 14}px`,
              lineHeight: promiseList.lineHeight || 1.8,
              cursor: "default",
            }}
          >
            {promiseList.items?.map((item, i) => (
              <li key={i} className="au-a2-list-item">
                {item}
              </li>
            ))}
          </ul>
        </section>

        {data?.components
          ?.filter((c) => c.id.startsWith("section-heading-"))
          .map((headingComp) => {
            const uid = headingComp.id.replace("section-heading-", "");
            return (
              <A2Block
                key={headingComp.id}
                headingProps={headingComp.props}
                textProps={getComp(`section-text-${uid}`).props}
              />
            );
          })}
      </div>
    </div>
  );
}

/* ================= About3 ================= */
function About3({ data }) {
  const components = data?.components || [];

  return (
    <div className="au-a3-page">
      {components
        .filter((c) => c.type === "heading")
        .map((header) => (
          <div key={header.id} className="au-a3-header-wrap">
            <h1
              className="au-a3-header-heading"
              style={{
                color: header.props.headingColor || "#111",
                fontSize: `${header.props.headingFontSize || 30}px`,
              }}
            >
              {header.props.heading}
            </h1>
            <div className="au-a3-divider"></div>
          </div>
        ))}

      <div className="au-a3-content">
        {components
          .filter((c) => c.type !== "heading")
          .map((section) => (
            <section key={section.id} className="au-a3-section">
              <div
                className="au-a3-row"
                style={{
                  flexDirection:
                    section.props.rowDirection === "reverse" ? "row-reverse" : "row",
                }}
              >
                <div className="au-a3-text-col" style={{ wordBreak: "break-all" }}>
                  <h2
                    className="au-a3-heading"
                    style={{
                      fontSize: `${section.props.headingFontSize || 18}px`,
                      color: section.props.headingColor || "#111",
                    }}
                  >
                    {section.props.heading}
                  </h2>
                  <p
                    className="au-a3-desc"
                    style={{
                      fontSize: `${section.props.fontSize || 14}px`,
                      color: section.props.color || "#4b5563",
                    }}
                  >
                    {section.props.content}
                  </p>
                </div>
                <div className="au-a3-image-col">
                  {section.props.src && (
                    <img
                      src={section.props.src}
                      className="au-a3-image"
                      style={{
                        width: section.props.imageWidth || "100%",
                        borderRadius: `${section.props.borderRadius || 0}px`,
                        objectFit: "cover",
                      }}
                      alt={section.props.heading}
                    />
                  )}
                </div>
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}

/* ================= About4 (tabs) ================= */
function About4({ data }) {
  const components = data?.components || [];
  const tabsSection = components.find((c) => c.type === "tabs-section");

  const [activeTabId, setActiveTabId] = useState(
    tabsSection?.props?.tabs?.[0]?.id ?? null
  );

  if (!tabsSection) return null;

  const activeTab = tabsSection.props.tabs.find((t) => t.id === activeTabId);
  const tc = activeTab?.["tab-content"];

  return (
    <div className="au-a4-page">
      {components
        .filter((c) => c.type === "heading")
        .map((header) => (
          <div key={header.id} className="au-a4-header-wrap">
            <h1
              className="au-a4-header-heading"
              style={{
                color: header.props.headingColor,
                fontSize: `${header.props.headingFontSize}px`,
              }}
            >
              {header.props.heading}
            </h1>
          </div>
        ))}

      <div className="au-a4-content">
        <div className="au-a4-row">
          <div className="au-a4-col">
            <div className="au-a4-tabs-nav">
              {tabsSection.props.tabs.map((tab) => (
                <div key={tab.id} className="au-a4-tab-wrap">
                  <button
                    type="button"
                    onClick={() => setActiveTabId(tab.id)}
                    className={cx("au-a4-tab-btn", activeTabId === tab.id && "is-active")}
                  >
                    {tab["tab-head"]}
                  </button>
                </div>
              ))}
            </div>

            <div className="au-a4-tab-content">
              <h2
                className="au-a4-tab-heading"
                style={{
                  fontSize: `${tc?.headingFontSize}px`,
                  color: tabsSection.props.contentHeadingColor || "#111",
                }}
              >
                {tc?.heading}
              </h2>
              <p
                className="au-a4-tab-desc"
                style={{ fontSize: `${tc?.fontSize}px`, color: tc?.color || "#4b5563" }}
              >
                {tc?.content}
              </p>

              {(tc?.sections || []).map((section) => (
                <div key={section.id} className="au-a4-section" style={{ paddingTop: "20px" }}>
                  <h3
                    className="au-a4-section-heading"
                    style={{
                      fontSize: `${section.headingFontSize}px`,
                      color: section.headingColor,
                      marginBottom: "10px",
                    }}
                  >
                    {section.heading}
                  </h3>
                  <p
                    className="au-a4-section-content"
                    style={{
                      fontSize: `${section.fontSize}px`,
                      color: section.color,
                      lineHeight: "1.5",
                    }}
                  >
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="au-a4-image-col">
            {tc?.image?.src && (
              <img
                src={tc.image.src}
                className="au-a4-image"
                style={{ borderRadius: `${tc.image.borderRadius || 0}px` }}
                alt={tc.image.alt || "About"}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= About5 ================= */
const buildOrderedGroups = (components = []) => {
  const groups = [];
  components.forEach((c) => {
    if (c.type !== "card-section" && c.type !== "text-section") return;
    const groupType = c.type === "card-section" ? "card-group" : "text-group";
    const last = groups[groups.length - 1];
    if (last && last.type === groupType) last.items.push(c);
    else groups.push({ type: groupType, items: [c] });
  });
  return groups;
};

function About5({ data }) {
  const components = data?.components || [];
  const history = components.find((c) => c.id === "section-main-history");
  const groups = buildOrderedGroups(components);

  return (
    <div className="au-a5-page">
      {history && (
        <div className="au-a5-history">
          <div className="au-a5-history-inner">
            <div className="au-a5-history-head">
              {history.props.src && (
                <img src={history.props.src} alt="icon" className="au-a5-icon" />
              )}
              <h1
                className="au-a5-history-heading"
                style={{
                  fontSize: `${history.props.headingFontSize || 28}px`,
                  color: history.props.headingColor || "#111",
                  wordBreak: "break-all",
                }}
              >
                {history.props.heading}
              </h1>
            </div>
            <div
              className="au-a5-history-content"
              style={{
                fontSize: `${history.props.fontSize || 14}px`,
                color: history.props.color || "#4b5563",
              }}
            >
              <p style={{ wordBreak: "break-all" }}>{history.props.content}</p>
            </div>
          </div>
        </div>
      )}

      <div className="au-a5-grid-wrap">
        {groups.map((group, idx) =>
          group.type === "card-group" ? (
            <div key={`group-${idx}`} className="au-a5-grid">
              {group.items.map((card) => (
                <div key={card.id} className="au-a5-card">
                  <div className="au-a5-card-image-wrap">
                    {card.props?.src && (
                      <img
                        src={card.props.src}
                        alt={card.props.heading}
                        className="au-a5-card-image"
                        style={{ borderRadius: `${card.props.borderRadius || 0}px` }}
                      />
                    )}
                  </div>
                  <h2
                    className="au-a5-card-heading"
                    style={{
                      fontSize: `${card.props?.headingFontSize || 20}px`,
                      color: card.props?.headingColor || "#111",
                    }}
                  >
                    {card.props?.heading}
                  </h2>
                  <p
                    className="au-a5-card-content"
                    style={{
                      fontSize: `${card.props?.fontSize || 14}px`,
                      color: card.props?.color || "#4b5563",
                    }}
                  >
                    {card.props?.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div key={`group-${idx}`} className="au-a5-text-wrap">
              {group.items.map((section) => (
                <div
                  key={section.id}
                  className="au-a5-text-section"
                  style={{ paddingTop: "20px", paddingBottom: "20px" }}
                >
                  <h2
                    className="au-a5-text-heading"
                    style={{
                      fontSize: `${section.props?.headingFontSize || 20}px`,
                      color: section.props?.headingColor || "#111111",
                    }}
                  >
                    {section.props?.heading}
                  </h2>
                  <p
                    className="au-a5-text-content"
                    style={{
                      fontSize: `${section.props?.fontSize || 14}px`,
                      color: section.props?.color || "#4b5563",
                    }}
                  >
                    {section.props?.content}
                  </p>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

const RENDERERS = { About1, About2, About3, About4, About5 };

export default function AboutUs({ templates = [] }) {
  const match = pickAboutTemplate(templates);

  if (!match) {
    return <div className="au-error">No About Us template found.</div>;
  }

  const Template = RENDERERS[match.title];
  return <Template data={match.data} />;
}