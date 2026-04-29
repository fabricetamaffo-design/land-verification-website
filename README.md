# Land Verification Website

PKFokam Institute of Excellence — Capstone Project Spring 2026

A secure, centralized digital platform for verifying land ownership and validating land documents in Cameroon.

## Team

| Name | Role |
|---|---|
| Tamaffo Fabrice | Project Manager / Backend Developer / Database Manager |
| Kuate Messado | Backend Developer |
| Nkam Titcha | Frontend Developer / Database Manager |
| Kemgang Leprince | Frontend Developer / Backend Developer |

**Supervisor:** Mr. Joel Teto Kamdem

---

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Leaflet
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** JWT + bcrypt
- **Maps:** Leaflet.js (react-leaflet)

---

## Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- npm >= 9

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/fabricetamaffo-design/land-verification-website.git
cd land-verification-website
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials and JWT secret
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`  
Frontend runs on `http://localhost:5173`

---

## Default Admin Credentials (after seed)

- **Email:** admin@landverify.cm
- **Password:** Admin@1234

---

## Features (FR-01 to FR-10)

| ID | Feature |
|---|---|
| FR-01 | User Registration |
| FR-02 | User Login (role-based) |
| FR-03 | Land Record Upload (Admin) |
| FR-04 | Automated Verification (Valid / Suspicious / Duplicate) |
| FR-05 | Land Search by title, ID, or owner name |
| FR-06 | Verification Result Display |
| FR-07 | GPS Map Display (Leaflet) |
| FR-08 | Land Record Management (edit / deactivate) |
| FR-09 | Role-Based Access Control |
| FR-10 | Browse Lands by Quarter |

---

## API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login

### Land (Public / User)
- `GET /api/lands/search?q=` — Search by title, ID, or owner
- `GET /api/lands/:id` — Get land parcel detail
- `GET /api/lands/browse?quarter=` — Browse by quarter

### Admin
- `POST /api/admin/lands` — Upload land record
- `PUT /api/admin/lands/:id` — Edit land record
- `PATCH /api/admin/lands/:id/deactivate` — Deactivate land record
- `GET /api/admin/users` — List all users
