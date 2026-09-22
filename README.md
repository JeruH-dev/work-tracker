# Work Tracker

> **A focused personal work-management system for turning plans into actions, actions into outcomes, and outcomes into a reliable record of work.**

Work Tracker is a personal work-management MVP built with **Next.js, TypeScript, PostgreSQL, and Prisma**. It is designed to manage daily actions, projects, priorities, deadlines, progress, and activity from a single workspace.

The project is intentionally being developed in phases: start with a dependable personal tracker, then evolve it into a richer system for project management, reporting, analytics, automation, and AI-assisted productivity.

---

## ✨ What is Work Tracker?

Traditional to-do lists answer:

> **"What do I need to do?"**

Work Tracker is designed to answer a broader set of questions:

- What do I need to do?
- What am I currently working on?
- What is due today?
- What is overdue or blocked?
- What have I actually accomplished?
- What happened on a task?
- What is the next action?
- How is each project progressing?
- What did I achieve this week or month?

The core workflow is:

```text
Task
  ↓
Action
  ↓
Progress
  ↓
Outcome
  ↓
Next Action
```

This makes the application useful not only as a task manager, but also as a lightweight **personal work log and project-tracking system**.

---

## 🚀 Current Status

**Development stage:** Phase 1 — MVP / Foundation

### Currently implemented

- [x] Next.js application
- [x] TypeScript
- [x] PostgreSQL database
- [x] Prisma ORM
- [x] User registration
- [x] User sign-in/sign-out
- [x] Signed HTTP-only sessions
- [x] Password hashing with Node.js `scrypt`
- [x] Email verification flow
- [x] Resend email integration
- [x] Authenticated API routes
- [x] Task CRUD API
- [x] Project CRUD API
- [x] Dashboard API
- [x] Server-side ownership enforcement
- [x] Environment-based configuration

### In active development

- [ ] Dashboard UI
- [ ] Task management UI
- [ ] Project management UI
- [ ] Activity logging
- [ ] Search and filtering
- [ ] Improved validation and error states
- [ ] Responsive application shell

### Planned

- [ ] Kanban board
- [ ] Calendar
- [ ] Milestones
- [ ] Recurring tasks
- [ ] Time tracking
- [ ] Notifications
- [ ] Daily/weekly/monthly reports
- [ ] Analytics
- [ ] Export to PDF/Excel
- [ ] AI-assisted productivity
- [ ] Production deployment

---

# 🧭 Product Roadmap

## Phase 1 — Core Work Tracker

**Goal:** Build a dependable personal work-management MVP.

Focus:

- Authentication
- Tasks
- Projects
- Dashboard
- Statuses
- Priorities
- Deadlines
- Ownership
- Activity history
- Search/filtering
- Database persistence

**Target:** `v0.1.x`

---

## Phase 2 — Productivity

**Goal:** Make the tracker useful for day-to-day planning and execution.

Planned features:

- Kanban board
- Calendar view
- Milestones
- Recurring tasks
- Time tracking
- Task dependencies
- Reminders
- Project timelines

**Target:** `v0.2.x`

---

## Phase 3 — Reporting & Analytics

**Goal:** Turn recorded work into useful information.

Planned features:

- Daily activity reports
- Weekly work summaries
- Monthly reports
- Project progress reports
- Completion-rate analytics
- Workload analytics
- Overdue-task trends
- PDF/Excel exports

**Target:** `v0.3.x`

---

## Phase 4 — Automation & AI

**Goal:** Reduce repetitive planning and reporting work.

Potential features:

- AI daily planning
- Natural-language task creation
- Meeting notes → action items
- Automatic weekly summaries
- Next-action suggestions
- Workload insights
- Natural-language search
- Automated reporting

**Target:** `v1.0.0`

---

# 🏗️ Architecture

Work Tracker follows a **modular monolith** architecture.

