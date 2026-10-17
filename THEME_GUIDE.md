# 🎨 Theme Management Guide

This project features a **Single Source of Truth** architecture for local theme switching and multi-tenant live domain routing.

---

## ⚡ 1. How to Switch Themes Locally (In 5 Seconds)

Open: **`config/theme.config.js`**

Change **Line 7**:
```javascript
export const ACTIVE_THEME_KEY = "BELUXJEWEL";
```

Change it to any available theme key (e.g. `"SONASONS_APP"`, `"PROCATALOG"`, `"ELVEE"`, etc.):
```javascript
export const ACTIVE_THEME_KEY = "SONASONS_APP";
```

**Save the file. That's it!**
- Next.js dev server automatically connects to that theme's UI folder.
- SQLite automatically connects to that theme's database (`db/tenants/<domain>/ecommerce.db`).
- Header logos, brand names, and favicons automatically update.

---

## 📋 Available Theme Presets

| Preset Key | Tenant Domain | Theme UI Folder | Brand Key | Website Display Name |
| :--- | :--- | :--- | :--- | :--- |
| `BELUXJEWEL` | `beluxjewel.web` | `app/theme/beluxjewel.web` | `beluxjewel` | Belux Jewel |
| `SONASONS_WEB` | `nxtsonasons.web` | `app/theme/fgstore.web` | `Sonasons` | Sonasons |
| `SONASONS_APP` | `nxtmobileapp.web` | `app/theme/fgstore.mapp` | `SonasonsApp` | Sonasons App |
| `PROCATALOG` | `procatalog.web` | `app/theme/procatalog.web` | `Sonasons` | Procatalog |
| `ELVEE` | `nxtelvee.web` | `app/theme/elvee.web` | `Sonasons` | Elvee |
| `HOQ` | `nxthoq.web` | `app/theme/hoq.web` | `hoq` | HOQ |
| `DIAMONDTINE` | `nxtdiamondtine.web` | `app/theme/diamondtine.web` | `Sonasons` | Diamondtine |
| `JULIAN` | `nxtjulian.web` | `app/theme/julian.web` | `Sonasons` | Julian |
| `JULIAN4` | `nxtjulian4.web` | `app/theme/julian4.web` | `Sonasons` | Julian4 |
| `OMJIYASH` | `omjiyanshjewels.com` | `app/theme/fgstore.web` | `omjiyas` | Om Jiyansh |
| `SHREEDIAMOND` | `shreediamond.optigoapps.com`| `app/theme/fgstore.mapp` | `shreediamond` | Shree Diamond |
| `ELIOR` | `elior.optigoapps.com` | `app/theme/fgstore.mapp` | `EliorApp` | Elior |

---

## 🛠️ 2. How to Add a Brand New Theme (Step-by-Step)

Adding a completely new theme takes 4 simple steps:

### Step 1: Create the Theme UI Folder
Create your theme components under `app/theme/`:
```text
app/theme/mybrand.web/
├── layout.jsx
├── home/
│   └── page.jsx
└── ...
```

---

### Step 2: Register in `ThemeRouteResolver.js`
Open **`app/(core)/utils/ThemeRouteResolver.js`**:
Add your theme key to `resolveLayout` and `resolveHome`:
```javascript
export async function resolveLayout(themePage) {
  switch (themePage) {
    case "mybrand.web":
      return (await import("@/app/theme/mybrand.web/layout.jsx")).default;
    // ... existing cases
  }
}

export async function resolveHome(themePage) {
  switch (themePage) {
    case "mybrand.web":
      return (await import("@/app/theme/mybrand.web/home/page.jsx")).default;
    // ... existing cases
  }
}
```

---

### Step 3: Register in `ThemeMap.js` (For Live Production)
Open **`app/(core)/utils/ThemeMap.js`**:
Add your live domain so live requests route to your new layout:
```javascript
export const themeMap = {
  // Add your new domain here:
  "mybrand.web": { page: "mybrand.web" },
  "shop.mybrand.com": { page: "mybrand.web" },

  // ... existing domains
};
```

---

### Step 4: Add Preset in `config/theme.config.js` (For Local Development)
Open **`config/theme.config.js`**:
Add your new theme object under `THEMES`:
```javascript
  MYBRAND: {
    domain: "mybrand.web",          // Domain used for SQLite database folder
    page: "mybrand.web",            // Theme folder name in app/theme/
    brand: "mybrand",               // Brand key for AppConfig
    websiteName: "My Brand Jewel",  // Human-readable title
    logos: {
      web: "/WebSiteStaticImage/logoIcon/webLogo.png",
      white_logo: "/WebSiteStaticImage/logoIcon/webLogo.png",
      black_logo: "/WebSiteStaticImage/logoIcon/webLogo11.png",
      blackLogo: "/WebSiteStaticImage/logoIcon/webLogo11.png",
      mobile: "/WebSiteStaticImage/logoIcon/mobileLogo.png",
      favicon: "/optigo_favicon.ico",
    },
  },
```

Now you can test it locally anytime simply by setting:
```javascript
export const ACTIVE_THEME_KEY = "MYBRAND";
```

---

## 🧠 3. How It Works Under the Hood

```text
               config/theme.config.js
               ACTIVE_THEME_KEY = "BELUXJEWEL"
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
    [app/env.js]   [app/(core)/utils/env.js]   [db/tenantManager.js]
    • LocalSetup   • NEXT_APP_WEB              • Connects to:
    • activeBrand  • WEBSITE_NAME                db/tenants/beluxjewel.web/
                   • WEBSITE_DOMAINS             ecommerce.db
```

### Localhost vs Live Isolation
- **Localhost (`localhost:8012`)**:
  `getActiveTheme()` explicitly uses `NEXT_APP_WEB` from your active preset.
- **Live Domains (`sonasons.procatalog.in`, `nxt10.optigoapps.com`)**:
  `getActiveTheme()` uses the incoming host name directly. Live domains **never** fall back to or interfere with your local development theme.
