"use client";

import React from 'react';
import {
  Container,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  sonasonsFaqs
} from "@/app/components/(static)/Constants/FaqList";
import { getBrandConfig } from "@/app/(core)/constants/BrandConfig";

export default function TermsAndConditions() {
  const brand = getBrandConfig();
  

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 6 }}>
      <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: { xs: "30vh", md: "30vh", lg: "35vh" },
                      backgroundImage: `url(/WebSiteStaticImage/Banner/vimalgolddiamond/faqBanner1.png)`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                  </Box>
      <Container maxWidth="md">
        {/* Header Section */}
        <Box sx={{ mb: 5, textAlign: 'center', px: 2 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            fontWeight="700"
            sx={{ color: '#1e293b',mt: 5, fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
          >
           Frequently Asked Questions
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ color: '#64748b', maxWidth: '600px', mx: 'auto', lineHeight: 1.6 }}
          >
         Find answers to common questions about our jewelry, craftsmanship, orders, payments, shipping, customization, and after-sales services.
          </Typography>
        </Box>

        {/* Card Container Layout */}
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: '12px', 
            overflow: 'hidden',
            border: '1px solid',
            borderColor: '#e2e8f0',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
            p: { xs: 2, sm: 3 }
          }}
        >
          {sonasonsFaqs.map((term, index) => (
            <React.Fragment key={index}>
              <Accordion 
                elevation={0} 
                disableGutters
                defaultExpanded // Forces the panel to open by default on mount
                sx={{
                  background: 'transparent',
                  '&:before': { display: 'none' }, 
                  my: 0.5
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ fontSize: '1.25rem', color: '#64748b' }} />}
                  aria-controls={`${index}-content`}
                  id={`${index}-header`}
                  sx={{ 
                    px: 1,
                    '& .MuiAccordionSummary-content': { my: 1.5 }
                  }}
                >
                  <Typography 
                    variant="subtitle1" 
                    fontWeight="600" 
                    sx={{ color: '#0f172a', letterSpacing: '0.02em', fontSize: '0.95rem' }}
                  >
                    {term.question}
                  </Typography>
                </AccordionSummary>
                
                <AccordionDetails sx={{ px: 1, pb: 3, pt: 0 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ color: '#475569', lineHeight: 1.7, fontSize: '0.875rem' }}
                  >
                    {term.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
              
              {index < sonasonsFaqs.length - 1 && <Divider sx={{ borderColor: '#f1f5f9', my: 1 }} />}
            </React.Fragment>
          ))}
        </Paper>

        {/* Footer Attribution */}
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: '500' }}>
          Still have questions? Contact {brand.name} customer support — we’re happy to help.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}   