# 🗺️ TodoFlow — Phase-wise Execution Plan

> This is the **step-by-step build guide** for TodoFlow.
> Each phase builds on the last. Don't skip ahead — each step must be tested before moving on.
> Check off tasks as you complete them.

---

## 📌 Legend

| Symbol | Meaning |
|--------|---------|
| `[ ]` | Not started |
| `[/]` | In progress |
| `[x]` | Done |
| 🔴 | Blocker — must be resolved before continuing |
| 🟡 | Important — do carefully |
| 🟢 | Quick win |

---

## 🏗️ Phase 0 — Project Scaffolding
> **Goal:** Get both the client and server running locally with no errors.
> **Estimated time:** 2–3 hours

### 0.1 — Repository Setup
- [ ] Create a GitHub repository named `todoflow`
- [ ] Clone it locally into `d:/projects/personal-projects/to-do-list/`
- [ ] Create `.gitignore` in root (ignore `node_modules`, `.env`, `dist`)
- [ ] Create `README.md` with a one-line description

### 0.2 — Backend Scaffold (`server/`)
- [ ] Create the `server/` directory
- [ ] Run `npm init -y` inside `server/`
- [ ] Install core dependencies:
  ```bash
  npm install express cors dotenv
  npm install -D nodemon
  ```
- [ ] Create `server/index.js` — basic Express server on port 5000
- [ ] Create `server/src/app.js` — Express app with `/api/health` test route
- [ ] Add `dev` script to `server/package.json` using nodemon
- [ ] 🧪 **Test:** `GET http://localhost:5000/api/health` returns `{ status: "ok" }`

### 0.3 — Database Setup (Prisma + Supabase)
- [ ] 🔴 Create a Supabase project and copy the **connection string**
- [ ] Install Prisma:
  ```bash
  npm install prisma @prisma/client
  npx prisma init
  ```
- [ ] Paste full schema (User, Todo, Subtask, Tag, Priority) into `prisma/schema.prisma`
- [ ] Create `server/.env` with `DATABASE_URL`, `JWT_SECRET`, `PORT=5000`
- [ ] Run first migration:
  ```bash
  npx prisma migrate dev --name init
  npx prisma generate
  ```
- [ ] Create `server/src/config/db.js` — export singleton PrismaClient
- [ ] 🧪 **Test:** `npx prisma studio` opens and shows all 4 tables

### 0.4 — Frontend Scaffold (`client/`)
- [ ] Scaffold Vite + React app:
  ```bash
  npm create vite@latest client -- --template react
  cd client && npm install
  ```
- [ ] Install Tailwind CSS:
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```
- [ ] Configure `tailwind.config.js` content paths
- [ ] Add Tailwind directives to `src/index.css`
- [ ] Install other frontend dependencies:
  ```bash
  npm install axios zustand react-router-dom
  ```
- [ ] Create `client/.env` with `VITE_API_URL=http://localhost:5000`
- [ ] Clean up the default Vite boilerplate in `App.jsx`
- [ ] 🧪 **Test:** `npm run dev` — blank page loads at `http://localhost:5173` with no console errors

---

## 🧱 Phase 1 — Core CRUD (Backend)
> **Goal:** A working REST API for todos that you can test with a tool like Postman or Thunder Client.
> **Estimated time:** 3–4 hours
> **Note:** No auth yet — we'll use a hardcoded `userId` for now.

### 1.1 — Server Structure
- [ ] Create folder structure inside `server/src/`:
  - `controllers/`, `routes/`, `middleware/`, `schemas/`, `config/`
- [ ] Create `server/src/middleware/error.middleware.js` — global error handler
- [ ] Wire up error middleware in `app.js`

### 1.2 — Zod Validation
- [ ] Install Zod: `npm install zod`
- [ ] Create `server/src/schemas/todo.schema.js`:
  - `createTodoSchema` — requires `title`, optional `description`, `priority`, `dueDate`
  - `updateTodoSchema` — all fields optional
- [ ] Create `server/src/middleware/validate.middleware.js` — reusable Zod middleware

