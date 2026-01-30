# Sentry

**Sentry** is a professional, production-grade MERN SaaS application designed for high-performance issue tracking and project management. Inspired by tools like Jira, Sentry provides a streamlined Kanban-based workflow with deep collaboration features, role-aware permissions, and real-time status tracking.

Built for engineering teams and product managers who need a reliable, minimal, yet powerful way to track tickets and manage project lifecycles.

---

## Live Demo

Sentry is live on Vercel! 🎉

Click [here](https://sentry-coral.vercel.app/) to check it out.

---

## Key Features

- **Project Management:** Create, update, and manage multiple projects with dedicated member lists.
- **Ticket Lifecycle:** Granular control over tickets with priority levels (Low, Medium, High) and statuses (Open, In Progress, Closed).
- **Kanban Workflow:** Intuitive drag-and-drop board for managing ticket progression across states.
- **Role-Aware Permissions:** Strict security model where only Project Owners can delete projects or manage memberships.
- **Collaboration:** Threaded discussion sections on every ticket with reply support.
- **Assignment System:** Assign tickets to specific project members with a unified dashboard view of "My Active Work".
- **Advanced Filtering:** Real-time search and filtering by status, priority, and assignee.

---

## Tech Stack

### Frontend
- **React 19 + Vite**: Modern, fast core framework.
- **Tailwind CSS 4**: Utility-first styling with premium theme configuration.
- **shadcn/ui**: Beautiful, accessible components.
- **Radix UI**: Accessible, unstyled primitives for high-quality components.
- **dnd-kit**: Robust drag-and-drop engine for the Kanban board.
- **Framer Motion**: Smooth micro-animations and page transitions.
- **Lucide React**: Clean, consistent iconography.
- **Sonner**: Non-intrusive toast notifications.

### Backend
- **Node.js + Express**: Scalable server architecture.
- **MongoDB + Mongoose**: Document-based database with relational-like population.
- **JWT (JSON Web Tokens)**: Secure, stateless authentication.
- **Nodemailer**: Integrated invitation system for member onboarding.

---

## Project Structure

```text
sentry
├─ backend/ (Core server-side logic and API)
│  ├─ config/ (Database connection settings)
│  ├─ controllers/ (Request handling logic for Auth, Projects, Tickets, and Dashboard)
│  ├─ middlewares/ (Security, JWT authentication, and error handling layers)
│  ├─ models/ (Mongoose schemas for User, Project, Ticket, Comment, and Invite)
│  ├─ routes/ (API endpoint definitions)
│  └─ utils/ (Helper functions and email templates for invitations)
└─ frontend/ (Client-side React application)
   ├─ public/ (Static assets, icons, and PWA manifest)
   └─ src/ (Application source code)
      ├─ api/ (Service layer for backend communications)
      ├─ components/ (Reusable UI components and feature-specific modules)
      ├─ contexts/ (Global state providers for Authentication and Theme)
      ├─ layouts/ (Shared application shells)
      ├─ lib/ (Utility functions and formatting helpers)
      ├─ pages/ (Main application views and page-level components)
      └─ routes/ (Navigation logic and protected route definitions)
```

---

## Setup & Local Installation

Follow these steps to get the project running locally on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/mdfaizan0/sentry.git
cd sentry
```

### 2. MongoDB Setup
Ensure you have MongoDB installed locally or have access to a MongoDB Atlas cluster.
- Create a new database named `sentry`.
- Copy your connection string for use in the environment variables.

### 3. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_APP_PASSWORD=your_google_app_password
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 4. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

### 5. Access the Application
Once both servers are running:
- Open your browser and navigate to `http://localhost:5173`.
- You can register a new account or use the demo credentials provided above.

---

## Environment Variables

### Backend (.env)
- `PORT`: The port the backend server will run on (default: 5000).
- `MONGO_URI`: Your MongoDB connection string.
- `JWT_SECRET`: A secret key used to sign JWT tokens.
- `EMAIL_USER`: Your email address.
- `GOOGLE_APP_PASSWORD`: Required for sending invitation emails via Nodemailer (Gmail). 
   - [Click here](https://myaccount.google.com/apppasswords) to get it, make sure you are logged in with `EMAIL_USER` and 2FA is enabled on your Gmail account.
- `FRONTEND_URL`: The URL of your running frontend.

### Frontend (.env)
- `VITE_API_URL`: The full URL to the backend API (e.g., `http://localhost:5000/api`).

---

## API Documentation

The backend exposes the following endpoints:

### Authentication
- `POST /api/auth/register`: Create a new user account.
- `POST /api/auth/login`: Authenticate a user and receive a JWT.

### Dashboard
- `GET /api/dashboard`: Fetch aggregated stats (projects, active tasks) and recent work for the logged-in user.

### Projects
- `GET /api/projects`: List all projects the user is an owner or member of.
- `GET /api/projects/:projectId`: Get detailed information about a specific project.
- `POST /api/projects`: Create a new project.
- `PUT /api/projects/:projectId`: Update project title or description (Owner only).
- `DELETE /api/projects/:projectId`: Delete a project and all its tickets (Owner only).
- `POST /api/projects/:projectId/add-member`: Directly add a user to the project.
- `POST /api/projects/:projectId/remove-member`: Remove a user from the project.

### Tickets
- `GET /api/tickets/:projectId`: List all tickets within a specific project.
- `GET /api/tickets/:projectId/:ticketId`: Fetch details for a specific ticket.
- `POST /api/tickets/:projectId`: Create a new ticket.
- `PATCH /api/tickets/:projectId/:ticketId`: Update ticket details (status, priority, etc.).
- `DELETE /api/tickets/:projectId/:ticketId`: Delete a ticket (Owner only).
- `PATCH /api/tickets/:projectId/:ticketId/assign`: Assign a ticket to a member.
- `PATCH /api/tickets/:projectId/:ticketId/unassign`: Remove assignee from a ticket.
- `PATCH /api/tickets/:projectId/:ticketId/change-assignee`: Reassign a ticket.

### Comments
- `GET /api/comments/:ticketId`: Fetch all comments and replies for a specific ticket.
- `POST /api/comments/:ticketId`: Add a new comment or reply to a ticket.

### Invitations
- `POST /api/invites/add/:projectId`: Send an email invitation to join a project.
- `GET /api/invites/all/:projectId`: List all pending/rejected invitations for a project.
- `PATCH /api/invites/accept/:token`: Accept a project invitation via token.
- `PATCH /api/invites/reject/:token`: Reject a project invitation via token.

### User Search
- `GET /api/users/search`: Search for existing users by name or email for project adding.

---

## Known Limitations
- **No Real-time Sockets**: Updates require a manual page refresh or interval-based polling.
- **No File Uploads**: Ticket descriptions and comments are currently text-only.
- **Client-side Filtering**: Current filters operate on the fetched result set rather than server-side pagination.

---

Thank You 💚