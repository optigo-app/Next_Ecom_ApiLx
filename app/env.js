import { ACTIVE_THEME } from "../config/theme.config.js";

/**
 * ==========================================================================================
 * LOCAL ENVIRONMENT CONFIGURATION
 * LocalSetup and activeBrand are automatically derived from the central config:
 * config/theme.config.js.
 * 
 * To switch themes locally, change ACTIVE_THEME_KEY in config/theme.config.js.
 * ==========================================================================================
 */
export const LocalSetup = ACTIVE_THEME?.page;
export const activeBrand = ACTIVE_THEME?.brand;
