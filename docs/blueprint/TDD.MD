# **FitLink Technical Design Document (TDD)**

**Project Name:** FitLink
**Version:** 2.0
**Author:** Fernando Jose Ordiales
**Date:** 12/2/2026
**Tech Stack:** Firebase, React 18, TypeScript, Tailwind CSS, Shadcn/ui, Zustand, Turborepo, PNPM, TanStack Query, React Hook Form, Zod, Vite, Vitest, Recharts, React Router 7

---

## **1. Project Overview**

FitLink is a dual-role fitness platform with **Trainee** and **Trainer** user types. Trainees follow predefined workout and dietary plans, track completion, view progress analytics, and earn achievements. Trainers manage client rosters, monitor real-time trainee performance, view comparative analytics with charts, and manage their availability and certifications. The project uses a **monorepo structure** with Turborepo and PNPM workspaces.

---

## **2. Tech Stack & Rationale**

| Layer              | Technology                          | Purpose                                                        |
| ------------------ | ----------------------------------- | -------------------------------------------------------------- |
| Frontend           | **React 18 + TypeScript**           | Component-based UI with type safety                            |
| Routing            | **React Router 7**                  | Client-side SPA routing with nested layouts                    |
| Styling            | **Tailwind CSS 3 + Shadcn/ui**      | Utility-first CSS + Radix UI-based component library           |
| State Management   | **Zustand 5**                       | Lightweight global state for auth with localStorage persistence |
| Data Fetching      | **TanStack Query 5**                | Server-state management, caching (5-min stale time), and refetch intervals |
| Backend / DB       | **Firebase 12**                     | Firestore DB, Auth (email + Google OAuth), Storage, Hosting    |
| Forms              | **React Hook Form + @hookform/resolvers** | Form state management with Zod resolver integration      |
| Validation         | **Zod**                             | Schema validation for auth, onboarding, and profile forms      |
| Charts             | **Recharts**                        | Line charts for trainer analytics (calorie burn, dietary adherence) |
| Icons              | **Lucide React**                    | SVG icon library                                               |
| Toasts             | **Sonner**                          | Toast notification library                                     |
| Theming            | **next-themes**                     | Dark/light theme management                                    |
| Bundler            | **Vite 5**                          | Fast dev server & build tool with path alias (`@` → `./src`)  |
| Testing            | **Vitest + Testing Library**        | Unit and integration tests with jsdom                          |
| Package Management | **PNPM 8**                          | Fast, deterministic dependency management                      |
| Monorepo           | **Turborepo 2**                     | Task orchestration with caching for build, lint, test, typecheck |
| Linting            | **ESLint 8 + Prettier**             | Code quality and formatting                                    |
| Git Hooks          | **Husky + lint-staged**             | Pre-commit linting and formatting on staged files              |
| Versioning         | **Changesets**                      | Semantic versioning with automated changelog                   |
| CI/CD              | **GitHub Actions**                  | Automated CI pipeline + Firebase Hosting deployment via WIF    |

---

## **3. Architectural Design**

### **3.1 High-Level Architecture**

```
+----------------------------------------------+
|               Frontend (SPA)                  |  React 18 + TS + Tailwind + Shadcn/ui
|----------------------------------------------|
|  Pages (auth, onboarding, trainee, trainer)   |
|  Sections (feature-specific sub-components)   |
|  Components (ProtectedRoute, Sidebars, UI)    |
|  Zustand (auth state + localStorage persist)  |
|  TanStack Query (server-state + caching)      |
|  React Hook Form + Zod (form validation)      |
|  Recharts (trainer analytics charts)          |
+----------------------+-----------------------+
                       |
                       v
+----------------------------------------------+
|               Firebase                        |
|----------------------------------------------|
|  Auth (email/password + Google OAuth)         |
|  Firestore DB (users, traineeGoals, trainers) |
|  Storage (profile pictures)                   |
|  Hosting (SPA deployment)                     |
+----------------------------------------------+
```

- **Frontend** communicates directly with **Firebase** via the Firebase SDK.
- **Zustand** manages auth state with localStorage persistence (essential fields only).
- **TanStack Query** manages server-state with 5-minute stale time and configurable refetch intervals.
- **Firebase Auth** handles email/password and Google OAuth with role-based routing.
- **Firestore** stores structured app data across 3 collections.
- **No backend API deployed** — tRPC router exists as a stub in `apps/functions/` but is not active.

