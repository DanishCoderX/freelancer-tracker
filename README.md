# 🗂️ Freelancer Project Tracker

> A full-stack productivity dashboard for freelancers to manage clients, track projects, monitor payments, and never miss a deadline.

**🌐 Live Demo:** [freelancer-tracker-app.netlify.app](https://freelancer-tracker-app.netlify.app)

![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47a248?style=flat-square&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

---

## 📸 Screenshots

> Dashboard · Clients · Projects · Calendar

*(Add screenshots here after taking them from the live app)*

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register & login with 7-day tokens
- 👤 **Client Management** — Add, edit, delete clients with full contact info
- 📁 **Project Tracking** — Status tracking (active / paused / completed)
- 💰 **Payment Progress** — Visual progress bar showing paid vs total amount
- 📊 **Dashboard** — Earnings summary, monthly bar chart, upcoming deadlines
- 📅 **Calendar View** — Monthly calendar with deadline markers and day drill-down
- 🌙 **Dark UI** — Slate dark theme with Inter font and smooth transitions
- 📱 **Responsive** — Works on desktop and mobile

---

## 🛠️ Tech Stack

### Frontend
- React 18 + React Router v6
- Tailwind CSS 3 (custom design tokens)
- Chart.js + react-chartjs-2
- react-calendar, react-toastify, Axios

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- bcryptjs + JSON Web Tokens (JWT)
- CORS configured for production

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/clients` | ✅ | List all clients |
| POST | `/api/clients` | ✅ | Create client |
| PUT | `/api/clients/:id` | ✅ | Update client |
| DELETE | `/api/clients/:id` | ✅ | Delete client |
| GET | `/api/projects` | ✅ | List all projects |
| POST | `/api/projects` | ✅ | Create project |
| PUT | `/api/projects/:id` | ✅ | Update project / payment |
| DELETE | `/api/projects/:id` | ✅ | Delete project |
| GET | `/api/dashboard/stats` | ✅ | Earnings, counts, deadlines |

---

## 📁 Project Structure

```
freelancer-tracker/
├── client/                        # React frontend
│   ├── public/
│   │   ├── index.html
│   │   └── _redirects             # Netlify SPA routing
│   └── src/
│       ├── components/            # Navbar, Layout, Modal, ProtectedRoute
│       ├── context/               # AuthContext (global auth state)
│       ├── pages/                 # Dashboard, Clients, Projects, Calendar, Login, Register
│       ├── services/              # Axios instance with auth interceptor
│       └── App.jsx                # Routes + ToastContainer
└── server/                        # Express backend
    ├── controllers/               # Auth, Client, Project, Dashboard
    ├── models/                    # User, Client, Project schemas
    ├── routes/                    # API route definitions
    ├── middleware/                # JWT verify middleware
    └── server.js                  # Entry point
```

---

## 🚀 Run Locally

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (free tier)

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

Fill in `.env`:
```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/freelance_tracker
JWT_SECRET=your_secret_key
PORT=5000
CLIENT_URL=http://localhost:3000
```

```bash
npm start
```

### 3. Frontend setup
```bash
cd client
npm install
npm start
```

App runs at `http://localhost:3000`

---

## ☁️ Deployment

| Service | Platform |
|---|---|
| Frontend | Netlify |
| Backend | Railway |
| Database | MongoDB Atlas |

---

## 👤 Author

**Daanish Saeed**

[![GitHub](https://img.shields.io/badge/GitHub-DanishCoderX-181717?style=flat-square&logo=github)](https://github.com/DanishCoderX)
[![Email](https://img.shields.io/badge/Email-daanishsaeed593@gmail.com-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:daanishsaeed593@gmail.com)
[![Portfolio](https://img.shields.io/badge/Portfolio-DanishCoderX.github.io-0A66C2?style=flat-square&logo=globe&logoColor=white)](https://DanishCoderX.github.io)

---

## 📄 License

MIT — feel free to use this project as inspiration for your own work.