```text
                         Browser
                            │
                            ▼
                    ┌───────────────┐
                    │    Next.js    │
                    │   App Router  │
                    └───────┬───────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
        Server Components       API / Server Actions
                │                       │
                └───────────┬───────────┘
                            ▼
                     Service / Logic
                            │
                            ▼
                         Prisma
                            │
                            ▼
                      PostgreSQL
```

### Architectural principle

```text
UI
 ↓
Server/API boundary
 ↓
Business logic
 ↓
Database access
 ↓
PostgreSQL
```

Business rules should not be scattered throughout React components.

---

# 🧰 Technology Stack

| Area | Technology |
|---|---|
| Framework | Next.js |
| UI | React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | Custom session-based authentication |
| Password hashing | Node.js `scrypt` |
| Email | Resend |
| Validation | Zod |
| Forms | React Hook Form |
| Icons | Lucide React |
| Date utilities | date-fns |
| Testing | Vitest / React Testing Library / Playwright |
| Deployment | Vercel + PostgreSQL-compatible hosting |

The exact installed dependency versions are defined by `package.json` and `package-lock.json`.

---

# 📁 Project Structure

The project is organized around the Next.js App Router with room for feature-specific modules.

```text
work-tracker/
│
├── .agents/                  # AI-agent project configuration
├── .claude/                  # Claude project configuration
├── .cursor/                  # Cursor project configuration
├── .devin/                   # Devin project configuration
│
├── public/                   # Static assets
│
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Development seed data
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── tasks/
│   │   │   ├── projects/
│   │   │   ├── activity/
│   │   │   ├── calendar/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── tasks/
│   │   │   ├── projects/
│   │   │   └── dashboard/
│   │   │
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── tasks/
│   │   ├── projects/
│   │   └── activity/
│   │
│   ├── lib/
│   │   ├── auth/
│   │   ├── db/
│   │   ├── services/
│   │   ├── validations/
│   │   ├── utils/
│   │   └── constants/
│   │
│   ├── hooks/
│   └── types/
│
├── .env.example
├── .env.local                # Local secrets; never commit
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── prisma.config.ts
├── README.md
└── tsconfig.json
```

> Some directories above represent the intended architecture and may be introduced as the corresponding features are implemented.

---

# 🗃️ Core Data Model

The initial domain model is intentionally simple:

```text
                         ┌──────────┐
                         │   User   │
                         └────┬─────┘
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
           ┌───────────┐             ┌───────────┐
           │  Project  │             │   Task    │
           └─────┬─────┘             └─────┬─────┘
                 │                         │
                 └────────────┬────────────┘
                              ▼
                        ┌───────────┐
                        │ Activity  │
                        └───────────┘
```

## User

Represents an authenticated user.

Typical data:

- ID
- Name
- Email
- Password hash
- Verification status
- Created/updated timestamps

## Project

Represents a body of related work.

Potential data:

- Name
- Description
- Status
- Priority
- Start date
- Target date
- Progress
- Owner

## Task

Represents an individual action or deliverable.

Potential data:

- Title
- Description
- Project
- Status
- Priority
- Start date
- Due date
- Progress
- Estimated time
- Actual time
- Next action
- Blocker
- Completion date
- Owner

## Activity

Represents work actually performed against a task.

Example:

```text
Date:
22 September 2026

Task:
Redesign careers page

Activity:
Reviewed the existing page structure and prepared the revised content layout.

Outcome:
New job-advert section structure completed.

Next action:
Implement responsive layout.
```

---

# 🔐 Authentication & Security

Work Tracker currently uses application-managed authentication.

### Session security

Sessions are stored using:

- Signed session cookies
- HTTP-only cookies
- Server-side authentication checks

### Password security

Passwords are:

- Hashed using Node.js `scrypt`
- Never stored in plain text
- Never returned to the browser

### Email verification

Verification emails are sent through **Resend**.

### Ownership enforcement

Task and project ownership is derived from the authenticated session on the server.

Clients do **not** submit:

```text
ownerId
assigneeId
```

as a way to determine ownership.

