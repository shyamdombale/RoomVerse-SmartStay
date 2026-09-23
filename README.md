# RoomVerse 🏢✨

> **Smart Rental, PG & Accommodation Management Platform**  
> Designed for Students & Working Professionals in Major Educational & Tech Hubs.

---

## 📌 Project Overview
**RoomVerse** is a modern, cloud-ready full-stack accommodation portal built to eliminate common rental pitfalls: hidden monthly living costs, phantom availability, unverified fake listings, and opaque booking processes.

Unlike basic CRUD portals, RoomVerse incorporates an **Explainable Total Monthly Cost Calculator**, an **Admin Verification Workflow**, an atomic **Room Availability Engine**, multi-criteria **Tenant Reviews**, and an isolated **Python Analytics Pipeline** for rental demand analysis.

---

## 🏗️ Technology Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios (with JWT interceptors)
- **Icons & UI**: Lucide React, Framer Motion

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JSON Web Tokens (JWT) + bcryptjs
- **Validation**: Joi / Custom Request Validators
- **Security**: CORS, Helmet, Rate Limiting, Parameterized SQL queries

### Database
- **Engine**: MySQL 8.0 (Strict 3NF relational model)
- **Local Dev**: Local MySQL Server (`mysql2/promise` connection pool)
- **Production**: AWS RDS MySQL (db.t3.micro / db.t4g.micro)

### Cloud Architecture (Realistic Academic Setup)
- **Compute**: AWS EC2 (t2.micro / t3.micro Ubuntu running Node.js backend)
- **Database**: AWS RDS MySQL (Private Subnet)
- **Media Storage (Phase 2)**: AWS S3 (Direct presigned uploads)
- **CDN & Frontend Hosting (Phase 2)**: AWS S3 + CloudFront
- **Networking**: AWS VPC with Public/Private Subnets & Security Groups

### Analytics Module (Phase 2)
- **Language**: Python 3.10+
- **Data Analysis**: Pandas, NumPy
- **Visualizations**: Matplotlib, Seaborn / Plotly
- **Pipeline**: Read-only SQL extraction -> Data cleaning -> Demand aggregation -> Visual reports

---

## 👥 User Roles & Access Control (RBAC)

1. **Tenant / Student**:
   - Register & secure login (JWT).
   - Explore verified properties with multi-filter search (location, budget, gender preference, AC, food, Wi-Fi).
   - Real-time Total Monthly Cost estimation (Rent + Maintenance + Electricity + Food + Commute).
   - Save favorites & compare up to 4 properties side-by-side.
   - Send booking & enquiry requests; track status progression.
   - Submit multi-dimensional reviews (Cleanliness, Facilities, Value, Location).

2. **Property Owner**:
   - Register and manage properties, room types, bed capacities, and amenities.
   - Real-time room availability status toggling (`Available`, `Reserved`, `Occupied`, `Maintenance`).
   - Review, accept, or reject incoming tenant booking requests.
   - Access owner dashboard with occupancy rates, active enquiries, and rent breakdown.

3. **Platform Administrator**:
   - Verify or reject property listings with timestamped verification badges.
   - Manage user and owner accounts.
   - Audit reported listings and platform safety metrics.

---

## 🏛️ Project Structure

```
RoomVerse/
├── frontend/               # React + Vite + Tailwind CSS SPA
├── backend/                # Node.js + Express REST API
│   ├── src/
│   │   ├── config/         # MySQL database pool & environment configs
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth, RBAC, validation, rate limiting, error handlers
│   │   ├── models/         # Database query abstractions
│   │   ├── routes/         # Express API route declarations
│   │   ├── services/       # Core business logic (Cost engine, availability)
│   │   ├── utils/          # Standard response helpers & logger
│   │   └── validators/     # Input validation schemas
├── database/               # Database DDL and seed scripts
│   ├── schema.sql          # Normalized MySQL 8.0 3NF schema
│   └── seed.sql            # Realistic sample data for Indian tech hubs
├── analytics/              # Python data analytics pipeline (Phase 2)
│   ├── data/               # Raw and processed analytics datasets
│   ├── notebooks/          # Exploratory data analysis notebooks
│   └── scripts/            # SQL extraction & summary scripts
├── docs/                   # Architectural blueprints & specifications
│   ├── architecture/       # System and AWS cloud architecture
│   ├── api/                # REST API specifications
│   └── database/           # Relational schema design & ER documentation
├── .gitignore              # Multi-tier gitignore rules
└── README.md               # Master repository documentation
```

---

## 🚀 Development Phases

- [x] **Phase 1: Project Architecture & Git Setup**
- [ ] **Phase 2: React Frontend Setup**
- [ ] **Phase 3: Express Backend Setup**
- [ ] **Phase 4: MySQL Database & Schema**
- [ ] **Phase 5: Authentication & RBAC**
- [ ] **Phase 6: Property Management**
- [ ] **Phase 7: Search & Filters**
- [ ] **Phase 8: Room Availability Engine**
- [ ] **Phase 9: Booking & Enquiry Workflow**
- [ ] **Phase 10: Favorites & Comparison Matrix**
- [ ] **Phase 11: Total Monthly Cost Calculator**
- [ ] **Phase 12: Reviews & Ratings**
- [ ] **Phase 13: Owner Dashboard**
- [ ] **Phase 14: Admin Verification**
- [ ] **Phase 15: Smart Explainable Matching (Phase 2)**
- [ ] **Phase 16: Python Analytics Module (Phase 2)**
- [ ] **Phase 17: AWS Integration & S3 Storage (Phase 2)**
- [ ] **Phase 18: Security Hardening & Monitoring**
- [ ] **Phase 19: Comprehensive Testing**
- [ ] **Phase 20: Final Deployment & Documentation**

---

## 🔒 Security Principles
- Passwords hashed with `bcryptjs` (salt rounds = 10).
- Stateless JWT-based authentication in Authorization headers.
- Strictly parameterized SQL statements to eliminate SQL Injection (SQLi).
- Role-based middleware enforcement (`requireRole('tenant')`, `requireRole('owner')`, `requireRole('admin')`).
- No hardcoded secrets; configuration loaded strictly via `.env`.

---

## 📄 License
This project is developed for academic evaluation and portfolio demonstration. All rights reserved.