### 1.3 — Todo Routes & Controllers
- [ ] Create `server/src/controllers/todo.controller.js` with handlers:
  - `getAllTodos` — fetch all todos for hardcoded userId
  - `createTodo` — create new todo
  - `getTodoById` — get single todo (with subtasks + tags)
  - `updateTodo` — update fields
  - `deleteTodo` — delete todo
  - `toggleComplete` — flip `completed` boolean
- [ ] Create `server/src/routes/todo.routes.js` — wire routes to controllers
- [ ] Mount todo routes in `app.js` at `/api/todos`

### 1.4 — Test All Todo Endpoints
- [ ] 🧪 `POST /api/todos` — creates a todo, returns it
- [ ] 🧪 `GET /api/todos` — returns array of todos
- [ ] 🧪 `GET /api/todos/:id` — returns single todo
- [ ] 🧪 `PUT /api/todos/:id` — updates and returns todo
- [ ] 🧪 `DELETE /api/todos/:id` — returns `{ message: "Deleted" }`
- [ ] 🧪 `PATCH /api/todos/:id/complete` — flips completed status

---

## 🎨 Phase 1 — Core CRUD (Frontend)
> **Goal:** A working UI where you can add, view, complete, and delete todos.
> **Estimated time:** 4–5 hours

### 1.5 — Zustand Store
- [ ] Create `client/src/store/todoStore.js`:
  - State: `todos`, `isLoading`, `error`
  - Actions: `fetchTodos`, `addTodo`, `deleteTodo`, `toggleTodo`, `updateTodo`

### 1.6 — Axios API Layer
- [ ] Create `client/src/api/todos.api.js` — one function per endpoint
- [ ] Create base Axios instance with `VITE_API_URL` as base URL

### 1.7 — Core Components
- [ ] Create `client/src/components/todos/TodoForm.jsx` — input + submit button
- [ ] Create `client/src/components/todos/TodoItem.jsx` — checkbox, title, delete button
- [ ] Create `client/src/components/todos/TodoList.jsx` — maps over todos
- [ ] Create `client/src/components/common/EmptyState.jsx` — shown when list is empty

### 1.8 — Dashboard Page
- [ ] Create `client/src/pages/DashboardPage.jsx`
- [ ] Wire up: load todos on mount → show list → form adds → delete works
- [ ] Set up React Router in `App.jsx` with route `/` → `DashboardPage`

### 1.9 — Test Frontend CRUD
- [ ] 🧪 Add a todo — appears in list
- [ ] 🧪 Check/uncheck a todo — completed state toggles visually
- [ ] 🧪 Delete a todo — removed from list
- [ ] 🧪 Refresh page — todos persist (loaded from DB)

---

## 📦 Phase 2 — Enrich Tasks
> **Goal:** Todos now have due dates, priorities, tags, subtasks, and descriptions.
> **Estimated time:** 5–6 hours

### 2.1 — Backend Enhancements
- [ ] Update `createTodoSchema` and `updateTodoSchema` to include `priority`, `dueDate`, `description`
- [ ] Create `server/src/routes/subtask.routes.js` + controller handlers:
  - `addSubtask` — POST `/api/todos/:id/subtasks`
  - `toggleSubtask` — PATCH `/api/todos/:id/subtasks/:subId`
  - `deleteSubtask` — DELETE `/api/todos/:id/subtasks/:subId`
- [ ] Create `server/src/schemas/auth.schema.js` (prep for Phase 4)
- [ ] Create tag routes + controller:
  - `getTags`, `createTag`, `deleteTag`
- [ ] 🧪 Test all new endpoints in Postman

### 2.2 — Frontend Enhancements
- [ ] Update `TodoForm.jsx` — add priority dropdown, due date picker, description textarea
- [ ] Update `TodoItem.jsx` — show priority badge, due date, description
- [ ] Create `client/src/components/common/Badge.jsx` — colored pill for priority/tags
- [ ] Create subtask UI inside `TodoItem.jsx` or a modal
- [ ] Create `client/src/utils/priorityHelpers.js` — maps priority → color/label
- [ ] Create `client/src/utils/dateHelpers.js` — formats dates nicely
- [ ] Update `todoStore.js` — add subtask and tag actions
- [ ] 🧪 Test: create todo with priority + due date, add subtasks, add tag

