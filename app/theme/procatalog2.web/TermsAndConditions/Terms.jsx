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
import { getBrandConfig } from "@/app/(core)/constants/BrandConfig";

export default function TermsAndConditions() {
  const brand = getBrandConfig();
  const termsData = [
    {
      id: 'panel1',
      title: 'TERMS AND CONDITIONS ACCEPTANCE',
      content: `Before using our website located at ${brand.website} and any associated websites linked to it, please read these Terms and Conditions carefully. By accessing or using our website, you agree to be bound by the terms outlined below.`
    },
    {
      id: 'panel2',
      title: 'PRODUCT AVAILABILITY',
      content: 'We make every effort to ensure that all jewelry items displayed on our website are available for purchase. However, due to high demand or limited stock, certain items may become unavailable. In such cases, we will notify you promptly if an item is out of stock after your purchase.'
    },
    {
      id: 'panel3',
      title: 'PRICING AND PAYMENTS',
      content: 'All prices listed on our website are subject to change without prior notice. Applicable taxes, shipping, and handling charges will be calculated during checkout. Payments are processed securely at the time of order confirmation using approved payment gateways.'
    },
    {
      id: 'panel4',
      title: 'INTERNATIONAL SHIPPING',
      content: 'International shipping is available. Any customs duties, taxes, or import fees imposed by the destination country are the responsibility of the customer.'
    },
    {
      id: 'panel5',
      title: 'WARRANTY EXCLUSIONS',
      content: 'The warranty does not cover damage due to misuse, normal wear and tear, accidental damage, or repairs performed by unauthorized parties.'
    },
    {
      id: 'panel6',
      title: 'CUSTOMER RESPONSIBILITIES',
      content: `Customers are responsible for maintaining the confidentiality of their account information and for providing accurate and complete details during transactions. ${brand.name} is not liable for issues arising from incorrect information.`
    },
    {
      id: 'panel7',
      title: 'PRIVACY AND DATA PROTECTION',
      content: 'We respect your privacy and are committed to protecting your personal data. Please refer to our Privacy Policy for detailed information on data collection and usage.'
    },
    {
      id: 'panel8',
      title: 'LIMITATION OF LIABILITY',
      content: '[Title] shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of our website or products. Our maximum liability shall not exceed the amount paid for the purchased product.'
    },
    {
      id: 'panel9',
      title: 'GOVERNING LAW',
      content: 'These Terms and Conditions are governed by and construed in accordance with the laws of the applicable jurisdiction.'
    },
    {
      id: 'panel10',
      title: 'DISPUTE RESOLUTION',
      content: 'Any disputes arising from these Terms and Conditions shall be resolved through binding arbitration in the designated location, in accordance with applicable laws.'
    }
  ];

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        {/* Header Section */}
        <Box sx={{ mb: 5, textAlign: 'center', px: 2 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            fontWeight="700"
            sx={{ color: '#1e293b', fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
          >
            Terms &amp; Conditions
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ color: '#64748b', maxWidth: '600px', mx: 'auto', lineHeight: 1.6 }}
          >
            Please read these terms carefully before using our website or purchasing any products. 
            Your access and use of our services indicate acceptance of these terms.
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
          {termsData.map((term, index) => (
            <React.Fragment key={term.id}>
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
                  aria-controls={`${term.id}-content`}
                  id={`${term.id}-header`}
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
                    {term.title}
                  </Typography>
                </AccordionSummary>
                
                <AccordionDetails sx={{ px: 1, pb: 3, pt: 0 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ color: '#475569', lineHeight: 1.7, fontSize: '0.875rem' }}
                  >
                    {term.content}
                  </Typography>
                </AccordionDetails>
              </Accordion>
              
              {index < termsData.length - 1 && <Divider sx={{ borderColor: '#f1f5f9', my: 1 }} />}
            </React.Fragment>
          ))}
        </Paper>

        {/* Footer Attribution */}
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: '500' }}>
            &copy; {new Date().getFullYear()} {brand.name}. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}