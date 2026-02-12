# **FitLink Product Design Document**

**Project Name:** FitLink
**Platform:** Web
**Methodology:** Agile (Scrum)
**Version:** 2.0
**Author:** Fernando Jose Ordiales
**Date:** 12/2/2026

---

## **1. Product Vision**

FitLink is a dual-role fitness platform connecting trainees and trainers. Trainees follow structured workout and dietary plans, track completion and progress, earn achievements, and view analytics. Trainers manage client rosters, monitor real-time trainee performance, view aggregated analytics, and manage their availability and certifications. The platform supports personalized onboarding for both roles with role-specific dashboards.

---

## **2. Target Users**

1. **Trainees:** Fitness enthusiasts who follow predefined workout and dietary plans, track progress through completion metrics, and earn achievements.
2. **Trainers:** Certified fitness professionals who manage a roster of trainees, monitor real-time client progress and dietary adherence, and view comparative analytics.

---

## **3. Agile Approach**

- **Sprints:** 2 weeks
- **Backlog:** Epics → Features → User Stories
- **Iterations:** Continuous feedback from both trainees and trainers

---

## **4. Epics, Features, and User Stories**

### **TRAINEE SIDE**

**Epic 1: Trainee Onboarding**

- **Goal:** Personalize the trainee experience and assign appropriate plans.
- **Features:** Role Selection, Personal Metrics, Fitness Goals, Workout Preferences, Timeline & Frequency
- **User Stories:**

  - US1.1 – Select role as trainee (step 1)
  - US1.2 – Enter personal metrics (gender, age, height, weight, activity level) (step 2)
  - US1.3 – Select fitness goals (Weight Loss, Muscle Gain, Endurance, Flexibility, General Health) (step 3)
  - US1.4 – Select preferred workout types (Cardio, Strength Training, HIIT, Yoga, Pilates, CrossFit, Swimming, Cycling, Running, Boxing) (step 4)
  - US1.5 – Set target timeline (1 month, 3 months, 6 months, 1 year) and workout frequency per week (step 5)

**Epic 2: Trainee Dashboard & Progress Tracking**

- **Goal:** Provide a comprehensive daily overview with progress visualization and achievements.
- **Features:** Stats grid, today's workout preview, weekly progress, goals overview, achievements, dietary summary, motivation card
- **User Stories:**

  - US2.1 – View top stats grid (completion %, workouts completed, calories burned, target timeline)
  - US2.2 – View today's scheduled workout with details (type, duration, calories, intensity)
  - US2.3 – View current week progress with completion bar
  - US2.4 – View dietary adherence summary with link to dietary plan
  - US2.5 – View fitness goals overview
  - US2.6 – View unlocked achievement badges
  - US2.7 – View personalized motivation card based on current progress

**Epic 3: Workout Plan & Logging**

- **Goal:** Follow structured workout plans and track completion.
- **Features:** Week-by-week workout plans, per-workout completion toggle, progress tracking
- **User Stories:**

  - US3.1 – View workout plan organized by weeks and days (based on selected timeline)
  - US3.2 – See per-workout details (type, duration, calories, intensity, description)
  - US3.3 – Mark individual workouts as complete/incomplete
  - US3.4 – View real-time progress bar and completion percentage
  - US3.5 – Navigate between weeks via tabs with completed-week indicators

**Epic 4: Dietary Plan & Tracking**

- **Goal:** Follow structured meal plans and track dietary adherence.
- **Features:** Week-by-week meal plans, daily meal completion toggle, calorie tracking
- **User Stories:**

  - US4.1 – View dietary plan organized by weeks and days (aligned with workout timeline)
  - US4.2 – See daily meals (breakfast, lunch, dinner, snack) with calorie targets
  - US4.3 – Mark daily meals as complete/incomplete
  - US4.4 – View dietary adherence percentage and average daily calories
  - US4.5 – Navigate between weeks via tabs with completed-week indicators

**Epic 5: Trainee Progress & Analytics**

- **Goal:** Visualize cumulative workout and dietary progress.
- **Features:** Weekly activity tables, body measurements, achievements, dietary stats, pagination
- **User Stories:**

  - US5.1 – View top stats grid (completion %, total workouts, calories burned, timeline)
  - US5.2 – View paginated weekly workout activity (5 per page)
  - US5.3 – View body measurements (height, weight, age)
  - US5.4 – View all achievements with locked/unlocked status
  - US5.5 – View dietary statistics (adherence %, avg daily calories, current streak)
  - US5.6 – View paginated weekly dietary activity (5 per page)

**Epic 6: Trainee Profile Management**

- **Goal:** View and edit personal information, goals, and preferences.
- **Features:** Personal info, current goals, additional goals, workout preferences, settings, edit profile modal
- **User Stories:**

  - US6.1 – View personal information (name, email, gender, age, height, weight)
  - US6.2 – Edit personal information via profile sheet modal
  - US6.3 – View current fitness goals and additional goals
  - US6.4 – View workout preferences (types, frequency, timeline)
  - US6.5 – Access account settings
  - US6.6 – Log out of the application

---

