import './PrivacyPolicy.scss'


const SonasonsprivacyData = {
    introduction: {
        text: "At Sonasons, your privacy and trust are our highest priorities. We are committed to protecting the personal information you share with us. This Privacy Policy outlines how we collect, use, store, and protect your personal data when you visit our website, make a purchase, or engage with us in any other way."
    },
    sections: [
        {
            title: "Information We Collect",
            content: [
                {
                    subtitle: "Personal Identification Information:",
                    text: "We may collect personal information such as your name, email address, phone number, billing address, and shipping address when you place an order or contact us for customer service."
                },
                {
                    subtitle: "Usage Data:",
                    text: "We may collect data about how you use our website, including information such as your IP address, browser type, pages viewed, and time spent on the site."
                },
                {
                    subtitle: "Cookies and Tracking Technologies:",
                    text: "We use cookies to enhance your browsing experience and analyze trends. Cookies help us remember your preferences and track your activity on the website."
                }
            ]
        },
        {
            title: "How We Use Your Information",
            content: [
                {
                    subtitle: "Order Processing:",
                    text: "We use the personal data we collect to process your orders, complete transactions, and deliver products to you."
                },
                {
                    subtitle: "Customer Service:",
                    text: "Your information helps us respond to inquiries, resolve issues, and provide you with support regarding your orders and products."
                },
                {
                    subtitle: "Marketing Communications:",
                    text: "We may send promotional emails about new products, offers, or events with your consent. You can opt-out of marketing emails at any time."
                },
                {
                    subtitle: "Website Improvement:",
                    text: "We analyze your usage data to enhance our website, improve customer experience, and personalize your shopping experience."
                }
            ]
        },
        {
            title: "Data Protection and Security",
            content: [
                {
                    subtitle: "How We Protect Your Data:",
                    text: "We implement various security measures to protect your personal data from unauthorized access, misuse, or loss. All sensitive information is transmitted via secure SSL encryption."
                },
                {
                    subtitle: "Data Sharing:",
                    text: "We do not share your personal information with third parties for marketing purposes. However, we may share your data with trusted service providers who assist in processing payments, fulfilling orders, and sending emails."
                }
            ]
        },
        {
            title: "Your Rights",
            content: [
                {
                    subtitle: "Access and Correction:",
                    text: "You can request access to your personal data and correct any inaccuracies in the information we hold."
                },
                {
                    subtitle: "Opt-out of Marketing Communications:",
                    text: "You may choose to unsubscribe from our promotional emails at any time by clicking the 'unsubscribe' link in the email."
                },
                {
                    subtitle: "Data Deletion:",
                    text: "You have the right to request the deletion of your personal data, subject to legal requirements and contractual obligations."
                }
            ]
        },
        {
            title: "Cookies and Tracking Technologies",
            content: [
                {
                    subtitle: "Cookies:",
                    text: "We use cookies to enhance your experience, track activity, and analyze trends. You can control cookies through your browser settings, but disabling them may affect some site features."
                },
                {
                    subtitle: "Other Tracking Technologies:",
                    text: "In addition to cookies, we may use web beacons, pixels, or similar technologies to collect data on your interactions with our site."
                }
            ]
        },
        {
            title: "Changes to This Privacy Policy",
            content: [
                {
                    subtitle: "Policy Updates:",
                    text: "We reserve the right to update this Privacy Policy. Any changes will be posted on this page, and the 'Effective Date' will be updated accordingly."
                },
                {
                    subtitle: "Continued Use:",
                    text: "By continuing to use our website after changes to this policy, you consent to the updated terms."
                }
            ]
        }
    ],
    conclusion: {
        text: "At Sonasons, we value your privacy and are dedicated to ensuring that your personal information is handled with care. If you have any questions or concerns about this Privacy Policy, please don't hesitate to reach out to us."
    }
};


export default function PrivacyPolicy() {
    const privacyData = SonasonsprivacyData
    return (
        <div className='smr_about_mainDiv'>
            <div className='daimondsEveryAbout'>
                <div className='smr_daimondsEveryAbout_sub' style={{ paddingBottom: '80px', minHeight: '400px' }}>
                    <div className="smrPr-terms">
                        <main className="smrPr-main">
                            <h1 className="smrPr-title">Privacy Policy</h1>
                            <div className="smrPr-content">
                                <p className="smrPr-introduction">{privacyData.introduction.text}</p>
                                {privacyData.sections.map((section, index) => (
                                    <section key={index} className="smrPr-section">
                                        <h2 className="smrPr-section-title">{section.title}</h2>
                                        {section.content.map((item, itemIndex) => (
                                            <div key={itemIndex} className="smrPr-section-content">
                                                <h3 className="smrPr-subtitle">{item.subtitle}</h3>
                                                <p className="smrPr-text">{item.text}</p>
                                            </div>
                                        ))}
                                    </section>
                                ))}
                                <p className="smrPr-conclusion">{privacyData.conclusion.text}</p>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    )
}

