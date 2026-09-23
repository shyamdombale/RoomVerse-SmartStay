# RoomVerse — RESTful API Specification

## 1. Standard Response Envelope
All API endpoints follow a uniform JSON envelope:

### Success Response (`200 OK`, `201 Created`)
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 42
  }
}
```

### Error Response (`400`, `401`, `403`, `404`, `500`)
```json
{
  "success": false,
  "message": "Specific error explanation",
  "errors": [
    { "field": "email", "message": "Email is already registered" }
  ]
}
```

---

## 2. API Endpoints Catalog

### 2.1 Authentication & Profile (`/api/auth`)
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `POST` | `/api/auth/register` | Public | Register new user (tenant, owner) |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT |
| `GET` | `/api/auth/me` | Protected | Fetch current user session & profile |
| `PUT` | `/api/auth/profile` | Protected | Update profile details |

### 2.2 Properties (`/api/properties`)
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `GET` | `/api/properties` | Public | Search & filter properties (city, budget, amenities, etc.) |
| `GET` | `/api/properties/:id` | Public | Detailed property profile with rooms & amenities |
| `POST` | `/api/properties` | Owner | Create new property listing (defaults to pending verification) |
| `PUT` | `/api/properties/:id` | Owner / Admin | Update property details |
| `DELETE` | `/api/properties/:id` | Owner / Admin | Soft delete / archive property |
| `POST` | `/api/properties/calculate-cost` | Public | Calculate estimated total monthly cost |

### 2.3 Rooms & Availability (`/api/properties/:propertyId/rooms`, `/api/rooms`)
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `GET` | `/api/properties/:propertyId/rooms` | Public | Get list of rooms for property |
| `POST` | `/api/properties/:propertyId/rooms` | Owner | Add a new room/bed type |
| `PUT` | `/api/rooms/:id/availability` | Owner | Update room status (`available`, `reserved`, `occupied`, `maintenance`) |

### 2.4 Bookings & Enquiries (`/api/bookings`)
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `POST` | `/api/bookings` | Tenant | Create booking / enquiry request |
| `GET` | `/api/bookings/my` | Tenant | List tenant's booking requests |
| `GET` | `/api/bookings/owner` | Owner | List booking requests for properties owned |
| `PUT` | `/api/bookings/:id/status` | Owner / Tenant | Update status (`accepted`, `rejected`, `confirmed`, `cancelled`) |

### 2.5 Reviews & Ratings (`/api/reviews`)
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `POST` | `/api/reviews` | Tenant | Submit verified tenant review |
| `GET` | `/api/reviews/property/:id` | Public | Get all reviews for a property |
| `PUT` | `/api/reviews/:id/reply` | Owner | Owner response to a review |

### 2.6 Favorites & Comparison (`/api/favorites`)
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `GET` | `/api/favorites` | Tenant | Get list of saved properties |
| `POST` | `/api/favorites/toggle` | Tenant | Add or remove property from favorites |
| `POST` | `/api/favorites/compare` | Public | Compare multiple properties side-by-side |

### 2.7 Dashboards & Moderation (`/api/owner`, `/api/admin`)
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `GET` | `/api/owner/dashboard` | Owner | Owner stats: properties, active enquiries, occupancy |
| `GET` | `/api/admin/pending-properties` | Admin | Listings awaiting verification |
| `PUT` | `/api/admin/properties/:id/verify` | Admin | Approve or reject property listing |
| `GET` | `/api/admin/stats` | Admin | Platform overview (total users, properties, bookings) |
