import { NEXT_APP_WEB } from "./env";

const DEFAULT_FOOTER_LINKS = [
    {
        label: "About Us",
        href: "/aboutUs",
    },
    {
        label: "Shipping Policy",
        href: "/shipping-policy",
    },
    {
        label: "Refund Policy",
        href: "/refund-policy",
    },
    {
        label: "Privacy Policy",
        href: "/privacyPolicy",
    },
    {
        label: "Terms & Conditions",
        href: "/terms-and-conditions",
    },
];

// francis custom footer routes
const FRANCIS_FOOTER_LINKS = [
    {
        label: "About Us",
        href: "/aboutUs",
    },
    {
        label: "Contact Us",
        href: "/contactUs",
    },
    {
        label: "Privacy Policy",
        href: "/privacyPolicy",
    },
    {
        label: "Terms & Conditions",
        href: "/terms-and-conditions",
    },
];

export const domainHtmlMap = {
    "nxt10.optigoapps.com": DEFAULT_FOOTER_LINKS,
    "nxt26.optigoapps.com": DEFAULT_FOOTER_LINKS,
    "thereflections.procatalog.in": DEFAULT_FOOTER_LINKS,
    "almacarino.procatalog.in": DEFAULT_FOOTER_LINKS,
    "uscreation.procatalog.in": DEFAULT_FOOTER_LINKS,
    "hemratnajewels.procatalog.in": DEFAULT_FOOTER_LINKS,
    "myras.procatalog.in": DEFAULT_FOOTER_LINKS,
    "fabgold.procatalog.in": DEFAULT_FOOTER_LINKS,
    "glossyjewel.procatalog.in": DEFAULT_FOOTER_LINKS,
    "demo.procatalog.in": DEFAULT_FOOTER_LINKS,
    "company.procatalog.in": DEFAULT_FOOTER_LINKS,
    "test.procatalog.in": DEFAULT_FOOTER_LINKS,
    "localhost:5006": DEFAULT_FOOTER_LINKS,
    "localhost:8006": DEFAULT_FOOTER_LINKS,
    "localhost:3000": DEFAULT_FOOTER_LINKS,
    "localhost:4000": DEFAULT_FOOTER_LINKS,
    'procatalog.web': DEFAULT_FOOTER_LINKS,
    'beta.procatalog.web': DEFAULT_FOOTER_LINKS,
    'jeweliita.procatalog.in': DEFAULT_FOOTER_LINKS,
    "localhost:8012": DEFAULT_FOOTER_LINKS,
    "francisdiamonds.procatalog.in": FRANCIS_FOOTER_LINKS,
    'sakungems.procatalog.in': DEFAULT_FOOTER_LINKS,
    "sonasons.procatalog.in": DEFAULT_FOOTER_LINKS,
    "laado.procatalog.in": DEFAULT_FOOTER_LINKS
};

export function getFooterLinks(host) {
    const domain = host || NEXT_APP_WEB;
    const list = domainHtmlMap[domain] || DEFAULT_FOOTER_LINKS;

    return list;
}