The server determines the authenticated user and uses that identity when reading or modifying protected resources.

This prevents a client from simply changing an ID to access another user's records.

---

# ⚙️ Getting Started

## 1. Prerequisites

Install:

- Node.js LTS
- npm
- Git
- PostgreSQL
- VS Code or another TypeScript-compatible editor

Verify the installations:

```bash
node -v
npm -v
git --version
```

Verify PostgreSQL using the PostgreSQL tools installed on your system.

---

## 2. Clone the repository

```bash
git clone <repository-url>
cd work-tracker
```

> Run project-level npm, Prisma, and Next.js commands from the directory containing `package.json`.

---

## 3. Install dependencies

```bash
npm install
```

---

## 4. Configure environment variables

Copy:

```text
.env.example
```

to:

```text
.env
```

or use the environment-file convention configured by the project.

The development environment requires:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/work_tracker"

SESSION_SECRET="replace-with-a-random-secret-of-at-least-32-characters"

RESEND_API_KEY="re_xxxxxxxxxxxxx"

EMAIL_FROM="Work Tracker <noreply@example.com>"
```

### Important

`SESSION_SECRET` should be a strong random value of **at least 32 characters**.

Never commit:

```text
.env
.env.local
```

to Git.

---

## 5. Configure PostgreSQL

Create a development database, for example:

```sql
CREATE DATABASE work_tracker;
```

Then configure:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/work_tracker"
```

Use the actual PostgreSQL username, password, host, port, and database name for your environment.

---

## 6. Apply the Prisma schema

The current development setup uses:

```bash
npx prisma db push
```

This synchronizes the Prisma schema with the development database.

For a production-grade migration history, the project should transition to a migration-first workflow:

```bash
npx prisma migrate dev --name initial_schema
```

and later:

```bash
npx prisma migrate deploy
```

The migration workflow should become the preferred approach before production deployment.

---

## 7. Generate Prisma Client

```bash
npx prisma generate
```

---

## 8. Seed development data

If a Prisma seed command is configured:

```bash
npx prisma db seed
```

Seed data should be:

- Safe for local development
- Clearly identifiable as sample data
- Free of real credentials
- Free of sensitive production information

---

## 9. Start the development server

```bash
npm run dev
```

Or, depending on the package manager:

```bash
yarn dev
```

```bash
pnpm dev
```

```bash
bun dev
```

Open:

**http://localhost:3000**

---

# 🧪 Development Commands

Common commands:

```bash
npm run dev
```

Start the development server.

```bash
npm run build
```

Create a production build.

```bash
npm run start
```

Start the production server.

```bash
npm run lint
```

Run ESLint.

### Prisma

```bash
npx prisma generate
```

Generate Prisma Client.

```bash
npx prisma db push
```

Synchronize the schema during early/local development.

```bash
npx prisma migrate dev
```

Create and apply a development migration.

```bash
npx prisma migrate deploy
```

Apply existing migrations in a deployment environment.

```bash
npx prisma studio
```

Open Prisma Studio to inspect the database.

---

# 🔌 API

Protected task, project, and dashboard endpoints require an authenticated session.

## Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/register` | Create an account |
| `POST` | `/api/auth/sign-in` | Sign in |
| `POST` | `/api/auth/sign-out` | Sign out |
| `GET` | `/api/auth/session` | Get current session |

---

## Tasks

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/tasks` | List tasks |
| `POST` | `/api/tasks` | Create a task |
| `GET` | `/api/tasks/:id` | Get a task |
| `PATCH` | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |

---

## Projects

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/projects` | List projects |
| `POST` | `/api/projects` | Create a project |
| `GET` | `/api/projects/:id` | Get a project |
| `PATCH` | `/api/projects/:id` | Update a project |
| `DELETE` | `/api/projects/:id` | Delete a project |

---

## Dashboard

```text
GET /api/dashboard
```

Returns dashboard-level information for the authenticated user.

---

# 🔄 Development Workflow

