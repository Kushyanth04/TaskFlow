# 🚀 TaskFlow Production Deployment Guide

Hey! Thanks for checking out TaskFlow. If you want to host this application on the internet yourself, you'll need to split the deployment: the **Frontend** goes to Vercel, and the **Backend** goes to Render. 

Since local Docker containers won't work natively in the cloud, you'll also need to grab three free cloud databases. Here is my step-by-step guide on exactly how I set it up!

---

## 🛠️ 1. Grab Your Cloud Databases
Before deploying any code, you need three connection strings. These essentially replace the local Docker databases for your live environment:

1. **MongoDB (For Tasks & Boards)**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free tier cluster.
   - Under "Database Access", create a Database User and save the password.
   - Under "Network Access", allow access from anywhere (`0.0.0.0/0`) so the Render server can reach it safely.
   - Click "Database" in the left sidebar, click the huge "Connect" button next to your cluster, choose "Drivers", and copy your `mongodb+srv://...` link. 
   - Replace the `<password>` and `<username>` placeholders with your actual user credentials.

2. **PostgreSQL (For Users & Auth)**
   - Create a free Postgres database on [Supabase](https://supabase.com/) or [Neon.tech](https://neon.tech/).
   - Copy your connection details from your project settings (`Host`, `Port`, `User`, `Password`, `Database Name`). 
   - *(Pro-tip: If you use Supabase, I highly recommend using their **Session Pooler** host to natively avoid IPv6 incompatibility errors inside Node).*

3. **Redis (For Background Queues)**
   - Go to [Upstash](https://upstash.com/) and create a free Redis database.
   - Toggle the "Node" connection layout to easily snag your `Endpoint` (Host), `Port`, and `Password`.

---

## ☁️ 2. Deploy the Backend (Render)
TaskFlow uses real-time WebSockets and Redis queues, which means the backend must be hosted on a server that natively supports long-running persistent connections. I personally recommend **Render.com**.

1. Create a [Render](https://render.com) account and click **New+** -> **Web Service**.
2. Connect your GitHub repository to Render.
3. Configure the following build settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
4. Under **Environment Variables**, paste all of those cloud credentials you generated in Step 1:
   - `MONGODB_URI` = *(Your MongoDB Atlas String)*
   - `POSTGRES_HOST` = *(Your Postgres Host)*
   - `POSTGRES_PORT` = `5432` *(Usually)*
   - `POSTGRES_USER` = *(Your Postgres User)*
   - `POSTGRES_PASSWORD` = *(Your Postgres Password)*
   - `POSTGRES_DB` = *(Your Postgres Database Name)*
   - `REDIS_HOST` = *(Your Upstash Host)*
   - `REDIS_PORT` = *(Your Upstash Port)*
   - `REDIS_PASSWORD` = *(Your Upstash Password)*
   - `REDIS_TLS` = `true`
   - `JWT_SECRET` = *(Generate any random string for cookie/token encryptions)*
5. Click **Deploy**! Render will spin up the environment and hand you an active URL like `https://taskflow-api.onrender.com`.

---

## ⚡ 3. Deploy the Frontend (Vercel)
Now that your powerful NestJS backend is alive, we just point the Vercel React UI to it!

1. Go to [Vercel](https://vercel.com) and create a new project.
2. Import this GitHub repository.
3. Edit the project setup configuration fields:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
4. Jump into the **Environment Variables** tab and map these properties precisely to the Render backend URL you received from Step 2:
   - `VITE_API_URL` = `https://<YOUR-RENDER-BACKEND-URL>/api`
   - `VITE_SOCKET_URL` = `https://<YOUR-RENDER-BACKEND-URL>`
5. Click **Deploy**.

Vercel will flawlessly build the React application, and you're officially live! The frontend will instantly pipe layout logic and WebSocket streams dynamically to your secured cloud backend. Enjoy!
