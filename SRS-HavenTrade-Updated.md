# Software Requirements Specification
## HavenTrade — Hyperlocal Marketplace Web Application

**Document Version:** 2.0 (Corrected)
**Date:** 26 May 2026
**Project:** HavenTrade
**Institution:** [Your Institution Name]
**Author:** [Your Name]

---

## Table of Contents

1. Introduction
2. Overall Description
3. Functional Requirements
4. Non-Functional Requirements
5. System Architecture
6. Data Models
7. Future Enhancements
8. Glossary

---

## 1. Introduction

### 1.1 Purpose

This document specifies the software requirements for HavenTrade, a hyperlocal peer-to-peer marketplace web application designed for residents of Abuja, Nigeria. It defines the scope, functional requirements, non-functional requirements, and architecture of the system as currently implemented.

### 1.2 Scope

HavenTrade enables residents within the same neighbourhood (approximately 2 km radius) to buy and sell pre-owned goods directly with each other. Sellers open personal storefronts, list items with photographs, and fulfil orders via cargo bike delivery or pickup. Buyers browse by category, save favourites, and complete purchases through a guided checkout flow.

The current release covers:
- User authentication and account management
- Seller onboarding and storefront management
- Product listing creation and browsing
- Cart management and order placement
- Wishlist / saved items
- Seller reviews and ratings
- Image hosting via Cloudinary CDN

### 1.3 Definitions and Acronyms

| Term | Definition |
|---|---|
| Buyer | A registered user who purchases items |
| Seller | A registered user who lists and sells items |
| Listing | A product posted for sale by a seller |
| Storefront | A seller's public profile page showing their listings, ratings, and about information |
| Neighbourhood | An Abuja locality (e.g., Maitama, Wuse, Garki) used for proximity filtering |
| JWT | JSON Web Token — used for session authentication |
| SPA | Single-Page Application |
| CDN | Content Delivery Network |

### 1.4 References

- React 18 Documentation
- Express.js Documentation
- MongoDB Documentation
- Cloudinary Documentation
- Tailwind CSS Documentation

### 1.5 Overview

Section 2 describes the product perspective and user classes. Section 3 lists functional requirements. Section 4 covers non-functional requirements. Section 5 describes the system architecture. Section 6 defines the data models. Section 7 describes planned future enhancements not in the current release.

---

## 2. Overall Description

### 2.1 Product Perspective

HavenTrade is a web application deployed as a client-server system. The frontend is a React SPA hosted on Vercel. The backend is a Node.js/Express REST API hosted on Render. Data is persisted in MongoDB Atlas. Images are stored and served via Cloudinary CDN.

```
Browser (React SPA — Vercel)
        │  HTTPS REST API calls
        ▼
Express Server (Render)
        │               │
        ▼               ▼
  MongoDB Atlas    Cloudinary CDN
```

### 2.2 Product Features Summary

- Neighbourhood-scoped product discovery (2 km radius)
- Seller storefronts with listings, about section, reviews, and policies
- Buyer cart, checkout, and order history
- Wishlist (saved items)
- Seller dashboard with live order feed and listing management
- JWT-based authentication via httpOnly cookies
- Cloudinary image storage with CDN transformations
- Responsive layout for mobile, tablet, and desktop

### 2.3 User Classes and Characteristics

#### 2.3.1 Buyer

- Registered user who has not enabled the seller role
- Can browse, search, save, and purchase listings
- Can leave reviews on sellers after receiving an order

#### 2.3.2 Seller

- A buyer who has opted into the seller role (at sign-up or later via profile settings)
- Has access to the seller dashboard
- Can create, update, and delete their own listings
- Has a public storefront page
- Can view and update incoming order fulfilment status

### 2.4 Operating Environment

| Component | Environment |
|---|---|
| Frontend | Any modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+) |
| Backend | Node.js 18+, Render free tier |
| Database | MongoDB Atlas (shared cluster) |
| Image CDN | Cloudinary |
| Local dev | Node.js 18+, MongoDB running on localhost:27017 |

### 2.5 Design and Implementation Constraints

- All monetary values are in Nigerian Naira (₦)
- Pilot city is Abuja, Nigeria
- Neighbourhood proximity is enforced via neighbourhood-string matching, not GPS coordinates
- Payment processing is UI-only in the current release (no live payment gateway)
- No native mobile application; web-only responsive design
- Frontend uses no client-side routing library; routing is handled by custom navigate/navStack state

