# Task Management System (TMS) Backend

A robust and secure backend for a Task Management System, built with modern web technologies.

## 🚀 Features

- **JWT Authentication**: Secure login system using Access Tokens (short-lived) and Refresh Tokens (long-lived, stored in `httpOnly` cookies).
- **Task Management**: Full CRUD operations for tasks with status filtering, search, and pagination.
- **Dockerized**: Easy setup with Docker and Docker Compose, including PostgreSQL with health checks.
- **Prisma ORM**: Type-safe database interactions with PostgreSQL.
- **Zod Validation**: Strict input validation for all API endpoints.
- **Deployment Ready**: Optimized for cloud platforms like Render with automated Prisma client generation.

## 🛠 Tech Stack

- **Runtime**: Node.js (v22+)
- **Framework**: Express.js
- **Language**: TypeScript (ESM)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JSON Web Tokens (JWT)
- **Validation**: Zod
- **Containerization**: Docker

## 🚦 Getting Started

### Prerequisites

- Node.js installed locally OR Docker & Docker Compose.
- A PostgreSQL database (if running locally without Docker).

### Local Setup

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/tms?schema=public"
   JWT_SECRET="your_access_token_secret"
   JWT_REFRESH_SECRET="your_refresh_token_secret"
   PORT=8000
   ```
4. **Run Database Migrations**:
   ```bash
   npx prisma db push
   ```
5. **Start Development Server**:
   ```bash
   npm run dev
   ```

### Docker Setup

1. **Start the containers**:
   ```bash
   docker compose up --build
   ```
   The application will be available at `http://localhost:8000`.

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register`: Create a new account.
- `POST /api/auth/login`: Login and receive Access/Refresh tokens.
- `POST /api/auth/refresh`: Obtain a new Access Token using the Refresh Token.
- `POST /api/auth/logout`: Logout and clear authentication cookies.

### Tasks

- `POST /api/tasks`: Create a new task.
- `GET /api/tasks`: List user tasks (supports `page`, `limit`, `search`, `status`).
- `GET /api/tasks/:taskId`: Get specific task details.
- `PATCH /api/tasks/:taskId`: Update a task.
- `DELETE /api/tasks/:taskId`: Delete a task.
- `PATCH /api/tasks/:taskId/toggle`: Quickly toggle task status (TODO <-> COMPLETED).
