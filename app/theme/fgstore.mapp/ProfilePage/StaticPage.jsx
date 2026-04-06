"use client";

import React, { useEffect, useState } from "react";
import { Drawer, Box, CircularProgress, Typography } from "@mui/material";
import MobileNavbar from "./NavigationBar";
import { AppConfig } from "@/app/(core)/constants/AppConfig";
import { activeBrand } from "@/app/env";

export default function StaticPage({ open, onClose, title = "Page" }) {
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(false);

  const brandConfig = AppConfig[activeBrand] || AppConfig.SonasonsApp;
  
  // Mapping for new dynamic JSON content
  const complianceKeys = {
    "Privacy Policy": "privacy_policy",
    "Copyright": "copyright",
    "Support": "support"
  };
  
  const complianceKey = complianceKeys[title];
  const dynamicContent = complianceKey ? brandConfig?.compliance_content?.[complianceKey] : null;

  // Fallback to fetch purely if it's an old brand relying on static_pages HTML or dynamicContent is missing
  const staticPageUrl = brandConfig?.static_pages?.[title];

  useEffect(() => {
    // If we have dynamic JSON content, we skip fetching HTML
    if (open && dynamicContent) {
      setHtmlContent("");
      return; 
    }

    if (open && staticPageUrl && !dynamicContent) {
      setLoading(true);
      fetch(staticPageUrl)
        .then((res) => {
          if (!res.ok) throw new Error("File not found");
          return res.text();
        })
        .then((data) => {
          setHtmlContent(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(`Error fetching static page [${title}]:`, err);
          setHtmlContent("<p style='padding: 20px; text-align: center;'>Content not found.</p>");
          setLoading(false);
        });
    } else if (!open) {
      setHtmlContent("");
    }
  }, [open, staticPageUrl, title, dynamicContent]);

  const renderPrivacyPolicy = (config) => (
    <Box sx={{ p: 2 }}>
      {config.effective_date && (
        <Typography variant="body2" sx={{ mb: 2, fontWeight: 'bold', color: '#555' }}>
          Effective Date: {config.effective_date}
        </Typography>
      )}
      
      {config.intro && <Typography variant="body2" sx={{ mb: 2, color: '#444' }}>{config.intro}</Typography>}
  
      {config.sections?.map((section, idx) => (
        <Box key={idx} sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#222' }}>
            {idx + 1}. {section.title}
          </Typography>
          
          {section.intro && <Typography variant="body2" sx={{ mb: 1, color: '#444' }}>{section.intro}</Typography>}
          {section.content && <Typography variant="body2" sx={{ mb: 1, color: '#444', whiteSpace: 'pre-wrap' }}>{section.content}</Typography>}
          
          {section.items && (
            <Box component="ul" sx={{ pl: 3, mb: 1, mt: 0, '& li': { mb: 0.5 } }}>
              {section.items.map((item, i) => (
                <Typography component="li" variant="body2" key={i} sx={{ color: '#444' }}>{item}</Typography>
              ))}
            </Box>
          )}
  
          {section.subsections?.map((sub, sIdx) => (
            <Box key={sIdx} sx={{ mb: 1, mt: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>{sub.subtitle}</Typography>
              {sub.intro && <Typography variant="body2" sx={{ mb: 0.5, color: '#444' }}>{sub.intro}</Typography>}
              {sub.items && (
                <Box component="ul" sx={{ pl: 3, mb: 0, mt: 0, '& li': { mb: 0.5 } }}>
                  {sub.items.map((item, i) => (
                    <Typography component="li" variant="body2" key={i} sx={{ color: '#444' }}>{item}</Typography>
                  ))}
                </Box>
              )}
            </Box>
          ))}
          
          {section.note && (
            <Box sx={{ mt: 1, p: 1.5, bgcolor: '#f5f8fa', borderLeft: '3px solid #3498db', borderRadius: '0 4px 4px 0' }}>
              <Typography variant="caption" sx={{ fontStyle: 'italic', color: '#555' }}>{section.note}</Typography>
            </Box>
          )}
        </Box>
      ))}
  
      {config.closing_text && (
        <Box sx={{ mt: 3, p: 2, bgcolor: '#fdfdfd', borderTop: '1px solid #eee' }}>
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#555' }}>
            {config.closing_text}
          </Typography>
        </Box>
      )}
    </Box>
  );

  const renderCopyright = (config) => (
    <Box sx={{ p: 3 }}>
      <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>{config.notice}</Typography>
      <Typography variant="body2" sx={{ mb: 3, color: '#555', lineHeight: 1.6 }}>{config.paragraph}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>{config.contact_note}</Typography>
      <Typography variant="body2" sx={{ color: '#1565c0' }}>Phone: {config.phone}</Typography>
      <Typography variant="body2" sx={{ color: '#1565c0' }}>Email: {config.email}</Typography>
    </Box>
  );
  
  const renderSupport = (config) => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ bgcolor: '#f8f9fa', borderRadius: 2, p: 2, mb: 3, borderLeft: '4px solid #1565c0' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1565c0', mb: 0.5 }}>{config.brand_name}</Typography>
          <Typography variant="caption" sx={{ color: '#999', textTransform: 'uppercase' }}>{config.address_header}</Typography>
          <Typography variant="body2" sx={{ mt: 1, mb: 2, color: '#444', lineHeight: 1.6 }}>{config.address}</Typography>
          <Typography variant="body2" sx={{ color: '#1565c0', mb: 0.5 }}><b>Call:</b> {config.phone}</Typography>
          <Typography variant="body2" sx={{ color: '#1565c0' }}><b>Mail:</b> {config.email}</Typography>
      </Box>
  
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, borderBottom: '1px solid #eee', pb: 1 }}>{config.faq_title}</Typography>
      {config.faqs.map((item, idx) => (
          <Box key={idx} sx={{ mb: 2, borderBottom: '1px solid #f5f5f5', pb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#333' }}>{idx + 1}. {item.q}</Typography>
              <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6 }}>{item.a}</Typography>
          </Box>
      ))}
    </Box>
  );

  return (
    <Drawer
      anchor="right"
      open={Boolean(open)}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "100%",
          maxWidth: "100%",
          bgcolor: "#fff",
        },
      }}
    >
      <MobileNavbar title={title} onClose={onClose} />

      <Box sx={{ overflowY: "auto", height: "calc(100% - 64px)", px: 1 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <CircularProgress size={30} sx={{ color: "#000" }} />
          </Box>
        ) : dynamicContent ? (
          /* Render Dynamic JSON format depending on the active title */
          title === "Privacy Policy" ? renderPrivacyPolicy(dynamicContent) :
          title === "Copyright" ? renderCopyright(dynamicContent) :
          title === "Support" ? renderSupport(dynamicContent) : null
        ) : htmlContent ? (
          /* Render old HTML format fetched via network */
          <Box
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            sx={{
              "& img": { maxWidth: "100%", height: "auto" },
              "& a": { color: "primary.main" },
              p: 0,
            }}
          />
        ) : (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No information available for {title}.
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
