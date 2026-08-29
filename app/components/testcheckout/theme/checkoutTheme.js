"use client";

import React, { createContext, useContext, useMemo } from "react";

/**
 * Belux Jewel Theme Color Palette
 * Warm caramel gold & soft linen tints.
 */
export const beluxCheckoutTheme = {
  name: "beluxjewel",
  // Primary brand accent (Buttons, highlights, active states)
  primary: "#cca182",
  // Hover state for primary buttons & interactive elements
  primaryHover: "#b88d6e",
  // Active / pressed state
  primaryActive: "#a67c5d",
  // Light background tint (Selected cards, edit mode background, badges)
  primaryLight: "#faf4ee",
  // Soft border for selected / focused cards and inputs
  primaryLightBorder: "#edd8c7",
  // High-contrast primary text for totals & highlights
  primaryText: "#9c6d48",
  // Button text color
  btnColor: "#ffffff",
  // "Deliver Here" / Status badge background & text
  badgeBg: "#f5e8dd",
  badgeText: "#8d613e",
  // Brand accent
  accent: "#cca182",
  // Success state for order completion
  success: "#16a34a",
  successLight: "#f0fdf4",
  successBorder: "#dcfce7",
};

/**
 * Julian Theme Color Palette
 * Deep midnight navy blue & cool ice-slate tints with gold accents.
 */
export const julianCheckoutTheme = {
  name: "julian",
  // Primary brand accent (Buttons, highlights, active states)
  primary: "#0d1232",
  // Hover state for primary buttons & interactive elements
  primaryHover: "#1c2559",
  // Active / pressed state
  primaryActive: "#070b20",
  // Light background tint (Selected cards, edit mode background, badges)
  primaryLight: "#f1f4fa",
  // Soft border for selected / focused cards and inputs
  primaryLightBorder: "#cad6eb",
  // High-contrast primary text for totals & highlights
  primaryText: "#0d1232",
  // Button text color
  btnColor: "#ffffff",
  // "Deliver Here" / Status badge background & text
  badgeBg: "#e3ebf7",
  badgeText: "#0d1232",
  // Julian Gold Accent
  accent: "#1c2559",
  // Success state for order completion
  success: "#16a34a",
  successLight: "#f0fdf4",
  successBorder: "#dcfce7",
};

/**
 * Default fallback theme
 */
export const defaultCheckoutTheme = beluxCheckoutTheme;

/**
 * Available theme presets
 */
export const checkoutThemePresets = {
  beluxjewel: beluxCheckoutTheme,
  "beluxjewel.web": beluxCheckoutTheme,
  julian: julianCheckoutTheme,
  "julian.web": julianCheckoutTheme,
  "julian4.web": julianCheckoutTheme,
  default: defaultCheckoutTheme,
};

/**
 * Helper to get theme preset by brand or domain name
 */
export function getCheckoutThemeByBrand(brandOrDomain) {
  if (!brandOrDomain) return defaultCheckoutTheme;
  const key = String(brandOrDomain).toLowerCase();
  if (key.includes("julian")) return julianCheckoutTheme;
  if (key.includes("belux")) return beluxCheckoutTheme;
  return checkoutThemePresets[key] || defaultCheckoutTheme;
}

/**
 * Builds a complete checkout theme object and its corresponding CSS variables.
 * Accepts: a theme object, a brand name string (e.g. "julian"), or undefined.
 */
export function buildCheckoutTheme(customTheme = {}, fallbackBrand) {
  let baseTheme = defaultCheckoutTheme;

  if (typeof customTheme === "string") {
    baseTheme = getCheckoutThemeByBrand(customTheme);
    customTheme = {};
  } else if (fallbackBrand) {
    baseTheme = getCheckoutThemeByBrand(fallbackBrand);
  } else if (customTheme?.name && checkoutThemePresets[customTheme.name]) {
    baseTheme = checkoutThemePresets[customTheme.name];
  }

  const primary = customTheme?.primary || baseTheme.primary;

  const theme = {
    ...baseTheme,
    ...customTheme,
    primary,
    primaryHover: customTheme?.primaryHover || baseTheme.primaryHover,
    primaryActive: customTheme?.primaryActive || baseTheme.primaryActive,
    primaryLight: customTheme?.primaryLight || baseTheme.primaryLight,
    primaryLightBorder: customTheme?.primaryLightBorder || baseTheme.primaryLightBorder,
    primaryText: customTheme?.primaryText || baseTheme.primaryText,
    btnColor: customTheme?.btnColor || baseTheme.btnColor,
    badgeBg: customTheme?.badgeBg || baseTheme.badgeBg,
    badgeText: customTheme?.badgeText || baseTheme.badgeText,
    accent: customTheme?.accent || baseTheme.accent,
  };

  const cssVariables = {
    "--checkout-primary": theme.primary,
    "--checkout-primary-hover": theme.primaryHover,
    "--checkout-primary-active": theme.primaryActive,
    "--checkout-primary-light": theme.primaryLight,
    "--checkout-primary-light-border": theme.primaryLightBorder,
    "--checkout-primary-text": theme.primaryText,
    "--checkout-btn-color": theme.btnColor,
    "--checkout-badge-bg": theme.badgeBg,
    "--checkout-badge-text": theme.badgeText,
    "--checkout-accent": theme.accent,
    "--checkout-success": theme.success,
    "--checkout-success-light": theme.successLight,
    "--checkout-success-border": theme.successBorder,
  };

  return { theme, cssVariables };
}

const CheckoutThemeContext = createContext(defaultCheckoutTheme);

/**
 * Checkout Theme Provider
 * Injects CSS variables and provides theme object via React Context.
 */
export function CheckoutThemeProvider({ theme: userTheme, fallbackBrand, children }) {
  const { theme, cssVariables } = useMemo(
    () => buildCheckoutTheme(userTheme, fallbackBrand),
    [userTheme, fallbackBrand]
  );

  return (
    <CheckoutThemeContext.Provider value={theme}>
      <div
        className="testCheckout_theme_root"
        style={{ display: "contents", ...cssVariables }}
      >
        {children}
      </div>
    </CheckoutThemeContext.Provider>
  );
}

/**
 * Hook to consume checkout theme in any child component
 */
export function useCheckoutTheme() {
  const context = useContext(CheckoutThemeContext);
  return context || defaultCheckoutTheme;
}
