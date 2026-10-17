# 🎨 Theme Configuration Directory

The central source of truth for all themes, brands, domains, and logos is located in:
👉 **[`theme.config.js`](./theme.config.js)**

### Quick Switch
To switch local theme, open [`theme.config.js`](./theme.config.js) and change `ACTIVE_THEME_KEY`:
```javascript
export const ACTIVE_THEME_KEY = "BELUXJEWEL"; // or "SONASONS_APP", "PROCATALOG", etc.
```

📖 **Full Step-by-Step Guide**: See **[`../THEME_GUIDE.md`](../THEME_GUIDE.md)** for instructions on adding brand new themes and understanding how multi-tenant routing works.
