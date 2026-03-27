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

## Hello! This is my project, TaskFlow.

I built TaskFlow as a full-stack, real-time project management platform designed to help teams collaborate seamlessly. My goal was to create a robust and scalable architecture that handles complex data relationships securely while offering an incredibly fast and reactive user experience.

To achieve this, I used **NestJS and TypeScript** on the backend, combining **MongoDB** for flexible task storage with **PostgreSQL** for strict user management and role-based access control (RBAC). I implemented **Socket.io** to power live, WebSocket-driven updates across team workspaces so that any change made by one user instantly reflects for everyone else. Additionally, I integrated a **Bull queue** (backed by Redis) to manage asynchronous jobs like task assignments, due date reminders, and overdue escalations. 

On the front end, I built a clean, drag-and-drop React interface utilizing Tailwind CSS to make managing tasks as intuitive as possible. Finally, I containerized the entire application using Docker and set up a GitHub Actions CI/CD pipeline to automate my deployments to AWS (and Vercel for the frontend).

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

## What I Implemented (Features)

- **JWT Authentication** with role-based access control (admin, member, viewer)
- **Dual Database** architecture — PostgreSQL for relational data, MongoDB for documents
- **Kanban Board** with drag-and-drop between columns (To Do, In Progress, Done)
- **Real-time Updates** via WebSocket — you can see other users' changes live!
- **Bull Queue** for async notifications:
  - Task assignment notifications
  - Due date reminders (24hr before)
  - Overdue task escalations
- **Workspace** management with team members
- **Task Filtering** by assignee, status, and priority

## How to Run My App Locally

If you'd like to test my app on your own machine, follow these steps:

### Prerequisites

- Docker & Docker Compose
- Node.js 20+

### 1. Clone & Setup

```bash
git clone https://github.com/Kushyanth04/TaskFlow.git
cd TaskFlow
cp backend/.env.example backend/.env
```

### 2. Start with Docker

```bash
docker-compose up -d postgres mongo redis
```

This starts the PostgreSQL, MongoDB, and Redis databases. *(Note: PostgreSQL is mapped to port 5433 to avoid local conflicts).*

### 3. Run the Backend (Development)

```bash
cd backend
npm install
npm run start:dev
```

My API will run on **http://localhost:3001**

### 4. Run the Frontend 

In a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser to see the app in action!

---

## API Documentation

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login to receive a JWT

### Workspaces
- `GET /api/workspaces` - List current user workspaces
- `POST /api/workspaces` - Create a new workspace
- `GET /api/workspaces/:id` - Get details of a specific workspace
- `PUT /api/workspaces/:id` - Update workspace details
- `DELETE /api/workspaces/:id` - Delete a workspace

### Boards
- `GET /api/boards?workspaceId=` - List all boards in a workspace
- `POST /api/boards` - Create a new Kanban board
- `GET /api/boards/:id` - View a board
- `PUT /api/boards/:id` - Edit a board
- `DELETE /api/boards/:id` - Delete a board

### Tasks
- `GET /api/tasks?boardId=&status=` - List or filter tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - View task details
- `PUT /api/tasks/:id` - Edit task text/assignments
- `PATCH /api/tasks/:id/move` - Move task between Kanban columns
- `DELETE /api/tasks/:id` - Delete a task

---

## WebSocket Events

My app connects to the `/ws` namespace with Socket.io for live updates.

### Client → Server
- `joinWorkspace` (payload: `workspaceId`) - Subscribe to workspace events
- `leaveWorkspace` (payload: `workspaceId`) - Unsubscribe

### Server → Client
- `taskCreated` - Broadcasts when a new task is created
- `taskUpdated` - Broadcasts when a task's details change
- `taskMoved` - Broadcasts when a task is moved to a new column
- `taskDeleted` - Broadcasts when a task is removed

---

## Deployment Strategy

- **Backend**: Containerized via Docker, deployed to Render/AWS.
- **Frontend**: Deployed to Vercel connected to the GitHub repo.
- **Databases**: Supabase/Neon for PostgreSQL, MongoDB Atlas for the document store, and Upstash for Redis.

## License

MIT