---

## 🔍 Phase 3 — Filtering & UX
> **Goal:** Users can search, filter, and sort their todos. UI feels polished.
> **Estimated time:** 4–5 hours

### 3.1 — Backend Filtering
- [ ] Update `getAllTodos` controller to accept query params:
  - `?completed=true/false`
  - `?priority=HIGH/MEDIUM/LOW`
  - `?tag=tagId`
  - `?search=keyword` (search title + description)
  - `?sortBy=dueDate|priority|createdAt&order=asc|desc`
- [ ] Use Prisma `where` and `orderBy` to implement filtering
- [ ] 🧪 Test each filter combination in Postman

### 3.2 — Frontend Filtering
- [ ] Create `client/src/components/todos/TodoFilters.jsx`:
  - Tabs: All / Active / Completed
  - Dropdown: Filter by priority
  - Dropdown: Filter by tag
  - Search input (debounced)
  - Sort dropdown
- [ ] Create `client/src/components/todos/TodoStats.jsx` — "3 of 7 completed"
- [ ] Update `todoStore.js` — store active filters, pass to API call
- [ ] Wire filters into `DashboardPage.jsx`
- [ ] 🧪 Test: filters update the visible list correctly

### 3.3 — UX Polish (No Auth Yet)
- [ ] Create `client/src/components/layout/Navbar.jsx` — app title + placeholder avatar
- [ ] Create `client/src/components/layout/PageWrapper.jsx` — consistent page padding
- [ ] Ensure `EmptyState.jsx` shows for each filter state
- [ ] Add loading spinner while todos are fetching

---

## 🔐 Phase 4 — Authentication
> **Goal:** Users can sign up, log in, and only see their own todos.
> **Estimated time:** 5–6 hours

### 4.1 — Backend Auth
- [ ] Install: `npm install bcryptjs jsonwebtoken`
- [ ] Create `server/src/controllers/auth.controller.js`:
  - `signup` — hash password, create user, return JWT
  - `login` — verify password, return JWT
  - `getMe` — return current user from token
- [ ] Create `server/src/schemas/auth.schema.js`:
  - `signupSchema` — email, password (min 8 chars), optional name
  - `loginSchema` — email, password
- [ ] Create `server/src/routes/auth.routes.js`
- [ ] Create `server/src/middleware/auth.middleware.js`:
  - Reads `Authorization: Bearer <token>` header
  - Verifies JWT, attaches `req.user` to request
- [ ] 🟡 Protect all `/api/todos` and `/api/tags` routes with auth middleware
- [ ] 🟡 Replace hardcoded `userId` in todo controllers with `req.user.id`
- [ ] 🧪 Test: signup → login → get token → use token to access todos

### 4.2 — Frontend Auth
- [ ] Create `client/src/store/authStore.js`:
  - State: `user`, `token`, `isAuthenticated`
  - Actions: `login`, `logout`, `signup`, `loadUser`
- [ ] Create `client/src/api/auth.api.js`
- [ ] Create `client/src/hooks/useAuth.js`
- [ ] Create `client/src/pages/LoginPage.jsx`
- [ ] Create `client/src/pages/SignupPage.jsx`
- [ ] Update Axios instance — attach JWT token from store to every request header
- [ ] Create Protected Route wrapper in `App.jsx` — redirects to `/login` if not authenticated
- [ ] Update `Navbar.jsx` — show user name + logout button
- [ ] Persist token to `localStorage` — survive page refresh
- [ ] 🧪 Test: sign up → log in → see todos → log out → redirected to login

---

## ✨ Phase 5 — Polish & Delight
> **Goal:** The app feels great to use — animations, dark mode, keyboard shortcuts.
> **Estimated time:** 4–5 hours

