# RoomVerse — System & Cloud Architecture Overview

## 1. High-Level System Architecture

RoomVerse follows a clean 3-tier architecture with decoupled analytics:

```
[ Client Layer (Vite + React SPA) ]
                │
                │ HTTPS / REST (JSON)
                ▼
[ Application Layer (Node.js + Express API) ]
        │                       │
        │ SQL Connection Pool   │ S3 Pre-signed Uploads (Phase 2)
        ▼                       ▼
[ Persistence Layer (MySQL 8.0) ]  [ Storage Layer (AWS S3) ]
        ▲
        │ Read-only Analytical Extraction
[ Analytics Layer (Python + Pandas Pipeline) ]
```

---

## 2. Tier Breakdown

### 2.1 Client Tier (Frontend)
- **Framework**: React 18 with Vite build tooling for fast HMR and optimized production bundles.
- **Routing**: Client-side single-page routing using `react-router-dom` with protected route wrappers (`RequireAuth`, `RequireRole`).
- **State Management**: Context API for global state (`AuthContext`, `CompareContext`) with localStorage persistence for session tokens.
- **Styling**: Tailwind CSS with responsive breakpoints (mobile, tablet, desktop).

### 2.2 Application Tier (Backend)
- **Express.js API Server**: Completely stateless REST API.
- **Middleware Pipeline**:
  1. `cors()`: Configured for allowed origins.
  2. `express.json()`: Body parsing with size limits.
  3. `requestLogger`: Timestamped request method and URL tracking.
  4. `rateLimiter`: Prevent brute force attacks on authentication and booking endpoints.
  5. `authenticateJWT`: Validates `Bearer <token>` and populates `req.user`.
  6. `authorizeRoles(...roles)`: RBAC enforcement against `req.user.role`.
  7. `errorHandler`: Centralized error handler returning standardized error envelopes.

### 2.3 Persistence Tier (Database)
- **Engine**: MySQL 8.0.
- **Policy**: Clean, production-ready schema with strict foreign keys, cascade rules, and compound indexes.
- **Zero Fallback Policy**: No alternative in-memory fallback stores. The system operates directly on MySQL in both development and production.

### 2.4 Cloud Architecture (Realistic 3rd-Year Academic Model)
To avoid unnecessary cloud billing while maintaining real-world engineering standards:
- **EC2 Instance**: Single `t2.micro` or `t3.micro` instance running Ubuntu 22.04 LTS with PM2 process manager and Nginx reverse proxy.
- **RDS MySQL**: Single-AZ `db.t3.micro` or `db.t4g.micro` running inside a private subnet of the VPC.
- **S3 Bucket**: Scalable storage for property images, eliminating server disk exhaustion.
- **Security Groups**:
  - `ALB/Nginx SG`: Inbound port 80/443 from Internet.
  - `Node.js App SG`: Inbound port 5000 only from ALB/Nginx.
  - `RDS MySQL SG`: Inbound port 3306 only from EC2 Node.js App SG.
