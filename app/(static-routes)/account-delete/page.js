import { activeBrand } from "@/app/env";
import { AppConfig } from "@/app/(core)/constants/AppConfig";

export const metadata = {
    title: "Delete My Account",
    description: "Learn how to delete your account. Step-by-step instructions for iOS, Android, and web.",
};

export default function AccountDeletePage() {
    const config = AppConfig[activeBrand]?.compliance_content?.account_delete;

    if (!config) {
        return (
            <div style={styles.wrapper}>
                <div style={styles.container}>
                    <h1 style={styles.title}>Account Deletion</h1>
                    <p style={styles.paragraph}>Content not available for this brand.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.wrapper}>
            <div style={styles.container}>
                <h1 style={styles.title}>{config.title}</h1>

                <p style={styles.paragraph}>
                    {config.intro}
                </p>

                <p style={styles.paragraph}>
                    {config.steps_intro}
                </p>

                {/* iOS / Android */}
                {config.ios && (
                    <section style={styles.section}>
                        <h2 style={styles.sectionTitle}>{config.ios.title}</h2>
                        <p style={styles.subtextMuted}>
                            {config.ios.subtext}
                        </p>
                        <ol style={styles.orderedList}>
                            {config.ios.steps.map((step, idx) => (
                                <li key={idx} style={styles.listItem}>{step}</li>
                            ))}
                        </ol>
                    </section>
                )}

                {/* Website */}
                {config.web && (
                    <section style={styles.section}>
                        <h2 style={styles.sectionTitle}>{config.web.title}</h2>
                        <p style={styles.subtextMuted}>
                            {config.web.subtext}
                        </p>
                        <ol style={styles.orderedList}>
                            {config.web.steps.map((step, idx) => (
                                <li key={idx} style={styles.listItem}>{step}</li>
                            ))}
                        </ol>
                    </section>
                )}

                {/* Things to Note */}
                {config.note && (
                    <section style={styles.noteBox}>
                        <h2 style={styles.noteTitle}>
                            {config.note.title}
                        </h2>
                        <ul style={styles.unorderedList}>
                            {config.note.points.map((point, idx) => (
                                <li key={idx} style={styles.listItem}>{point}</li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </div>
    );
}

const styles = {
    wrapper: {
        minHeight: "100vh",
        backgroundColor: "#fafafa",
        padding: "40px 16px 120px 16px", // Added 120px bottom padding (100px extra)
    },
    container: {
        maxWidth: 720,
        margin: "0 auto",
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: "40px 24px", // Adjusted padding for better mobile feel
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    },
    title: {
        fontSize: 28, // Slightly larger
        fontWeight: 800,
        color: "#1a1a1a",
        marginBottom: 24,
        borderBottom: "2px solid #f0f0f0",
        paddingBottom: 16,
        lineHeight: 1.2,
    },
    paragraph: {
        fontSize: 16, // Better readability
        lineHeight: 1.8,
        color: "#4a4a4a",
        marginBottom: 20,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 19,
        fontWeight: 700,
        color: "#222",
        marginBottom: 12,
    },
    subtextMuted: {
        fontSize: 14,
        color: "#888",
        marginBottom: 12,
        fontWeight: 500,
    },
    orderedList: {
        paddingLeft: 20,
        margin: 0,
    },
    unorderedList: {
        paddingLeft: 20,
        margin: 0,
    },
    listItem: {
        fontSize: 15,
        lineHeight: 1.9,
        color: "#444",
        marginBottom: 8,
    },
    noteBox: {
        backgroundColor: "#fffdf0",
        border: "1px solid #ffecb3",
        borderRadius: 10,
        padding: "24px",
        marginTop: 10,
    },
    noteTitle: {
        fontSize: 17,
        fontWeight: 700,
        color: "#bf360c",
        marginBottom: 12,
    },
};