---

### **3.2 Monorepo Structure (Turborepo + PNPM)**

```
fitlink/
├─ .github/
│  └─ workflows/           # CI/CD pipelines (ci, deploy-dev, deploy-stage, deploy-main, release)
├─ .husky/                 # Git hooks (pre-commit)
├─ .changeset/             # Changeset config for versioning
├─ apps/
│  ├─ web/                 # React SPA (main application)
│  │  └─ src/
│  │     ├─ pages/         # Route page components
│  │     │  ├─ auth/       # Login, Signup
│  │     │  ├─ onboarding/ # GetToKnow, OnBoardStep1-5, schemas
│  │     │  ├─ dashboard/  # Dashboard layout wrapper
│  │     │  ├─ trainee/    # DashboardHome, WorkoutPlan, DietaryPlan, Progress, Profile
│  │     │  └─ trainer/    # TrainerDashboard, Clients, Schedule, Analytics, TrainerProfile
│  │     ├─ sections/      # Feature-specific presentational sub-components
│  │     │  ├─ trainee/    # dashboard/, workout-plan/, dietary-plan/, progress/, profile/
│  │     │  └─ trainer/    # dashboard/, clients/, schedule/, analytics/, profile/
│  │     ├─ components/    # ProtectedRoute, EditProfileSheet, Sidebars, ui/ (Shadcn)
│  │     ├─ hooks/         # useAuth, useUser (TanStack Query mutations/queries)
│  │     ├─ lib/
│  │     │  ├─ api/        # Firebase API functions (auth, user, trainer, trainer-analytics)
│  │     │  ├─ schemas/    # Zod schemas (auth)
│  │     │  └─ store/      # Zustand auth store
│  │     ├─ constants/     # Navigation, options, achievements, workout/dietary plans
│  │     ├─ interface/     # TypeScript interfaces
│  │     └─ providers/     # QueryProvider
│  └─ functions/           # tRPC backend (stub, not deployed)
├─ packages/
│  ├─ ui/                  # Shared Shadcn components + cn() utility
│  ├─ shared/              # Shared Zod schemas & types
│  ├─ eslint-config/       # Shared ESLint config
│  ├─ typescript-config/   # Shared TypeScript config
│  └─ config/              # Configuration package
├─ docs/
│  ├─ blueprint/           # PDD, TDD, TODO
│  └─ ci-cd/               # CI/CD pipeline documentation
├─ scripts/                # setup-wif.sh (Workload Identity Federation)
├─ firebase.json           # Firebase hosting & rules config
├─ firestore.rules         # Firestore security rules
├─ turbo.json              # Turborepo task pipeline config
├─ pnpm-workspace.yaml     # Workspace definition (apps/*, packages/*)
└─ package.json            # Root monorepo config & scripts
```

---

## **4. Database Design**

### **4.1 Firestore Collections**

1. **users/{uid}**

   - `uid` (string, Firebase Auth UID, immutable)
   - `email` (string, immutable)
   - `displayName` (string)
   - `role` (enum: `'trainee'` | `'trainer'`)
   - `gender` (enum: `'male'` | `'female'` | `'other'`)
   - `age` (number)
   - `height` (number, cm)
   - `weight` (number, kg)
   - `activityLevel` (enum: `'sedentary'` | `'light'` | `'moderate'` | `'high'`)
   - `profilePicUrl` (string, optional)
   - `createdAt` (timestamp, immutable)
   - `updatedAt` (timestamp, optional)

2. **traineeGoals/{uid}**

   - `userId` (string, ref to users, immutable)
   - `goals` (array of strings, e.g. `["Weight Loss", "Muscle Gain"]`)
   - `preferredWorkoutTypes` (array of strings, e.g. `["Running", "HIIT"]`)
   - `frequencyPerWeek` (string, e.g. `"4"`)
   - `targetTimeline` (string: `"1 month"` | `"3 months"` | `"6 months"` | `"1 year"`)
   - `completedWorkouts` (array of strings, format `"week-day"`, e.g. `["1-1", "1-2", "2-3"]`)
   - `completedMeals` (array of strings, format `"week-day"`, e.g. `["1-1", "1-2"]`)
   - `createdAt` (timestamp, immutable)
   - `updatedAt` (timestamp, optional)

