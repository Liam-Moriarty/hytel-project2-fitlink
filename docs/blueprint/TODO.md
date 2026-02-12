# **FitLink To-Do List**

## **1. Project Setup**

- [x] Initialize Turborepo monorepo
- [x] Setup PNPM workspace (`pnpm-workspace.yaml`)
- [x] Create `apps/web` folder for React frontend
- [x] Create `apps/functions` folder for tRPC backend (stub)
- [x] Create `packages/ui` for shared Shadcn components
- [x] Create `packages/shared` for shared Zod schemas & types
- [x] Create `packages/eslint-config` for shared ESLint config
- [x] Create `packages/typescript-config` for shared TypeScript config
- [x] Setup Vite + TypeScript with path alias (`@` → `./src`)
- [x] Install dependencies: React 18, Tailwind CSS, Shadcn/ui, Zustand, TanStack Query, React Hook Form, Zod, Firebase SDK, Recharts, Lucide React, Sonner, next-themes
- [x] Configure Vitest for unit testing with Testing Library + jsdom
- [x] Setup Husky + lint-staged for pre-commit hooks
- [x] Setup Changesets for semantic versioning
- [x] Configure Syncpack for dependency version consistency

---

## **2. CI/CD Setup**

- [x] Create CI pipeline (`ci.yml`) — lint, format check, type check, build, test
- [x] Create deploy-dev pipeline (`deploy-dev.yml`) — auto-deploy on `dev` push
- [x] Create deploy-stage pipeline (`deploy-stage.yml`) — auto-deploy on `stage` push
- [x] Create deploy-main pipeline (`deploy-main.yml`) — manual deploy with approval
- [x] Create release pipeline (`release.yml`) — Changesets versioning
- [x] Create dependency review pipeline (`dependency-review.yml`)
- [x] Setup Workload Identity Federation (WIF) for keyless GCP auth
- [x] Configure GitHub Secrets for Firebase environment variables
- [x] Create CI/CD documentation (`docs/ci-cd/`)

---

## **3. Firebase Setup**

- [x] Setup Firebase project
- [x] Enable Firebase Auth (email/password + Google OAuth)
- [x] Configure Firestore database
- [x] Setup Firebase Storage (profile pictures)
- [x] Setup Firestore collections: `users`, `traineeGoals`, `trainers`
- [x] Write Firestore Security Rules with role-based access control
- [x] Configure Firebase Hosting with SPA rewrites
- [x] Setup `.env` configuration for Firebase SDK

---

## **4. Authentication**

- [x] Email/password signup with name, email, password (Zod validation)
- [x] Email/password login with email, password (Zod validation)
- [x] Google OAuth login/signup
- [x] Firebase `onAuthStateChanged` session management
- [x] Zustand auth store with localStorage persistence
- [x] Protected routes with role-based guards (`ProtectedRoute` component)
- [x] Guest-only routes (redirect authenticated users away from login/signup)
- [x] Auth-only route for onboarding (authenticated but no role)
- [x] Logout functionality with cache clearing

---

## **5. Trainee Features**

### **5.1 Onboarding**

- [x] Step 1: Role selection (trainee/trainer) with visual cards
- [x] Step 2: Demographics (gender, age, height, weight, activity level)
- [x] Step 3: Fitness goals multi-select (Weight Loss, Muscle Gain, Endurance, Flexibility, General Health)
- [x] Step 4: Preferred workout types multi-select (Cardio, Strength Training, HIIT, Yoga, Pilates, CrossFit, Swimming, Cycling, Running, Boxing)
- [x] Step 5: Target timeline (1/3/6 months, 1 year) and frequency per week
- [x] Zod schema validation for all onboarding fields
- [x] Progress indicator (step counter + progress bar)
- [x] Persist onboarding data to Firestore (`users` + `traineeGoals` with empty completedWorkouts/completedMeals arrays)

### **5.2 Dashboard**

- [x] Header with user greeting and profile info
- [x] Top stats grid (completion %, workouts completed, calories burned, target timeline)
- [x] Today's workout card (type, duration, calories, intensity, description)
- [x] Weekly progress card with completion bar
- [x] Dietary adherence summary card with link to dietary plan
- [x] Fitness goals overview card
- [x] Achievements section (unlocked/locked badges)
- [x] Motivation card with dynamic messages based on progress
- [x] TanStack Query integration for data fetching

### **5.3 Workout Plan**

- [x] Week-by-week workout plan display with tab navigation
- [x] Per-workout cards (type, duration, calories, intensity, description)
- [x] Completion toggle (mark complete/incomplete) per workout
- [x] Real-time progress bar and completion percentage
- [x] Completed-week indicators on tabs
- [x] Predefined plans: 1-month (4 weeks), 3-month (12 weeks), 6-month (26 weeks)
- [x] Rest day styling
- [x] Sync completions with Firestore (`completedWorkouts` array using `arrayUnion`/`arrayRemove`)

### **5.4 Dietary Plan**

- [x] Week-by-week meal plan display with tab navigation
- [x] Daily meal cards (breakfast, lunch, dinner, snack) with calorie targets
- [x] Completion toggle per day
- [x] Dietary adherence percentage and average daily calories
- [x] Completed-week indicators on tabs
- [x] Plans aligned with workout timelines
- [x] Sync completions with Firestore (`completedMeals` array)

### **5.5 Progress Tracking**