### **TRAINER SIDE**

**Epic 7: Trainer Onboarding**

- **Goal:** Capture trainer information, specialties, certifications, and availability.
- **Features:** Role Selection, Personal Metrics, Specialties, Certifications, Availability
- **User Stories:**

  - US7.1 – Select role as trainer (step 1)
  - US7.2 – Enter personal metrics (gender, age, height, weight, activity level) (step 2)
  - US7.3 – Select specialties (Weight Loss, Strength Training, Yoga, HIIT, Rehabilitation) (step 3)
  - US7.4 – Select certifications (ACE, NASM, ISSA, ISSN, CPR, Personal Training, Group Fitness, Nutrition, Strength & Conditioning) (step 4)
  - US7.5 – Set weekly availability (days of week) (step 5)

**Epic 8: Trainer Dashboard**

- **Goal:** Provide a real-time overview of all client metrics and performance.
- **Features:** Stats grid, client progress summaries, dietary progress summaries, schedule overview, quick actions, calorie burn chart
- **User Stories:**

  - US8.1 – View aggregate stats (total clients, total workouts, success rate, total calories)
  - US8.2 – View individual client progress summary cards (name, completion %, workouts, calories)
  - US8.3 – View dietary progress summary per client
  - US8.4 – View schedule overview with available days
  - US8.5 – Access quick action links (clients, analytics, schedule)
  - US8.6 – View calorie burn summary chart across clients

- **Requirements:** Real-time data refresh every 5 seconds

**Epic 9: Client Management**

- **Goal:** Manage a roster of trainees.
- **Features:** Client table, invite by email, remove clients
- **User Stories:**

  - US9.1 – View list of assigned trainees in a data table (name, email, status, actions)
  - US9.2 – Invite new trainees by searching their email address
  - US9.3 – Remove trainees from the client roster
  - US9.4 – View client count badge

**Epic 10: Trainer Schedule & Certifications**

- **Goal:** Manage availability and professional credentials.
- **Features:** Availability editor, certifications editor
- **User Stories:**

  - US10.1 – Toggle availability for each day of the week (Monday–Sunday)
  - US10.2 – Add/remove certifications from a predefined list
  - US10.3 – Save changes to Firestore

**Epic 11: Trainer Analytics & Reporting**

- **Goal:** Provide detailed comparative analytics across trainees.
- **Features:** Trainee selector, aggregated stats, line charts, individual trainee detail cards
- **User Stories:**

  - US11.1 – Select one or more trainees to compare
  - US11.2 – View aggregated stats (total workouts, calories, avg progress, avg dietary adherence)
  - US11.3 – View calorie burn progress line chart per trainee (week-by-week)
  - US11.4 – View dietary adherence line chart per trainee (week-by-week)
  - US11.5 – View expandable individual trainee detail cards with comprehensive data

- **Requirements:** Real-time data refresh every 5 seconds, color-coded lines per trainee

**Epic 12: Trainer Profile Management**

- **Goal:** View and edit trainer profile, specialties, and overview stats.
- **Features:** Personal info, trainer overview, specialties management, settings
- **User Stories:**

  - US12.1 – View personal information (name, email, gender, age, height, weight)
  - US12.2 – Edit personal information via profile sheet modal
  - US12.3 – View trainer overview (client count, certifications count, available days)
  - US12.4 – Manage specialties list
  - US12.5 – Access account settings
  - US12.6 – Log out of the application

---

### **5. Shared Features for Both Roles**

- **Authentication:** Email/password and Google OAuth login/signup
- **Role-Based Routing:** Protected routes that redirect based on user role
- **Profile Management:** Edit personal info via modal sheet
- **Onboarding:** 5-step multi-step form with Zod validation and progress indicator
- **Sidebar Navigation:** Collapsible role-specific sidebar with active route highlighting
- **Toast Notifications:** Success/error feedback via Sonner toast library

---

### **6. Non-Functional Requirements**

- **Platform:** Web (React SPA hosted on Firebase Hosting)
- **Security:** Firebase Auth, Firestore security rules with role-based access control, immutable system fields (uid, email, createdAt)
- **Performance:** Real-time data refresh (5-second intervals on trainer dashboards), TanStack Query caching (5-minute stale time)
- **Scalability:** Support multiple trainees per trainer, Turborepo monorepo for modular development
- **Accessibility:** Semantic HTML, ARIA labels, keyboard navigation, focus indicators, color contrast compliance
- **Responsive Design:** Mobile-first with Tailwind CSS breakpoints (md, lg, xl)
- **CI/CD:** GitHub Actions with lint, format check, type check, build, and test on PRs; auto-deploy to dev/stage environments; manual deploy to production

---

### **7. Agile Implementation Notes**

- **Backlog Organization:** Separate epics for Trainee and Trainer features
- **Sprint Planning:** Mix high-priority trainee and trainer stories to deliver complete features
- **Daily Standups & Retrospective:** Track progress and adjust based on feedback from both user types
- **Versioning:** Changesets for semantic versioning with automated changelog
- **Git Workflow:** `dev` → `stage` → `main` branch strategy with feature branches
