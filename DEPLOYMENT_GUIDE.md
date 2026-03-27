# 🚀 TaskFlow Production Deployment Guide

When you run TaskFlow locally, it uses **Docker** to spin up local versions of PostgreSQL, MongoDB, and Redis on your machine. However, when deploying to the internet, your hosted servers cannot access your laptop's `localhost`. 

You must provision **real, cloud-hosted databases**, get their connection strings (keys), and securely inject them into Render and Vercel.

Here is exactly how to do this flawlessly for **free**.

---

## 🛠️ Phase 1: Provisioning Free Cloud Databases

Before you deploy any code, you need to grab 3 connection strings. Sign up for these free platforms:

### 1. MongoDB (For Tasks & Boards)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free tier cluster.
2. In the left sidebar, click **Database Access**, then **Add New Database User**. Create a username and password. Keep this password safe!
3. In the left sidebar, click **Network Access**, then **Add IP Address**. Choose **Allow Access from Anywhere** (`0.0.0.0/0`) so your Render backend can reach it securely.
4. In the left sidebar, click **Database** to view your active cluster.
5. Click the large **Connect** button right next to your cluster's name.
6. A popup will appear. Select the **Drivers** native option (it might also be labeled "Connect your application").
7. Copy the entire connection string presented to you. It will look identical to this: 
   `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/taskflow?retryWrites=true&w=majority`
8. **CRITICAL**: Before pasting this into Render, manually replace `<username>` and `<password>` in the string with the exact credentials you created in Step 2 to generate your final `MONGODB_URI`. Make sure to delete the `<` and `>` brackets!

### 2. PostgreSQL (For Users & Auth)
1. Go to [Neon.tech](https://neon.tech/) or [Supabase](https://supabase.com/).
2. Create a new PostgreSQL project.
3. Go to connection settings and copy the host, user, password, and port. 
   *(Alternatively, Render offers a free PostgreSQL database directly in their dashboard which you can spin up alongside your backend!)*

### 3. Redis (For Background Queues)
1. Go to [Upstash](https://upstash.com/).
2. Create a free Redis database.
3. Copy the **Endpoint** (this is your `REDIS_HOST`) and **Port**. Note: if your backend requires a password, you might need to insert it, but Upstash provides the exact variables.

---

## ☁️ Phase 2: Deploying the Backend (Render)

The backend must be deployed on a platform capable of handling WebSockets and continuous NodeJS processing. [Render.com](https://render.com) is perfect for this.

1. Create a Render account and click **New+** -> **Web Service**.
2. Connect your GitHub repository.
3. In the setup, strictly configure the following:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod` *(Ensure this runs the compiled `dist/main.js`)*
4. Scroll down to **Environment Variables** and securely paste your cloud keys:
   - `MONGODB_URI` = *Your MongoDB Atlas String*
   - `POSTGRES_HOST` = *Your Neon/Supabase/Render Postgres Host*
   - `POSTGRES_PORT` = *Usually 5432*
   - `POSTGRES_USER` = *Your Postgres User*
   - `POSTGRES_PASSWORD` = *Your Postgres Password*
   - `POSTGRES_DB` = *Your Postgres Database Name*
   - `REDIS_HOST` = *Your Upstash Redis Host*
   - `REDIS_PORT` = *Your Upstash Redis Port*
   - `JWT_SECRET` = *(Generate a random long string like `my_super_secure_production_key_992`)*
5. Click **Deploy**. Once it successfully starts, Render will give you a URL like `https://taskflow-backend.onrender.com`.

---

## ⚡ Phase 3: Deploying the Frontend (Vercel)

Now that your powerful backend is alive, we just connect the Vercel UI to it.

1. Go to [Vercel](https://vercel.com) and click **Add New Project**.
2. Import your GitHub repository.
3. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` *(Click Edit and select the frontend folder)*
4. Open the **Environment Variables** tab and paste the Render backend URL you got from Phase 2:
   - `VITE_API_URL` = `https://taskflow-backend.onrender.com/api`
   - `VITE_SOCKET_URL` = `https://taskflow-backend.onrender.com`
5. Click **Deploy**.

### 🎉 You are done!
Vercel will give you a beautiful, public URL. When you visit it, the React UI will hit your Render secure backend, which will securely route data to your cloud Atlas and Postgres databases!
