# TaskFlow 🚀

Hey! This is **TaskFlow**, a project management tool I built to make tracking work actually feel intuitive. Unlike basic to-do apps, this one handles real-time updates and tracks exactly how long you spend on every task through automated sub-sessions.

I built this using a modern stack: **NestJS, React, TypeScript, MongoDB, and PostgreSQL**.

---

## 🛠️ How I Built It
- **Postgres (Auth & Workspaces)**: I used this for all the structured data like users and workspace permissions.
- **MongoDB (Tasks & Boards)**: Since tasks change a lot and can have different fields, I used Mongo for the flexibility.
- **Redis (Bull Queue)**: This handles all the background notification processing so the app stays fast.
- **WebSockets**: I integrated Socket.io so that any change you make on a board shows up instantly for everyone else.
- **Tailwind CSS**: Every part of the UI is custom-styled to be clean, responsive, and easy on the eyes.

---

## ✨ Features That Make It Useful
- **Automated Time Tracking**: Just drag a task into "In Progress" and I start a timer for you. Move it back or to "Done" and I'll log the exact session time.
- **Session History**: You can see exactly when you worked on a task. Even if you pause it 10 times, I log every single session.
- **Smart Visuals**: Cards change color based on status (Red for active, Yellow for paused, Green for done). Plus, I added a "Past Due" flag for late submissions.
- **Live Notifications**: You'll get a real-time heads-up whenever a task is created or moved in your workspace.

---

## 🚀 Get It Running

### Local Setup (Docker)
1. Clone the repo.
2. I've included a `docker-compose.yml` file. Just run `docker-compose up -d` to spin up Redis, Mongo, and Postgres.
3. Set up your `.env` files in both `frontend` and `backend` (I've included `.env.example` files to show you what's needed).
4. Run `npm install` and `npm run dev` in both folders.

### Production Deployment
If you want to put this on the web like I did, check out my [**Deployment Guide**](file:///d:/Code/Task%20flow/DEPLOYMENT_GUIDE.md). I've documented exactly how to host the backend on **Render** and the frontend on **Vercel** for free.

---
<p align="center">Built with ❤️ by Kushyanth</p>
