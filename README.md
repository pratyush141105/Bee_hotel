# Hotel Bee — Backend API

> Production-ready Node.js + Express + MongoDB backend for Hotel Management.
> Clean architecture: Routes → Controllers → Services → Repositories → MongoDB

---

## Quick Start

```bash
git clone <repo-url>
cd backend_hotel_bee
npm install
cp .env.example .env        # fill in all values
npm run seed                 # creates Super Admin
npm run dev                  # starts on http://localhost:5000
```

Health check: `GET http://localhost:5000/api/v1/health`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ (ES Modules) |
| Framework | Express.js 4 |
| Database | MongoDB + Mongoose 8 |
| Auth | JWT in HTTP-only cookies |
| Validation | Zod (every body/params/query) |
| Uploads | Multer + Cloudinary |
| Security | Helmet, CORS, rate-limit, xss-clean, mongo-sanitize |
| Logging | Morgan |

---

## Environment Variables

Copy `.env.example` → `.env` and fill:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/hotel_bee
JWT_SECRET=your_long_random_secret_minimum_32_chars
JWT_EXPIRES_IN=7d
COOKIE_NAME=hotel_bee_token
CLIENT_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Project Structure

```
src/
├── app.js                    # Express factory (middleware stack)
├── server.js                 # Entry point + graceful shutdown
├── config/                   # env.config.js, cloudinary.config.js
├── constants/                # http, messages, roles, booking
├── controllers/              # Thin HTTP handlers (13 files)
├── database/                 # connect.js (retry logic)
├── errors/                   # AppError.js, ValidationError.js
├── middlewares/              # auth, validate, upload, rateLimiter, sanitize, errorHandler
├── models/                   # 18 Mongoose schemas
├── repositories/             # 18 data-access objects
├── routes/                   # 15 route files + index
├── services/                 # 19 business logic files
├── utils/                    # jwt, cookie, cloudinary, pagination, referenceNumber, slug, etc.
└── validators/               # Zod schemas (by feature folder)
scripts/
└── seedAdmin.js              # First admin seeder
```

---

## Standard Response Format

**Success:**
```json
{ "success": true, "message": "Fetched successfully.", "data": {} }
```

**Error:**
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [{ "field": "body.email", "message": "Invalid email format." }]
}
```

---

## Authentication

JWT stored in HTTP-only cookie. All admin routes require the cookie.

```http
POST /api/v1/auth/login
Content-Type: application/json
{ "email": "admin@hotelbee.com", "password": "HotelBee@123" }
```

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | Public | Login → sets cookie |
| POST | `/auth/logout` | 🔒 | Clears cookie |
| GET | `/auth/me` | 🔒 | Current admin |
| PUT | `/auth/profile` | 🔒 | Update name/email |
| PUT | `/auth/change-password` | 🔒 | Change password |

---

## Pagination

All list endpoints support:

| Param | Default | Description |
|---|---|---|
| `page` | `1` | Page number |
| `limit` | `10–20` | Items per page (max 100) |
| `sort` | field-specific | Sort field |
| `order` | `desc` | `asc` or `desc` |

Paginated response includes:
```json
"pagination": { "page": 1, "limit": 20, "total": 150, "totalPages": 8 }
```

---

## Reference Numbers

Every customer-facing request gets a unique reference number:

| Model | Format | Example |
|---|---|---|
| BanquetBooking | `BNQ-YYYYMMDD-XXXXXX` | `BNQ-20260728-8F93K2` |
| CateringInquiry | `CAT-YYYYMMDD-XXXXXX` | `CAT-20260728-K2J9P1` |
| ContactInquiry | `CNT-YYYYMMDD-XXXXXX` | `CNT-20260728-M3X7Q4` |
| EventRegistration | `EVT-YYYYMMDD-XXXXXX` | `EVT-20260728-W1N5R8` |

---

## API Reference

### Home — `/home`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/home` | Public | Get home content |
| PUT | `/home` | 🔒 | Update (multipart: `heroImages[]`) |

### About — `/about`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/about` | Public | Get about content |
| PUT | `/about` | 🔒 | Update |

---

### Restaurant — `/restaurant`

**Categories:**

| Method | Endpoint | Auth |
|---|---|---|
| GET | `/restaurant/categories` | Public |
| GET | `/restaurant/categories/:id` | Public |
| POST | `/restaurant/categories` | 🔒 multipart `image` |
| PUT | `/restaurant/categories/:id` | 🔒 multipart `image` |
| DELETE | `/restaurant/categories/:id` | 🔒 |

**Menu Items** (query: `search`, `categoryId`, `veg`, `featured`, `isAvailable`):

