import { activeBrand } from "@/app/env";
import { AppConfig } from "@/app/(core)/constants/AppConfig";

export const metadata = {
    title: "Copyright",
    description: "Copyright information. All rights reserved.",
};

export default function CopyrightPage() {
    const config = AppConfig[activeBrand]?.compliance_content?.copyright;

    if (!config) {
        return (
            <div style={styles.wrapper}>
                <div style={styles.container}>
                    <h1 style={styles.title}>Copyright</h1>
                    <p style={styles.paragraph}>Content not available for this brand.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.wrapper}>
            <div style={styles.container}>
                <h1 style={styles.title}>{config.title}</h1>

                <section style={styles.copyrightSection}>
                    <h2 style={styles.copyrightNotice}>
                        {config.notice}
                    </h2>

                    <p style={styles.paragraph}>
                        &ldquo;{config.paragraph}&rdquo;
                    </p>

                    <div style={styles.contactNoteBox}>
                        <p style={styles.contactNote}>
                            {config.contact_note}
                        </p>

                        <div style={styles.contactRow}>
                            <span style={styles.contactLabel}>Phone:</span>
                            <a href={`tel:${config.phone.replace(/[^0-9+]/g, '')}`} style={styles.contactLink}>
                                {config.phone}
                            </a>
                        </div>
                        <div style={styles.contactRow}>
                            <span style={styles.contactLabel}>Email:</span>
                            <a
                                href={`mailto:${config.email}`}
                                style={styles.contactLink}
                            >
                                {config.email}
                            </a>
                        </div>
                    </div>
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
    copyrightSection: {
        marginTop: 10,
    },
    copyrightNotice: {
        fontSize: 20,
        fontWeight: 800,
        color: "#333",
        marginBottom: 20,
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 1.9,
        color: "#4a4a4a",
        marginBottom: 32,
    },
    contactNoteBox: {
        backgroundColor: "#f8f9fa",
        borderRadius: 12,
        padding: "28px",
        borderLeft: "5px solid #424242",
        boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    },
    contactNote: {
        fontSize: 15,
        fontWeight: 700,
        color: "#555",
        marginBottom: 16,
    },
    contactRow: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 8,
    },
    contactLabel: {
        fontSize: 14,
        fontWeight: 700,
        color: "#666",
        minWidth: 55,
    },
    contactLink: {
        fontSize: 15,
        color: "#1565c0",
        textDecoration: "none",
        fontWeight: 500,
    },
};