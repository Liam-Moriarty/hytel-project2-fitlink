# **FitLink To-Do List**

## **1. Project Setup**

- [ ] Initialize Turborepo monorepo
- [ ] Setup PNPM workspace
- [ ] Create `apps/web` folder for React frontend
- [ ] Create `packages/ui` for shared Shadcn components
- [ ] Create `packages/store` for Zustand stores
- [ ] Setup Vite + TypeScript
- [ ] Install dependencies: React, Tailwind CSS, Shadcn, Zustand, TanStack Query, Zod, Firebase SDK
- [ ] Configure Vitest for unit testing

---

## **2. Firebase Setup**

- [ ] Setup Firebase project
- [ ] Enable Firebase Auth (email/password login)
- [ ] Configure Firestore database
- [ ] Setup Firebase Storage (profile pics, media uploads)
- [ ] Setup initial Firestore collections: `users`, `traineeGoals`, `workouts`, `trainers`, `feedback`, `notifications`
- [ ] Write Firestore Security Rules for role-based access

---

## **3. Trainee Features**

### **3.1 Onboarding**

- [ ] Step 1: Personal info (name, age, gender, activity level, optional: height/weight)
- [ ] Step 2: Fitness goals (goal type, timeline)
- [ ] Step 3: Exercise preferences (workout types, frequency, duration)
- [ ] Step 4 (Optional): Trainer & notifications preferences
- [ ] Validate onboarding forms with Zod
- [ ] Persist onboarding data to Firestore (`users`, `traineeGoals`)

### **3.2 Dashboard**

- [ ] Display overall progress (charts/graphs using data from workouts)
- [ ] Show goal achievement status
- [ ] Display trainer info
- [ ] Integrate TanStack Query to fetch workouts and progress

### **3.3 Workouts**

- [ ] Log new workouts (type, duration, intensity, notes)
- [ ] Edit/delete workouts
- [ ] Sync workouts with Firestore
- [ ] Visualize workout history

### **3.4 Trainer Interaction**

- [ ] Invite trainer (link trainee to trainer)
- [ ] View trainer feedback for workouts
- [ ] Messaging / notifications from trainer
- [ ] Display notifications on dashboard

---

## **4. Trainer Features**

### **4.1 Onboarding**

- [ ] Enter personal info (name, experience, certification)
- [ ] Select specialties (strength, cardio, yoga, etc.)
- [ ] Set availability for trainees

### **4.2 Dashboard**

- [ ] View list of assigned trainees
- [ ] Track trainee progress (workouts, goals, analytics)
- [ ] Generate weekly/monthly trainee reports

### **4.3 Feedback & Communication**

- [ ] Send feedback to trainee workouts
- [ ] Messaging system for trainees
- [ ] Receive notifications on trainee activity or requests

---

## **5. Shared / System Features**

- [ ] Authentication: Role-based login (trainee or trainer)
- [ ] Profile management: Edit personal info, preferences
- [ ] Notifications: Push/email for goal milestones, feedback, reminders
- [ ] Validation: All forms validated using Zod
- [ ] State management: Setup Zustand for UI state + user state
- [ ] Server state: Setup TanStack Query for Firestore reads/writes
- [ ] Testing: Unit tests for forms, stores, components (Vitest)

---

## **6. Design & UI**

- [ ] Design UI for onboarding (3–4 steps)
- [ ] Design dashboards (trainee vs trainer)
- [ ] Design workout logging pages
- [ ] Design trainer management pages
- [ ] Responsive design using Tailwind + Shadcn

---

## **7. Optional / Future Enhancements**

- [ ] Cloud Functions for automated notifications
- [ ] Export / share progress reports
- [ ] Multi-trainer support per trainee
- [ ] Gamification: badges, achievements
