# LandVerifyCM Mobile

Expo React Native client for the existing LandVerifyCM backend.

## What This App Reuses

- Existing Node.js / Express REST API under `/api`
- Existing PostgreSQL database through the backend only
- Existing JWT auth, admin role checks, upload routes, audit logs, and verification algorithm

It does not add a backend, connect directly to PostgreSQL, or duplicate Prisma/verification logic.

## Requirements

- Node.js 22.13+ for Expo SDK 56
- npm
- A running backend API or the deployed Railway API

## Setup

```bash
cd mobile
npm install
copy .env.example .env.local
npm run start
```

Set `EXPO_PUBLIC_API_URL` to the backend origin without `/api`.

Examples:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.20:5000
EXPO_PUBLIC_API_URL=https://land-verification-website-production.up.railway.app
```

For physical devices, do not use `localhost`; use the computer's LAN IP address.

## Business Requirement Coverage

| Requirement | Mobile screen / behavior |
|---|---|
| FR-01 User Registration | `Register` screen calls `POST /api/auth/register` |
| FR-02 User Login | `Login` screen stores JWT in Expo SecureStore |
| FR-03 Admin Upload Land Record | `Upload land record` calls `POST /api/admin/lands` with multipart documents |
| FR-04 Automated Verification | Reused through backend upload/update responses; no mobile copy of the algorithm |
| FR-05 Land Search | `Search` calls `GET /api/lands/search` |
| FR-06 Verification Result Display | `StatusBadge`, cards, and details show valid/not-valid/admin statuses |
| FR-07 GPS Map Display | `Land detail` embeds OpenStreetMap and opens native maps |
| FR-08 Admin Edit and Deactivate | `Manage lands` and `Edit land record` call existing admin routes |
| FR-09 Role-Based Access Control | Mobile guards admin screens and backend still enforces JWT ADMIN role |
| FR-10 Browse by Quarter | `Browse` calls `GET /api/lands/quarters` and `GET /api/lands/browse` |
| FR-11 Document Upload | `Upload land record` uses Expo DocumentPicker and multipart `documents` |
| FR-12 Ownership Chain | Upload accepts ownership history; edit can add/delete ownership records |

## Notes

- Uploaded document downloads use the authenticated `/uploads` route from the latest backend.
- Admin list endpoints use the backend pagination parameters added in the latest `develop` branch.
- The app uses a lightweight in-app navigator instead of React Navigation to keep the dependency surface small.
