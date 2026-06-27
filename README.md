# 🗂 Freelancer Project Tracker

> A full-stack dashboard for freelancers to manage clients, projects, payments, and deadlines.

![Stack](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Stack](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![Stack](https://img.shields.io/badge/MongoDB-Mongoose-47a248?style=flat-square&logo=mongodb)
![Stack](https://img.shields.io/badge/TailwindCSS-3-06b6d4?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 JWT Auth | Secure register/login with 7-day tokens |
| 👤 Clients | Add, edit, delete clients with company & contact info |
| 📁 Projects | Track status, deadlines, and payment per project |
| 💰 Payments | Visual progress bar — paid vs. total per project |
| 📊 Dashboard | Earnings summary, monthly bar chart, upcoming deadlines |
| 📅 Calendar | Monthly view with deadline markers and day drill-down |
| 🌙 Dark UI | Slate dark theme with Inter font and smooth transitions |

---

## 🖥 Screenshots

> Dashboard · Clients · Projects · Calendar

*(Add screenshots after deployment)*

---

## 🛠 Tech Stack

**Frontend**
- React 18 + React Router v6
- Tailwind CSS 3 (custom design tokens)
- Chart.js + react-chartjs-2
- react-calendar, react-toastify, Axios

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- bcryptjs + JSON Web Tokens

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (free tier works)

### 1. Clone the repo

```bash
git clone https://github.com/DanishCoderX/freelancer-tracker.git
cd freelancer-tracker
```

### 2. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`:

```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/freelancer-tracker
JWT_SECRET=choose_a_long_random_string
PORT=5000
CLIENT_URL=http://localhost:3000
```

```bash
npm run dev     # starts on port 5000
```

### 3. Frontend setup

```bash
cd client
npm install
npm start       # starts on port 3000
```

> The `proxy` in `client/package.json` forwards `/api` requests to `localhost:5000` — no extra config needed locally.

---

## ☁️ Deployment

### Backend → Render

1. Push `server/` to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`
4. Build command: `npm install` · Start command: `npm start`

### Frontend → Vercel

1. Push `client/` to GitHub
2. Import into [Vercel](https://vercel.com)
3. Add environment variable: `REACT_APP_API_URL=https://your-app.onrender.com/api`
4. Deploy — Vercel auto-detects Create React App

---

## 📁 Project Structure

```
freelancer-tracker/
├── client/
│   ├── src/
│   │   ├── components/     Navbar, Layout, Modal, ProtectedRoute
│   │   ├── context/        AuthContext (global auth state)
│   │   ├── pages/          Dashboard, Clients, Projects, CalendarView, Login, Register
│   │   ├── services/       Axios instance with auth interceptor
│   │   └── App.jsx         Routes + ToastContainer
│   ├── tailwind.config.js
│   └── vercel.json
└── server/
    ├── controllers/        authController, clientController, projectController, dashboardController
    ├── models/             User, Client, Project
    ├── routes/             auth, clients, projects, dashboard
    ├── middleware/         auth.js (JWT verify)
    ├── server.js
    └── render.yaml
```

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | ✓ | Get current user |
| GET | `/api/clients` | ✓ | List all clients |
| POST | `/api/clients` | ✓ | Create client |
| PUT | `/api/clients/:id` | ✓ | Update client |
| DELETE | `/api/clients/:id` | ✓ | Delete client |
| GET | `/api/projects` | ✓ | List all projects |
| POST | `/api/projects` | ✓ | Create project |
| PUT | `/api/projects/:id` | ✓ | Update project / payment |
| DELETE | `/api/projects/:id` | ✓ | Delete project |
| GET | `/api/dashboard/stats` | ✓ | Earnings, counts, deadlines |

---

## 👤 Author

**Daanish Saeed**  
[github.com/DanishCoderX](https://github.com/DanishCoderX) · daanishsaeed593@gmail.com

---

## 📄 License

MIT