3. **trainers/{uid}**

   - `userId` (string, ref to users, immutable)
   - `specialties` (array of strings, e.g. `["Strength Training", "HIIT"]`)
   - `certifications` (array of strings, e.g. `["ACE", "NASM"]`)
   - `availability` (array of strings, e.g. `["Monday", "Wednesday", "Friday"]`)
   - `traineeIds` (array of strings, UIDs of assigned trainees)
   - `createdAt` (timestamp, immutable)
   - `updatedAt` (timestamp, optional)

### **4.2 Entity Relationship**

```
[users] (role: trainee) <1----1> [traineeGoals]
   |                                  |
   |                                  ├── completedWorkouts[]
   |                                  └── completedMeals[]
   |
[users] (role: trainer) <1----1> [trainers]
                                      |
                                      └── traineeIds[] ──references──> [users] + [traineeGoals]
```

- One **trainer** can have multiple trainees (via `traineeIds` array).
- One **trainee** has one `traineeGoals` document with completion arrays.
- Trainers read trainee data via security rules that validate `traineeIds` membership.

---

## **5. Frontend Design**

### **5.1 Pages / Routes**

**Public (Guest-Only):**
- `/login` – Email/password + Google OAuth login
- `/signup` – Email/password + Google OAuth signup
- `/` – Redirects to `/login`

**Auth-Only (Pre-Role):**
- `/onboarding` – 5-step multi-step form (role selection → demographics → goals/specialties → workout types/certifications → timeline/availability)

