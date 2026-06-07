# 📋 TodoFlow — Project Plan

> A full-stack to-do application built with React, Node.js, Express, Prisma, and PostgreSQL.
> This document serves as the single source of truth for project context, architecture, and development roadmap.

---

## 🧭 Project Overview

| Field | Detail |
|---|---|
| **Project Name** | TodoFlow |
| **Type** | Full-Stack Web Application |
| **Goal** | A feature-rich, scalable to-do app to learn full-stack development |
| **Developer** | Beginner — learning by building |
| **Target** | Personal productivity + portfolio project |

---

## 🧱 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + Vite | UI, component-based architecture |
| **Styling** | Tailwind CSS | Utility-first responsive design |
| **State Management** | Zustand | Lightweight global state |
| **HTTP Client** | Axios | API requests from frontend |
| **Backend** | Node.js + Express | REST API server |
| **ORM** | Prisma | Type-safe database access |
| **Database** | PostgreSQL (Supabase) | Relational data, free cloud tier |
| **Auth** | JWT (JSON Web Tokens) | Secure user authentication |
| **Validation** | Zod | Schema validation on backend |
| **Testing** | Vitest + Supertest | Unit and integration tests |

---

## 🗂️ Scalable Project Architecture

```
todoflow/
│
├── client/                          # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── api/                     # Axios API call functions
│   │   │   ├── auth.api.js
│   │   │   └── todos.api.js
│   │   │
│   │   ├── components/              # Reusable UI components
│   │   │   ├── common/              # Generic components
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   └── EmptyState.jsx
│   │   │   │
│   │   │   ├── layout/              # Layout components
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── PageWrapper.jsx
│   │   │   │
│   │   │   └── todos/               # Todo-specific components
│   │   │       ├── TodoItem.jsx
│   │   │       ├── TodoList.jsx
│   │   │       ├── TodoForm.jsx
│   │   │       ├── TodoFilters.jsx
│   │   │       └── TodoStats.jsx
│   │   │
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useTodos.js
│   │   │   ├── useAuth.js
│   │   │   └── useDarkMode.js
│   │   │
│   │   ├── pages/                   # Route-level page components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── StatsPage.jsx
│   │   │
│   │   ├── store/                   # Zustand global state
│   │   │   ├── authStore.js
│   │   │   └── todoStore.js
│   │   │
│   │   ├── utils/                   # Helper functions
│   │   │   ├── dateHelpers.js
│   │   │   └── priorityHelpers.js
│   │   │
│   │   ├── App.jsx                  # Root component + routes
│   │   └── main.jsx                 # React entry point
│   │
│   ├── .env                         # VITE_API_URL=http://localhost:5000
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # Node.js + Express Backend
│   ├── src/
│   │   ├── config/                  # App configuration
│   │   │   ├── db.js                # Prisma client instance
│   │   │   └── env.js               # Validated env variables
│   │   │
│   │   ├── controllers/             # Route handler logic
│   │   │   ├── auth.controller.js
│   │   │   ├── todo.controller.js
│   │   │   └── user.controller.js
│   │   │
│   │   ├── middleware/              # Express middleware
│   │   │   ├── auth.middleware.js   # JWT verification
│   │   │   ├── error.middleware.js  # Global error handler
│   │   │   └── validate.middleware.js # Zod schema validation
│   │   │
│   │   ├── routes/                  # Express route definitions
│   │   │   ├── auth.routes.js
│   │   │   ├── todo.routes.js
│   │   │   └── user.routes.js
│   │   │
│   │   ├── schemas/                 # Zod validation schemas
│   │   │   ├── auth.schema.js
│   │   │   └── todo.schema.js
│   │   │
│   │   └── app.js                   # Express app setup
│   │
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema
│   │   └── migrations/              # Auto-generated migrations
│   │
│   ├── index.js                     # Server entry point
│   ├── .env                         # DATABASE_URL, JWT_SECRET, PORT
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🗃️ Database Schema (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  todos     Todo[]
  tags      Tag[]
}

model Todo {
  id          String    @id @default(cuid())
  title       String
  description String?
  completed   Boolean   @default(false)
  priority    Priority  @default(MEDIUM)
  dueDate     DateTime?
  order       Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  subtasks    Subtask[]
  tags        Tag[]     @relation("TodoTags")
}

model Subtask {
  id        String   @id @default(cuid())
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())

  todoId    String
  todo      Todo     @relation(fields: [todoId], references: [id], onDelete: Cascade)
}

model Tag {
  id    String @id @default(cuid())
  name  String
  color String @default("#6366f1")

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  todos  Todo[] @relation("TodoTags")
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login, returns JWT | No |
| GET | `/api/auth/me` | Get current user info | Yes |

### Todos
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/todos` | Get all todos (with filters) | Yes |
| POST | `/api/todos` | Create a new todo | Yes |
| GET | `/api/todos/:id` | Get single todo | Yes |
| PUT | `/api/todos/:id` | Update a todo | Yes |
| DELETE | `/api/todos/:id` | Delete a todo | Yes |
| PATCH | `/api/todos/:id/complete` | Toggle complete | Yes |
| PATCH | `/api/todos/reorder` | Update order after drag-drop | Yes |

