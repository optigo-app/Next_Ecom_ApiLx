import { activeBrand } from "@/app/env";
import { AppConfig } from "@/app/(core)/constants/AppConfig";

export const metadata = {
    title: "Support & Contact Us",
    description: "Get in touch with us. Find our office address, phone, email, and frequently asked questions.",
};

export default function SupportPage() {
    const config = AppConfig[activeBrand]?.compliance_content?.support;

    if (!config) {
        return (
            <div style={styles.wrapper}>
                <div style={styles.container}>
                    <h1 style={styles.title}>Support</h1>
                    <p style={styles.paragraph}>Content not available for this brand.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.wrapper}>
            <div style={styles.container}>
                <h1 style={styles.title}>{config.title}</h1>

                {/* Office Address */}
                <section style={styles.addressCard}>
                    <h2 style={styles.addressBrand}>{config.brand_name}</h2>
                    <p style={styles.addressLine}>{config.address_header}</p>
                    <p style={styles.addressText}>
                        {config.address}
                    </p>
                    <div style={styles.contactRow}>
                        <span style={styles.contactLabel}>Call:</span>
                        <a href={`tel:${config.phone.replace(/[^0-9+]/g, '')}`} style={styles.contactLink}>
                            {config.phone}
                        </a>
                    </div>
                    <div style={styles.contactRow}>
                        <span style={styles.contactLabel}>Mail:</span>
                        <a href={`mailto:${config.email}`} style={styles.contactLink}>
                            {config.email}
                        </a>
                    </div>
                </section>

                {/* FAQ */}
                <section style={styles.faqSection}>
                    <h2 style={styles.faqTitle}>
                        {config.faq_title}
                    </h2>

                    {config.faqs.map((item, idx) => (
                        <div key={idx} style={styles.faqItem}>
                            <h3 style={styles.faqQuestion}>
                                {idx + 1}. {item.q}
                            </h3>
                            <p style={styles.faqAnswer}>{item.a}</p>
                        </div>
                    ))}
                </section>
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
    /* Address Card */
    addressCard: {
        backgroundColor: "#f8f9fa",
        borderRadius: 12,
        padding: "28px",
        marginBottom: 40,
        borderLeft: "5px solid #1565c0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    },
    addressBrand: {
        fontSize: 22,
        fontWeight: 800,
        color: "#1565c0",
        marginBottom: 6,
    },
    addressLine: {
        fontSize: 12,
        fontWeight: 600,
        color: "#999",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: 12,
    },
    addressText: {
        fontSize: 16,
        lineHeight: 1.8,
        color: "#444",
        marginBottom: 20,
    },
    contactRow: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 10,
    },
    contactLabel: {
        fontSize: 14,
        fontWeight: 700,
        color: "#666",
        minWidth: 45,
    },
    contactLink: {
        fontSize: 15,
        color: "#1565c0",
        textDecoration: "none",
        fontWeight: 500,
    },
    /* FAQ */
    faqSection: {
        marginTop: 10,
    },
    faqTitle: {
        fontSize: 22,
        fontWeight: 800,
        color: "#222",
        marginBottom: 24,
        paddingBottom: 12,
        borderBottom: "1px solid #eee",
    },
    faqItem: {
        marginBottom: 24,
        paddingBottom: 20,
        borderBottom: "1px solid #f5f5f5",
    },
    faqQuestion: {
        fontSize: 16,
        fontWeight: 700,
        color: "#333",
        marginBottom: 10,
        lineHeight: 1.4,
    },
    faqAnswer: {
        fontSize: 15,
        lineHeight: 1.8,
        color: "#555",
        margin: 0,
    },
};