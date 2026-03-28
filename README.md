# 🗳️ Secure E-Voting Platform

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![React](https://img.shields.io/badge/React-19.x-blueviolet)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)

A modern, secure, and professional Election & Voting Platform built with the **MERN Stack** (MongoDB, Express, React, Node.js). Features role-based access control with **separate admin and voter portals**, Aadhar-based authentication, real-time vote tracking, and a clean professional UI.

---

## ✨ Key Features

- **🔐 Aadhar-Based Authentication** — Secure voter login & registration using 12-digit Aadhar card number.
- **🛡️ Separate Admin Portal** — Admin has a dedicated login route (`/admin-login`) completely separate from voter login.
- **🗳️ Single Vote Enforcement** — Once a voter casts a vote, they cannot vote again. Protected via JWT session.
- **👨‍💼 Admin Dashboard** — Full CRUD operations on candidates (add, delete). Admin cannot vote.
- **📊 Live Election Dashboard** — Real-time vote counts with progress bars and candidate rankings.
- **👤 User Profile** — View account info and change password securely.
- **🎨 Professional UI** — Clean, light-themed interface with smooth animations and responsive design.

---

## 🛠️ Technology Stack

| Category       | Technology                                     |
|----------------|------------------------------------------------|
| **Frontend**   | React 19 (Vite), React Router v7, Vanilla CSS |
| **Backend**    | Node.js, Express.js 5                          |
| **Database**   | MongoDB (Mongoose 9)                           |
| **Security**   | JWT Authentication, Bcrypt.js, CORS            |
| **Icons**      | Lucide React                                   |

---

## 📂 Project Structure

```
📦 voting-app/
├── 📂 client/                  # Frontend React Application (Vite)
│   ├── 📂 src/
│   │   ├── 📂 components/      # Reusable UI components
│   │   │   └── Navbar.jsx
│   │   ├── 📂 context/         # React Context for auth state
│   │   │   └── AuthContext.jsx
│   │   ├── 📂 pages/           # Application pages
│   │   │   ├── AuthPage.jsx          # Voter login/register
│   │   │   ├── AdminLoginPage.jsx    # Admin-only login portal
│   │   │   ├── VoterDashboard.jsx    # Voting dashboard
│   │   │   ├── AdminDashboard.jsx    # Candidate management
│   │   │   └── ProfilePage.jsx      # User profile & password
│   │   ├── index.css           # Global styles
│   │   ├── App.jsx             # Root component with routing
│   │   └── main.jsx            # Entry point
│   └── index.html
├── 📂 middleware/               # Express middleware
│   └── auth.js                 # JWT verification & admin guard
├── 📂 models/                   # MongoDB schemas
│   ├── User.js                 # User model (voter/admin)
│   └── Elector.js              # Candidate model
├── 📂 routes/                   # API route handlers
│   ├── userRoutes.js           # Auth routes (signup, signin, admin-signin)
│   ├── electorRoutes.js        # Candidate CRUD routes
│   └── voteRoutes.js           # Voting routes
├── server.js                   # Express server entry point
├── .env                        # Environment variables (not tracked)
├── .gitignore                  # Git ignore rules
└── package.json                # Server dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v16+
- [MongoDB](https://www.mongodb.com/) — Local server or MongoDB Atlas URI

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/samirwatgule/voting-app.git
cd voting-app
```

**2. Create environment file**
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/voting_app
JWT_SECRET=your_secret_key_here
```

**3. Install & start the backend**
```bash
npm install
npm run dev
```
> The server auto-seeds a default Admin account on first boot.

**4. Install & start the frontend** *(in a new terminal)*
```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📖 Usage

### 🗳️ Voter
1. Open `http://localhost:5173/login`
2. **Register** with a 12-digit Aadhar number and password
3. **Login** and cast your vote from the dashboard
4. Each voter can vote only **once** — the vote is irreversible

### 👑 Administrator
1. Navigate to `http://localhost:5173/admin-login`
2. **Login** with default credentials:
   - Admin ID: `Admin`
   - Password: `Admin@123`
3. **Manage candidates** — Add or remove election candidates
4. Admin **cannot vote** — only manages the election

> ⚠️ Admin login is intentionally separated from voter login for security.

---

## 🚦 API Endpoints

| Method   | Endpoint                     | Access     | Description                         |
|----------|------------------------------|------------|-------------------------------------|
| `POST`   | `/api/users/signup`          | Public     | Register new voter                  |
| `POST`   | `/api/users/signin`          | Public     | Voter login (blocks admin)          |
| `POST`   | `/api/users/admin-signin`    | Public     | Admin login (blocks voters)         |
| `GET`    | `/api/users/profile`         | Private    | Get user profile                    |
| `PUT`    | `/api/users/change-password` | Private    | Change password                     |
| `GET`    | `/api/electors`              | Public     | Get all candidates                  |
| `POST`   | `/api/electors`              | Admin Only | Add a new candidate                 |
| `PUT`    | `/api/electors/:id`          | Admin Only | Update candidate details            |
| `DELETE` | `/api/electors/:id`          | Admin Only | Remove a candidate                  |
| `POST`   | `/api/votes/:electorId`      | Voter Only | Cast a vote                         |
| `GET`    | `/api/votes/count`           | Public     | Get live vote counts (sorted)       |

---

## 🔐 Security Features

- **JWT Token Authentication** — All protected routes require a valid Bearer token
- **Bcrypt Password Hashing** — Passwords are salted and hashed before storage
- **Role-Based Access Control** — Admin and voter roles with separate login portals
- **Single Vote Protection** — Backend enforces one vote per user
- **Admin Vote Prevention** — Admin accounts are blocked from casting votes
- **Route Separation** — Admin cannot login through voter portal and vice versa

---

## 📜 License

This project is licensed under the MIT License.

---

<div align="center">
  <sub>Built with ❤️ for secure digital elections</sub>
</div>
