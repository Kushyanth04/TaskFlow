# TaskFlow

> Real-time project management platform with Kanban boards, drag-and-drop tasks, and team collaboration.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socket.io&logoColor=white)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  Login/   │  │Dashboard │  │  Kanban  │  │ Notification  │  │
│  │  Signup   │  │  Page    │  │  Board   │  │    Bell       │  │
│  └──────────┘  └──────────┘  └──────────┘  └───────────────┘  │
│            Axios (REST)            Socket.io (WebSocket)        │
└────────────────────┬──────────────────┬────────────────────────┘
                     │                  │
┌────────────────────┴──────────────────┴────────────────────────┐
│                     BACKEND (NestJS)                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │   Auth   │  │  Tasks   │  │  Boards  │  │  Workspaces   │  │
│  │  Module  │  │  Module  │  │  Module  │  │    Module     │  │
│  └──────────┘  └──────────┘  └──────────┘  └───────────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│  │   JWT    │  │ WebSocket│  │   Bull   │                     │
│  │ Strategy │  │ Gateway  │  │  Queue   │                     │
│  └──────────┘  └──────────┘  └──────────┘                     │
└────────┬───────────────┬───────────────┬──────────────────────┘
         │               │               │
    ┌────┴────┐   ┌──────┴──────┐  ┌─────┴─────┐
    │PostgreSQL│   │   MongoDB   │  │   Redis   │
    │ Users    │   │ Tasks       │  │ Bull Jobs │
    │Workspaces│   │ Boards      │  │           │
    └─────────┘   └─────────────┘  └───────────┘
```

## Tech Stack

| Layer      | Technology                                         |
|------------|----------------------------------------------------|
| Frontend   | React 18, TypeScript, Tailwind CSS, Vite            |
| Backend    | NestJS 10, TypeScript, Passport JWT                 |
| Databases  | PostgreSQL (users), MongoDB (tasks/boards)           |
| Queue      | Bull (Redis-backed) for async notifications          |
| Real-time  | Socket.io via NestJS WebSocket Gateway               |
| Deployment | Docker, docker-compose, GitHub Actions CI/CD         |
| DnD        | @hello-pangea/dnd (react-beautiful-dnd fork)         |

## Features

- **JWT Authentication** with role-based access control (admin, member, viewer)
- **Dual Database** architecture — PostgreSQL for relational data, MongoDB for documents
- **Kanban Board** with drag-and-drop between columns (To Do, In Progress, Done)
- **Real-time Updates** via WebSocket — see other users' changes live
- **Bull Queue** for async notifications:
  - Task assignment notifications
  - Due date reminders (24hr before)
  - Overdue task escalations
- **Workspace** management with team members
- **Task Filtering** by assignee, status, and priority

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+

### 1. Clone & Setup

```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
cp backend/.env.example backend/.env
```

### 2. Start with Docker

```bash
docker-compose up -d
```

This starts PostgreSQL, MongoDB, Redis, and the backend.

### 3. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

### 4. Run Backend (Development)

```bash
cd backend
npm install
npm run start:dev
```

API runs on **http://localhost:3001**

---

## API Documentation

### Authentication

| Method | Endpoint          | Description    | Auth |
|--------|-------------------|----------------|------|
| POST   | `/api/auth/signup` | Register user  | No   |
| POST   | `/api/auth/login`  | Login user     | No   |

### Workspaces

| Method | Endpoint                       | Description         | Auth |
|--------|--------------------------------|---------------------|------|
| GET    | `/api/workspaces`              | List user workspaces| JWT  |
| POST   | `/api/workspaces`              | Create workspace    | JWT  |
| GET    | `/api/workspaces/:id`          | Get workspace       | JWT  |
| PUT    | `/api/workspaces/:id`          | Update workspace    | JWT  |
| DELETE | `/api/workspaces/:id`          | Delete workspace    | JWT  |
| POST   | `/api/workspaces/:id/members`  | Add member          | JWT  |

### Boards

| Method | Endpoint                | Description          | Auth |
|--------|-------------------------|----------------------|------|
| GET    | `/api/boards?workspaceId=` | List boards         | JWT  |
| POST   | `/api/boards`           | Create board          | JWT  |
| GET    | `/api/boards/:id`       | Get board             | JWT  |
| PUT    | `/api/boards/:id`       | Update board          | JWT  |
| DELETE | `/api/boards/:id`       | Delete board          | JWT  |

### Tasks

| Method | Endpoint                        | Description          | Auth |
|--------|---------------------------------|----------------------|------|
| GET    | `/api/tasks?boardId=&status=&priority=&assignee=` | List/filter tasks | JWT |
| POST   | `/api/tasks`                    | Create task          | JWT  |
| GET    | `/api/tasks/:id`                | Get task             | JWT  |
| PUT    | `/api/tasks/:id`                | Update task          | JWT  |
| PATCH  | `/api/tasks/:id/move`           | Move task (status)   | JWT  |
| DELETE | `/api/tasks/:id`                | Delete task          | JWT  |

---

## WebSocket Events

Connect to `/ws` namespace with Socket.io.

### Client → Server

| Event            | Payload        | Description              |
|------------------|----------------|--------------------------|
| `joinWorkspace`  | `workspaceId`  | Subscribe to workspace   |
| `leaveWorkspace` | `workspaceId`  | Unsubscribe              |

### Server → Client

| Event          | Payload     | Description           |
|----------------|-------------|-----------------------|
| `taskCreated`  | `Task`      | New task created      |
| `taskUpdated`  | `Task`      | Task details changed  |
| `taskMoved`    | `Task`      | Task moved columns    |
| `taskDeleted`  | `taskId`    | Task removed          |
| `notification` | `Notification` | Push notification  |

---

## Project Structure

```
taskflow/
├── backend/
│   ├── src/
│   │   ├── auth/           # JWT authentication
│   │   ├── users/          # User entity (PostgreSQL)
│   │   ├── workspaces/     # Workspace management
│   │   ├── boards/         # Board schema (MongoDB)
│   │   ├── tasks/          # Tasks + WebSocket gateway
│   │   ├── notifications/  # Bull queue processor
│   │   └── common/         # Guards & decorators
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # KanbanBoard, TaskCard, TaskModal
│   │   ├── pages/          # Login, Signup, Dashboard, Board
│   │   ├── hooks/          # useSocket
│   │   ├── services/       # API client, Socket.io
│   │   └── context/        # AuthContext
│   └── package.json
├── docker-compose.yml
├── .github/workflows/ci.yml
└── README.md
```

## Deployment

- **Backend**: Deploy via Docker to Render / Railway / AWS ECS
- **Frontend**: Deploy to Vercel (`npm run build` → static files)
- **Databases**: Use managed services (MongoDB Atlas, Supabase/Neon for PostgreSQL, Upstash for Redis)

## License

MIT