| Method | Endpoint | Auth |
|---|---|---|
| GET | `/restaurant/menu` | Public |
| GET | `/restaurant/menu/featured` | Public |
| GET | `/restaurant/menu/category/:categoryId` | Public |
| GET | `/restaurant/menu/:id` | Public |
| POST | `/restaurant/menu` | 🔒 multipart `image` |
| PUT | `/restaurant/menu/:id` | 🔒 multipart `image` |
| DELETE | `/restaurant/menu/:id` | 🔒 |

---

### Banquet — `/banquet`

**Halls** (query: `status`):

| Method | Endpoint | Auth |
|---|---|---|
| GET | `/banquet/halls` | Public |
| GET | `/banquet/halls/:id` | Public |
| POST | `/banquet/halls` | 🔒 multipart `images[]` |
| PUT | `/banquet/halls/:id` | 🔒 multipart `images[]` |
| DELETE | `/banquet/halls/:id` | 🔒 |

**Bookings:**

> ⚠️ `approveBooking` runs conflict detection — rejects with HTTP 409 if hall already has a confirmed booking on the same date.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/banquet/book` | Public | Submit booking inquiry |
| GET | `/banquet/bookings` | 🔒 | List (filter: `status`, `hall`, `date`) |
| GET | `/banquet/bookings/:id` | 🔒 | Details |
| PUT | `/banquet/bookings/:id/approve` | 🔒 | Approve (checks conflicts) |
| PUT | `/banquet/bookings/:id/reject` | 🔒 | Reject |
| PUT | `/banquet/bookings/:id/complete` | 🔒 | Complete |
| DELETE | `/banquet/bookings/:id` | 🔒 | Delete |

**Create Booking Body:**
```json
{
  "customerName": "Rahul Sharma",
  "phone": "9876543210",
  "email": "rahul@example.com",
  "hall": "<hall_id>",
  "eventType": "Wedding",
  "date": "2026-12-15",
  "time": "7:00 PM",
  "numberOfGuests": 200,
  "notes": "Veg only"
}
```

---

### Catering — `/catering`

**Packages** (formerly `/catering` — updated to `/catering/packages`):

| Method | Endpoint | Auth |
|---|---|---|
| GET | `/catering/packages` | Public |
| GET | `/catering/packages/:id` | Public |
| POST | `/catering/packages` | 🔒 multipart `images[]` |
| PUT | `/catering/packages/:id` | 🔒 multipart `images[]` |
| DELETE | `/catering/packages/:id` | 🔒 |

**Inquiries:**

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/catering/inquiry` | Public | Submit inquiry |
| GET | `/catering/inquiries` | 🔒 | List (filter: `status`, `date`, `search`) |
| GET | `/catering/inquiries/:id` | 🔒 | Details |
| PUT | `/catering/inquiries/:id/confirm` | 🔒 | Confirm |
| PUT | `/catering/inquiries/:id/reject` | 🔒 | Reject |
| PUT | `/catering/inquiries/:id/complete` | 🔒 | Complete |
| DELETE | `/catering/inquiries/:id` | 🔒 | Delete |

**Inquiry Body:**
```json
{
  "customerName": "Priya Mehta",
  "phone": "9876543210",
  "email": "priya@example.com",
  "eventDate": "2026-12-20",
  "eventTime": "7:00 PM",
  "location": "Bandra, Mumbai",
  "numberOfGuests": 150,
  "selectedPackage": "<optional_package_id>",
  "foodRequirements": "Pure vegetarian",
  "additionalRequirements": "Need live counter"
}
```

---

### Gallery — `/gallery`

Query: `type` (image/video), `category`, `search`

| Method | Endpoint | Auth |
|---|---|---|
| GET | `/gallery` | Public |
| POST | `/gallery` | 🔒 multipart `media` file + `type` field |
| PUT | `/gallery/:id` | 🔒 |
| DELETE | `/gallery/:id` | 🔒 |

---

### Reviews — `/reviews`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/reviews` | Public | Filter: `approved=true/false` |
| POST | `/reviews` | Public | Submit review |
| PUT | `/reviews/:id/approve` | 🔒 | Approve |
| DELETE | `/reviews/:id` | 🔒 | Delete |

---

### Events — `/events`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/events` | Public | List (filter: `featured`, `category`, `search`) |
| GET | `/events/featured` | Public | Featured events |
| GET | `/events/upcoming` | Public | Future events |
| GET | `/events/:id` | Public | Single event |
| GET | `/events/:id/availability` | Public | Seat availability |
| POST | `/events/:id/register` | Public | Register for event |
| POST | `/events` | 🔒 | Create (multipart `banner`) |
| PUT | `/events/:id` | 🔒 | Update |
| DELETE | `/events/:id` | 🔒 | Delete |