### 2.6 Assumptions and Dependencies

- Users have access to a modern web browser and internet connection
- Sellers are trusted to self-report their neighbourhood
- Product images are hosted on Cloudinary in production; local `public/images/` folder is used in development for offline support
- Static seed data (sample listings and sellers) supplements live database content on the home feed

---

## 3. Functional Requirements

### 3.1 User Authentication and Account Management

#### REQ-USER-01 — Registration
**Description:** A new visitor shall be able to register an account using name, email address, password, and Abuja postcode.
**Priority:** High
**Status:** Implemented

Acceptance criteria:
- Email must be unique; duplicate email returns a clear error
- Password is hashed using bcrypt (salt rounds ≥ 10) before storage
- On success, user is issued a JWT stored in an httpOnly cookie (7-day expiry)
- User is redirected to the seller dashboard if `isSeller` was checked; otherwise to the home feed

#### REQ-USER-02 — Sign In
**Description:** A registered user shall be able to sign in with email and password.
**Priority:** High
**Status:** Implemented

Acceptance criteria:
- Invalid credentials return a generic "Invalid email or password" error (no enumeration)
- On success, JWT is refreshed in the httpOnly cookie
- User is redirected to the home feed

#### REQ-USER-03 — Sign Out
**Description:** A signed-in user shall be able to sign out.
**Priority:** High
**Status:** Implemented

Acceptance criteria:
- JWT cookie is cleared on the server
- User is redirected to the landing page

#### REQ-USER-04 — View and Update Profile
**Description:** A signed-in user shall be able to view and update their display name, postcode, neighbourhood, and profile tagline.
**Priority:** Medium
**Status:** Implemented

Acceptance criteria:
- Changes are persisted to the database
- Updated values appear immediately in the UI without a full page reload

#### REQ-USER-05 — Change Password
**Description:** A signed-in user shall be able to change their password by providing their current password and a new password.
**Priority:** Medium
**Status:** Implemented

Acceptance criteria:
- Current password is verified before update
- New password is hashed with bcrypt before storage

#### REQ-USER-06 — Become a Seller
**Description:** A buyer account shall be able to be upgraded to a seller account via the profile settings screen.
**Priority:** Medium
**Status:** Implemented

Acceptance criteria:
- User's `isSeller` flag is set to `true`
- User is redirected to the seller dashboard after upgrade
- Seller storefront becomes visible to other users

---

### 3.2 Product Listings

#### REQ-LIST-01 — Create Listing
**Description:** A seller shall be able to create a product listing with title, price, category, condition, condition level, description, neighbourhood, and up to 6 photographs.
**Priority:** High
**Status:** Implemented

Acceptance criteria:
- Images are uploaded to Cloudinary via a multipart POST to `/api/upload`
- Listing is stored in MongoDB with a reference to the seller's user ID
- Listing appears on the seller's storefront and in the home feed

#### REQ-LIST-02 — Edit Listing
**Description:** A seller shall be able to edit any of their own listings.
**Priority:** High
**Status:** Implemented

Acceptance criteria:
- Only the listing owner can edit (verified by JWT on the server)
- Changes are persisted to MongoDB

#### REQ-LIST-03 — Delete Listing
**Description:** A seller shall be able to delete any of their own listings.
**Priority:** High
**Status:** Implemented

Acceptance criteria:
- Only the listing owner can delete (verified by JWT on the server)
- Listing is removed from MongoDB and no longer appears in any browse feed

#### REQ-LIST-04 — Browse Listings
**Description:** Any visitor (including unauthenticated) shall be able to browse listings filtered by category, condition, and neighbourhood.
**Priority:** High
**Status:** Implemented

Acceptance criteria:
- Listings are returned in reverse-chronological order by default
- Filters can be combined
- Both static seed listings and live database listings appear in the feed

#### REQ-LIST-05 — Search Listings
**Description:** Any visitor shall be able to search for listings by keyword.
**Priority:** Medium
**Status:** Implemented (frontend filter over merged seed + DB listings)

Acceptance criteria:
- Search matches against listing title, category, and seller name
- Results update as the user types

#### REQ-LIST-06 — View Listing Detail
**Description:** Any visitor shall be able to view a full listing detail page (PDP) showing all photographs, description, condition, price, seller info, and related listings.
**Priority:** High
**Status:** Implemented

