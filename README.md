# 🗳️ Secure E-Voting Platform

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![React](https://img.shields.io/badge/React-18.x-blueviolet)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)

A modern, highly secure, and dynamically responsive Election & Voting Platform built with the **MERN Stack** (MongoDB, Express, React, Node.js). Engineered with a focus on robust authentication, role-based access control, and a premium glassmorphic user interface.

---

## ✨ Key Features

- **🔐 Rigorous Authentication**: Secure Aadhar-Card based login (simulated with 12-digit mathematical validation).
- **🛡️ Vote Integrity**: Advanced single-vote security preventing multiple POST requests ensuring zero double-voting. Protected via robust JWT-session mechanisms.
- **👨‍💼 Dedicated Admin Portal**: Role-Based Access Control (RBAC) securely restricting normal voters while enabling Administrators to perform full CRUD operations on Candidate configurations.
- **📊 Real-Time Dashboard**: Fully responsive dashboards displaying live, aggregated candidate performance and vote counts instantly.
- **🎨 Premium UI/UX**: An aesthetically pleasing, soft-shadow light mode interface crafted carefully using pure CSS variables and smooth micro-animations.

---

## 🛠️ Technology Stack

| Category         | Technology / Tools                         |
|------------------|--------------------------------------------|
| **Frontend**     | React.js (Vite), React Router v6, Vanilla CSS |
| **Backend**      | Node.js, Express.js                        |
| **Database**     | MongoDB (Mongoose)                         |
| **Security**     | JSON Web Tokens (JWT), Bcrypt.js, CORS     |
| **Icons**        | Lucide React                               |

---

## 📂 Project Structure

```text
📦 voting-app
 ┣ 📂 client                 # Frontend React Application
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components         # Reusable UI components (Navbar)
 ┃ ┃ ┣ 📂 context            # Authentication state management
 ┃ ┃ ┣ 📂 pages              # Main views (Auth, Dashboard, Admin)
 ┃ ┃ ┗ 📜 index.css          # Premium Global Glassmorphic UI Styles
 ┣ 📂 models                 # MongoDB Mongoose Schemas (User, Elector)
 ┣ 📂 routes                 # Express API Endpoint Logic
 ┣ 📂 middleware             # JWT Verification & Authorization Guards
 ┣ 📜 server.js              # Node.js Server Initializer
 ┗ 📜 .env                   # Environment variable mappings
```

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project running locally on your machine for development and testing purposes.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) (Local server or Atlas URI)

### Installation Guide

**1. Clone the repository**
```bash
git clone https://github.com/samirwatgule/voting-app.git
cd voting-app
```

**2. Setup the Backend Environment**
```bash
# Install root dependencies
npm install

# Start the Node/Express backend server on port 5000
node server.js
```
> **Note:** The server auto-seeds a default Administrator on its first boot.

**3. Setup the Frontend Environment** (In a new terminal)
```bash
cd client

# Install client dependencies
npm install

# Start the Vite React development server
npm run dev
```

---

## 📖 Usage Instructions

### 👑 Administrator Guide
- **Login Credentials:** 
  - Aadhar Number: `Admin`
  - Password: `Admin@123`
- **Actions:** Navigate to `/admin` to register participating Candidates (Electors) including their affiliations and age profiles.

### 🗳️ Voter Guide
- **Registration:** New voters register using their exact 12-digit mock Aadhar Card number (e.g., `123456789012`).
- **Voting:** Once authenticated, voters can review candidates on the `/dashboard` and safely cast a *single, irreversible vote*.

---

## 🚦 Application API Design

| Method | Endpoint                    | Access      | Description                            |
|--------|-----------------------------|-------------|----------------------------------------|
| `POST` | `/api/users/signup`         | Public      | Register new standard voter            |
| `POST` | `/api/users/signin`         | Public      | Authenticate user & receive JWT        |
| `GET`  | `/api/users/profile`        | Private     | Retrieve sensitive user profile data   |
| `PUT`  | `/api/users/change-password`| Private     | Enable active-user password rotation   |
| `GET`  | `/api/electors`             | Public      | Fetch array of active participants     |
| `POST` | `/api/electors`             | Admin Only  | Provision a new Candidate entity       |
| `DELETE`| `/api/electors/:id`        | Admin Only  | Remove a Candidate from the database   |
| `POST` | `/api/votes/:electorId`     | Voter Only  | Commit an active, tracked unique vote  |
| `GET`  | `/api/votes/count`          | Public      | Receive live election statistics       |

---
<div align="center">
  <i>Developed to establish uncompromisable digital voting structures.</i>
</div>