A typical feature should follow:

```text
Requirement
    ↓
Define data model
    ↓
Update Prisma schema
    ↓
Create migration
    ↓
Implement service/business logic
    ↓
Implement API / Server Action
    ↓
Add validation
    ↓
Build UI
    ↓
Test
    ↓
Lint
    ↓
Build
    ↓
Commit
```

This keeps the application layers predictable and makes debugging easier.

---

# 🌿 Git Workflow

The project uses Git for source control.

### Main branches

```text
main
develop
feature/*
fix/*
refactor/*
docs/*
chore/*
```

### Example feature branch

```bash
git checkout develop
git pull
git checkout -b feature/task-management
```

### Commit

```bash
git add .
git commit -m "feat: add task management"
```

### Suggested commit prefixes

```text
feat:       New functionality
fix:        Bug fix
refactor:   Code restructuring
style:      Styling-only changes
docs:       Documentation
test:       Tests
chore:      Tooling/dependency/configuration
```

Examples:

```bash
git commit -m "feat: add project creation"
```

```bash
git commit -m "fix: prevent unauthorized task access"
```

```bash
git commit -m "docs: update database setup"
```

---

# 🧪 Testing Strategy

Testing will expand as the application grows.

## Unit tests

For isolated logic:

- Date calculations
- Task status calculations
- Progress calculations
- Validation
- Filtering
- Utility functions

## Integration tests

For:

- Authentication
- Task services
- Project services
- Database operations
- Server actions/API routes

## End-to-end tests

Important workflows should eventually be tested from the user's perspective:

```text
Register
   ↓
Verify email
   ↓
Sign in
   ↓
Create project
   ↓
Create task
   ↓
Update task
   ↓
Record activity
   ↓
Complete task
   ↓
Verify dashboard
```

---

# 🛡️ Security Guidelines

The application should follow these rules throughout development:

- Never expose database credentials to the browser.
- Never store plain-text passwords.
- Never commit secrets.
- Validate all client-controlled input on the server.
- Authenticate protected requests.
- Authorize access to every user-owned record.
- Do not trust client-supplied ownership IDs.
- Use secure, HTTP-only session cookies.
- Avoid logging passwords, session secrets, API keys, or tokens.
- Keep production and development credentials separate.
- Use least-privilege access where practical.

### The key authorization rule

A user must not gain access to another user's data simply by changing:

```text
/tasks/123
```

to:

```text
/tasks/124
```

Every protected record lookup must verify ownership on the server.

---

# ⚡ Performance & Scalability

The initial architecture intentionally uses a modular monolith.

This is appropriate for the project's current scope because it provides:

- Simple development
- Fewer deployment components
- Easier debugging
- Lower operational complexity
- Clear separation of application layers

Future optimization options include:

- Database indexes
- Pagination
- Server-side filtering
- Query optimization
- Caching
- Background jobs
- Rate limiting
- Connection pooling
- Object storage for attachments

Microservices should only be considered if actual scale and operational requirements justify them.

---

# 📊 Reporting Philosophy

One of the long-term goals of Work Tracker is to make recorded work useful for reporting.

Instead of manually reconstructing what happened during a week, the application should be able to derive a report from:

```text
Tasks
+
Activities
+
Outcomes
+
Projects
+
Dates
+
Status changes
```

For example:

```text
WEEKLY WORK SUMMARY
────────────────────────────────────

Projects:
3 active

Tasks:
18 completed
7 in progress
2 overdue

Activities:
34 recorded

Major outcomes:
• Careers page redesign completed
• Project documentation updated
• Database integration completed

Outstanding:
• Final UI testing
• Stakeholder review

Next actions:
• Address review comments
• Deploy updated version
```

The goal is to make reporting a consequence of good record-keeping rather than another manual chore.

---

# 🤖 Future AI Integration

AI features are intentionally planned for a later phase.

Potential capabilities:

### Daily planning

Input:

```text
What do I need to get done today?
```

