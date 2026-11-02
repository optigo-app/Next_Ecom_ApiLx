/**
 * Pure helper function to normalize raw website color / theme configuration
 * into clean, typed properties and CSS variables for both Server and Client environments.
 *
 * NOTE: Preserves real database values; does not invent fake fallbacks when data is absent.
 */

export function normalizeWebThemeColor(rawColorData = {}) {
  const data = (Array.isArray(rawColorData) ? rawColorData[0] : rawColorData) || {};

  const id = data.id != null ? Number(data.id) : null;
  const storeId = data.store_id != null ? Number(data.store_id) : (data.storeId != null ? Number(data.storeId) : null);
  const domainName = data.domain_name || data.domainName || null;
  const ufcc = data.ufcc || null;

  const primaryThemeColor = data.primary_theme_color ?? data.primaryThemeColor ?? null;
  const primaryThemeBg = data.primary_theme_bg ?? data.primaryThemeBg ?? null;
  const stickyHeaderBg = data.sticky_header_bg ?? data.stickyHeaderBg ?? null;
  const btnMainBg = data.btn_main_bg ?? data.btnMainBg ?? null;
  const btnMainText = data.btn_main_text ?? data.btnMainText ?? null;
  const btnMainBorder = data.btn_main_border ?? data.btnMainBorder ?? null;
  const btnProductBg = data.btn_product_bg ?? data.btnProductBg ?? null;
  const btnProductText = data.btn_product_text ?? data.btnProductText ?? null;
  const btnProductBorder = data.btn_product_border ?? data.btnProductBorder ?? null;
  const btnProductBorderRadius = data.btn_product_border_radius ?? data.btnProductBorderRadius ?? null;
  const btnRemoveCartBg = data.btn_remove_cart_bg ?? data.btnRemoveCartBg ?? null;
  const btnRemoveCartText = data.btn_remove_cart_text ?? data.btnRemoveCartText ?? null;
  const btnRemoveCartBorder = data.btn_remove_cart_border ?? data.btnRemoveCartBorder ?? null;
  const btnRemoveCartBorderRadius = data.btn_remove_cart_border_radius ?? data.btnRemoveCartBorderRadius ?? null;
  const iconColor = data.icon_color ?? data.iconColor ?? null;
  const iconRemoveColor = data.icon_remove_color ?? data.iconRemoveColor ?? null;

  // Build CSS variables object for dynamic root/container injection
  const cssVariables = {};
  if (primaryThemeColor) cssVariables["--primary-theme-color"] = primaryThemeColor;
  if (primaryThemeBg) cssVariables["--primary-theme-bg"] = primaryThemeBg;
  if (stickyHeaderBg) cssVariables["--sticky-header-bg"] = stickyHeaderBg;
  if (btnMainBg) cssVariables["--btn-main-bg"] = btnMainBg;
  if (btnMainText) cssVariables["--btn-main-text"] = btnMainText;
  if (btnMainBorder) cssVariables["--btn-main-border"] = btnMainBorder;
  if (btnProductBg) cssVariables["--btn-product-bg"] = btnProductBg;
  if (btnProductText) cssVariables["--btn-product-text"] = btnProductText;
  if (btnProductBorder) cssVariables["--btn-product-border"] = btnProductBorder;
  if (btnProductBorderRadius) cssVariables["--btn-product-border-radius"] = btnProductBorderRadius;
  if (btnRemoveCartBg) cssVariables["--btn-remove-cart-bg"] = btnRemoveCartBg;
  if (btnRemoveCartText) cssVariables["--btn-remove-cart-text"] = btnRemoveCartText;
  if (btnRemoveCartBorder) cssVariables["--btn-remove-cart-border"] = btnRemoveCartBorder;
  if (btnRemoveCartBorderRadius) cssVariables["--btn-remove-cart-border-radius"] = btnRemoveCartBorderRadius;
  if (iconColor) cssVariables["--icon-color"] = iconColor;
  if (iconRemoveColor) cssVariables["--icon-remove-color"] = iconRemoveColor;

  return {
    raw: data,
    id,
    storeId,
    domainName,
    ufcc,
    primaryThemeColor,
    primaryThemeBg,
    stickyHeaderBg,
    btnMainBg,
    btnMainText,
    btnMainBorder,
    btnProductBg,
    btnProductText,
    btnProductBorder,
    btnProductBorderRadius,
    btnRemoveCartBg,
    btnRemoveCartText,
    btnRemoveCartBorder,
    btnRemoveCartBorderRadius,
    iconColor,
    iconRemoveColor,
    cssVariables,
  };
}

export default normalizeWebThemeColor;