### Subtasks
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/todos/:id/subtasks` | Add subtask | Yes |
| PATCH | `/api/todos/:id/subtasks/:subId` | Toggle subtask complete | Yes |
| DELETE | `/api/todos/:id/subtasks/:subId` | Delete subtask | Yes |

### Tags
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/tags` | Get all user tags | Yes |
| POST | `/api/tags` | Create a tag | Yes |
| DELETE | `/api/tags/:id` | Delete a tag | Yes |

---

## ✅ Feature List & Build Phases

### Phase 1 — Core CRUD (Week 1)
- [ ] Add a task
- [ ] View all tasks
- [ ] Mark task complete / incomplete
- [ ] Delete a task
- [ ] Edit a task inline

### Phase 2 — Enrich Tasks (Week 2)
- [ ] Due dates on tasks
- [ ] Priority levels (Low / Medium / High)
- [ ] Categories / Tags with color
- [ ] Subtasks (break task into steps)
- [ ] Notes / Description field on each task

### Phase 3 — Filtering & UX (Week 3)
- [ ] Filter by: All / Active / Completed
- [ ] Filter by priority
- [ ] Filter by tag
- [ ] Search bar (keyword search)
- [ ] Sort by: date, priority, alphabetically
- [ ] Task counter ("3 of 7 completed")
- [ ] Empty state UI

### Phase 4 — Authentication (Week 4)
- [ ] User signup
- [ ] User login
- [ ] JWT-protected API routes
- [ ] Protected frontend routes
- [ ] Logout
- [ ] Each user sees only their own todos

### Phase 5 — Polish & Delight (Week 5)
- [ ] Dark mode toggle
- [ ] Drag & drop task reordering
- [ ] Smooth add/delete animations
- [ ] Undo delete (snackbar)
- [ ] Keyboard shortcuts (Enter to add, Esc to cancel)
- [ ] Confetti when all tasks completed 🎉
- [ ] Responsive mobile design

### Phase 6 — Advanced (Week 6+)
- [ ] File attachments per task
- [ ] Recurring tasks (daily / weekly)
- [ ] Browser push notifications for due dates
- [ ] Collaboration (share list with another user)
- [ ] Stats dashboard (tasks completed per day chart)
- [ ] Activity log per task

---

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                              │
│                                                             │
│   React UI  ──►  Zustand Store  ──►  Axios API calls       │
│       ▲                                      │              │
│       └──────────────────────────────────────┘              │
└─────────────────────────────┬───────────────────────────────┘
                              │ HTTP (JSON)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     EXPRESS SERVER                          │
│                                                             │
│   Routes  ──►  Middleware  ──►  Controllers                 │
│                  (JWT Auth)         │                        │
│                  (Zod Validate)     ▼                       │
│                               Prisma ORM                    │
└─────────────────────────────┬───────────────────────────────┘
                              │ SQL queries
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   PostgreSQL (Supabase)                      │
│                                                             │
│   Users  ──  Todos  ──  Subtasks  ──  Tags                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
# Clone the repo
git clone https://github.com/yourusername/todoflow.git
cd todoflow

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Setup Environment Variables

```bash
# server/.env
DATABASE_URL="postgresql://..."   # From Supabase
JWT_SECRET="your-secret-key"
PORT=5000

# client/.env
VITE_API_URL=http://localhost:5000
```

### 3. Setup Database

```bash
cd server
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run the App

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

App runs at `http://localhost:5173`

---

## 📐 Coding Conventions

- **Component files**: PascalCase (`TodoItem.jsx`)
- **Utility/hook files**: camelCase (`useTodos.js`)
- **API files**: camelCase with `.api.js` suffix (`todos.api.js`)
- **Constants**: UPPER_SNAKE_CASE
- **Commits**: Use conventional commits — `feat:`, `fix:`, `chore:`
- **Branches**: `feature/add-dark-mode`, `fix/delete-bug`

---

## 🎯 Definition of Done

A feature is considered **done** when:
1. It works correctly end-to-end (frontend → backend → database)
2. It handles errors gracefully (invalid input, network failure)
3. It looks good on both desktop and mobile
4. The code is committed with a clear commit message

---

*Last updated: June 2026 — Built with ❤️ as a learning project*
