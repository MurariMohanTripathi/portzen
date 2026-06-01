# PortZen

PortZen is a production-minded developer portfolio builder for software engineers, students, freelancers, and founders. It helps users publish SEO-ready portfolio websites with projects, experience, resume links, developer blogs, custom themes, analytics, and public username URLs.

## Features

- Public developer portfolios at `/:username`
- Dedicated developer blog index at `/:username/developer-blog`
- Individual blog post pages at `/:username/developer-blog/:postSlug`
- Dashboard editor for overview, profile, projects, experience, templates, custom code, blog posts, and settings
- Dynamic sections for hero, about, skills, projects, experience, education, certifications, achievements, contact, social links, resume, custom fields, and custom HTML
- Project CMS with tech stack, GitHub URL, live URL, cover image, featured flag, and uploads
- Developer blog with title, topic, SEO description, full post body, slug URLs, and optional separate blog theme
- Theme designer with presets, color controls, fonts, surface colors, and contrast balancing
- Live preview with desktop, tablet, and mobile modes
- Custom code mode for fully custom HTML/CSS portfolios
- GitHub profile sync and connected public links
- Firebase Authentication, Firestore, Storage, Hosting, and Functions support
- Admin dashboard for users, analytics, templates, and settings
- SEO foundation with canonical tags, Open Graph tags, Twitter cards, JSON-LD, `robots.txt`, `sitemap.xml`, and social preview image

## Routes

- Landing page: `/`
- Auth: `/login`, `/signup`, `/forgot-password`
- Dashboard: `/dashboard/overview`, `/dashboard/edit`, `/dashboard/projects`, `/dashboard/experience`, `/dashboard/templates`, `/dashboard/code`, `/dashboard/stories`, `/dashboard/settings`
- Admin: `/admin/:adminUsername`, `/admin/:adminUsername/users`, `/admin/:adminUsername/analytics`, `/admin/:adminUsername/templates`, `/admin/:adminUsername/settings`
- Public portfolio: `/:username`
- Developer blog: `/:username/developer-blog`
- Blog post: `/:username/developer-blog/:postSlug`
- Template preview: `/preview/:template`

## SEO

PortZen includes practical SEO building blocks for both the main product site and user portfolios:

- `index.html` contains default title, description, keywords, canonical URL, Open Graph, Twitter card, theme color, verification, manifest, and SoftwareApplication JSON-LD.
- `src/utils/seo.js` updates page-level metadata at runtime for landing pages, dashboard pages, public portfolios, developer blog indexes, and blog posts.
- User portfolios use profile-focused metadata and Person JSON-LD.
- Blog posts use article metadata and BlogPosting JSON-LD.
- `public/robots.txt` points crawlers to `public/sitemap.xml`.
- `public/og-image.svg` provides a branded social preview image.

Search ranking is not guaranteed by metadata alone. Real ranking also depends on useful public content, crawlability, page speed, backlinks, domain authority, indexing, and consistent publishing.

## Architecture

- `src/contexts` contains auth and session providers.
- `src/services` contains Firebase and API service logic.
- `src/templates` contains data-compatible template renderers.
- `src/themes` contains public portfolio themes.
- `src/components/portfolio` contains dynamic section rendering, custom HTML rendering, drag and drop, and editor components.
- `src/components/layout/SiteFooter.jsx` contains the theme-aware footer.
- `src/pages/Dashboard.jsx` contains the main portfolio editor, blog editor, settings, templates, stories, projects, and live preview flows.
- `src/pages/DeveloperBlogPage.jsx` renders public blog indexes.
- `src/pages/DeveloperBlogPostPage.jsx` renders individual public blog posts.
- `server/src` contains the Express API exported as a Firebase Function.

## Commands

```bash
npm run dev
npm run api:dev
npm run build
npm run lint
npm run deploy
```

## Environment

Frontend admin access uses `VITE_SUPERADMIN_EMAIL` or comma-separated `VITE_SUPERADMIN_EMAILS`.

For local frontend development against a separately running API, set:

```env
VITE_DEV_API_PROXY=http://localhost:8080
```

The Vite dev server proxies `/api` to that backend, so local save requests do not 404 at `localhost:5173`.

Local development defaults to `VITE_USE_CLIENT_FIRESTORE=true` so you can save and preview without a Firebase Admin service account. Set it to `false` when testing the local Express backend, and put a real `FIREBASE_SERVICE_ACCOUNT` JSON value in `server/.env`.

Firebase Functions can use:

```env
CLIENT_ORIGIN=https://your-firebase-hosting-domain.web.app
SUPERADMIN_EMAILS=admin@example.com
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

On Firebase Hosting, `/api/**` is rewritten to the `api` Cloud Function and the React app is served from `dist`.