The system could use current tasks, deadlines, priorities, and project status to produce a structured work plan.

### Activity summarization

The system could transform multiple activity entries into:

```text
Today's Work Summary
```

### Meeting → action items

Meeting notes could be converted into structured tasks.

### Weekly report generation

Recorded activities could become a professional weekly report without manually reconstructing the week's work.

### Next-action suggestions

For a task such as:

```text
Website redesign
```

the system could suggest possible next actions based on existing project context.

AI should remain an **assistant to the underlying work-management system**, not a replacement for structured records.

---

# 🚀 Deployment

The planned production architecture is:

```text
                    Internet
                       │
                       ▼
                    Vercel
                       │
                       ▼
                  Next.js App
                       │
                       ▼
                    Prisma
                       │
                       ▼
             Hosted PostgreSQL
```

Before deployment:

```bash
npm run lint
npm run build
```

Production environment variables must be configured in the hosting environment.

Never deploy development secrets or commit `.env` files.

---

# 🐛 Troubleshooting

## `npm install` cannot find `package.json`

Make sure you are inside the actual project:

```bash
cd work-tracker
```

Verify:

```bash
ls
```

You should see:

```text
package.json
```

---

## npm reports `ECOMPROMISED`, `EEXIST`, or `ENOENT`

First verify the npm cache:

```bash
npm cache verify
```

If the cache is genuinely corrupted:

```bash
npm cache clean --force
```

Then retry the installation.

Avoid repeatedly deleting the cache unless there is an actual cache problem.

---

## Windows reports `ENOTEMPTY` while installing packages

Close:

- Running Next.js servers
- Prisma Studio
- VS Code terminals using the project
- Other Node processes using the project

Then retry:

```bash
npm install
```

---

## Next.js cache problems

Delete the generated `.next` directory:

```bash
rm -rf .next
```

Then:

```bash
npm run dev
```

---

## Prisma problems

Check:

```bash
npx prisma --version
```

Check installed packages:

```bash
npm ls prisma @prisma/client
```

Inspect the database:

```bash
npx prisma studio
```

---

## Dependency vulnerabilities

Run:

```bash
npm audit
```

Review the affected dependency tree before applying fixes.

Avoid immediately using:

```bash
npm audit fix --force
```

because forced upgrades can introduce breaking changes.

---

# 📌 Versioning

The project follows semantic versioning:

```text
MAJOR.MINOR.PATCH
```

Examples:

```text
0.1.0
0.2.0
0.3.0
1.0.0
```

Suggested milestones:

| Version | Milestone |
|---|---|
| `v0.1.x` | Core Work Tracker MVP |
| `v0.2.x` | Productivity features |
| `v0.3.x` | Reporting & analytics |
| `v1.0.0` | Stable production release |

Before `1.0.0`, architectural and feature changes may still occur as the product matures.

---

# 🗺️ Product Vision

Work Tracker is not intended to become another bloated productivity application with dozens of features that are rarely used.

The development direction is:

```text
Simple
  ↓
Reliable
  ↓
Structured
  ↓
Insightful
  ↓
Automated
```

The application should make it easy to record work without creating additional administrative work.

The long-term vision is a system where:

> **Plans become tasks. Tasks produce activities. Activities produce outcomes. Outcomes build project history. Project history produces useful reports and insights.**

That creates a continuous record of work rather than a collection of disconnected to-do items.

---

# 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn](https://nextjs.org/learn)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Resend Documentation](https://resend.com/docs)

---

# 📄 License

This project is currently intended as a **personal/private development project**.

A formal open-source license should be added if the repository is later made public or distributed externally.

---

## 👨‍💻 Development Note

Work Tracker is being developed incrementally with an emphasis on:

- Clean architecture
- Maintainable TypeScript
- Secure authentication
- Reliable data ownership
- Practical UX
- Useful reporting
- Progressive enhancement

The priority is not simply to ship features quickly.

The priority is to build a system that remains understandable and maintainable as it grows.
