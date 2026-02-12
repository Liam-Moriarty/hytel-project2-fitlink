# **FitLink Product Design Document **

**Project Name:** FitLink
**Platform:** Web
**Methodology:** Agile (Scrum)
**Version:** 1.1
**Author:** Fernando Jose Ordiales
**Date:** 9/2/2026

---

## **1. Product Vision**

FitLink is a fitness platform connecting trainees and trainers. Trainees can log workouts, track progress, receive feedback, and analyze performance, while trainers can monitor trainees, provide guidance, and manage training plans. The platform supports personalized onboarding for both roles.

---

## **2. Target Users**

1. **Trainees:** Fitness enthusiasts wanting to log workouts, track progress, and receive trainer guidance.
2. **Trainers:** Certified fitness professionals who create training plans, monitor trainee progress, and provide feedback.

---

## **3. Agile Approach**

- **Sprints:** 2 weeks
- **Backlog:** Epics → Features → User Stories
- **Iterations:** Continuous feedback from both trainees and trainers

---

## **4. Epics, Features, and User Stories**

### **TRAINEE SIDE**

**Epic 1: Trainee Onboarding**

- **Goal:** Personalize the trainee experience.
- **Features:** Personal Info, Fitness Goals, Exercise Preferences, Trainer Preferences
- **User Stories:**

  - US1.1 – Enter personal info (name, age, activity level)
  - US1.2 – Set fitness goals
  - US1.3 – Set preferred workouts and frequency
  - US1.4 – Select trainer guidance & notifications

**Epic 2: Trainee Dashboard & Progress Tracking**

- **Goal:** Track and visualize fitness progress
- **Features:** Workout logging, analytics, goal tracking
- **User Stories:**

  - US2.1 – Log workouts (type, duration, intensity)
  - US2.2 – View analytics (graphs, progress charts)
  - US2.3 – Track goal achievement

**Epic 3: Trainer Interaction (Trainee)**

- **Goal:** Connect with trainers
- **Features:** Invite trainer, feedback system, messaging
- **User Stories:**

  - US3.1 – Invite a trainer
  - US3.2 – Receive feedback
  - US3.3 – Messaging & notifications

---

### **TRAINER SIDE**

**Epic 4: Trainer Onboarding**

- **Goal:** Capture trainer info and specialties
- **Features:** Personal Info, Certifications, Expertise Areas
- **User Stories:**

  - US4.1 – Enter trainer profile info (name, experience, certification)
  - US4.2 – Specify specialization (strength, cardio, yoga, HIIT, etc.)
  - US4.3 – Set availability for trainees

- **Requirements:** Validation for certifications, optional profile photo

**Epic 5: Trainer Dashboard**

- **Goal:** Allow trainers to manage trainees and workouts
- **Features:** Trainee list, Workout plans, Analytics
- **User Stories:**

  - US5.1 – View list of assigned trainees
  - US5.2 – Create and assign workout plans
  - US5.3 – Track trainee progress and performance trends

**Epic 6: Trainer Feedback & Communication**

- **Goal:** Enable trainers to guide trainees effectively
- **Features:** Feedback system, Messaging, Notifications
- **User Stories:**

  - US6.1 – Send feedback to trainees on workouts
  - US6.2 – Message trainees in-app
  - US6.3 – Receive notifications on trainee activity or requests

**Epic 7: Trainer Reports & Insights**

- **Goal:** Provide actionable insights for trainers
- **Features:** Trainee performance reports, Progress analytics
- **User Stories:**

  - US7.1 – View weekly/monthly trainee progress
  - US7.2 – Generate reports for multiple trainees
  - US7.3 – Highlight underperforming or high-achieving trainees

---

### **5. Shared Features for Both Roles**

- **Authentication & Authorization:** Login/Register as Trainee or Trainer
- **Profile Management:** Edit personal info, preferences, and account settings

---

### **6. Non-Functional Requirements**

- Platform: Web, iOS, Android
- Security: Encrypted data, role-based access control
- Performance: Load main dashboard < 2 seconds
- Scalability: Support multiple trainees per trainer
- Accessibility: WCAG compliance

---

### **7. Agile Implementation Notes**

- **Backlog Organization:** Separate backlogs for Trainee and Trainer epics
- **Sprint Planning:** Mix high-priority trainee and trainer stories to deliver complete features
- **Daily Standups & Retrospective:** Track progress and adjust based on feedback from both user types
