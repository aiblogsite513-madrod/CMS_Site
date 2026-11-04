# CHAMBER — Chamber Management System marketing website

A cinematic public product showcase for the **Chamber Management System**, with an animated 3D metallic orbit sculpture, GSAP scroll-driven reveals, Lenis smooth scrolling, React Bits–style interactive spotlight cards, and a clickable fictional product demo.

## Project files

- `index.html` — complete, semantic, responsive public marketing site; no account/login area.
- `style.css` — all design, layouts, responsive breakpoints, reduced-motion support, and CSS 3D scene fallback.
- `main.js` — interactions; GSAP + ScrollTrigger, Lenis, product demo tabs, accessible navigation, spotlight cards, contact copy.
- `scene.js` — three.js WebGL gyroscopic metal-and-glass sculpture. Degrades gracefully to CSS 3D if WebGL or CDN is unavailable.
- `assets/favicon.svg` — brand icon.
- `assets/social-preview.svg` — social sharing image (1200×630).

## Animation libraries and inspiration

This implementation deliberately needs **no build process** and can be uploaded to any static host. The CDN references load:

- [GSAP](https://github.com/greensock/GSAP) / ScrollTrigger — animated entrances, scroll scrubbing and parallax.
- [Lenis](https://github.com/darkroomengineering/lenis) — smooth scrolling synchronized with ScrollTrigger.
- [React Bits](https://github.com/DavidHDev/react-bits) — the **SpotlightCard** mouse-following radial illumination technique, ported to vanilla JS/CSS for this standalone site; the React Bits package/source is **not bundled** and no React runtime is needed. The component concept is credited here and in `main.js`.
- [Three.js](https://threejs.org/) — dynamic WebGL 3D sculpture when WebGL/CDN is available.

All content is original and the product demo is fictional. This marketing site never loads real case data or touches the court diary database. The online product demos are interactive visuals, **not a trial account**.

### Contact setup

Inquiry buttons open the visitor's configured email application with the address:

`madushangarodrigo@gmail.com`

No back-end, SMTP password, API key, analytics tracker or third-party contact form is required. Search `madushangarodrigo@gmail.com` in `index.html` and `main.js` to change the address.

## Deploy with Cloudflare Pages (browser only)

**Do not upload these files into the existing Cloudflare Worker CMS.** The marketing site is public and separate from the private Chamber Management System app and its D1 database.

**Option A — Direct Upload (easiest):**

1. Open Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Direct Upload** (interface naming may vary).
2. Upload the extracted folder contents, including `index.html`, `style.css`, `main.js`, `scene.js`, and `assets/`.
3. Select a project name, for example `chamber-marketing`.
4. Cloudflare supplies a `.pages.dev` URL. Verify that the page, product tabs and contact email work.
5. Later connect a dedicated domain or subdomain, such as `www.yourdomain.lk`, if you own it. Do not reuse the private app Worker address.

**Option B — GitHub:** create a separate public repository for these marketing files, connect it to Cloudflare Pages, and set **Build command: none**, **Output directory: `/`**. You can safely make the marketing repo public because it contains no credentials or real chamber case records.

## Local preview

For a no-installation preview, open `index.html` in a browser. Static content, layout, fictional product tabs, and CSS 3D fallback work immediately. WebGL modules may require an HTTP server instead of `file://`; the recommended deployment on Cloudflare Pages serves them over HTTPS. GSAP, Lenis, Google Fonts and Three.js need an internet connection to load from their CDNs. If unavailable, the page still displays and scrolls using native browser behavior.

## Accessibility and security

- Respects `prefers-reduced-motion` and uses CSS 3D fallback for disabled WebGL.
- Mobile navigation button uses `aria-expanded`; demonstration tabs use `aria-pressed`.
- Keyboard links/buttons and skip-to-content link.
- No login, user records, cookies, trackers or API routes.
- User-provided email address is used only in outbound `mailto:` links and explicit copy action.
- Feature descriptions reflect current app capabilities. In-app reminders are **not** represented as SMS, email or push notifications.

## Limitations

The marketing site is a public demonstration, not a production security assessment or an operational court diary. Current user-facing screenshots are fictional mockups; no legal client details are included. External JS enhancements may require access to the CDN; vendors and versions are explicit in `index.html` and `scene.js`.
