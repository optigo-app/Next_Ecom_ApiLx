export const COLORS = {
    primary: "#000000", // black
    white: "#ffffff",
    border: "#dcdcdc",
    selected: "#333333", // dark gray
    hover: "#111111",
};

export const FgstoreWeb = {
    Default: {
        primary: "#000000",
        white: "#ffffff",
        border: "#dcdcdc",
        selected: "#333333",
        hover: "#111111",
    },
    Omjiyas: {
        primary: "#0d6efd", // 🔵 blue primary
        white: "#ffffff",
        border: "#dcdcdc",
        selected: "#0a58ca", // darker blue
        hover: "#084298",

        // 👇 Blue glass / blur colors
        blurBlue: "rgba(13, 110, 253, 0.25)",   // light blue blur
        blurBlueStrong: "rgba(13, 110, 253, 0.5)", // strong blue blur
    },
};

export const IsSonasons = true;



export const CurrentactiveTheme = FgstoreWeb.Omjiyas;

export const getButtonStyle = (active, customStyle = {}) => ({
    borderRadius: "5px",
    textTransform: "none",
    fontSize: "0.8rem",
    display: "flex",
    alignItems: "center",
    gap: 1,

    backgroundColor: active ? activeTheme.primary : activeTheme.white,
    color: active ? activeTheme.white : activeTheme.primary,
    border: `1px solid ${activeTheme.border}`,

    "&:hover": {
        backgroundColor: active ? activeTheme.hover : "#f5f5f5",
        boxShadow: "none",
    },
    boxShadow: "none",
    py: 1,
    ...customStyle,
});
