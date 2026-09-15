# Great Yellow OS — Prototype

An interactive, clickable prototype of the Great Yellow operating system.

## How to open

Open **`index.html`** (or `home.html`) in a web browser — double-click it, or drag it into Chrome/Safari/Edge. No install or server needed.

Best viewed on a desktop browser. An internet connection is recommended: icons and two web fonts load from a CDN, though the main display font is embedded and the prototype works offline (with plainer fallback fonts/icons).

## Where to start

`home.html` is the cockpit. From the left sidebar you can reach:

- **Home** — the daily cockpit, with the in-page workflow drawer.
- **Workflows** — Demand Mapping and Investor Q&A Log canvas prototypes (add `?mode=edit` to a canvas URL for editor mode).
- **Inventory** (Portfolio scope) — Portfolio Dashboard, All Inventory, Ecosystem Services (BNG / WCC), and a programme example (Denton Reserve).
- **Market Map (Kwame)** and **Outcome Engine (I2O)** — portfolio-level intelligence tools.
- **Hive Mind Library** — the ecosystem-service rule books (Carbon opens as a full page).
- **Documents**, **Meeting Notes**, and supporting pages.

## Notes

- It's a design prototype: most action buttons show a toast rather than performing real work, and data is illustrative.
- The sidebar width is draggable and persists (stored locally in the browser).
- Shared look-and-feel lives in `gy-shell.css`, `gy-nav.js`, `gy-canvas.*`, and the embedded display font in `gy-manner-font.css` — keep all files together in this folder.