Acceptance criteria:
- "More from Seller's Studio" section shows up to 4 other listings from the same seller
- "Related Products" section shows up to 4 listings from the same category (excluding already-shown items)
- Favourite (heart) button on related listing cards functions correctly

---

### 3.3 Seller Storefront

#### REQ-STORE-01 — Public Storefront Page
**Description:** Every seller shall have a public storefront page accessible to all visitors.
**Priority:** High
**Status:** Implemented

Acceptance criteria:
- Storefront displays seller name, avatar, tagline, neighbourhood, and member-since date
- Tabs: Listings, About, Reviews, Policies
- Listings tab shows all active listings for that seller
- Reviews tab shows aggregate star rating and individual review cards

#### REQ-STORE-02 — Seller Self-View
**Description:** When a signed-in seller views their own storefront, they shall see an inline prompt to complete missing profile fields (neighbourhood or tagline).
**Priority:** Medium
**Status:** Implemented

Acceptance criteria:
- Prompt appears only when the signed-in user's ID matches the storefront seller's ID
- Saving from the prompt updates the storefront immediately without a page refresh

#### REQ-STORE-03 — Leave a Review
**Description:** A signed-in buyer shall be able to leave a star rating and written review on a seller's storefront after receiving an order from that seller.
**Priority:** Medium
**Status:** Implemented (review form available; order-gating is a future enhancement)

---

### 3.4 Cart and Checkout

#### REQ-CART-01 — Add to Cart
**Description:** A signed-in buyer shall be able to add listings to a shopping cart.
**Priority:** High
**Status:** Implemented

Acceptance criteria:
- Cart state is persisted in the browser's `localStorage`
- Cart shows item count badge in the navigation bar
- Quantity can be adjusted per item; item can be removed

#### REQ-CART-02 — Cart Summary
**Description:** The cart screen shall display all items grouped by seller, with individual prices, quantities, and a running subtotal.
**Priority:** High
**Status:** Implemented

#### REQ-CART-03 — Checkout Flow
**Description:** A buyer shall be able to proceed through a three-step checkout: delivery address, delivery window selection per seller, and payment method selection.
**Priority:** High
**Status:** Implemented (UI only — no live payment processing)

Acceptance criteria:
- Step 1 pre-fills name and postcode from the signed-in user's profile
- Step 2 shows a DeliverySlotPicker for each physical seller group; digital items show "Instant download"
- Step 3 offers Bank Transfer (Nigerian banks: GTBank, Access Bank, Zenith Bank, First Bank) and Card tabs

#### REQ-CART-04 — Place Order
**Description:** Completing checkout shall create an order record in the database.
**Priority:** High
**Status:** Implemented

Acceptance criteria:
- Order record contains buyer ID, all items (listing ref, seller ref, title, price, qty), subtotal, delivery fee (₦1,500 per non-digital seller group), platform fee (₦500), and total
- Cart is cleared after successful order placement
- User is redirected to an order confirmation screen
- **Note:** Payment is marked as paid immediately for demo purposes. Live payment gateway integration is a future enhancement (see Section 7).

#### REQ-CART-05 — Order History
**Description:** A signed-in buyer shall be able to view their past orders.
**Priority:** Medium
**Status:** Implemented

Acceptance criteria:
- Orders are displayed in reverse-chronological order
- Each order shows items, total, date, and current fulfilment status

---

### 3.5 Seller Dashboard and Order Management

#### REQ-DASH-01 — Seller Dashboard
**Description:** A signed-in seller shall have access to a private dashboard showing their KPIs, active listings, and incoming orders.
**Priority:** High
**Status:** Implemented

Acceptance criteria:
- Dashboard displays the seller's real first name in the greeting
- KPIs: count of active listings, count of incoming orders
- Quick actions: create new listing, view storefront, edit profile
- Empty states are shown for sellers with no listings or orders

#### REQ-DASH-02 — Order Feed
**Description:** The seller dashboard shall display a live feed of orders that contain the seller's items.
**Priority:** High
**Status:** Implemented

Acceptance criteria:
- Orders are fetched from `/api/orders/seller` using the seller's JWT
- Each order card shows buyer name, item list, total, and current status

#### REQ-DASH-03 — Update Order Status
**Description:** A seller shall be able to update the fulfilment status of an order.
**Priority:** Medium
**Status:** Implemented

Acceptance criteria:
- Status transitions: pending → confirmed → dispatched → delivered
- Status update is persisted via PATCH `/api/orders/:id/status`
- Only a seller whose items appear in the order can update its status

---

