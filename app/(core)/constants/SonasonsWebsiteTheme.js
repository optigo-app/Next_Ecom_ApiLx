export const COLORS = {
  primary: "#000000",      // black
  white: "#ffffff",
  border: "#dcdcdc",
  selected: "#333333",     // dark gray
  hover: "#111111",
};


export const getButtonStyle = (active, customStyle = {}) => ({
  borderRadius: "5px",
  textTransform: "none",
  fontSize: "0.8rem",
  display: "flex",
  alignItems: "center",
  gap: 1,

  backgroundColor: active ? COLORS.primary : COLORS.white,
  color: active ? COLORS.white : COLORS.primary,
  border: `1px solid ${COLORS.border}`,

  "&:hover": {
    backgroundColor: active ? COLORS.hover : "#f5f5f5",
    boxShadow: 'none',
  },
  boxShadow: 'none',
  py: 1,
  ...customStyle
});
