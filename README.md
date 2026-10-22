# ResolveIQ — Smart Complaint Management System

A full-stack MERN application for filing, assigning and resolving customer complaints, with separate dashboards and permissions for **users**, **agents** and **admins**.

---

## Features

### User

- Sign up and log in (JWT authentication)
- File a new complaint with a title, description, category and priority
- View only **their own** complaints, with live status and assigned agent
- Search and filter complaints by status

### Agent

- Log in with an account created by an admin
- See only the complaints **assigned to them**
- Update a complaint's status (Open / In Progress / Pending / Resolved)

### Admin

- Dashboard with metrics (total, open, in progress, resolved, resolution rate)
- View every complaint, search and filter by status
- Assign, reassign or unassign complaints to active agents
- Manage agents: add, activate/deactivate, remove
- Removing an agent automatically returns their complaints to **Open** and unassigned

### Security

- Passwords hashed with bcrypt
- JWT-based authentication with role-based authorization middleware
- Public signup can only create `user` accounts. Agents are created by admins only
- Ownership checks on the backend: users can't read other users' complaints, agents can't touch complaints that aren't assigned to them
- Frontend route guards (`ProtectedRoute`) redirect by role, and logout clears the stored session
- CORS restricted to the configured frontend origin

---

## Tech Stack

| Layer    | Technology                                                              |
| -------- | ----------------------------------------------------------------------- |
| Frontend | React, Vite, Tailwind CSS, React Router, Redux Toolkit, React Hook Form |
| Backend  | Node.js, Express                                                        |
| Database | MongoDB with Mongoose                                                   |
| Auth     | JSON Web Tokens, bcryptjs                                               |

---

## Project Structure

```
smart_complaint_system/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # authController, complaintController
│   ├── middleware/      # protect + authorize (JWT and role checks)
│   ├── models/          # User, Complaint
│   ├── routes/          # authRoutes, userRoutes, complaintRoutes
│   ├── utils/           # generateToken
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/  # AgentsView, DetailPanel, NewComplaintModal, ProtectedRoute, ...
    │   ├── features/    # Redux slices (complaints, agents)
    │   ├── pages/       # Home, Login, SignUp, UserPage, Agent, AdminPage
    │   ├── redux/       # store
    │   └── data/        # shared constants (categories, statuses, styles)
    └── index.html
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- A MongoDB database (local or MongoDB Atlas)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd smart_complaint_system
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
FRONTEND_URL=http://localhost:5173
```

Generate a secure `JWT_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

> `FRONTEND_URL` must not have a trailing slash.

Start the server:

```bash
npm run dev
```

### 3. Create the first admin

Signup always creates a normal `user`, so the first admin has to be created once by hand. Save this as `backend/seedAdmin.js`, run `node seedAdmin.js`, then delete it or keep it out of version control:

```js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/user.js";

dotenv.config();
await mongoose.connect(process.env.MONGODB_URI);

const hashedPassword = await bcrypt.hash("ChangeThisPassword123", 10);
await User.create({
  name: "Admin",
  email: "admin@example.com",
  password: hashedPassword,
  role: "admin",
});

console.log("Admin created");
process.exit();
```

### 4. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`. The frontend calls the API at `http://localhost:5000`, so update the URLs in the Redux slices and auth pages if your backend runs elsewhere.

---

## How the Roles Work

| Action                            |   User   |     Agent     | Admin |
| --------------------------------- | :------: | :-----------: | :---: |
| Sign up publicly                  |    ✅    |      ❌       |  ❌   |
| File a complaint                  |    ✅    |      ❌       |  ❌   |
| View complaints                   | Own only | Assigned only |  All  |
| Update complaint status           |    ❌    | Assigned only |  ✅   |
| Assign / unassign complaints      |    ❌    |      ❌       |  ✅   |
| Create, deactivate, remove agents |    ❌    |      ❌       |  ✅   |

**Typical flow:** a user files a complaint, the admin assigns it to an agent, the agent works it and marks it resolved, and the user sees the updated status on their dashboard.

---

## API Reference

All routes except signup and login require the header `Authorization: Bearer <token>`.

### Auth

| Method | Endpoint           | Description              |
| ------ | ------------------ | ------------------------ |
| POST   | `/api/auth/signup` | Register a new user      |
| POST   | `/api/auth/login`  | Log in and receive a JWT |

### Complaints

| Method | Endpoint                     | Access                         | Description                                       |
| ------ | ---------------------------- | ------------------------------ | ------------------------------------------------- |
| POST   | `/api/complaints`            | User                           | Create a complaint                                |
| GET    | `/api/complaints`            | Any logged-in role             | List complaints (filtered by role)                |
| GET    | `/api/complaints/:id`        | Owner / assigned agent / admin | Get one complaint                                 |
| PATCH  | `/api/complaints/:id/status` | Agent, Admin                   | Update status                                     |
| PATCH  | `/api/complaints/:id/assign` | Admin                          | Assign an agent, or unassign with `agentId: null` |

### Admin

| Method | Endpoint                              | Description                                   |
| ------ | ------------------------------------- | --------------------------------------------- |
| POST   | `/api/admin/create-agent`             | Create an agent account                       |
| GET    | `/api/admin/agents`                   | List all agents                               |
| PATCH  | `/api/admin/agents/:id/toggle-status` | Activate or deactivate an agent               |
| DELETE | `/api/admin/agents/:id`               | Remove an agent and unassign their complaints |

---

## Data Models

**User:** `name`, `email` (unique), `password` (hashed), `role` (`user` | `agent` | `admin`), `status` (`Active` | `Inactive`)

**Complaint:** `title`, `description`, `category` (Billing, Technical, Refund, Delivery, Service, Other), `priority` (High, Medium, Low), `status` (Open, In Progress, Pending, Resolved), `submitter` (ref User), `assignedAgent` (ref User), `assignedDate`, plus timestamps

---

## Known Limitations and Future Improvements

- No pagination on complaint lists
- No restrictions on status transitions (any status can be set from any other)
- API URLs are hardcoded to `localhost:5000` in the frontend. Moving them to a `VITE_API_URL` environment variable would simplify deployment
- No email notifications when agents are created or complaints change status
- No rate limiting on complaint submission
- The "Export" button on the dashboards is a placeholder

---

## License

This project is open source and available under the [MIT License](LICENSE).