**Trainee (Protected, role: trainee):**
- `/dashboard/trainee` – Layout wrapper with `TraineeSidebar` + `<Outlet />`
  - `/dashboard/trainee/` (index) – Dashboard home (stats, today's workout, week progress, goals, achievements, dietary summary, motivation)
  - `/dashboard/trainee/workout-plan` – Week-by-week workout plan with completion toggles
  - `/dashboard/trainee/dietary-plan` – Week-by-week meal plan with completion toggles
  - `/dashboard/trainee/progress` – Progress analytics (weekly activity, body measurements, achievements, dietary stats)
  - `/dashboard/trainee/profile` – Profile management with edit modal

**Trainer (Protected, role: trainer):**
- `/dashboard/trainer` – Layout wrapper with `TrainerSidebar` + `<Outlet />`
  - `/dashboard/trainer/` (index) – Trainer dashboard (real-time stats, client summaries, dietary summaries, schedule, quick actions, calorie chart)
  - `/dashboard/trainer/clients` – Client roster management (table, invite by email, remove)
  - `/dashboard/trainer/schedule` – Availability and certifications editor
  - `/dashboard/trainer/analytics` – Comparative analytics (trainee selector, stats grid, line charts, individual detail cards)
  - `/dashboard/trainer/profile` – Trainer profile (overview, specialties, settings)

### **5.2 Component Architecture**

```
Pages (data fetching, state, route-level)
  └─ Sections (feature-specific presentational components)
      └─ UI Components (Shadcn/Radix primitives, no business logic)
          └─ Custom Components (ProtectedRoute, Sidebars, EditProfileSheet)
```

**Shadcn/ui Components Used:** Button, Card, Input, Label, Badge, Progress, Sheet, Dialog, Tabs, Select, Checkbox, Tooltip, Separator, ScrollArea, Table, AlertDialog, Form, Chart (Recharts wrapper), Skeleton, Sonner

### **5.3 State Management**

| Layer | Tool | Scope |
|-------|------|-------|
| Local | `useState` | Pagination, form state, UI toggles, completion sets |
| Global | Zustand | Auth state (user, userData, isAuthenticated, loading) with localStorage persistence |
| Server | TanStack Query | User data, trainer profiles, client lists, analytics — 5-min stale time, configurable refetch intervals |

**Data Flow Pattern:**
```
User Action → setState (optimistic) → useMutation (Firebase update) → queryClient.invalidateQueries() → useQuery refetch → Component re-render
```

### **5.4 Forms & Validation**

| Form | Schema | Library |
|------|--------|---------|
| Login | `loginSchema` (email, password) | React Hook Form + Zod resolver |
| Signup | `signupSchema` (name, email, password) | React Hook Form + Zod resolver |
| Onboarding | `onboardingSchema` (gender, age, height, weight, activityLevel, goals, specialties, workoutTypes, certifications, frequency, timeline, availability) | React Hook Form + Zod resolver |
| Edit Profile | Inline validation | React Hook Form |

---

## **6. Backend Design**

- Firebase handles backend (serverless):

  - **Auth:** Email/password + Google OAuth, session management via `onAuthStateChanged`
  - **Firestore:** 3 collections (`users`, `traineeGoals`, `trainers`)
  - **Storage:** Profile pictures
  - **Hosting:** SPA deployment from `apps/web/dist/` with SPA rewrites

- **tRPC Backend (Stub):** Defined in `apps/functions/` with user router but not deployed to Cloud Functions

---

## **7. Security & Firestore Rules**

### **Helper Functions**
- `isAuthenticated()` – Checks `request.auth != null`
- `isOwner(userId)` – Checks `request.auth.uid == userId`
- `getUserRole()` – Reads role from `users/{uid}`
- `isTrainer()` / `isTrainee()` – Role validation
- `isTrainerOfTrainee(traineeId)` – Validates trainee is in trainer's `traineeIds`

### **Collection Rules**

| Collection | Create | Read | Update | Delete | List |
|------------|--------|------|--------|--------|------|
| `users/{uid}` | Owner only (requires uid, email, createdAt) | Owner OR trainer-of-trainee | Owner only (uid, email, createdAt immutable) | Denied | Trainers only |
| `traineeGoals/{uid}` | Owner only (requires userId, completedWorkouts, completedMeals, createdAt) | Owner OR trainer-of-trainee | Owner only (userId, createdAt immutable) | Denied | — |
| `trainers/{uid}` | Owner only (requires userId, createdAt) | Owner only | Owner only (userId, createdAt immutable) | Denied | — |

**Catch-All:** All other paths denied (`allow read, write: if false`)

---

## **8. Testing**

- **Unit Tests:** Vitest for components, hooks, schemas, and stores
- **Testing Library:** @testing-library/react + @testing-library/jest-dom with jsdom
- **Test Files:**
  - `apps/web/src/hooks/useUsers.test.ts` – User query hook tests
  - `apps/functions/src/trpc/routers/user.test.ts` – tRPC router tests
  - `packages/shared/src/schemas/user.test.ts` – Zod schema validation tests
  - `packages/ui/components/Header.test.tsx` – Component rendering tests
  - `packages/ui/components/Counter.test.tsx` – Component interaction tests
- **Commands:** `pnpm test` (all), `pnpm test:coverage` (with coverage)

---

## **9. CI/CD Pipeline**

### **Branch Strategy**
| Branch | Environment | Trigger |
|--------|-------------|---------|
| `dev` | Development | Auto-deploy on push |
| `stage` | Staging | Auto-deploy on push |
| `main` | Production | Manual trigger with approval |

### **GitHub Actions Workflows**

1. **CI (`ci.yml`):** Runs on PRs and pushes — lint, format check, type check, build, test, dependency consistency
2. **Deploy Dev (`deploy-dev.yml`):** Auto-deploy to Firebase Hosting on `dev` push via Workload Identity Federation
3. **Deploy Stage (`deploy-stage.yml`):** Auto-deploy on `stage` push
4. **Deploy Main (`deploy-main.yml`):** Manual deploy to production with required reviewers
5. **Release (`release.yml`):** Automated semantic versioning with Changesets on `main` push
6. **Dependency Review (`dependency-review.yml`):** Scans PRs for vulnerable dependencies

### **Authentication:** Google Cloud Workload Identity Federation (WIF) — keyless OIDC authentication, no stored service account keys

### **Pre-Commit Hooks:** Husky + lint-staged runs ESLint + Prettier on staged `.ts`, `.tsx`, `.json`, `.md`, `.yaml` files