### 3.6 Wishlist

#### REQ-WISH-01 — Save a Listing
**Description:** A signed-in user shall be able to save (favourite) any listing by clicking the heart icon.
**Priority:** Medium
**Status:** Implemented

Acceptance criteria:
- Saved listing IDs are stored in user state on the client
- Heart icon toggles between filled and unfilled
- Heart buttons are functional on listing cards in the home feed, PDP related sections, and search results

---

### 3.7 Image Upload

#### REQ-IMG-01 — Upload Product Image
**Description:** A seller shall be able to upload product images during listing creation.
**Priority:** High
**Status:** Implemented

Acceptance criteria:
- Images are uploaded to Cloudinary via the server-side upload endpoint (`POST /api/upload`)
- Cloudinary returns a secure URL which is stored with the listing
- In development (localhost), images are served from `client/public/images/` for offline support
- In production, Cloudinary CDN transformations (`f_auto`, `q_auto`, `w_N`) are applied

---

## 4. Non-Functional Requirements

### 4.1 Performance

| ID | Requirement | Target |
|---|---|---|
| NFR-PERF-01 | API response time for listing queries | < 500 ms (p95) on Atlas M0 shared cluster |
| NFR-PERF-02 | Page load time (initial) | < 3 s on a 4G connection |
| NFR-PERF-03 | Image load time | < 1 s via Cloudinary CDN with f_auto,q_auto |

### 4.2 Security

| ID | Requirement |
|---|---|
| NFR-SEC-01 | Passwords stored as bcrypt hashes (≥ 10 salt rounds) |
| NFR-SEC-02 | JWT stored in httpOnly, Secure, SameSite=Strict cookie |
| NFR-SEC-03 | Server-side CORS restricted to known client origins |
| NFR-SEC-04 | Protected API routes verify JWT before processing |
| NFR-SEC-05 | Listing mutation endpoints verify resource ownership before allowing update/delete |

### 4.3 Reliability

| ID | Requirement |
|---|---|
| NFR-REL-01 | The application shall remain available while MongoDB Atlas and Render are operational |
| NFR-REL-02 | Static seed data provides a fallback browsing experience if the database is temporarily unreachable |
| NFR-REL-03 | Cart state is persisted in localStorage so it survives browser tab close and reopens |

### 4.4 Usability

| ID | Requirement |
|---|---|
| NFR-USE-01 | All primary user journeys (browse → PDP → cart → checkout) shall be completable on a 375 px wide mobile screen |
| NFR-USE-02 | Interactive elements shall have accessible focus styles and ARIA labels where labels are not visible |
| NFR-USE-03 | Form error messages shall appear inline, adjacent to the field that caused the error |

### 4.5 Maintainability

| ID | Requirement |
|---|---|
| NFR-MAIN-01 | Frontend components shall be broken into single-responsibility files in `client/src/components/` and `client/src/screens/` |
| NFR-MAIN-02 | API data shapes shall be normalised at the boundary (normalizeListing, normalizeSeller functions in `client/src/api/index.js`) so the rest of the frontend uses a consistent shape regardless of data source |
| NFR-MAIN-03 | Environment-specific configuration (API URL, Cloudinary credentials) shall be supplied via environment variables, never hard-coded |

---

## 5. System Architecture

### 5.1 Overview

HavenTrade follows a three-tier web architecture:

```
┌─────────────────────────────────────────────┐
│              CLIENT TIER                    │
│  React 18 SPA (Vite build, hosted Vercel)   │
│  Tailwind CSS, custom component library     │
│  State: useAuth context, localStorage cart  │
└─────────────────┬───────────────────────────┘
                  │  HTTPS REST (JSON)
┌─────────────────▼───────────────────────────┐
│              SERVER TIER                    │
│  Node.js 18 + Express.js (hosted Render)    │
│  Routes: auth, listings, sellers, orders,   │
│           upload                            │
│  Middleware: JWT auth guard, CORS, error    │
└──────────┬──────────────────────┬───────────┘
           │ Mongoose ODM         │ Cloudinary SDK
┌──────────▼──────────┐  ┌───────▼───────────┐
│   DATA TIER         │  │   IMAGE STORE      │
│  MongoDB Atlas      │  │  Cloudinary CDN    │
│  Collections:       │  │  f_auto, q_auto,   │
│  users, listings,   │  │  w_N transforms    │
│  orders, reviews,   │  └───────────────────┘
│  counters           │
└─────────────────────┘
```

