# 🛠️ Technical Design Document (TDD)

## Product: FitLink

**Architecture:** Monorepo (The Hytel Way)  
**Product Type:** Freemium SaaS Fitness Tracking & Coaching Platform

---

## 1. Technical Objectives

- End-to-end type safety across frontend and backend
- Clear separation of server state and client/UI state
- Scalable monorepo architecture
- Secure multi-tenant trainer–trainee access control
- High developer experience and maintainability
- Fast, safe iteration via CI/CD

---

## 2. Tech Stack Overview

| Layer         | Technology           |
| ------------- | -------------------- |
| Monorepo      | pnpm + Turborepo     |
| Frontend      | React + Vite         |
| Language      | TypeScript           |
| Styling       | Tailwind CSS         |
| UI Components | Shadcn UI            |
| API Layer     | tRPC                 |
| Server State  | TanStack Query       |
| Client State  | Zustand              |
| Validation    | Zod                  |
| Testing       | Vitest               |
| CI/CD         | GitHub Actions + WIF |

---

## 3. Monorepo Structure

apps/
├── web/
│ ├── src/
│ │ ├── pages/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── stores/
│ │ ├── lib/
│ │ ├── providers/
│ │ └── styles/
│
└── functions/
└── src/trpc/
├── routers/
├── procedures/
├── middleware/
└── context.ts

packages/
├── ui/
├── shared/
├── eslint-config/
└── typescript-config/

---

## 4. State Management Strategy

FitLink uses both **TanStack Query** and **Zustand**, each with a clearly defined role.

### 4.1 TanStack Query (Server State)

Used for:

- Workouts
- Nutrition logs
- Analytics
- Trainer–trainee relationships
- Feedback
- User profile data

Characteristics:

- Cached and refetchable
- Synced with backend
- Invalidated on mutation
- Source of truth for persisted data

Example:

```ts
const { data: workouts } = trpc.workout.list.useQuery()

### 4.2 Zustand (Client / UI State)

Used for:

- Selected trainee
- Dashboard filters
- Date ranges
- Modal and drawer state
- Onboarding progress

type DashboardStore = {
  selectedTraineeId: string | null
  dateRange: 'week' | 'month'
  setSelectedTraineeId: (id: string) => void
  setDateRange: (range: 'week' | 'month') => void
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  selectedTraineeId: null,
  dateRange: 'week',
  setSelectedTraineeId: (id) => set({ selectedTraineeId: id }),
  setDateRange: (range) => set({ dateRange: range }),
}))

5. Frontend Architecture (apps/web)
5.1 Application Providers

<QueryClientProvider client={queryClient}>
  <TRPCProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </TRPCProvider>
</QueryClientProvider>

5.2 Frontend Layers
| Layer      | Responsibility             |
| ---------- | -------------------------- |
| Pages      | Routing and layout         |
| Components | UI composition             |
| Hooks      | Business logic and queries |
| Stores     | UI state (Zustand)         |
| Lib        | Clients and utilities      |

6. Backend Architecture (apps/functions)
6.1 tRPC Context
export type Context = {
  user: AuthUser | null
  db: DatabaseClient
}


6.2 Feature Routers

routers/
├── auth.router.ts
├── user.router.ts
├── workout.router.ts
├── nutrition.router.ts
├── analytics.router.ts
├── trainer.router.ts
├── feedback.router.ts
└── subscription.router.ts

6.3 Example Router
export const workoutRouter = router({
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.db.workout.findMany({
      where: { userId: ctx.user.id },
    })
  }),

  create: protectedProcedure
    .input(CreateWorkoutSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.workout.create({
        data: { ...input, userId: ctx.user.id },
      })
    }),
})

7. Shared Schemas & Types
packages/shared/src/schemas

export const CreateWorkoutSchema = z.object({
  date: z.date(),
  exercises: z.array(
    z.object({
      name: z.string(),
      sets: z.number(),
      reps: z.number(),
      weight: z.number().optional(),
    })
  ),
})

8. Core Domain Models
User

- id
- role (trainee | trainer)
- profile data
- subscription tier

Workout

- id
- traineeId
- date
- exercises
- completion status

NutritionLog

- id
- traineeId
- meals
- macros

TrainerRelationship

- trainerId
- traineeId
- permissions

Feedback

- id
- trainerId
- traineeId
- message
- createdAt

9. Feature-to-Tech Mapping

| Feature           | Frontend           | Backend | State           |
| ----------------- | ------------------ | ------- | --------------- |
| Workout Logging   | React + Shadcn     | tRPC    | Query           |
| Analytics         | Charts + filters   | tRPC    | Query + Zustand |
| Trainer Dashboard | React              | tRPC    | Query           |
| Feedback          | UI + notifications | tRPC    | Query           |
| Onboarding        | Wizard UI          | —       | Zustand         |
| Subscriptions     | UI + guards        | tRPC    | Query           |

10. Data Flow Example

Logging a Workout

1. User submits workout form
2. tRPC mutation is called
3. Input validated with Zod
4. Workout persisted to database
5. workout.list query invalidated
6. UI updates automatically

11. Authentication & Authorization

- Authentication handled via provider and injected into tRPC context
- Role-based authorization enforced server-side
- Trainer access scoped to assigned trainee IDs only

12. Error Handling Strategy
Frontend

- Toast notifications
- Inline validation errors
- Query retries where applicable

Backend

- Zod validation errors
- Typed tRPC errors
- No sensitive data exposure

13. Testing Strategy

Frontend

- Component tests (Vitest)
- Hook and store tests

Backend

- Router unit tests
- Validation and authorization tests

14. Performance Considerations

- TanStack Query caching and invalidation
- Memoized Zustand selectors
- Lazy-loaded dashboard routes
- Minimal client-side state

15. Security Considerations

- Role-based access control
- Tenant isolation
- Secure data access patterns
- Server-side validation only

16. CI/CD & Deployment

- Turborepo pipelines
- GitHub Actions workflows
- WIF-secured GCP deployments
- Automated linting, testing, and builds

17. Future Technical Enhancements

- Real-time trainer updates (WebSockets)
- Offline workout logging
- Mobile apps sharing the same API
- Analytics pre-aggregation
- AI-assisted insights

```
