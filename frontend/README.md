# Frontend — Vairad Task

A polished, production-ready Next.js + TypeScript frontend for a task management and image annotation platform. This README is written to help recruiters quickly understand the scope, technical choices, and my contributions, and to make it trivial to run the project locally.

**Project**: Full-featured frontend for an annotation + task-tracking application.

**Stack**
- **Framework:** Next.js (16.x)
- **Language:** TypeScript (strict-typed components and APIs)
- **Styling:** Tailwind CSS / PostCSS
- **State:** Zustand
- **Forms & Validation:** react-hook-form + zod
- **Drag & Drop:** @dnd-kit/core

**Core Features**
- Authentication (login/register) with JWT access/refresh tokens and automatic refresh.
- Task board with date filtering, create/update/delete operations, and drag-and-drop ordering.
- Image upload and annotation canvas for labeling images.
- Responsive UI and reusable components across dashboard, tasks, and annotation flows.

**My Role / Highlights**
- Implemented the frontend architecture using Next.js + TypeScript, focusing on developer ergonomics and reliability.
- Built a robust API wrapper with automatic token refresh and typed responses: see [frontend/lib/api.ts](frontend/lib/api.ts#L1-L200).
- Implemented task APIs and typed client helpers: see [frontend/lib/tasksApi.ts](frontend/lib/tasksApi.ts#L1-L200).
- Developed the annotation canvas and supporting UI: [frontend/components/annotate/AnnotationCanvas.tsx](frontend/components/annotate/AnnotationCanvas.tsx#L1-L200).
- Added drag-and-drop task board with accessible interactions: [frontend/components/tasks/Board.tsx](frontend/components/tasks/Board.tsx#L1-L200).

Why this matters: the app demonstrates practical full-stack integration, strong TypeScript usage, production-ready token handling, and polished UX components — all skills recruiters often look for in frontend engineers.

## Quick Start (Local)

Prerequisites:
- Node.js 18+ (recommended)
- The backend API running and reachable via an environment variable.

Steps:

1. Install dependencies

```bash
npm install
```

2. Configure environment

Copy the example env and set the API base URL:

```bash
cp .env.local.example .env.local
# then edit .env.local and set NEXT_PUBLIC_API_BASE_URL to your backend URL
```

3. Start the dev server

```bash
npm run dev
```

Visit `http://localhost:3000` and sign in using the backend sample credentials (or register a new account).

## Build & Lint

```bash
npm run build
npm run start
npm run lint
```

## Project Structure (high level)
- `app/` — Next.js routes and pages.
- `components/` — Reusable UI components grouped by feature (tasks, annotate, auth, dashboard).
- `lib/` — API helpers and client wrappers (see [frontend/lib/api.ts](frontend/lib/api.ts#L1-L200) and [frontend/lib/tasksApi.ts](frontend/lib/tasksApi.ts#L1-L200)).
- `types/` — Shared TypeScript types used across the frontend.

## Notable Implementation Details
- The API wrapper stores tokens in `localStorage`, automatically refreshes the access token when a 401 occurs, and surfaces errors with a typed `ApiError` class.
- All data-fetching helpers return typed responses and normalize paginated results to simple arrays where convenient.

## How to Evaluate Me (for recruiters / hiring managers)
- Ask about trade-offs: security of storing tokens in `localStorage` vs HTTP-only cookies and why automatic refresh is implemented client-side.
- Discuss performance: how to paginate large image sets, lazy-load images, and optimize canvas rendering.
- Code review: examine `frontend/lib/api.ts` for how errors are surfaced and token refresh is retried.

## Demo & Screenshots
Screenshots live in the repository under `public/`. Run the app locally to interact with the annotation canvas and the task board.

## Contact / Next Steps
Replace this line with your preferred contact method (email, LinkedIn, GitHub) so recruiters can reach you directly.

---

If you'd like, I can also:
- Add a short demo GIF and hosted Netlify/Vercel link.
- Generate a concise one-page portfolio summary specifically for recruiters.

Good luck! If you want edits to tailor this README to a specific job application, tell me the role and I'll adjust the language and highlights.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
