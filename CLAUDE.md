# PG Review Platform — Frontend

## What this is
Frontend for a Trustpilot-style PG/rental review platform (Gurgaon/Delhi NCR). 
Backend is a separate FastAPI project (`pg-review-backend`, sibling repo) — 
this repo only handles UI and calls the backend's REST API.

## Why I'm building this
Backend is the primary FastAPI learning focus. This frontend supports that — 
keep it functional and clean, don't over-engineer the React side.

## Stack
- Vite + React + TypeScript
- react-router-dom for routing
- axios for API calls
- Deployed on Vercel (planned)
- Not using Next.js — SEO isn't a concern for phase 1 (internal 
  testing/learning); revisit SSR/Next.js migration if this becomes 
  public-facing later

## Backend contract
- Production API: https://fastapibackend-gksx.onrender.com (free Render tier — 
  cold start after idle can take 30-50s; not a bug)
- Local dev: http://localhost:8000 — override via `VITE_API_URL` env var 
  (defaults to production)
- Auth: JWT, 30-min expiry, no refresh token. Stored in localStorage 
  (`pg_review_token`), sent as Bearer header via axios interceptor
- `/auth/login` is form-encoded (OAuth2 password flow) — field is `username` 
  but holds the email
- Routes: `/auth/{signup,login,me}`, `/pgs/` CRUD, `/pgs/{id}/reviews/` 
  (GET/POST only). No pagination, no review edit/delete. See `/docs` (Swagger)

## Phase 1 (done)
- [x] Routing setup (react-router-dom)
- [x] Pages: home/search, PG listing detail, login/signup, add PG
- [x] Auth flow (login/signup forms, token storage, protected routes)
- [x] Fetch + display PG listings from backend (city search)
- [x] Review submission form (inline on PG detail, auth-gated)
- [ ] Deploy to Vercel

## Phase 2 (later — do not build yet)
- Anything related to AI verdict display, SEO/SSR migration

## Conventions
- Structure: `src/pages/` (route components), `src/components/` (shared), 
  `src/lib/` (api.ts axios client + typed endpoint fns, auth.tsx context), 
  `src/types.ts` (API types)
- Styling: plain CSS in `src/index.css` with CSS variables, class-based — 
  no CSS framework
- All API calls go through the typed functions in `src/lib/api.ts`; use 
  `errorMessage(err)` helper for user-facing errors