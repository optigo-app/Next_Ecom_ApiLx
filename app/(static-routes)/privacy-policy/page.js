import { activeBrand } from "@/app/env";
import { AppConfig } from "@/app/(core)/constants/AppConfig";

export const metadata = {
    title: "Privacy Policy",
    description: "Read our privacy policy. Learn how we collect, use, share, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
    const config = AppConfig[activeBrand]?.compliance_content?.privacy_policy;

    if (!config) {
        return (
            <div style={styles.wrapper}>
                <div style={styles.container}>
                    <h1 style={styles.title}>Privacy Policy</h1>
                    <p style={styles.paragraph}>Content not available for this brand.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.wrapper}>
            <div style={styles.container}>
                <h1 style={styles.title}>{config.title}</h1>
                
                {config.effective_date && (
                    <p style={styles.effectiveDate}><b>Effective Date: {config.effective_date}</b></p>
                )}
                
                {config.intro && (
                    <p style={styles.paragraph}>{config.intro}</p>
                )}

                {config.sections?.map((section, idx) => (
                    <section key={idx} style={styles.section}>
                        <h2 style={styles.sectionTitle}>{idx + 1}. {section.title}</h2>
                        
                        {section.intro && <p style={styles.paragraph}>{section.intro}</p>}
                        {section.content && <p style={styles.paragraphWithWrap}>{section.content}</p>}
                        
                        {section.items && (
                            <ul style={styles.list}>
                                {section.items.map((item, i) => (
                                    <li key={i} style={styles.listItem}>{item}</li>
                                ))}
                            </ul>
                        )}

                        {section.subsections?.map((sub, sIdx) => (
                            <div key={sIdx} style={styles.subsection}>
                                <h3 style={styles.subsectionTitle}>{sub.subtitle}</h3>
                                {sub.intro && <p style={styles.paragraph}>{sub.intro}</p>}
                                {sub.items && (
                                    <ul style={styles.list}>
                                        {sub.items.map((item, i) => (
                                            <li key={i} style={styles.listItem}>{item}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                        
                        {section.note && (
                            <div style={styles.note}>
                                <span>{section.note}</span>
                            </div>
                        )}
                    </section>
                ))}

                {config.closing_text && (
                    <p style={styles.closingText}>
                        {config.closing_text}
                    </p>
                )}
            </div>
        </div>
    );
}

const styles = {
    wrapper: {
        minHeight: "100vh",
        backgroundColor: "#fafafa",
        padding: "40px 16px 120px 16px",
    },
    container: {
        maxWidth: 720,
        margin: "0 auto",
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: "40px 32px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    },
    title: {
        fontSize: 32,
        fontWeight: 800,
        color: "#1a1a1a",
        marginBottom: 16,
        borderBottom: "2px solid #f0f0f0",
        paddingBottom: 16,
    },
    effectiveDate: {
        fontSize: 15,
        color: "#4a4a4a",
        marginBottom: 24,
    },
    section: {
        marginBottom: 36,
        marginTop: 32,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 700,
        color: "#222",
        marginBottom: 16,
        lineHeight: 1.4,
    },
    subsection: {
        marginTop: 20,
        marginBottom: 20,
    },
    subsectionTitle: {
        fontSize: 17,
        fontWeight: 600,
        color: "#333",
        margin: "16px 0 8px 0",
    },
    paragraph: {
        fontSize: 15,
        lineHeight: 1.8,
        color: "#4a4a4a",
        margin: "0 0 12px 0",
    },
    paragraphWithWrap: {
        fontSize: 15,
        lineHeight: 1.8,
        color: "#4a4a4a",
        margin: "0 0 12px 0",
        whiteSpace: "pre-wrap",
    },
    list: {
        paddingLeft: 24,
        margin: "8px 0 16px 0",
    },
    listItem: {
        fontSize: 15,
        lineHeight: 1.8,
        color: "#4a4a4a",
        marginBottom: 8,
    },
    note: {
        fontSize: 14.5,
        lineHeight: 1.7,
        color: "#555",
        marginTop: 16,
        padding: "16px",
        backgroundColor: "#f5f8fa",
        borderLeft: "4px solid #3498db",
        borderRadius: "0 8px 8px 0",
        fontStyle: "italic",
    },
    closingText: {
        fontSize: 15,
        lineHeight: 1.9,
        color: "#555",
        fontStyle: "italic",
        marginTop: 40,
        padding: "20px",
        backgroundColor: "#fdfdfd",
        borderTop: "1px solid #eee",
        borderBottom: "1px solid #eee",
    },
};