### 5.2 Frontend

| Aspect | Detail |
|---|---|
| Framework | React 18 |
| Build tool | Vite |
| Styling | Tailwind CSS + custom CSS variables (tokens) |
| Routing | Custom navigate/navStack state (no react-router) |
| Auth state | React Context (AuthContext) + JWT httpOnly cookie |
| Cart state | React state mirrored to localStorage |
| Image URLs | `imgUrl()` utility — Cloudinary in prod, local `/images/` in dev |

### 5.3 Backend

| Aspect | Detail |
|---|---|
| Runtime | Node.js 18 |
| Framework | Express.js |
| ORM/ODM | Mongoose 7 |
| Auth | JWT (jsonwebtoken), httpOnly cookies (cookie-parser) |
| Password hashing | bcrypt |
| Image upload | Multer + Cloudinary SDK (multer-storage-cloudinary) |
| CORS | Restricted to localhost:3001 (dev) and Vercel domain (prod) |

### 5.4 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Sign in |
| POST | `/api/auth/logout` | — | Sign out |
| GET | `/api/auth/me` | JWT | Current user |
| PATCH | `/api/auth/me` | JWT | Update profile |
| PATCH | `/api/auth/me/password` | JWT | Change password |
| GET | `/api/listings` | — | Browse listings |
| GET | `/api/listings/:id` | — | Single listing |
| POST | `/api/listings` | JWT (seller) | Create listing |
| PATCH | `/api/listings/:id` | JWT (owner) | Update listing |
| DELETE | `/api/listings/:id` | JWT (owner) | Delete listing |
| GET | `/api/listings/seller/:id` | — | All listings by a seller |
| GET | `/api/sellers` | — | All sellers |
| GET | `/api/sellers/:id` | — | Seller profile |
| GET | `/api/sellers/:id/reviews` | — | Seller reviews |
| POST | `/api/sellers/:id/reviews` | JWT | Leave a review |
| GET | `/api/orders` | JWT | Buyer order history |
| POST | `/api/orders` | JWT | Place an order |
| GET | `/api/orders/seller` | JWT (seller) | Orders with seller's items |
| PATCH | `/api/orders/:id/status` | JWT (seller) | Update fulfilment status |
| POST | `/api/upload` | JWT | Upload image to Cloudinary |

### 5.5 Deployment

| Component | Platform | Notes |
|---|---|---|
| Client | Vercel | `VITE_API_URL` env var set to Render service URL |
| Server | Render (free tier) | Cold start ~30–60 s after 15 min inactivity |
| Database | MongoDB Atlas | `MONGO_URI` env var |
| Images | Cloudinary | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` env vars |

### 5.6 Local Development

Prerequisites: Node.js 18+, MongoDB running on `localhost:27017`.

```bash
# Install all dependencies
npm run install:all