**Registration Body:**
```json
{
  "customerName": "Amit Singh",
  "phone": "9876500000",
  "email": "amit@example.com",
  "numberOfGuests": 2,
  "specialRequest": "Wheelchair accessible seating"
}
```

**Availability Response:**
```json
{
  "registrationEnabled": true,
  "maximumGuests": 200,
  "registeredGuests": 45,
  "remainingSeats": 155,
  "isFull": false,
  "registrationDeadline": "2026-12-28T00:00:00.000Z",
  "deadlinePassed": false
}
```

**Event Registrations (Admin):**

| Method | Endpoint |
|---|---|
| GET | `/events/registrations` |
| GET | `/events/registrations/:id` |
| PUT | `/events/registrations/:id/confirm` |
| PUT | `/events/registrations/:id/cancel` |
| DELETE | `/events/registrations/:id` |

---

### Managers — `/managers`
All endpoints require 🔒. Standard CRUD with pagination.

### Branches — `/branches`
Public read, 🔒 write. Filter: `isActive=true/false`.

---

### Contact — `/contact`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/contact` | Public | Hotel contact info (singleton) |
| PUT | `/contact` | 🔒 | Update contact info |
| POST | `/contact/inquiry` | Public | Submit contact form |
| GET | `/contact/inquiries` | 🔒 | List (filter: `status`) |
| GET | `/contact/inquiries/:id` | 🔒 | Details |
| PUT | `/contact/inquiries/:id/read` | 🔒 | Mark read |
| PUT | `/contact/inquiries/:id/close` | 🔒 | Close |
| DELETE | `/contact/inquiries/:id` | 🔒 | Delete |

---

### Settings — `/settings`
All endpoints require 🔒.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/settings` | Get settings |
| PUT | `/settings` | Update links/title/theme |
| PUT | `/settings/logo` | Upload logo (`logo` file field) |
| PUT | `/settings/qr` | Upload QR code (`qr` file field) |

---

### Dashboard — `/dashboard`
All endpoints require 🔒.

| Method | Endpoint | Returns |
|---|---|---|
| GET | `/dashboard/overview` | 21 entity counts |
| GET | `/dashboard/bookings` | Monthly/weekly/daily trends + status pie |
| GET | `/dashboard/revenue` | Estimated revenue from confirmed bookings |
| GET | `/dashboard/recent` | Latest 5 items from 5 modules |
| GET | `/dashboard/charts` | 6 aggregation datasets for charts |

**Overview Response:**
```json
{
  "totalBookings": 0, "pendingBookings": 0, "confirmedBookings": 0,
  "totalEvents": 0, "upcomingEvents": 0,
  "totalReviews": 0, "approvedReviews": 0, "pendingReviews": 0,
  "totalGalleryItems": 0, "totalRestaurantItems": 0, "totalCategories": 0,
  "totalBanquetHalls": 0, "totalBranches": 0, "totalManagers": 0,
  "totalCateringServices": 0, "totalCateringInquiries": 0, "pendingCateringInquiries": 0,
  "totalContactInquiries": 0, "unreadContactInquiries": 0,
  "totalEventRegistrations": 0, "pendingEventRegistrations": 0
}
```

---

## Security Features

| Feature | Implementation |
|---|---|
| JWT storage | HTTP-only, SameSite=strict, Secure in production |
| Brute force | 10 req/15min on `/auth/login` |
| General rate limit | 100 req/15min |
| XSS | xss-clean + Helmet |
| NoSQL injection | express-mongo-sanitize |
| Password | bcrypt (12 rounds), never returned in response |
| Validation | Zod on every body/params/query |

---

## Scripts

```bash
npm run dev      # development with nodemon
npm start        # production
npm run seed     # create first Super Admin
```

Custom seed:
```bash
ADMIN_NAME="John" ADMIN_EMAIL="john@hotel.com" ADMIN_PASSWORD="Pass@123" npm run seed
```

---

## Postman Collection

Import `hotel_bee.postman_collection.json`. Set Postman variable:
- `BASE_URL` → `http://localhost:5000/api/v1`

Postman handles cookies automatically after login.

---

## Deployment

1. Set all env vars in your hosting dashboard
2. Set `NODE_ENV=production`, `CLIENT_URL` to frontend domain
3. Use HTTPS (required for Secure cookies)
4. Start: `npm start`

Works with: **Render**, **Railway**, **Fly.io**, **DigitalOcean App Platform**
