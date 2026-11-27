"use client";

import React, { useEffect, useState } from "react";
import { MapPin, Clock, Wallet, ArrowRight, Upload, MessageCircle, Phone, Mail } from "lucide-react";

/* ---------------- constants ---------------- */
const SERIF = "Georgia, 'Times New Roman', serif";
const SLAB = "'Roboto Slab', Georgia, serif";
const CAREER_PAGE_KEYS = ["career", "careers", "career-page", "career-us"];

const TAG_ICONS = { location: MapPin, clock: Clock, salary: Wallet };
const SPEC_ICONS = { location: MapPin };
const CONTACT_ICONS = { phone: Phone, email: Mail };

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

const pickCareerTemplate = (templates = []) => {
  const list = templates.filter(
    (t) => t?.ContentType === "pagetemplate" && CAREER_PAGE_KEYS.includes(t?.PageKey)
  );
  if (!list.length) return null;

  const active = list.find((t) => t.IsActive) || list[0];
  const data = parseContentJson(active.ContentJson);
  if (!data) return null;

  const title = [active.Title, data.templateId].find(isCareerTemplate) || null;
  return title ? { title, data } : null;
};

const useViewport = () => {
  const [w, setW] = useState(1200);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return { isMobile: w < 640, isTablet: w >= 640 && w < 1024, isDesktop: w >= 1024 };
};

const findById = (data, id) => data?.components?.find((c) => c.id === id);
const findByType = (data, type) => data?.components?.find((c) => c.type === type);
const propsOf = (c) => c?.props || {};

const justifyFromAlign = (align) =>
  align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start";

const colsFor = (props, vp) => {
  const cols = props.columns || 1;
  const mobile = props.mobileColumns || 1;
  if (vp.isMobile) return mobile;
  if (vp.isTablet) return Math.min(cols, 2);
  return cols;
};

