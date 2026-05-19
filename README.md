# LandVerifyCM — Land Verification Platform

**PKFokam Institute of Excellence | Capstone Project | Spring 2026**
**Department of Computing & Software Engineering**

LandVerifyCM is a secure, centralized web platform designed to combat land fraud in Cameroon. It enables citizens, buyers, and legal professionals to verify land ownership, detect duplicate or suspicious title records, and view GPS-based parcel locations — all through a bilingual (English / French) interface.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Team](#team)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Verification Algorithm](#verification-algorithm)
- [Branching Strategy](#branching-strategy)

---

## Project Overview

Land fraud is a significant problem in Cameroon, where forged or duplicated land titles lead to costly legal disputes and loss of property. LandVerifyCM addresses this by providing:

- A **public registry** where anyone can search and browse registered land parcels
- An **automated verification engine** that classifies every land record as Valid, Suspicious, or Duplicate based on GPS proximity analysis and title number uniqueness
- A **secure admin panel** where authorized administrators can upload, edit, deactivate, and audit land records
- A **bilingual UI** supporting both English and French users

---

## Team

| Name | Role |
|---|---|
| Tamaffo Fabrice | Project Manager · Backend Developer · Database Manager |
| Nkam Titcha | Frontend Developer · Database Manager |
| Kemgang Leprince | Frontend Developer · Backend Developer |

**Supervisor:** Mr. Joel Teto Kamdem

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Maps | React Leaflet (Leaflet.js) |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL 14+ via Prisma ORM |
| Authentication | JWT (jsonwebtoken) + bcrypt password hashing |
| File Uploads | Multer (PDF, JPG, PNG — max 10 MB per file) |
| Validation | Zod schema validation |
| i18n | Custom React context (English / French) |

---

## Architecture

```
land-verification-website/
├── frontend/               # React + Vite SPA
│   └── src/
│       ├── components/     # Reusable UI components (Navbar, Footer, LandCard, etc.)
│       ├── context/        # Auth and Language context providers
│       ├── pages/          # Route-level page components
│       ├── services/       # Axios API service layer
│       ├── translations/   # EN / FR translation files
│       └── types/          # Shared TypeScript types
│
└── backend/                # Express REST API
    ├── src/
    │   ├── controllers/    # Route handler logic (auth, land, admin)
    │   ├── middleware/     # JWT auth guard, admin role guard
    │   ├── routes/         # Express routers
    │   └── utils/          # JWT helpers, verification algorithm
    └── prisma/
        ├── schema.prisma   # Database schema (User, LandParcel, LandDocument, AuditLog)
        └── seed.ts         # Default admin account seed
```

- The **frontend** runs on `http://localhost:5173` and communicates with the backend via REST API calls.
- The **backend** runs on `http://localhost:5000` and exposes a RESTful API protected by JWT middleware.
- All admin routes require both a valid `Bearer` token and the `ADMIN` role.

---

## Features

| ID | Feature | Status |
|---|---|---|
| FR-01 | User Registration (name, email, password) | Done |
| FR-02 | User Login with JWT-based session | Done |
| FR-03 | Admin — Upload Land Record with document attachments | Done |
| FR-04 | Automated Verification Engine (Valid / Suspicious / Duplicate) | Done |
| FR-05 | Land Search by title number, parcel ID, or owner name | Done |
| FR-06 | Verification Result Display with color-coded status badge | Done |
| FR-07 | GPS Map Display using Leaflet.js | Done |
| FR-08 | Admin — Edit and Deactivate Land Records | Done |
| FR-09 | Role-Based Access Control (ADMIN vs USER) | Done |
| FR-10 | Browse Land Parcels by Quarter / Neighborhood | Done |
| FR-11 | Document Upload — Admin attaches supporting files (PDF / image) | Done |
| FR-12 | Ownership Chain — Admin records full chain of past owners | Done |

---

## Getting Started

### Prerequisites

| Tool | Minimum Version |
|---|---|
| Node.js | 18.x |
| npm | 9.x |
| PostgreSQL | 14.x |

---

### 1. Clone the Repository

```bash
git clone https://github.com/fabricetamaffo-design/land-verification-website.git
cd land-verification-website
```

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file and fill in your values
cp .env.example .env

# Run database migrations
npx prisma migrate dev --name init

# Seed the default admin account
npx prisma db seed

# Start the development server
npm run dev
```

The backend API will be available at `http://localhost:5000`.

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will be available at `http://localhost:5173`.

---

### Default Admin Credentials (after seed)

| Field | Value |
|---|---|
| Email | admin@landverify.cm |
| Password | Admin@1234 |

> These credentials are for development and demonstration purposes only. Change them before any production deployment.

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure the following:

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/land_verification` |
| `JWT_SECRET` | Secret key for signing JWT tokens — use a long random string in production | `change-me-in-production` |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Runtime environment | `development` or `production` |
| `FRONTEND_URL` | Allowed CORS origin for the frontend | `http://localhost:5173` |

---

## API Reference

All endpoints are prefixed with `/api`. Admin routes require a valid `Authorization: Bearer <token>` header with the `ADMIN` role.

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user account | Public |
| POST | `/api/auth/login` | Login and receive a JWT token | Public |

### Land Records

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/lands/search?q=` | Search parcels by title number, owner name, or parcel ID | Public |
| GET | `/api/lands/browse?quarter=` | List parcels filtered by quarter | Public |
| GET | `/api/lands/:id` | Get full details of a land parcel including documents | Public |

### Admin Panel

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/admin/lands` | List all land records (including inactive) | Admin |
| POST | `/api/admin/lands` | Upload a new land record (supports document attachments) | Admin |
| PUT | `/api/admin/lands/:id` | Update an existing land record | Admin |
| PATCH | `/api/admin/lands/:id/deactivate` | Deactivate a land record | Admin |
| GET | `/api/admin/users` | List all registered users | Admin |
| GET | `/api/admin/lands/:landId/audit` | View the full audit log for a land record | Admin |

**Document upload:** Use `multipart/form-data` with the field name `documents`. Accepted formats: PDF, JPG, PNG. Maximum file size: 10 MB. Maximum 5 files per request.

---

## Verification Algorithm

When an admin uploads or updates a land record, the system automatically classifies it using the following rules, evaluated in order:

```
1. DUPLICATE  — title number already exists in the registry
2. DUPLICATE  — GPS coordinates are within 10 meters of an existing parcel
3. SUSPICIOUS — GPS coordinates are within 50 meters of an existing parcel
4. VALID      — no conflicts detected
```

GPS distance is calculated using the **Haversine formula**, which accounts for the curvature of the Earth to produce accurate real-world distances between two coordinate pairs.

- A **DUPLICATE** result blocks the upload entirely and returns a `409 Conflict` response with details about the conflicting record.
- A **SUSPICIOUS** result allows the upload but flags the record for manual administrative review.
- Every create, update, and deactivate action is recorded in the `AuditLog` table with the action type, changed fields, responsible admin ID, and a timestamp.

---

## Branching Strategy

This project follows the **Gitflow** workflow:

```
master          <- production-ready code (receives merges from release/* and hotfix/*)
  └── release/v1.0    <- release preparation (receives merge from develop)
        └── develop   <- integration branch (receives merges from feature/*)
              ├── feature/auth-and-registration
              ├── feature/admin-panel
              ├── feature/land-upload-verification
              ├── feature/search-and-map
              └── feature/browse-and-ui
hotfix/*        <- urgent production fixes (branches from master)
```

All new work must be done on a `feature/*` branch. Changes flow through `develop` → `release/*` → `master` via pull requests. Direct commits to `master` are not permitted.

For the full contribution guide, see [CONTRIBUTING.md](./CONTRIBUTING.md).
