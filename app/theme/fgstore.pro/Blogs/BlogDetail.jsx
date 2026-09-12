"use client";

import React from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import { blogData } from './BlogData'; // Make sure the path matches your project structure

export default function BlogDetail({ id }) {
    // Find the active article matching the passed ID string/number safely
    const blog = blogData.find((item) => item.id.toString() === id.toString());

    if (!blog) {
        return (
            <Box sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h5" color="error">Article Content Not Found</Typography>
            </Box>
        );
    }

    // Styling token values for consistency
    const beigeThemeColor = '#fdfbf7';
    const accentGoldColor = '#c5a880';
    const borderGrey = '#eae2d5';

    return (
        <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', pt: 4, pb: 10 }}>
        <Container maxWidth="xl">
    
            {/* ==========================================================
        1. HERO TITLE BLOCK & PRIMARY METADATA PANEL
        ========================================================== */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        fontFamily: '"Playfair Display", "Georgia", serif',
                        fontWeight: 600,
                        color: '#1a1a1a',
                        mb: 2,
                        lineHeight: 1.2
                    }}
                >
                    {blog.title}
                </Typography>
    
                {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, color: '#777777', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PersonOutlineIcon sx={{ fontSize: '1.1rem' }} />
                        <Typography variant="body2">{blog.author}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarTodayIcon sx={{ fontSize: '1rem' }} />
                        <Typography variant="body2">{blog.publishedDate}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTimeIcon sx={{ fontSize: '1.1rem' }} />
                        <Typography variant="body2">{blog.readTime}</Typography>
                    </Box>
                </Box> */}
                <Divider sx={{ borderColor: borderGrey }} />
            </Box>
    
            {/* ==========================================================
        2. UPPER BLOCK: ASYMMETRIC CONTENT & NAVIGATION PANEL
        ========================================================== */}
            <Grid container spacing={4} sx={{ mb: 6, display: 'flex', alignItems: 'stretch' }}>
                {/* Main Visual Image (Left Column) */}
                <Grid item size={{ xs: 12, md: 8 }} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box
                        sx={{
                            width: '100%',
                            flex: 1,
                            // Sets a solid fallback height for mobile and desktop when text is short
                            minHeight: { xs: 260, md: 450 },
                            borderRadius: '16px',
                            overflow: 'hidden',
                            backgroundColor: '#f0f0f0',
                            backgroundImage: `url(${blog.img || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1000&q=80'})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    />
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#999', fontStyle: 'italic' }}>
                        Image Reference: {blog.title} Luxury Collection
                    </Typography>
                </Grid>
    
                {/* Table of Contents Sidecard (Right Column) */}
                <Grid item size={{ xs: 12, md: 4 }} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box
                        sx={{
                            bgcolor: beigeThemeColor,
                            p: 3,
                            borderRadius: '16px',
                            border: `1px solid ${borderGrey}`,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Typography variant="h6" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, mb: 2, color: '#1a1a1a' }}>
                            On This Page
                        </Typography>
                        <List disablePadding sx={{ flex: 1 }}>
                            {blog.sections.map((section, idx) => (
                                <ListItem
                                    key={section.id}
                                    disableGutters
                                    component="a"
                                    href={`#${section.id}`}
                                    sx={{
                                        textDecoration: 'none',
                                        color: idx === 2 ? accentGoldColor : '#444444',
                                        fontWeight: idx === 2 ? 600 : 400,
                                        py: 0.75,
                                        borderLeft: idx === 2 ? `2px solid ${accentGoldColor}` : 'none',
                                        pl: idx === 2 ? 1.5 : 0,
                                        '&:hover': { color: accentGoldColor }
                                    }}
                                >
                                    <ListItemText primary={section.heading} primaryTypographyProps={{ fontSize: '0.95rem' }} />
                                </ListItem>
                            ))}
                            <ListItem disableGutters component="a" href="#faqs" sx={{ textDecoration: 'none', color: '#444444', py: 0.75 }}>
                                <ListItemText primary="FAQs" primaryTypographyProps={{ fontSize: '0.95rem' }} />
                            </ListItem>
                        </List>
                    </Box>
                </Grid>
            </Grid>
    
            {/* Intro Paragraph */}
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.75, color: '#333333', mb: 6 }}>
                {blog.intro}
            </Typography>
    
            {/* ==========================================================
        3. RENDER GENERATED ARTICLES CONTENT SECTIONS
        ========================================================== */}
            {blog.sections.map((section) => (
                <Box key={section.id} id={section.id} sx={{ mb: 8, scrollMarginTop: '20px' }}>
    
                    {/* Heading Layout */}
                    <Typography
                        variant="h4"
                        sx={{
                            fontFamily: '"Playfair Display", "Georgia", serif',
                            fontWeight: 600,
                            color: '#1a1a1a',
                            mb: 2
                        }}
                    >
                        {section.heading}
                    </Typography>
    
                    {section.content && (
                        <Typography variant="body1" sx={{ lineHeight: 1.7, color: '#444444', mb: 3 }}>
                            {section.content}
                        </Typography>
                    )}
    
                    {/* A. Subsections Block Layout (e.g., The 4Cs grid display layout cards) */}
                    {section.subsections && !section.subsections[0]?.listItems && (
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            {section.subsections.map((sub) => (
                                <Grid item size={{ xs: 12, sm: 6 }} key={sub.id}>
                                    <Box
                                        sx={{
                                            p: 3,
                                            bgcolor: beigeThemeColor,
                                            borderRadius: '12px',
                                            borderLeft: `3px solid ${accentGoldColor}`,
                                            height: '100%',
                                            borderTop: `1px solid ${borderGrey}`,
                                            borderRight: `1px solid ${borderGrey}`,
                                            borderBottom: `1px solid ${borderGrey}`
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, mb: 1 }}>
                                            {sub.heading}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#555555', lineHeight: 1.6 }}>
                                            {sub.content}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    )}
    
                    {/* B. Side-By-Side Comparison Grid Panels Layout (e.g., Natural vs Lab-grown lists columns) */}
                    {section.subsections && section.subsections[0]?.listItems && (
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            {section.subsections.map((sub) => (
                                <Grid item size={{ xs: 12, sm: 6 }} key={sub.id}>
                                    <Box sx={{ p: 3, bgcolor: beigeThemeColor, borderRadius: '12px', border: `1px solid ${borderGrey}`, height: '100%' }}>
                                        <Typography variant="h5" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, mb: 2, color: accentGoldColor }}>
                                            {sub.heading}
                                        </Typography>
                                        {sub.content && (
                                            <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>{sub.content}</Typography>
                                        )}
                                        <Box component="ul" sx={{ listStyleType: 'square', pl: 2, m: 0, '& li': { mb: 1, color: '#333333', fontSize: '0.95rem' } }}>
                                            {sub?.listItems?.map((bullet, bIdx) => (
                                                <li style={{ display: 'list-item', listStyleType: 'square', }} key={bIdx}>{bullet}</li>
                                            ))}
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    )}
    
                    {/* C. Unordered Bullet Lists Render Blocks Layout */}
                    {section.listItems && section.listItems.length > 0 && (
                        <Box component="ul" sx={{ listStyleType: 'square', pl: 3, mb: 3, '& li': { mb: 1.5, color: '#444444', lineHeight: 1.6 } }}>
                            {section.listItems.map((item, index) => (
                                <li style={{ display: 'list-item', listStyleType: 'square', }} key={index}>{item}</li>
                            ))}
                        </Box>
                    )}
    
                    {section.closingContent && (
                        <Typography variant="body1" sx={{ lineHeight: 1.7, color: '#444444', mt: 2, fontStyle: 'italic' }}>
                            {section.closingContent}
                        </Typography>
                    )}
                </Box>
            ))}
    
            {/* ==========================================================
        3.5 Dynamic FAQs Section Block Layout
        ========================================================== */}
            {blog.faqs && blog.faqs.length > 0 && (
                <Box id="faqs" sx={{ mb: 8, scrollMarginTop: '20px' }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontFamily: '"Playfair Display", "Georgia", serif',
                            fontWeight: 600,
                            color: '#1a1a1a',
                            mb: 4
                        }}
                    >
                        Frequently Asked Questions
                    </Typography>
                    <Grid container spacing={3}>
                        {blog.faqs.map((faq, index) => (
                            <Grid item size={{ xs: 12, md: 6 }} key={index}>
                                <Box
                                    sx={{
                                        p: 3,
                                        bgcolor: '#ffffff',
                                        borderRadius: '12px',
                                        border: `1px solid ${borderGrey}`,
                                        height: '100%'
                                    }}
                                >
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            fontFamily: '"Playfair Display", serif', 
                                            fontWeight: 600, 
                                            color: '#1a1a1a', 
                                            mb: 1 
                                        }}
                                    >
                                        {faq.question}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#555555', lineHeight: 1.6 }}>
                                        {faq.answer}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
    
            {/* ==========================================================
        4. LOWER FOOTER ACCORDIONS & CALLOUT TIP LAYOUTS
        ========================================================== */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
                {/* Informational Tip Card (Left Box) */}
                <Grid item size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ p: 3, bgcolor: beigeThemeColor, borderRadius: '12px', border: `1px solid ${borderGrey}`, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: accentGoldColor, mb: 1 }}>
                            <AddIcon fontSize="small" />
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                Expert Guidance Note
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#555555', lineHeight: 1.65 }}>
                            {blog.conclusion}
                        </Typography>
                    </Box>
                </Grid>
    
                {/* Corporate Value Statement Card (Right Box) */}
                <Grid item size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ p: 3, bgcolor: beigeThemeColor, borderRadius: '12px', border: `1px solid ${borderGrey}`, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: accentGoldColor, mb: 1 }}>
                            <AddIcon fontSize="small" />
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                {blog.cta.heading}
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#555555', lineHeight: 1.65 }}>
                            {blog.cta.text}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
    
        </Container>
    </Box>
    );
}