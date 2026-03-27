# TaskFlow 🚀

A real-time, full-stack project management application built with **NestJS, React, TypeScript, MongoDB, and PostgreSQL**. 

TaskFlow has been designed to replace static "To-Do" lists with interactive **automatic time tracking**, native sub-sessions, and seamless drag-and-drop mechanics.

---

## 🏗️ Architecture Stack

- **PostgreSQL**: Used for Authentication and Workspace structures natively scaling relational data.
- **MongoDB**: Used for high-volume flexible document storage mapped strictly for Boards, Tasks, and Comments.
- **Redis (Bull Queue)**: Orchestrating background async processing for notifications.
- **WebSockets (Socket.io)**: Broadcasting board and task modifications so everyone sees updates immediately.
- **React 18 + TailwindCSS**: Modern, dynamic frontend with intuitive hover states and strict UX/UI logic.

---

## 🔥 Unique Interactive Features (V4)

- **Interactive Time Telemetry**: Simply dragging a task from "To Do" to "In Progress" begins a live visual stopwatch.
- **Session Pausing**: Take breaks by clicking the "Pause" button on your active task cards. It tracks Multi-Session lifecycles autonomously.
- **Dynamic Kanban Borders**: 
  - 🟥 **Red**: Currently active and tracking time.
  - 🟨 **Yellow**: Paused or bounced back to "To Do".
  - 🟩 **Green**: Completed and archived duration.
- **Live UI Notifications**: The native bell component tracks real-time `taskCreated` and `taskMoved` web-socket executions across user sessions, avoiding stale updates.
- **Universal Edit Modals**: Configure task status dropdowns directly from task properties without navigating manual drag layouts.
- **In-App Onboarding**: Native modals instructing users how to navigate the platform dynamically.

---

## 🚀 Setup & Execution

### Pre-Requisites
Execute the following Docker containers configured directly in `docker-compose.yml`:
- **Redis** 
- **MongoDB**
- **Postgres** (Mapped to Port `5433` avoiding local `5432` binds)

### Installation
1. Clone the repository.
2. Initialize and configure both `.env` configurations using the `.env.example` equivalents provided in the respective directories.
3. Once running, **anyone can securely register an account inherently through the frontend Auth signup portal**. Open registration is entirely secure due to decoupled backend databases handling tokens natively.

---
<p align="center">Made by Kushyanth, Copyright © 2026</p>