### 5.1 — Dark Mode
- [ ] Create `client/src/hooks/useDarkMode.js` — toggle + persist to localStorage
- [ ] Configure Tailwind `darkMode: 'class'` in `tailwind.config.js`
- [ ] Add dark mode classes to all components
- [ ] Add toggle button in `Navbar.jsx`
- [ ] 🧪 Test: toggle persists across refresh

### 5.2 — Drag & Drop Reordering
- [ ] Install: `npm install @dnd-kit/core @dnd-kit/sortable`
- [ ] Wrap `TodoList.jsx` with DnD context
- [ ] On drop: call `PATCH /api/todos/reorder` with new order array
- [ ] Implement `reorderTodos` in backend controller
- [ ] 🧪 Test: drag a todo, refresh — new order is saved

### 5.3 — Animations & Micro-interactions
- [ ] Install: `npm install framer-motion`
- [ ] Animate todo items on add/delete (`AnimatePresence`)
- [ ] Add completion animation (strikethrough transition)
- [ ] Add confetti when all todos are completed 🎉
  ```bash
  npm install canvas-confetti
  ```

### 5.4 — Keyboard Shortcuts & UX
- [ ] `Enter` to submit todo form
- [ ] `Escape` to cancel editing
- [ ] Undo delete — snackbar with 5-second timer
- [ ] Responsive mobile layout — test on 375px viewport

---

## 🚀 Phase 6 — Advanced Features
> **Goal:** Take the app beyond a basic todo list.
> **Estimated time:** Open-ended

### 6.1 — Stats Dashboard
- [ ] Create `client/src/pages/StatsPage.jsx`
- [ ] Install charting library: `npm install recharts`
- [ ] Show: tasks completed per day (bar chart), completion rate (pie chart)
- [ ] Add backend route: `GET /api/todos/stats`

### 6.2 — Recurring Tasks
- [ ] Add `recurring` field to `Todo` model (`DAILY | WEEKLY | NONE`)
- [ ] Run new Prisma migration
- [ ] Logic: when a recurring todo is completed, auto-create next instance

### 6.3 — File Attachments
- [ ] Use Supabase Storage for file uploads
- [ ] Add `attachments` table to Prisma schema
- [ ] Build upload UI in todo detail view

### 6.4 — Push Notifications
- [ ] Use browser Notification API
- [ ] Schedule reminders for todos with due dates approaching

### 6.5 — Collaboration
- [ ] Add `SharedList` model to schema
- [ ] Invite users by email to share a list
- [ ] Real-time updates with WebSockets (Socket.io)

---

## 🧪 Testing Strategy

### Backend Tests (Supertest)
- [ ] Setup Vitest + Supertest in `server/`
- [ ] Test each auth endpoint (signup, login, getMe)
- [ ] Test todo CRUD — valid + invalid inputs
- [ ] Test auth middleware — blocked without token

### Frontend Tests (Vitest)
- [ ] Test `TodoForm` renders and submits
- [ ] Test `TodoItem` toggles and deletes
- [ ] Test `todoStore` actions update state correctly

---

## 📋 Definition of Done Checklist

Before marking any phase complete, verify:

- [ ] All endpoints in that phase are tested in Postman/Thunder Client
- [ ] Frontend UI reflects backend state correctly
- [ ] Errors are handled (bad input, network failure, not found)
- [ ] Code is committed with a clear conventional commit message
- [ ] No `console.log` debug statements left in production code

---

## 📅 Suggested Weekly Schedule

| Week | Focus |
|------|-------|
| Week 1 | Phase 0 (Scaffolding) + Phase 1 Backend |
| Week 2 | Phase 1 Frontend + Phase 2 |
| Week 3 | Phase 3 (Filtering & UX) |
| Week 4 | Phase 4 (Authentication) |
| Week 5 | Phase 5 (Polish) |
| Week 6+ | Phase 6 (Advanced) + Testing |

---

*Last updated: June 2026 — Sync this file with PLAN.md as the project evolves.*
