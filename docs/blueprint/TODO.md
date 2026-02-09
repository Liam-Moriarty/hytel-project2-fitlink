# ✅ TODO

> Living development checklist for **FitLink**  
> Aligned with `PDD.md` and `TDD.md`

---

## 🧱 Phase 0 — Project Setup & Foundations

### Monorepo & Tooling

- [ ] Initialize monorepo using pnpm + Turborepo
- [ ] Verify Node.js (20+) and pnpm (8+) versions
- [ ] Configure `pnpm-workspace.yaml`
- [ ] Validate shared ESLint & TypeScript configs
- [ ] Set up Prettier formatting rules
- [ ] Confirm CI pipelines run on PRs

### App Structure

- [ ] Create `apps/web` (React + Vite)
- [ ] Create `apps/functions` (tRPC backend)
- [ ] Create `packages/ui`
- [ ] Create `packages/shared`
- [ ] Validate cross-package imports

---

## 🔐 Phase 1 — Authentication & User Roles

### Backend

- [ ] Implement auth provider integration
- [ ] Inject authenticated user into tRPC context
- [ ] Define user roles (trainee, trainer)
- [ ] Create role-based middleware
- [ ] Write auth guard tests

### Frontend

- [ ] Build login and signup screens
- [ ] Implement role selection during onboarding
- [ ] Add route guards per role
- [ ] Store auth state via TanStack Query

---

## 👤 Phase 2 — User Profile & Onboarding

### Shared

- [ ] Create Zod schemas for user profile
- [ ] Export shared types to frontend

### Backend

- [ ] Create user profile router
- [ ] Implement profile create/update procedures

### Frontend

- [ ] Build onboarding wizard UI
- [ ] Store onboarding progress in Zustand
- [ ] Persist completed profile to backend

---

## 🏋️ Phase 3 — Workout Tracking (Core MVP)

### Shared

- [ ] Define workout & exercise schemas

### Backend

- [ ] Implement workout router (list, create, update)
- [ ] Enforce trainee ownership of workouts
- [ ] Add workout validation tests

### Frontend

- [ ] Build workout logging form
- [ ] Implement workout history list
- [ ] Add workout reuse/duplicate feature
- [ ] Fetch workouts via TanStack Query
- [ ] Invalidate queries on mutation

---

## 📊 Phase 4 — Analytics Dashboard (Basic)

### Backend

- [ ] Create analytics router
- [ ] Aggregate workout frequency data
- [ ] Aggregate basic progress metrics

### Frontend

- [ ] Build analytics dashboard layout
- [ ] Add date range filters (Zustand)
- [ ] Render charts for workout frequency
- [ ] Display strength progression per exercise

---

## 🧑‍🏫 Phase 5 — Trainer Dashboard & Access Control

### Shared

- [ ] Define trainer–trainee relationship schema

### Backend

- [ ] Implement trainer invitation flow
- [ ] Implement trainer acceptance flow
- [ ] Enforce scoped data access
- [ ] Create trainer dashboard router

### Frontend

- [ ] Build trainer dashboard UI
- [ ] Implement trainee list view
- [ ] Add trainee selection (Zustand)
- [ ] Display trainee activity indicators

---

## 💬 Phase 6 — Feedback System

### Shared

- [ ] Create feedback schema

### Backend

- [ ] Implement feedback router
- [ ] Enforce trainer-only feedback creation
- [ ] Add feedback history queries

### Frontend

- [ ] Build feedback input UI
- [ ] Display feedback timeline
- [ ] Add feedback notifications

---

## 🍎 Phase 7 — Nutrition Tracking

### Shared

- [ ] Define nutrition log schema
- [ ] Define macronutrient structure

### Backend

- [ ] Implement nutrition router
- [ ] Add meal logging endpoints

### Frontend

- [ ] Build nutrition logging UI
- [ ] Display macro breakdown
- [ ] Integrate nutrition data into analytics

---

## 🔔 Phase 8 — Notifications & Engagement

### Backend

- [ ] Implement notification triggers
- [ ] Add inactivity detection logic

### Frontend

- [ ] Build notification center
- [ ] Add workout reminder UI
- [ ] Add feedback alert UI
- [ ] Implement notification preferences

---

## 💳 Phase 9 — Monetization (Freemium)

### Backend

- [ ] Implement subscription tiers
- [ ] Enforce feature gating
- [ ] Track subscription status

### Frontend

- [ ] Build pricing page
- [ ] Show premium feature locks
- [ ] Add upgrade/downgrade flow

---

## 🧪 Phase 10 — Testing & Quality

### Frontend

- [ ] Write component tests (Vitest)
- [ ] Test Zustand stores
- [ ] Test critical user flows

### Backend

- [ ] Write router unit tests
- [ ] Test authorization rules
- [ ] Validate schema coverage

---

## 🚀 Phase 11 — Deployment & CI/CD

- [ ] Configure environment variables
- [ ] Set up WIF authentication
- [ ] Enable dev/stage/prod deployments
- [ ] Verify production build pipeline
- [ ] Run full precheck before release

---

## 🌱 Phase 12 — Post-MVP Enhancements

- [ ] AI-assisted insights
- [ ] Workout plan templates
- [ ] Real-time trainer updates
- [ ] Offline workout logging
- [ ] Mobile app planning

---

## 🧠 Ongoing

- [ ] Keep PDD.md updated
- [ ] Keep TDD.md updated
- [ ] Refactor aggressively after validation
- [ ] Gather user feedback early
- [ ] Optimize only after usage is proven
