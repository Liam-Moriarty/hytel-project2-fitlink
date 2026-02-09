# **FitLink Technical Design Document (TDD)**

**Project Name:** FitLink
**Version:** 1.0
**Author:** Fernando Jose Ordiales
**Date:** 9/2/2026
**Tech Stack:** Firebase, React, TypeScript, Tailwind CSS, Shadcn, Zustand, Turborepo, PNPM, TanStack Query, Zod, Vite, Vitest

---

## **1. Project Overview**

FitLink is a dual-role fitness platform with **Trainee** and **Trainer** user types. Trainees track workouts, view analytics, and interact with trainers. Trainers create plans, monitor progress, and provide feedback. The project uses a **monorepo structure** for scalable development with Turborepo.

---

## **2. Tech Stack & Rationale**

| Layer              | Technology                | Purpose                                                      |
| ------------------ | ------------------------- | ------------------------------------------------------------ |
| Frontend           | **React + TypeScript**    | Component-based UI with type safety                          |
| Styling            | **Tailwind CSS + Shadcn** | Utility-first CSS + component library for rapid UI           |
| State Management   | **Zustand**               | Lightweight global state for UI and app state                |
| Data Fetching      | **TanStack Query**        | Server-state management, caching, and queries                |
| Backend / DB       | **Firebase**              | Firestore DB, Auth, Storage, Hosting                         |
| Validation         | **Zod**                   | Schema validation for TypeScript-safe forms and API requests |
| Bundler            | **Vite**                  | Fast dev server & build tool                                 |
| Testing            | **Vitest**                | Unit and integration tests                                   |
| Package Management | **PNPM**                  | Fast, deterministic dependency management                    |
| Monorepo           | **Turborepo**             | Manage frontend, backend, and shared code packages           |

---

## **3. Architectural Design**

### **3.1 High-Level Architecture**

```
+---------------------------+
|        Frontend           |  (React + TS + Tailwind + Shadcn)
|---------------------------|
|  Components               |
|  Pages                    |
|  Zustand (state)          |
|  TanStack Query (server)  |
+------------+--------------+
             |
             v
+---------------------------+
|        Firebase           |
|---------------------------|
|  Auth (users & roles)     |
|  Firestore DB             |
|  Storage (profile/workouts)|
|  Cloud Functions (optional)|
+---------------------------+
```

- **Frontend** communicates with **Firebase** via REST/SDK.
- **Zustand** manages local UI state.
- **TanStack Query** manages server-state and caching.
- **Firebase Auth** handles Trainee and Trainer roles.
- **Firestore** stores structured app data.
- **Cloud Functions** (optional) handle complex business logic like notifications.

---

### **3.2 Monorepo Structure (Turborepo + PNPM)**

```
fitlink/
├─ apps/
│  ├─ web/          # React app
│  └─ admin/        # Optional trainer admin panel
├─ packages/
│  ├─ ui/           # Shadcn + custom components
│  ├─ types/        # TypeScript types & Zod schemas
│  ├─ store/        # Zustand stores
│  └─ utils/        # Shared utilities & helpers
├─ package.json
├─ pnpm-workspace.yaml
└─ turbo.json
```

---

## **4. Database Design**

### **4.1 Firestore Collections**

1. **users**

- `uid` (string, Firebase Auth UID)
- `role` (enum: 'trainee' | 'trainer')
- `name` (string)
- `age` (number)
- `gender` (string)
- `height` (number, optional)
- `weight` (number, optional)
- `activityLevel` (string: Sedentary / Light / Moderate / High)
- `profilePicUrl` (string, optional)
- `createdAt` (timestamp)

2. **traineeGoals**

- `userId` (ref to users)
- `goals` (array of strings)
- `preferredWorkoutTypes` (array of strings)
- `frequencyPerWeek` (number)
- `targetTimeline` (string, e.g., '3 months')
- `createdAt` (timestamp)

3. **workouts**

- `userId` (ref to users)
- `date` (timestamp)
- `type` (string: Cardio / Strength / etc.)
- `duration` (number, minutes)
- `intensity` (string: Low / Medium / High)
- `notes` (string, optional)
- `createdAt` (timestamp)

4. **trainers**

- `userId` (ref to users)
- `certifications` (array of strings)
- `specialties` (array of strings)
- `availability` (array of {day, startTime, endTime})
- `traineeIds` (array of refs to users)
- `createdAt` (timestamp)

5. **feedback**

- `trainerId` (ref)
- `traineeId` (ref)
- `workoutId` (ref)
- `message` (string)
- `createdAt` (timestamp)

---

### **4.2 Entity Relationship (Simplified)**

```
[users] <1----* [workouts]
    |         \
    |          \
    |           \
    *            *
[traineeGoals]  [feedback]
    ^             ^
    |             |
[trainers] ------ *
```

- One **trainer** can have multiple trainees.
- One **trainee** can receive multiple feedback entries.
- **TraineeGoals** are one-to-one with a trainee.

---

## **5. Frontend Design**

### **5.1 Pages / Routes**

- `/onboarding` – Multi-step onboarding (trainee/trainer)
- `/dashboard` – Role-specific dashboard
- `/workouts` – Log/view workouts
- `/trainer` – Trainee: view trainer / Trainer: manage trainees
- `/analytics` – Trainee: progress charts / Trainer: trainee reports
- `/profile` – Edit personal info, goals, and preferences

### **5.2 State Management**

- **Zustand**: User auth info, onboarding state, UI state
- **TanStack Query**: Server-state (workouts, trainees, feedback)

### **5.3 Forms & Validation**

- **Zod** schemas for onboarding, workout logging, feedback
- Integrated with React Hook Form or Shadcn components

---

## **6. Backend Design**

- Firebase handles backend (serverless):

  - **Auth:** User registration, role-based login
  - **Firestore:** Data storage
  - **Storage:** Profile pictures, attachments
  - **Cloud Functions (optional):** Notifications, analytics triggers

---

## **7. Testing**

- **Unit Tests:** Vitest for components, stores, and utils
- **Integration Tests:** Form validation, Firebase interaction
- **E2E Tests (optional):** Cypress or Playwright

---

## **8. Security & Roles**

- **Trainee:** Can view/edit own data, log workouts, see feedback
- **Trainer:** Can manage trainees, provide feedback, view reports
- **Firestore Security Rules:** Role-based access control
