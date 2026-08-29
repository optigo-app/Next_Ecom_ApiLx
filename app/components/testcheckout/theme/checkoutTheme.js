"use client";

import React, { createContext, useContext, useMemo } from "react";

/**
 * Default Belux Jewel Theme Color Palette
 * Clean, customizable color tokens for Unified Cart & Checkout.
 */
export const defaultCheckoutTheme = {
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
  // Success state for order completion
  success: "#16a34a",
  successLight: "#f0fdf4",
  successBorder: "#dcfce7",
};

/**
 * Builds a complete checkout theme object and its corresponding CSS variables.
 * Allows passing a partial theme or custom colors.
 */
export function buildCheckoutTheme(customTheme = {}) {
  const primary = customTheme?.primary || defaultCheckoutTheme.primary;

  const theme = {
    ...defaultCheckoutTheme,
    ...customTheme,
    primary,
    primaryHover: customTheme?.primaryHover || defaultCheckoutTheme.primaryHover,
    primaryActive: customTheme?.primaryActive || defaultCheckoutTheme.primaryActive,
    primaryLight: customTheme?.primaryLight || defaultCheckoutTheme.primaryLight,
    primaryLightBorder: customTheme?.primaryLightBorder || defaultCheckoutTheme.primaryLightBorder,
    primaryText: customTheme?.primaryText || defaultCheckoutTheme.primaryText,
    btnColor: customTheme?.btnColor || defaultCheckoutTheme.btnColor,
    badgeBg: customTheme?.badgeBg || defaultCheckoutTheme.badgeBg,
    badgeText: customTheme?.badgeText || defaultCheckoutTheme.badgeText,
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
export function CheckoutThemeProvider({ theme: userTheme, children }) {
  const { theme, cssVariables } = useMemo(
    () => buildCheckoutTheme(userTheme),
    [userTheme]
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
