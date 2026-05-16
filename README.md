# PortZen

Production-minded customizable developer portfolio builder SaaS built with React, Vite, Tailwind CSS, Firebase Authentication, Firestore, Firebase Hosting, and Firebase Functions.

## Frontend

- Landing page: `/`
- Auth: `/login`, `/signup`, `/forgot-password`
- Dashboard: `/dashboard/overview`, `/dashboard/edit`, `/dashboard/projects`, `/dashboard/experience`, `/dashboard/templates`, `/dashboard/settings`, `/dashboard/stories`
- Admin: `/admin/users`, `/admin/analytics`, `/admin/templates`, `/admin/settings`
- Public portfolio: `/:username`
- Template preview: `/preview/:template`

## Architecture

- `src/contexts` contains auth/session providers.
- `src/services` contains API clients for the Firebase Functions backend.
- `src/templates` contains data-compatible template renderers.
- `src/components/portfolio` contains dynamic section and custom component rendering.
- `src/pages/Dashboard.jsx` contains live preview editing, stories, projects, templates, and settings flows.
- `server/src` contains the Express API exported as a Firebase Function. It uses Firebase Admin SDK with Firestore for portfolios, usernames, users, analytics, and admin actions.

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
