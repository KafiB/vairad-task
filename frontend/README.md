# Frontend — Vairad Task

This repository contains the Next.js + TypeScript frontend for the TaskAnnotate application (task management + image annotation). This README documents how to run the frontend locally, build for production, and deploy to Vercel — covering everything needed for contributors and for production deployment.

**Quick summary**
- Framework: Next.js (app router)
- Language: TypeScript
- Styling: Tailwind CSS / PostCSS
- State: Zustand
- Forms: react-hook-form + zod

View core frontend code:
- API helpers: [frontend/lib/api.ts](frontend/lib/api.ts#L1-L200)
- Tasks API: [frontend/lib/tasksApi.ts](frontend/lib/tasksApi.ts#L1-L200)
- Annotation canvas: [frontend/components/annotate/AnnotationCanvas.tsx](frontend/components/annotate/AnnotationCanvas.tsx#L1-L200)

## Prerequisites
- Node.js 18+ (LTS recommended)
- npm, pnpm, or yarn
- A running backend API (see backend/README) or a reachable API URL

## Environment variables
Copy the example and set values:

```bash
cp .env.local.example .env.local
```

Important variables (examples):

- `NEXT_PUBLIC_API_BASE_URL` — URL of the backend API (e.g. `http://localhost:8000/api`)
- `NEXT_PUBLIC_SENTRY_DSN` — optional Sentry DSN for error tracking
- `NEXT_PUBLIC_ANALYTICS_ID` — optional analytics id

Open [frontend/.env.local.example](frontend/.env.local.example) to see all variables the app reads.

## Local development

1. Install dependencies

```bash
npm install
# or
pnpm install
# or
yarn
```

2. Start the dev server

```bash
npm run dev
```

3. Open the app

Visit http://localhost:3000. Use a backend account (register via UI if needed) or seed data from the backend.

## Build & run production locally

1. Build

```bash
npm run build
```

2. Run production server

```bash
npm run start
```

3. Verify

Open http://localhost:3000 and test flows (login, task board, annotate).

## Scripts
- `dev` — runs the Next.js dev server
- `build` — produces a production build
- `start` — runs the production server
- `lint` — runs ESLint

Check `package.json` for full script names and details.

## Vercel deployment (step-by-step)
This project is configured for seamless deployment on Vercel (recommended for Next.js). Below are instructions to deploy via the Vercel dashboard or CLI and tips for environment configuration and common issues.

1) Deploy via Git (recommended)

- Push your repository to GitHub, GitLab or Bitbucket.
- On Vercel, click "New Project" → Import your repo.
- When prompted, pick the root directory: `frontend` (important if monorepo)
- Framework Preset: Next.js (auto-detected)
- Build Command: `npm run build` (or `pnpm build` / `yarn build`)
- Install Command: `npm ci` (optional)
- Output Directory: Leave blank (Next.js app router manages output)

Add environment variables in the Vercel dashboard under Settings → Environment Variables:

- `NEXT_PUBLIC_API_BASE_URL` — production backend URL (e.g. `https://api.myapp.com`)
- Any other `NEXT_PUBLIC_*` vars shown in `.env.local.example`

Set each variable for both Preview and Production environments as appropriate.

2) Deploy via Vercel CLI

```bash
npm i -g vercel
cd frontend
vercel login
vercel --prod
```

During the interactive CLI flow, specify the project root as `frontend` if asked, and add environment variables via the dashboard or using `vercel env add`.

3) Common Vercel settings and tips

- Node version: Vercel uses the `engines` field from `package.json` if present. To pin Node 18, add:

	```json
	"engines": { "node": "18.x" }
	```

- Environment variables: always set `NEXT_PUBLIC_API_BASE_URL` for Production and Preview.
- If your backend requires auth credentials or secrets, never expose them as `NEXT_PUBLIC_*` — use server-only secrets or the backend to mediate.
- If you use image optimization for externally-hosted images, ensure the domain is allowed in `next.config.js`.

4) Custom domain & HTTPS

- Add your domain in Vercel dashboard → Domains and follow DNS instructions. Vercel provisions HTTPS automatically.

## Troubleshooting
- Build errors: Run `npm run build` locally to reproduce; the terminal will show missing env vars or TypeScript errors.
- 500 / API errors in Production: verify `NEXT_PUBLIC_API_BASE_URL` and that CORS is configured on the backend.
- Missing images: check `next.config.js` `images.domains` includes remote hostnames.

## Notes for reviewers / recruiters
- The project demonstrates practical TypeScript usage, typed API client wrappers, and an annotation canvas you can interact with locally.
- Key files: [frontend/lib/api.ts](frontend/lib/api.ts#L1-L200), [frontend/components/annotate/AnnotationCanvas.tsx](frontend/components/annotate/AnnotationCanvas.tsx#L1-L200), [frontend/components/tasks/Board.tsx](frontend/components/tasks/Board.tsx#L1-L200).

## Next steps I can help with
- Add a CI workflow for preview deployments (GitHub Actions)
- Add a short demo GIF and a public Vercel link to this README
- Add troubleshooting checklist for backend-auth integration

---

File: [frontend/README.md](frontend/README.md)
