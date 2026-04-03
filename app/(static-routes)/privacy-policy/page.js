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

                {config.sections.map((section, idx) => (
                    <section key={idx} style={styles.section}>
                        <h2 style={styles.sectionTitle}>{section.title}</h2>
                        <p style={styles.paragraph}>{section.content}</p>
                    </section>
                ))}

                <p style={styles.closingText}>
                    {config.closing_text}
                </p>
            </div>
        </div>
    );
}

const styles = {
    wrapper: {
        minHeight: "100vh",
        backgroundColor: "#fafafa",
        padding: "40px 16px 120px 16px", // Added bottom padding
    },
    container: {
        maxWidth: 720,
        margin: "0 auto",
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: "40px 24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    },
    title: {
        fontSize: 28,
        fontWeight: 800,
        color: "#1a1a1a",
        marginBottom: 24,
        borderBottom: "2px solid #f0f0f0",
        paddingBottom: 16,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 700,
        color: "#222",
        marginBottom: 10,
        lineHeight: 1.4,
    },
    paragraph: {
        fontSize: 15,
        lineHeight: 1.9,
        color: "#4a4a4a",
        margin: 0,
    },
    closingText: {
        fontSize: 15,
        lineHeight: 1.9,
        color: "#555",
        fontStyle: "italic",
        marginTop: 12,
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        borderLeft: "4px solid #ddd",
    },
};