# Start client + server concurrently
npm run dev
# Client: http://localhost:3001
# Server: http://localhost:5001
```

In development, images are served from `client/public/images/` (offline-capable). In production, Cloudinary CDN URLs are used.

---

## 6. Data Models

### 6.1 User

```
{
  name:          String (required)
  email:         String (required, unique)
  password:      String (bcrypt hash, required)
  postcode:      String
  neighbourhood: String
  isSeller:      Boolean (default: false)
  isVerified:    Boolean (default: false)
  sellerProfile: {
    tagline: String
    since:   Date
  }
  createdAt:     Date (auto)
  updatedAt:     Date (auto)
}
```

### 6.2 Listing

```
{
  title:          String (required)
  price:          Number (required)
  category:       String (required)
  condition:      String (e.g. "Like New", "Good", "Fair")
  conditionLevel: Number (1–5)
  description:    String
  images:         [String]  (Cloudinary URLs)
  seller:         ObjectId → User (required)
  status:         String (default: "active")
  stock:          Number (default: 1)
  digital:        Boolean (default: false)
  neighbourhood:  String
  eta:            String
  createdAt:      Date (auto)
  updatedAt:      Date (auto)
}
```

### 6.3 Order

```
{
  buyer:       ObjectId → User (required)
  items: [{
    listing:   ObjectId → Listing
    seller:    ObjectId → User
    title:     String
    price:     Number
    qty:       Number
  }]
  subtotal:    Number
  deliveryFee: Number
  platformFee: Number
  total:       Number
  status:      String (pending | confirmed | dispatched | delivered)
  createdAt:   Date (auto)
  updatedAt:   Date (auto)
}
```

### 6.4 Review

```
{
  seller:    ObjectId → User (required)
  buyer:     ObjectId → User (required)
  rating:    Number (1–5, required)
  body:      String
  createdAt: Date (auto)
}
```

### 6.5 Counter

```
{
  _id:  String  (sequence name)
  seq:  Number  (current value)
}
```

Used to generate human-readable order reference numbers.

---

## 7. Future Enhancements

The following features were designed and/or discussed but are **not implemented** in the current release. They are documented here as a roadmap for future development.

### 7.1 Payment Gateway Integration

**Description:** Integrate a Nigerian payment gateway (Paystack or Flutterwave) to process card and bank transfer payments.

Current state: The checkout UI is fully built and functional as a flow. Clicking "Place order" creates an order record and marks it as paid immediately (demo mode). No money changes hands.

Planned: Initiate a Paystack/Flutterwave transaction on "Place order", redirect to the hosted payment page, and handle the webhook callback to update order status to `paid`.

### 7.2 Real-Time In-App Messaging

**Description:** Socket.IO-based buyer–seller chat, allowing negotiation before purchase.

Planned features:
- Persistent conversation threads (buyer ↔ seller, per listing)
- Unread message badge in navigation
- Push notification on new message

### 7.3 Email Notifications

**Description:** Transactional emails sent via SMTP (e.g., Mailgun, SendGrid).

Planned triggers:
- Order placed (buyer confirmation + seller notification)
- Order status change (dispatch, delivery)
- Password reset link

### 7.4 Administrator Panel

**Description:** A private admin dashboard for platform operators.

Planned capabilities:
- View all users, listings, and orders
- Suspend or delete accounts and listings
- Resolve disputes
- View platform revenue metrics

### 7.5 GPS-Based Proximity Filtering

**Description:** Replace neighbourhood-string filtering with true geospatial queries using MongoDB 2dsphere indexes.

Planned: Store user location as GeoJSON `{ type: "Point", coordinates: [lng, lat] }`, index with `2dsphere`, and use `$nearSphere` to return listings within a configurable radius (default 2 km). Use browser Geolocation API to determine buyer's position.

### 7.6 Phone Number / BVN Verification

**Description:** Verify seller identity with Nigerian BVN or phone OTP before allowing listing creation.

Planned: Integrate with a BVN verification provider (e.g., Smile Identity, Dojah) or send OTP via Africa's Talking SMS API.

### 7.7 Social Sign-In

**Description:** Allow users to register and sign in with Google OAuth 2.0 in addition to email/password.

### 7.8 Password Reset via Email

**Description:** Allow users to reset a forgotten password by clicking a time-limited link emailed to their registered address.

### 7.9 Delivery Partner Role

**Description:** A third user role (Delivery Partner) who accepts dispatch jobs, tracks delivery in real time, and marks orders as delivered.

### 7.10 Review Gating

**Description:** Restrict review submission to buyers who have a completed order from that seller, preventing fraudulent reviews.

### 7.11 Progressive Web App (PWA)

**Description:** Add a service worker and web app manifest so HavenTrade can be installed on mobile home screens and cache assets for offline browsing.

---

## 8. Glossary

| Term | Meaning |
|---|---|
| httpOnly cookie | A browser cookie inaccessible to JavaScript, protecting the JWT from XSS attacks |
| bcrypt | A password-hashing function designed to be computationally expensive to resist brute-force attacks |
| JWT | JSON Web Token — a self-contained, signed token used to verify identity |
| CDN | Content Delivery Network — a geographically distributed server network that serves static assets from the edge closest to the user |
| Cloudinary | A cloud-based image and video management service |
| Mongoose ODM | Object Document Mapper for MongoDB, used to define schemas and query the database from Node.js |
| Vite | A fast frontend build tool and dev server for React |
| Tailwind CSS | A utility-first CSS framework |
| SPA | Single-Page Application — a web app that loads a single HTML page and dynamically updates content using JavaScript |
| Static seed data | Pre-defined sample listings and seller profiles stored in `client/src/data/index.js`, used to populate the home feed without database content |
| Neighbourhood | A named district within Abuja (e.g., Maitama, Wuse II, Garki, Asokoro) used as a proxy for proximity |
| Storefront | A seller's public-facing page on HavenTrade, showing their listings, ratings, reviews, and about information |
| PDP | Product Detail Page — the full-page view of a single listing |

---

*End of Document*