- [x] Top stats grid (completion %, total workouts, calories burned, timeline)
- [x] Paginated weekly workout activity table (5 per page)
- [x] Body measurements section (height, weight, age)
- [x] Achievements display (8 achievement badges with locked/unlocked states)
- [x] Dietary statistics card (adherence %, avg daily calories, current streak)
- [x] Paginated weekly dietary activity table (5 per page)

### **5.6 Profile**

- [x] Header with avatar, name, email, role badge
- [x] Personal information display (name, email, gender, age, height, weight)
- [x] Edit profile via sheet modal (EditProfileSheet component)
- [x] Current goals display
- [x] Additional goals display
- [x] Workout preferences display
- [x] Settings card
- [x] Logout button with confirmation

---

## **6. Trainer Features**

### **6.1 Onboarding**

- [x] Step 1: Role selection (shared with trainee)
- [x] Step 2: Demographics (shared with trainee)
- [x] Step 3: Specialties multi-select (Weight Loss, Strength Training, Yoga, HIIT, Rehabilitation)
- [x] Step 4: Certifications multi-select (ACE, NASM, ISSA, ISSN, CPR, Personal Training, Group Fitness, Nutrition, Strength & Conditioning)
- [x] Step 5: Availability days of week (Monday–Sunday)
- [x] Persist to Firestore (`users` + `trainers` with empty `traineeIds` array)

### **6.2 Dashboard**

- [x] Header with trainer greeting
- [x] Aggregate stats grid (total clients, total workouts, success rate, total calories)
- [x] Client progress summary cards (per-client completion %, workouts, calories)
- [x] Dietary progress summary per client
- [x] Schedule overview (available days)
- [x] Quick actions panel (links to clients, analytics, schedule)
- [x] Calorie burn summary chart
- [x] Real-time data refresh (5-second interval)

### **6.3 Client Management**

- [x] Client data table (name, email, status, actions)
- [x] Invite trainee by email search
- [x] Remove client from roster
- [x] Client count badge
- [x] Real-time client list updates

### **6.4 Schedule & Certifications**

- [x] Availability editor (toggle days Monday–Sunday)
- [x] Certifications list editor (add/remove)
- [x] Save changes to Firestore

### **6.5 Analytics & Reporting**

- [x] Multi-select trainee selector
- [x] Aggregated stats (total workouts, calories, avg progress, avg dietary adherence)
- [x] Calorie burn progress line chart (week-by-week, color-coded per trainee)
- [x] Dietary adherence line chart (week-by-week per trainee)
- [x] Individual trainee detail cards (expandable with comprehensive data)
- [x] Real-time data refresh (5-second interval)

### **6.6 Profile**

- [x] Header with avatar, name, email, role badge
- [x] Personal information display and edit
- [x] Trainer overview (client count, certifications count, available days)
- [x] Specialties management
- [x] Settings card
- [x] Logout button

---

## **7. Shared / System Features**

- [x] Authentication: Email/password + Google OAuth with role-based routing
- [x] Profile management: Edit personal info via modal sheet
- [x] Collapsible role-specific sidebar navigation with active route highlighting
- [x] Toast notifications via Sonner
- [x] Zod validation on all forms (auth, onboarding, profile edit)
- [x] Zustand auth store with localStorage persistence
- [x] TanStack Query for server-state with caching and refetch intervals
- [x] Loading states (spinners, skeletons)

---

## **8. Design & UI**

- [x] 5-step onboarding UI with progress indicator
- [x] Trainee dashboard with stats grid, cards, and achievements
- [x] Trainer dashboard with real-time stats and client summaries
- [x] Workout plan page with week/day tabs and completion toggles
- [x] Dietary plan page with week/day tabs and meal cards
- [x] Progress page with paginated tables and stats
- [x] Analytics page with line charts (Recharts) and trainee selector
- [x] Client management page with data table and invite card
- [x] Schedule page with availability and certifications editors
- [x] Profile pages for both roles with edit modal
- [x] Responsive design using Tailwind CSS breakpoints
- [x] Dark/light theme support via next-themes
- [x] Shadcn/ui component system (Button, Card, Input, Tabs, Select, Checkbox, Table, Dialog, Sheet, etc.)

---

## **9. Testing**

- [x] Vitest configuration with Testing Library + jsdom
- [x] User query hook tests (`useUsers.test.ts`)
- [x] Zod schema validation tests (`user.test.ts`)
- [x] Component rendering tests (`Header.test.tsx`, `Counter.test.tsx`)
- [x] tRPC router tests (`user.test.ts`)
- [ ] Expand test coverage for trainee pages
- [ ] Expand test coverage for trainer pages
- [ ] Expand test coverage for onboarding flow
- [ ] E2E tests (Cypress or Playwright)

---

## **10. Future Enhancements**

- [ ] Deploy tRPC backend to Firebase Cloud Functions
- [ ] In-app messaging between trainer and trainee
- [ ] Push notifications (workout reminders, goal milestones, client activity)
- [ ] Trainer feedback system on workouts
- [ ] 1-year workout and dietary plan constants
- [ ] Cloud Functions for automated notifications
- [ ] Export / share progress reports (PDF)
- [ ] Wearable/fitness tracker integration
- [ ] Mobile app (React Native or PWA)
- [ ] Multi-trainer support per trainee
- [ ] Gamification: leaderboards, challenges, streaks
- [ ] Nutrition database API integration
- [ ] Video workout tutorials
- [ ] Payment/subscription system
