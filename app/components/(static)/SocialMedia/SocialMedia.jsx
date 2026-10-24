"use client";

import React from "react";
import {
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Music2,
  Linkedin,
} from "lucide-react";
import "./SocialMedia.scss";

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

const pickSocialTemplate = (templates = []) => {
  const list = templates.filter(
    (t) =>
      t?.ContentType === "pagetemplate" &&
      t?.PageKey?.toLowerCase() === "social-media"
  );
  if (!list.length) return null;

  const active = list.find((t) => t.IsActive) || list[0];
  const data = parseContentJson(active.ContentJson);
  if (!data) return null;

  // works for SocialMedia1...SocialMediaN automatically, based on the registry
  const title = [active.Title, data.templateId].find(isSocialTemplate) || null;

  return title ? { title, data } : null;
};

/* ---------------- shared: social icon ---------------- */
const ICONS = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  twitter: Twitter,
  x: Twitter,
  tiktok: Music2,
  linkedin: Linkedin,
};

function SocialIcon({ props = {} }) {
  const name = (
    props.socialmedianame ||
    props.socialMediaName ||
    props.platform ||
    "instagram"
  ).toLowerCase();

  const Icon = ICONS[name] || Instagram;
  return <Icon size={props.iconSize || 20} style={{ color: props.iconColor || "#374151" }} />;
}

/* ---------------- shared: post image / video ---------------- */
function PostMedia({ item }) {
  const props = item?.props || {};

  if (props.isVideo) {
    return (
      <div className="sm-video-wrapper">
        <video
          src={props.image}
          className="sm-post-media"
          muted
          loop
          autoPlay
          playsInline
        />
        <div className="sm-video-overlay">
          <div className="sm-video-play">
            <span>▶</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={props.image}
      className="sm-post-media"
      alt={props.username || "Social Media Post"}
    />
  );
}

/* ================= SocialMedia1 — linked image grid with icon ================= */
function SocialMedia1({ data }) {
  const components = data?.components || [];

  return (
    <div className="sm1-page">
      <div className="sm1-top-heading">
        <h3>SOCIAL MEDIA</h3>
      </div>

      <div className="sm1-grid">
        {components.map((item) => {
          const props = item?.props || {};
          const link = item?.socialUrl || props.socialUrl;

          return (
            <a
              key={item?.id}
              href={link || "#"}
              target={link ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="sm1-post-card"
              style={{
                borderRadius: `${props.borderRadius || 0}px`,
                textDecoration: "none",
                color: "inherit",
                display: "block",
              }}
            >
              <div
                className="sm1-image-wrapper"
                style={{
                  aspectRatio: props.aspectRatio || "4/5",
                  borderRadius: `${props.borderRadius || 0}px`,
                }}
              >
                <img
                  src={props.image}
                  className="sm1-post-image"
                  alt="Social Media Post"
                />
              </div>

              <div className="sm1-icon">
                <SocialIcon props={props} />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

/* ================= SocialMedia2 — header card + post grid (image / video) ================= */
function SocialMedia2({ data }) {
  const components = data?.components || [];

  return (
    <div className="sm2-page">
      <div className="sm2-grid">
        {components.map((item) => {
          const props = item?.props || {};

          if (item?.type === "social-header") {
            const themeColor = props.themeColor || "#1A1A1A";

            return (
              <div
                key={item?.id}
                className="sm2-header-card"
                style={{ borderRadius: `${props.borderRadius || 0}px` }}
              >
                <div className="sm2-header-content">
                  <h2 className="sm2-header-title" style={{ color: themeColor }}>
                    {props.title}
                  </h2>

                  <div className="sm2-profile">
                    <div className="sm2-logo">
                      {props.logo ? (
                        <img src={props.logo} alt="Social Logo" />
                      ) : (
                        <span>LOGO</span>
                      )}
                    </div>

                    <div className="sm2-profile-info">
                      <p className="sm2-username">{props.username}</p>
                      <p className="sm2-followers">{props.followers}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="sm2-follow-button"
                    style={{ backgroundColor: themeColor }}
                  >
                    {props.buttonText}
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={item?.id}
              className="sm2-post-card"
              style={{
                borderRadius: `${props.borderRadius || 0}px`,
                aspectRatio: props.aspectRatio || "1/1",
              }}
            >
              <div
                className="sm2-post-image-wrapper"
                style={{ borderRadius: `${props.borderRadius || 0}px` }}
              >
                <PostMedia item={item} />
              </div>

              {props.isVideo && (
                <div className="sm2-video-indicator">
                  <div className="sm2-play-circle">▶</div>
                </div>
              )}

              <div className="sm2-social-icon">
                <SocialIcon props={props} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================= SocialMedia3 — title/username header + post cards with footer ================= */
function SocialMedia3({ data }) {
  const components = data?.components || [];
  const header = components.find((c) => c?.type === "social-header");
  const posts = components.filter((c) => c?.type === "social-post");

  return (
    <div className="sm3-page">
      {header && (
        <div className="sm3-header">
          <div className="sm3-header-title-wrapper">
            <h2
              className="sm3-title"
              style={{ fontSize: px(header.props?.titleSize) }}
            >
              {header.props?.title}
            </h2>
          </div>

          <div className="sm3-header-username">
            <span style={{ fontSize: px(header.props?.usernameSize) }}>
              {header.props?.username}
            </span>
          </div>
        </div>
      )}

      <div className="sm3-posts-wrapper">
        <div className="sm3-posts-grid">
          {posts.map((item) => {
            const props = item?.props || {};

            return (
              <div
                key={item?.id}
                className="sm3-post-card"
                style={{ borderRadius: `${props.borderRadius || 0}px` }}
              >
                <div
                  className="sm3-post-image-wrapper"
                  style={{ aspectRatio: props.aspectRatio || "3/4" }}
                >
                  <img
                    src={props.image}
                    className="sm3-post-image"
                    alt="Social Media Post"
                  />
                  <div className="sm3-image-overlay" />
                </div>

                <div className="sm3-post-footer">
                  <div className="sm3-user">
                    <div className="sm3-user-avatar">
                      {props.username?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <span className="sm3-post-username">{props.username}</span>
                  </div>

                  <div
                    className={`sm3-social-icon ${
                      props.iconShape === "circle" ? "sm3-icon-circle" : "sm3-icon-square"
                    }`}
                  >
                    <SocialIcon props={props} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ================= registry ================= */
const SOCIAL_TEMPLATES = {
  SocialMedia1,
  SocialMedia2,
  SocialMedia3,
};

const isSocialTemplate = (id) =>
  Object.prototype.hasOwnProperty.call(SOCIAL_TEMPLATES, id);

export default function SocialMedia({ templates = [] }) {
  const match = pickSocialTemplate(templates);

  if (!match) {
    return <div className="sm-empty">No social media template found.</div>;
  }

  const Template = SOCIAL_TEMPLATES[match.title];
  return (
    <div className="social-media-container">
      <Template data={match.data} />
    </div>
  );
}