/* ---------------- shared form ---------------- */
function CareerForm({ fields = [], variant = "c1", buttonProps = {}, onSubmit, vp }) {
  const [values, setValues] = useState({});
  const [fileNames, setFileNames] = useState({});

  const setVal = (id, v) => setValues((p) => ({ ...p, [id]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(values);
  };

  const inputStyleC5 = {
    width: "100%",
    border: "1px solid #d1d5db",
    padding: "12px 14px",
    fontSize: "14px",
    outline: "none",
    background: "#fff",
    boxSizing: "border-box",
  };

  const renderFile = (f) => {
    const hidden = (
      <input
        type="file"
        required={!!f.required}
        style={{ display: "none" }}
        id={`file-${f.id}`}
        onChange={(e) => {
          const file = e.target.files?.[0];
          setFileNames((p) => ({ ...p, [f.id]: file?.name || "" }));
          setVal(f.id, file || null);
        }}
      />
    );

    if (variant === "c1") {
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e5e7eb" }}>
          <span style={{ fontSize: 14, color: "#6b7280", padding: "8px" }}>
            {fileNames[f.id] || f.label}
          </span>
          {hidden}
          <label
            htmlFor={`file-${f.id}`}
            style={{
              backgroundColor: f.buttonColor || "#0b1942",
              color: f.buttonTextColor || "#fff",
              padding: "8px 28px",
              fontSize: 15,
              flex: 1,
              maxWidth: "58%",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            {f.buttonText || "Choose a File"}
          </label>
        </div>
      );
    }

    if (variant === "c2") {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 12, border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", padding: 8 }}>
          {hidden}
          <label
            htmlFor={`file-${f.id}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontWeight: 600,
              flexShrink: 0,
              backgroundColor: f.buttonColor || "#b83358",
              color: f.buttonTextColor || "#fff",
              fontSize: 12,
              padding: "9px 18px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            <Upload size={14} />
            {f.buttonText || "Choose a File"}
          </label>
          <span style={{ fontSize: 12, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {fileNames[f.id] || f.placeholder || "No file chosen"}
          </span>
        </div>
      );
    }

    // c5
    return (
      <div style={{ ...inputStyleC5, display: "flex", alignItems: "center", gap: 8 }}>
        {hidden}
        <label
          htmlFor={`file-${f.id}`}
          style={{
            backgroundColor: f.buttonColor || "#efefef",
            color: f.buttonTextColor || "#111827",
            border: "1px solid #767676",
            borderRadius: 3,
            fontSize: 13,
            padding: "2px 8px",
            flexShrink: 0,
            cursor: "pointer",
          }}
        >
          {f.buttonText || "Choose File"}
        </label>
        <span style={{ fontSize: 14, color: "#1f2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {fileNames[f.id] || f.placeholder || "No file chosen"}
        </span>
      </div>
    );
  };

  const renderInput = (f) => {
    const common = {
      required: !!f.required,
      value: values[f.id] ?? "",
      onChange: (e) => setVal(f.id, e.target.value),
    };

    if (f.type === "file") return renderFile(f);

    if (variant === "c1") {
      if (f.type === "textarea")
        return (
          <textarea
            {...common}
            rows={4}
            placeholder={f.label}
            style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 4, padding: 8, outline: "none", boxSizing: "border-box" }}
          />
        );
      if (f.type === "select")
        return (
          <select {...common} style={{ width: "100%", borderBottom: "1px solid #e5e7eb", border: "none", padding: "8px 0", outline: "none", fontSize: 14, background: "transparent" }}>
            {(f.options || []).filter((o) => o.trim() !== "").map((o, i) => (
              <option key={i} value={i === 0 ? "" : o}>{o}</option>
            ))}
          </select>
        );
      return (
        <input
          {...common}
          type={f.type}
          placeholder={f.label}
          style={{ width: "100%", border: "none", borderBottom: "1px solid #e5e7eb", padding: "8px", outline: "none", fontSize: 14, boxSizing: "border-box", background: "transparent" }}
        />
      );
    }

    if (variant === "c2") {
      const base = { width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "12px", fontSize: 14, outline: "none", background: "#fff", boxSizing: "border-box" };
      if (f.type === "textarea")
        return <textarea {...common} rows={3} placeholder={f.placeholder || ""} style={{ ...base, padding: "8px 12px" }} />;
      if (f.type === "select")
        return (
          <select {...common} style={base}>
            {(f.options || []).filter((o) => o.trim() !== "").map((o, i) => (
              <option key={i} value={o}>{o}</option>
            ))}
          </select>
        );
      return <input {...common} type={f.type} placeholder={f.placeholder || ""} style={base} />;
    }

    // c5
    if (f.type === "textarea") return <textarea {...common} rows={4} placeholder={f.placeholder || ""} style={inputStyleC5} />;
    if (f.type === "select")
      return (
        <select {...common} style={inputStyleC5}>
          {(f.options || []).filter((o) => o.trim() !== "").map((o, i) => (
            <option key={i} value={o}>{o}</option>
          ))}
        </select>
      );
    return <input {...common} type={f.type} placeholder={f.placeholder || ""} style={inputStyleC5} />;
  };

  const fieldWrapWidth = (f) => {
    if (variant === "c2") return "100%";
    if (vp.isMobile) return "100%";
    return f.width || (variant === "c1" ? "50%" : "100%");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexWrap: "wrap",
        margin: variant === "c1" ? "0 -10px" : variant === "c5" ? "0 -6px" : 0,
      }}
    >
      {fields.map((f) => (
        <div
          key={f.id}
          style={{
            width: fieldWrapWidth(f),
            padding: variant === "c1" ? "0 10px" : variant === "c5" ? "0 6px" : 0,
            marginBottom: variant === "c1" ? 24 : variant === "c5" ? 14 : 16,
            boxSizing: "border-box",
          }}
        >
          {variant === "c2" && (
            <label style={{ display: "block", textTransform: "uppercase", fontWeight: 600, color: "#374151", marginBottom: 8, fontSize: 11, letterSpacing: "0.04em" }}>
              {f.label}
            </label>
          )}
          {variant === "c5" && f.label && (
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              {f.label}
            </label>
          )}
          {renderInput(f)}
        </div>
      ))}

      {variant === "c1" && (
        <div style={{ width: "100%", padding: "8px 8px 0", display: "flex", justifyContent: "center" }}>
          <button
            type="submit"
            style={{
              backgroundColor: buttonProps.buttonColor,
              color: buttonProps.buttonTextColor,
              padding: "10px 0",
              width: vp.isDesktop ? "50%" : "100%",
              marginBottom: 30,
              fontSize: 14,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            {buttonProps.buttonText}
          </button>
        </div>
      )}

      {variant === "c2" && (
        <div style={{ width: "100%" }}>
          <button
            type="submit"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontWeight: 600,
              fontSize: 14,
              backgroundColor: buttonProps.buttonColor,
              color: buttonProps.buttonTextColor,
              padding: "14px 0",
              borderRadius: 8,
              marginTop: 8,
              border: "none",
              cursor: "pointer",
            }}
          >
            <span>{buttonProps.buttonText}</span>
            {buttonProps.buttonIcon === "whatsapp" && <MessageCircle size={18} />}
          </button>
        </div>
      )}

      {variant === "c5" && (
        <div style={{ width: "100%", padding: "4px 6px 0" }}>
          <button
            type="submit"
            style={{
              backgroundColor: buttonProps.buttonColor,
              color: buttonProps.buttonTextColor,
              padding: "12px 34px",
              borderRadius: 2,
              fontSize: 14,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            {buttonProps.buttonText}
          </button>
        </div>
      )}
    </form>
  );
}

/* ---------------- shared hero banner ---------------- */
function HeroBanner({ hero, vp, defaultHeight, mobileMax, bg = "#f3f4f6", children }) {
  const p = propsOf(hero);
  const c = p.content || {};
  const height = vp.isMobile
    ? `${Math.min(parseInt(p.height) || defaultHeight, mobileMax)}px`
    : p.height || `${defaultHeight}px`;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        height,
        backgroundImage: p.backgroundImage ? `url(${p.backgroundImage})` : "none",
        backgroundColor: bg,
        backgroundSize: p.style?.backgroundSize || "cover",
        backgroundPosition: p.style?.backgroundPosition || "center",
        borderBottom: p.borderBottom || "none",
        justifyContent: justifyFromAlign(c.align),
      }}
    >
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundColor: p.overlayColor }} />
      {children(c)}
    </div>
  );
}

/* ================= Career1 ================= */
function Career1({ data }) {
  const vp = useViewport();
  const header = propsOf(findById(data, "career-header-section"));
  const grid = propsOf(findById(data, "career-join-team-grid"));
  const note = propsOf(findById(data, "career-job-offers-note"));
  const form = propsOf(findById(data, "career-application-form-section"));
  const blocks = grid.blocks || [];

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ margin: vp.isDesktop ? header.margin : "30px 20px 20px 20px", textAlign: header.textAlign || "center" }}>
        {header.heading && (
          <h1 style={{ fontSize: `${header.headingFontSize}px`, color: header.headingColor, fontWeight: 400, marginBottom: 8, textTransform: "uppercase" }}>
            {header.heading}
          </h1>
        )}
        {header.subHeading && (
          <h2 style={{ fontSize: `${header.subHeadingFontSize}px`, color: header.subHeadingColor, marginBottom: 16, textTransform: "uppercase", fontWeight: 400 }}>
            {header.subHeading}
          </h2>
        )}
        {header.content && (
          <p style={{ fontSize: `${header.contentFontSize}px`, color: header.contentColor, lineHeight: 1.6, textAlign: "justify", textAlignLast: header.textAlign || "center" }}>
            {header.content}
          </p>
        )}
      </div>

      {/* Blocks */}
      <div style={{ padding: vp.isDesktop ? grid.padding || "0 10%" : "0 20px" }}>
        {blocks.map((block, idx) => {
          const imageRight = block.imagePosition === "right";
          return (
            <div
              key={block.id || idx}
              style={{
                display: "grid",
                gridTemplateColumns: vp.isMobile ? "1fr" : "1fr 1fr",
                gap: vp.isMobile ? "20px" : grid.gap || "40px",
                alignItems: "center",
                marginBottom: vp.isMobile ? "30px" : grid.blockSpacing || "50px",
              }}
            >
              <div style={{ order: !vp.isMobile && imageRight ? 2 : 1 }}>
                {block.image && (
                  <img
                    src={block.image}
                    alt={block.alt || ""}
                    style={{ width: "100%", objectFit: block.objectFit || "cover", display: "block" }}
                  />
                )}
              </div>
              <div style={{ order: !vp.isMobile && imageRight ? 1 : 2 }}>
                <h3 style={{ fontSize: `${grid.headingFontSize || 16}px`, color: grid.headingColor, fontWeight: 600, marginBottom: 12, textTransform: "uppercase" }}>
                  {block.heading}
                </h3>
                <div
                  style={{
                    fontSize: `${grid.contentFontSize || 12}px`,
                    color: grid.contentColor,
                    textAlign: "justify",
                    wordBreak: "normal",
                    overflowWrap: "break-word",
                    whiteSpace: "pre-line",
                    lineHeight: 1.6,
                  }}
                >
                  {block.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note */}
      {note.content && (
        <div style={{ margin: vp.isDesktop ? note.margin : "24px 20px", textAlign: note.textAlign || "center" }}>
          <p style={{ fontSize: `${note.contentFontSize}px`, color: note.contentColor }}>{note.content}</p>
        </div>
      )}

      <hr style={{ border: 0, borderTop: "1px solid #d1d5db", margin: "0 48px" }} />

      {/* Form */}
      {form.fields && (
        <div style={{ padding: vp.isDesktop ? form.padding || "40px 15%" : "30px 20px" }}>
          {(form.formHeading || form.formDescription) && (
            <div style={{ textAlign: "center", marginBottom: 30 }}>
              {form.formHeading && <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: "#111827" }}>{form.formHeading}</h2>}
              {form.formDescription && <p style={{ fontSize: 14, color: "#6b7280" }}>{form.formDescription}</p>}
            </div>
          )}
          <CareerForm fields={form.fields} variant="c1" buttonProps={form} vp={vp} />
        </div>
      )}
    </div>
  );
}

/* ================= Career2 ================= */
function Career2({ data }) {
  const vp = useViewport();
  const hero = propsOf(findByType(data, "heading"));
  const bar = propsOf(findByType(data, "status-bar"));
  const gridComp = findByType(data, "layout-grid");
  const grid = propsOf(gridComp);
  const jobCards = (gridComp?.children || []).filter((c) => c.type === "job-card");
  const form = propsOf(findByType(data, "form"));
  const columns = colsFor(grid, vp);

  const handleSubmit = (values) => {
    if (form.submitAction === "whatsapp" && form.whatsappNumber) {
      const text = (form.fields || [])
        .filter((f) => f.type !== "file")
        .map((f) => `${f.label}: ${values[f.id] || ""}`)
        .join("\n");
      window.open(
        `https://wa.me/${String(form.whatsappNumber).replace(/\D/g, "")}?text=${encodeURIComponent(text)}`,
        "_blank"
      );
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fafafa" }}>
      {/* Hero */}
      <div style={{ margin: vp.isDesktop ? hero.margin : "40px 20px 24px 20px", textAlign: hero.textAlign || "center" }}>
        {hero.badge && (
          <span
            style={{
              display: "inline-block",
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: 16,
              backgroundColor: hero.badgeBackgroundColor,
              color: hero.badgeTextColor,
              fontSize: 11,
              letterSpacing: "0.2em",
              padding: "6px 14px",
              borderRadius: 9999,
            }}
          >
            {hero.badge}
          </span>
        )}
        <h1
          style={{
            
            fontWeight: 700,
            marginBottom: 12,
            fontSize: `${vp.isMobile ? Math.min(hero.headingFontSize || 40, 30) : hero.headingFontSize}px`,
            color: hero.headingColor,
          }}
        >
          {hero.heading}
        </h1>
        <p style={{ lineHeight: 1.6, margin: "0 auto", fontSize: `${hero.contentFontSize}px`, color: hero.contentColor, maxWidth: 720 }}>
          {hero.content}
        </p>
      </div>

      {/* Summary bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: bar.backgroundColor,
          border: `1px solid ${bar.borderColor || "#e5e7eb"}`,
          borderRadius: bar.borderRadius,
          padding: bar.padding,
          maxWidth: bar.maxWidth,
          margin: vp.isDesktop ? bar.margin : "0 20px 30px 20px",
          marginLeft: vp.isDesktop ? "auto" : undefined,
          marginRight: vp.isDesktop ? "auto" : undefined,
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: bar.statusIndicatorColor,
              boxShadow: `0 0 0 4px ${bar.statusIndicatorColor}33`,
              display: "inline-block",
            }}
          />
          <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{bar.statusText}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "#6b7280" }}>
          {(bar.locations || []).map((loc, i) => (
            <span key={i}>{loc}</span>
          ))}
        </div>
      </div>

      {/* Jobs grid */}
      <div style={{ padding: vp.isDesktop ? grid.padding : "0 20px 40px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: grid.gap || "24px" }}>
          {jobCards.map((card) => {
            const p = card.props || {};
            return (
              <div
                key={card.id}
                style={{
                  backgroundColor: p.cardBackgroundColor,
                  borderRadius: p.borderRadius,
                  border: "1px solid #eef0f2",
                  padding: "22px 24px",
                }}
              >
                <div style={{ textTransform: "uppercase", fontWeight: 700, marginBottom: 8, color: p.departmentColor, fontSize: 10, letterSpacing: "0.18em" }}>
                  {p.department}
                </div>
                <h3 style={{  fontWeight: 600, marginBottom: 16, fontSize: 20, color: "#111827", lineHeight: 1.25 }}>
                  {p.title}
                </h3>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingBottom: 20, marginBottom: 20, borderBottom: "1px solid #f3f4f6" }}>
                  {(p.tags || []).map((tag, ti) => {
                    const Icon = TAG_ICONS[tag.icon] || MapPin;
                    return (
                      <span
                        key={ti}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          background: "#f3f4f6",
                          color: "#4b5563",
                          fontWeight: 500,
                          fontSize: 11,
                          padding: "5px 10px",
                          borderRadius: 9999,
                        }}
                      >
                        <Icon size={12} />
                        <span>{tag.label}</span>
                      </span>
                    );
                  })}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <a
                    href={p.detailsUrl || "#"}
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "#111827", textDecoration: "none" }}
                  >
                    <span>{p.detailsLinkText}</span>
                    <ArrowRight size={13} />
                  </a>
                  <a
                    href={p.applyUrl || "#apply"}
                    style={{
                      fontWeight: 600,
                      backgroundColor: p.applyButtonColor,
                      color: p.applyButtonTextColor,
                      fontSize: 13,
                      padding: "9px 22px",
                      borderRadius: 9999,
                      textDecoration: "none",
                    }}
                  >
                    {p.applyButtonText}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Apply form */}
      {form.fields && (
        <div
          id="apply"
          style={{
            backgroundColor: form.cardBackgroundColor,
            maxWidth: form.maxWidth || "480px",
            padding: vp.isDesktop ? form.padding : "20px",
            margin: vp.isDesktop ? form.margin : "30px 16px 40px 16px",
            marginLeft: "auto",
            marginRight: "auto",
            boxSizing: "border-box",
          }}
        >
          {form.formHeading && (
            <h2 style={{   fontWeight: 600, marginBottom: 8, fontSize: 26, color: "#111827" }}>
              {form.formHeading}
            </h2>
          )}
          {form.formDescription && <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 16 }}>{form.formDescription}</p>}
          <div style={{ marginTop: 24 }}>
            <CareerForm fields={form.fields} variant="c2" buttonProps={form} onSubmit={handleSubmit} vp={vp} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= Career3 ================= */
function Career3({ data }) {
  const vp = useViewport();
  const hero = findByType(data, "banner");
  const heading = propsOf(findByType(data, "heading"));
  const gridComp = findByType(data, "layout-grid");
  const grid = propsOf(gridComp);
  const cards = (gridComp?.children || []).filter((c) => c.type === "overlay-card");
  const contact = propsOf(findByType(data, "content-group"));
  const columns = colsFor(grid, vp);

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <HeroBanner hero={hero} vp={vp} defaultHeight={460} mobileMax={420}>
        {(c) => (
          <div
            style={{
              position: "relative",
              zIndex: 10,
              maxWidth: vp.isMobile ? "100%" : c.maxWidth || "520px",
              padding: vp.isMobile ? "0 20px" : c.padding || "0 8%",
              textAlign: c.align || "left",
            }}
          >
            <h1
              style={{
                fontWeight: 400,
                marginBottom: 16,
                fontSize: `${vp.isMobile ? Math.min(c.headingFontSize || 36, 28) : c.headingFontSize}px`,
                color: c.headingColor,
                lineHeight: 1.15,
              }}
            >
              {c.heading}
            </h1>
            <p style={{ lineHeight: 1.6, marginBottom: 32, fontSize: `${c.descriptionFontSize}px`, color: c.descriptionColor }}>
              {c.description}
            </p>
            {c.buttonText && (
              <a
                href={c.buttonUrl || "#"}
                style={{
                  display: "inline-block",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  backgroundColor: c.buttonColor,
                  color: c.buttonTextColor,
                  fontSize: 11,
                  padding: "14px 32px",
                  letterSpacing: "0.04em",
                  textDecoration: "none",
                }}
              >
                {c.buttonText}
              </a>
            )}
          </div>
        )}
      </HeroBanner>

      {/* Heading */}
      <div id="open-positions" style={{ margin: vp.isDesktop ? heading.margin : "36px 20px 20px 20px", textAlign: heading.textAlign || "left" }}>
        <h2
          style={{
            fontWeight: 400,
            marginBottom: 8,
            fontSize: `${vp.isMobile ? Math.min(heading.headingFontSize || 28, 22) : heading.headingFontSize}px`,
            color: heading.headingColor,
          }}
        >
          {heading.heading}
        </h2>
        <p style={{ lineHeight: 1.6, fontSize: `${heading.contentFontSize}px`, color: heading.contentColor }}>{heading.content}</p>
      </div>

      {/* Cards */}
      <div style={{ padding: vp.isDesktop ? grid.padding : "0 20px 30px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: grid.gap || "24px" }}>
          {cards.map((card) => {
            const p = card.props || {};
            return (
              <div
                key={card.id}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  height: p.height || "300px",
                  borderRadius: 12,
                  backgroundImage: p.imageSrc ? `url(${p.imageSrc})` : "none",
                  backgroundColor: "#d1d5db",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundColor: p.overlayColor }} />
                <div style={{ position: "relative", zIndex: 10, padding: "20px 28px", color: p.textColor || "#ffffff" }}>
                  <div style={{ marginBottom: 4, fontSize: 12 }}>{p.tag}</div>
                  <h3 style={{ marginBottom: 8, fontSize: 24, lineHeight: 1.2, color: "#ffffff", fontWeight: 600 }}>{p.heading}</h3>
                  <p style={{ lineHeight: 1.35, fontSize: 11, maxHeight: 110, overflow: "hidden", margin: 0 }}>{p.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact */}
      <div style={{ backgroundColor: "#f7f7f7", padding: vp.isDesktop ? contact.padding : "24px 20px 36px 20px" }}>
        <h4 style={{ fontWeight: 700, marginBottom: 32, fontSize: 16, color: "#111827" }}>{contact.introText}</h4>
        <div style={{ display: "grid", gridTemplateColumns: vp.isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))", gap: 28 }}>
          {(contact.sections || []).map((sec, idx) => {
            const Icon = CONTACT_ICONS[sec.icon] || Phone;
            return (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <Icon size={38} strokeWidth={1.2} style={{ color: contact.iconColor || "#a8885a", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: `${contact.headingFontSize}px`, color: contact.headingColor }}>{sec.heading}</div>
                  <div style={{ fontSize: `${contact.contentFontSize}px`, color: contact.contentColor }}>{sec.content}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ================= Career4 ================= */
function Career4({ data }) {
  const vp = useViewport();
  const hero = findByType(data, "banner");
  const listComp = findByType(data, "layout-grid");
  const list = propsOf(listComp);
  const jobs = (listComp?.children || []).filter((c) => c.type === "job-listing-card");

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <HeroBanner hero={hero} vp={vp} defaultHeight={280} mobileMax={240}>
        {(c) => (
          <div
            style={{
              position: "relative",
              zIndex: 10,
              width: "100%",
              padding: vp.isMobile ? "0 20px" : c.padding || "0 10%",
              textAlign: c.align || "center",
              boxSizing: "border-box",
            }}
          >
            <h1
              style={{
                fontWeight: 500,
                marginBottom: 12,
                fontSize: `${vp.isMobile ? Math.min(c.headingFontSize || 32, 26) : c.headingFontSize}px`,
                color: c.headingColor,
              }}
            >
              {c.heading}
            </h1>
            <p style={{ fontSize: `${c.descriptionFontSize}px`, color: c.descriptionColor, margin: 0 }}>{c.description}</p>
          </div>
        )}
      </HeroBanner>

      <div
        style={{
          padding: vp.isDesktop ? list.padding : vp.isMobile ? "20px 16px 40px 16px" : "30px 8% 50px 8%",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: list.gap || "20px" }}>
          {jobs.map((job) => {
            const p = job.props || {};
            const accent = p.leftAccentBorderColor || "#990000";
            const valueColor = p.specValueColor || "#990000";

            return (
              <div
                key={job.id}
                style={{
                  backgroundColor: p.cardBackgroundColor,
                  border: "1px solid #e5e7eb",
                  padding: vp.isMobile ? "16px" : "18px 20px 20px 20px",
                }}
              >
                <h3
                  style={{
                    fontWeight: 600,
                    fontSize: 17,
                    color: "#111827",
                    borderBottom: "1px solid #d1d5db",
                    paddingBottom: 6,
                    margin: 0,
                  }}
                >
                  {p.title}
                </h3>

                <div
                  style={{
                    borderLeft: `3px solid ${accent}`,
                    marginLeft: vp.isMobile ? -16 : -20,
                    paddingLeft: vp.isMobile ? 16 : 20,
                    paddingTop: 10,
                    paddingBottom: 6,
                  }}
                >
                  <p style={{ lineHeight: 1.6, marginBottom: 12, fontSize: 13, color: "#4b5563", marginTop: 0 }}>{p.description}</p>

                  {(p.specs || []).map((spec, si) => {
                    const Icon = SPEC_ICONS[spec.icon];
                    const color = spec.highlightColor || valueColor;
                    return (
                      <div key={si} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", lineHeight: "24px", fontSize: 13 }}>
                        <span style={{ fontWeight: 600, color: "#111827" }}>{spec.label}</span>
                        <span style={{ margin: "0 6px", fontWeight: 600, color: "#111827" }}>:</span>
                        {Icon ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              fontWeight: 500,
                              color,
                              backgroundColor: /^#[0-9a-fA-F]{6}$/.test(color) ? `${color}14` : "#fdecec",
                              fontSize: 11,
                              padding: "2px 9px",
                              borderRadius: 9999,
                            }}
                          >
                            <Icon size={11} />
                            <span>{spec.value}</span>
                          </span>
                        ) : (
                          <span style={{ fontWeight: 600, color }}>{spec.value}</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                  <a
                    href={p.applyButtonUrl || "#"}
                    style={{
                      fontWeight: 500,
                      backgroundColor: p.applyButtonColor,
                      color: p.applyButtonTextColor,
                      fontSize: 13,
                      padding: "7px 40px",
                      textDecoration: "none",
                    }}
                  >
                    {p.applyButtonText}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ================= Career5 ================= */
function Career5({ data }) {
  const vp = useViewport();
  const hero = findByType(data, "banner");
  const gridComp = findByType(data, "layout-grid");
  const grid = propsOf(gridComp);
  const children = gridComp?.children || [];
  const form = propsOf(children.find((c) => c.type === "form"));
  const image = propsOf(children.find((c) => c.type === "image"));
  const columns = colsFor(grid, vp);

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <HeroBanner hero={hero} vp={vp} defaultHeight={360} mobileMax={260} bg="#1f1f1f">
        {(c) => (
          <div
            style={{
              position: "relative",
              zIndex: 10,
              width: "100%",
              padding: vp.isMobile ? "0 20px" : c.padding || "0 15%",
              textAlign: c.align || "left",
              boxSizing: "border-box",
            }}
          >
            <h1
              style={{
               
                fontWeight: 400,
                margin: 0,
                fontSize: `${vp.isMobile ? Math.min(c.headingFontSize || 32, 26) : c.headingFontSize}px`,
                color: c.headingColor,
              }}
            >
              {c.heading}
            </h1>
          </div>
        )}
      </HeroBanner>

      <div style={{ padding: vp.isDesktop ? grid.padding : vp.isMobile ? "30px 16px" : "40px 6%" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gap: grid.gap || "30px",
            alignItems: "stretch",
          }}
        >
          {/* Form card */}
          <div
            style={{
              backgroundColor: form.cardBackgroundColor,
              boxShadow: form.boxShadow,
              padding: vp.isMobile ? "20px" : form.padding || "30px",
              alignSelf: "start",
              boxSizing: "border-box",
            }}
          >
            {form.formHeading && (
              <h2
                style={{
                  fontWeight: 700,
                  marginBottom: 20,
                  marginTop: 0,
                  fontSize: `${form.formHeadingFontSize || 20}px`,
                  color: form.formHeadingColor || "#111827",
                }}
              >
                {form.formHeading}
              </h2>
            )}
            {form.formDescription && <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 16 }}>{form.formDescription}</p>}
            <CareerForm fields={form.fields || []} variant="c5" buttonProps={form} vp={vp} />
          </div>

          {/* Side image */}
          <div style={{ overflow: "hidden", background: "#e5e7eb", minHeight: vp.isMobile ? 260 : 340 }}>
            {image.src && (
              <img
                src={image.src}
                alt={image.alt || ""}
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: vp.isMobile ? 260 : 340,
                  objectFit: image.objectFit || "cover",
                  display: "block",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- registry ---------------- */
const CAREER_TEMPLATES = {
  Career1,
  Career2,
  Career3,
  Career4,
  Career5,
};

const isCareerTemplate = (id) =>
  Object.prototype.hasOwnProperty.call(CAREER_TEMPLATES, id);

export default function CareerUs({ templates = [] }) {
  const match = pickCareerTemplate(templates);

  if (!match) {
    return <div className="au-error">No Career template found.</div>;
  }

  const Template = CAREER_TEMPLATES[match.title];
  return <Template data={match.data} />;
}