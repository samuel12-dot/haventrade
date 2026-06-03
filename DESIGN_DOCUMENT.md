# HavenTrade — Software Design Document

**Document Type:** Full-Stack Web Application Design Document  
**Project Name:** HavenTrade  
**Version:** 1.0  
**Date:** June 2026  
**Author:** Samuel Ogunduyile

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Project Structure](#4-project-structure)
5. [Database Design](#5-database-design)
6. [API Design](#6-api-design)
7. [Frontend Architecture](#7-frontend-architecture)
8. [Authentication & Security](#8-authentication--security)
9. [State Management](#9-state-management)
10. [Design System](#10-design-system)
11. [External Integrations](#11-external-integrations)
12. [Deployment Architecture](#12-deployment-architecture)
13. [Environment Configuration](#13-environment-configuration)
14. [Data Flow Diagrams](#14-data-flow-diagrams)
15. [Key Feature Walkthroughs](#15-key-feature-walkthroughs)

---

## 1. Project Overview

### 1.1 Summary

HavenTrade is a full-stack neighbourhood marketplace web application targeting Abuja, Nigeria. It enables residents to buy and sell pre-loved goods with people in nearby neighbourhoods. Sellers open a personal storefront, list items with photos, and offer cargo-bike delivery. Buyers browse by category, save favourites to a wishlist, and complete purchases through a guided multi-step checkout flow.

### 1.2 Core Value Proposition

| Stakeholder | Value |
|---|---|
| Buyers | Discover quality second-hand items close to home with transparent seller profiles and ratings |
| Sellers | A zero-friction storefront to list items, manage orders, and build a local reputation |
| Community | Encourages circular economy and reduces waste within Abuja neighbourhoods |

### 1.3 Application Type

- **Single-Page Application (SPA)** — React frontend with hash-based client-side routing
- **RESTful API** — Node.js/Express backend serving JSON
- **Monorepo** — client and server housed in one repository, orchestrated by a root `package.json`

### 1.4 User Roles

| Role | Capabilities |
|---|---|
| **Guest** | Browse listings, view seller profiles, view product detail pages |
| **Buyer** | All guest capabilities + wishlist, cart, checkout, order history, reviews |
| **Seller** | All buyer capabilities + create/edit listings, view seller dashboard, manage orders |

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT TIER                          │
│                                                             │
│   Browser (React SPA — Vercel CDN)                          │
│   ┌──────────────┐  ┌────────────────┐  ┌───────────────┐  │
│   │   Screens    │  │   Components   │  │  AuthContext  │  │
│   │  (17 pages)  │  │  (15 shared)   │  │  + App State  │  │
│   └──────┬───────┘  └───────┬────────┘  └───────┬───────┘  │
│          └──────────────────┴───────────────────┘           │
│                         │ HTTP / JSON                        │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                        API TIER                             │
│                                                             │
│   Express.js Server (Render)                                │
│   ┌──────────────┐  ┌────────────────┐  ┌───────────────┐  │
│   │    Routes    │  │  Controllers   │  │  Middleware   │  │
│   │  (5 modules) │  │  (5 handlers)  │  │  Auth/Upload  │  │
│   └──────┬───────┘  └───────┬────────┘  └───────┬───────┘  │
│          └──────────────────┴───────────────────┘           │
│                         │ Mongoose ODM                       │
└─────────────────────────┼───────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   DATA TIER  │  │   STORAGE    │  │   AUTH/SEC   │
│              │  │              │  │              │
│  MongoDB     │  │  Cloudinary  │  │  JWT Tokens  │
│  Atlas       │  │  (Images)    │  │  httpOnly    │
│              │  │              │  │  Cookies     │
└──────────────┘  └──────────────┘  └──────────────┘
```

### 2.2 Request Lifecycle

```
User Action (e.g. Add to Cart)
        │
        ▼
  React Component
        │ calls
        ▼
  api/index.js (fetch wrapper)
        │ HTTP request (with credentials: 'include')
        ▼
  Express Router
        │
        ▼
  auth middleware (verify JWT from cookie)
        │
        ▼
  Controller function
        │ Mongoose query
        ▼
  MongoDB Atlas
        │ document(s)
        ▼
  Controller formats response
        │ JSON
        ▼
  React Component updates state
        │
        ▼
  UI re-renders
```

---

## 3. Technology Stack

### 3.1 Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 18.3.1 | UI library and component model |
| Vite | 5.4.11 | Build tool and development server |
| React Router DOM | 6.27.0 | Client-side routing |
| Tailwind CSS | 3.4.17 | Utility-first CSS framework |
| PostCSS | 8.4.49 | CSS transformation pipeline |
| Autoprefixer | 10.4.20 | CSS vendor prefixing |

### 3.2 Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | ES Modules | JavaScript runtime |
| Express | 4.21.2 | HTTP web framework |
| Mongoose | 8.9.4 | MongoDB object document mapper |
| jsonwebtoken | 9.0.2 | JWT creation and verification |
| bcryptjs | 2.4.3 | Password hashing |
| multer | 2.1.1 | Multipart file upload parsing |
| cloudinary | 2.10.0 | Image CDN and transformation SDK |
| express-validator | 7.2.1 | Request body validation |
| cors | 2.8.5 | Cross-origin resource sharing |
| cookie-parser | 1.4.7 | Cookie parsing middleware |
| morgan | 1.10.0 | HTTP request logging |
| dotenv | 16.4.7 | Environment variable loading |
| nodemon | 3.1.9 | Auto-reload in development |

### 3.3 Database & Infrastructure

| Service | Role |
|---|---|
| MongoDB Atlas | Managed cloud database |
| Cloudinary | Image hosting and CDN transformations |
| Vercel | Frontend static hosting and CDN |
| Render | Backend Node.js server hosting |

---

## 4. Project Structure

```
haventrade/
│
├── package.json                  # Monorepo root — concurrently scripts
├── package-lock.json
├── README.md
├── DESIGN_DOCUMENT.md
│
├── client/                       # React + Vite SPA
│   ├── public/
│   │   ├── images/
│   │   │   ├── products/         # Local product image copies
│   │   │   └── sellers/          # Local seller avatar copies
│   │   └── brand/                # Logo assets
│   │
│   ├── src/
│   │   ├── screens/              # Page-level components (17 screens)
│   │   │   ├── LandingScreen.jsx
│   │   │   ├── HomeFeedScreen.jsx
│   │   │   ├── PDPScreen.jsx
│   │   │   ├── CartScreen.jsx
│   │   │   ├── CheckoutScreen.jsx
│   │   │   ├── ConfirmationScreen.jsx
│   │   │   ├── SearchScreen.jsx
│   │   │   ├── WishlistScreen.jsx
│   │   │   ├── SellersScreen.jsx
│   │   │   ├── StorefrontScreen.jsx
│   │   │   ├── ProfileScreen.jsx
│   │   │   ├── DashboardScreen.jsx
│   │   │   ├── EditorScreen.jsx
│   │   │   ├── OrderHistoryScreen.jsx
│   │   │   ├── SignInScreen.jsx
│   │   │   ├── SignUpScreen.jsx
│   │   │   └── DesignSystemScreen.jsx
│   │   │
│   │   ├── components/           # Reusable UI components (15 components)
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ListingCard.jsx
│   │   │   ├── SellerAvatar.jsx
│   │   │   ├── SellerCardCompact.jsx
│   │   │   ├── Brand.jsx
│   │   │   ├── Icons.jsx
│   │   │   ├── MarketTicket.jsx
│   │   │   ├── StatusPill.jsx
│   │   │   ├── ConditionBadge.jsx
│   │   │   ├── PulsePanel.jsx
│   │   │   ├── TrustStrip.jsx
│   │   │   ├── PostcodeInput.jsx
│   │   │   ├── DeliverySlotPicker.jsx
│   │   │   └── BackLink.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # User session provider
│   │   │
│   │   ├── api/
│   │   │   └── index.js          # Fetch wrapper + data normalisation
│   │   │
│   │   ├── data/
│   │   │   └── index.js          # Static seed: LISTINGS, SELLERS, NEIGHBOURHOODS
│   │   │
│   │   ├── utils/
│   │   │   └── cloudinary.js     # imgUrl() — Cloudinary vs local image resolver
│   │   │
│   │   ├── App.jsx               # Root router + global state
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Tailwind directives + custom CSS tokens
│   │
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── server/                       # Express REST API
    ├── server.js                 # App entry point
    ├── package.json
    ├── .env.example
    └── src/
        ├── config/
        │   └── db.js             # MongoDB connection with retry logic
        │
        ├── models/
        │   ├── User.js
        │   ├── Listing.js
        │   ├── Order.js
        │   ├── Review.js
        │   └── Counter.js
        │
        ├── controllers/
        │   ├── authController.js
        │   ├── listingsController.js
        │   ├── ordersController.js
        │   ├── sellersController.js
        │   └── uploadController.js
        │
        ├── routes/
        │   ├── auth.js
        │   ├── listings.js
        │   ├── orders.js
        │   ├── sellers.js
        │   └── upload.js
        │
        └── middleware/
            ├── auth.js           # protect + requireSeller guards
            ├── upload.js         # multer + Cloudinary stream upload
            └── errorHandler.js   # Global error handler
```

---

## 5. Database Design

### 5.1 Overview

The application uses **MongoDB** (via Mongoose ODM) with five collections: `users`, `listings`, `orders`, `reviews`, and `counters`. Relationships are expressed as ObjectId references with `.populate()` used at query time to join related documents.

### 5.2 Entity Relationship Diagram

```
┌────────────┐       ┌────────────────┐       ┌────────────┐
│    User    │ 1───* │    Listing     │ *───1 │    User    │
│ (buyer)    │       │                │       │  (seller)  │
└─────┬──────┘       └────────┬───────┘       └─────┬──────┘
      │                       │                     │
      │ 1                     │ *                   │ 1
      │                       │                     │
      ▼ *                     ▼                     ▼ *
┌────────────┐       ┌────────────────┐       ┌────────────┐
│   Order    │ *─────│  Order.items[] │        │   Review   │
│            │       │  (embedded)    │        │            │
└────────────┘       └────────────────┘        └────────────┘
      │
      │ 1
      ▼
┌────────────┐
│  Counter   │
│ (utility)  │
└────────────┘
```

### 5.3 User Model

**Collection:** `users`

| Field | Type | Constraints | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `name` | String | Required, max 60 | Display name |
| `email` | String | Required, unique, lowercase | Login email |
| `password` | String | Required, min 8, hashed | bcrypt hash; stripped from JSON output |
| `postcode` | String | Optional, uppercase | Delivery/search postcode |
| `neighbourhood` | String | Optional | Abuja neighbourhood |
| `grad` | String | Default: `grad-cool` | CSS gradient class for avatar |
| `isSeller` | Boolean | Default: `false` | Seller access flag |
| `isVerified` | Boolean | Default: `false` | Email verification flag |
| `rating` | Number | 0–5, computed | Average seller rating |
| `reviewCount` | Number | Computed | Total seller reviews |
| `sellerProfile.tagline` | String | Optional | Short seller bio |
| `sellerProfile.since` | String | Optional | Year seller joined |
| `sellerProfile.workshopAddress` | String | Optional | Physical address |
| `sellerProfile.openingHours` | String | Optional | Opening hours text |
| `sellerProfile.languages` | [String] | Optional | Languages spoken |
| `savedListings` | [ObjectId] | Ref: Listing | Wishlist |
| `createdAt` | Date | Auto | Timestamp |
| `updatedAt` | Date | Auto | Timestamp |

**Instance Methods:**

- `matchPassword(plaintext)` — compares a plain-text password against the stored bcrypt hash using `bcrypt.compare()`
- `toJSON()` — override that removes the `password` field before serialisation, ensuring it is never exposed in API responses

**Indexes:**

- Unique index on `email`

---

### 5.4 Listing Model

**Collection:** `listings`

| Field | Type | Constraints | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `title` | String | Required, max 120 | Listing headline |
| `description` | String | Optional, max 2000 | Full item description |
| `price` | Number | Required, ≥ 0 | Price in Naira |
| `seller` | ObjectId | Required, Ref: User | Owning seller |
| `category` | String | Enum (8 values) | Furniture, Electronics, Vintage, Kids & Baby, Clothing, Books & Media, Home & Garden, Free |
| `condition` | String | Enum (5 values) | New, Like new, Good, Fair, For parts |
| `conditionLevel` | Number | 1–5, auto-set | Numeric condition for sorting |
| `grad` | String | Default: `grad-vintage` | CSS gradient class for card |
| `neighbourhood` | String | Optional | Abuja neighbourhood |
| `postcode` | String | Optional, uppercase | Listing postcode |
| `location` | GeoJSON Point | Default: Rotterdam | `{ type: 'Point', coordinates: [lon, lat] }` |
| `stock` | Number | Default: 1, min 0 | Available quantity |
| `digital` | Boolean | Default: false | Digital vs physical item |
| `eta` | String | Default: `today` | Delivery ETA label |
| `sub` | String | Optional | Sub-label on listing card |
| `images` | [String] | Optional | Cloudinary URLs or local paths |
| `dimensions` | String | Optional | Physical dimensions |
| `weight` | String | Optional | Item weight |
| `materials` | String | Optional | Construction materials |
| `format` | String | Optional | Digital file format (e.g. PDF) |
| `license` | String | Optional | Digital license type |
| `deliveryOptions.cargo` | Boolean | Default: true | Cargo bike delivery |
| `deliveryOptions.self` | Boolean | Default: false | Self-delivery |
| `deliveryOptions.pickup` | Boolean | Default: false | Buyer pickup |
| `status` | String | Enum, Default: `active` | active, draft, sold, archived |
| `views` | Number | Default: 0 | View count |
| `createdAt` | Date | Auto | Timestamp |
| `updatedAt` | Date | Auto | Timestamp |

**Pre-save Hook:**

- Automatically maps `condition` string to a numeric `conditionLevel` (New=5, Like new=4, Good=3, Fair=2, For parts=1) before saving

**Indexes:**

- `location: '2dsphere'` — enables geospatial queries (proximity search)
- Compound: `{ category: 1, status: 1 }` — optimises category browsing
- Compound: `{ seller: 1, status: 1 }` — optimises seller listing lookups
- Single: `{ price: 1 }` — optimises price range filtering

**Category Enum:**

```
Furniture | Electronics | Vintage | Kids & Baby
Clothing  | Books & Media | Home & Garden | Free
```

---

### 5.5 Order Model

**Collection:** `orders`

| Field | Type | Constraints | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `orderNumber` | String | Unique, auto-generated | Format: `HT-YYYY-XXXX` |
| `buyer` | ObjectId | Required, Ref: User | Purchasing user |
| `items` | [OrderItem] | Required, non-empty | Embedded array of line items |
| `deliveryAddress.name` | String | Required | Recipient name |
| `deliveryAddress.street` | String | Required | Street address |
| `deliveryAddress.postcode` | String | Required | Postcode |
| `deliveryAddress.city` | String | Required | City |
| `deliveryAddress.notes` | String | Optional | Delivery instructions |
| `subtotal` | Number | Computed | Sum of item prices × qty |
| `deliveryFee` | Number | Default: 0 | ₦1,500 per physical seller group |
| `platformFee` | Number | Default: 500 | HavenTrade service fee |
| `total` | Number | Computed | subtotal + deliveryFee + platformFee |
| `paymentMethod` | String | Enum | ideal, card, pending |
| `paymentStatus` | String | Enum, Default: `pending` | pending, paid, failed, refunded |
| `status` | String | Enum, Default: `pending` | pending, active, delivered, cancelled |
| `createdAt` | Date | Auto | Timestamp |
| `updatedAt` | Date | Auto | Timestamp |

**Order Item (Embedded Sub-document):**

| Field | Type | Description |
|---|---|---|
| `listing` | ObjectId (Ref: Listing) | Source listing |
| `seller` | ObjectId (Ref: User) | Seller for this item |
| `title` | String | Snapshot of listing title at order time |
| `price` | Number | Snapshot of price at order time |
| `qty` | Number | Quantity ordered (≥ 1) |
| `digital` | Boolean | Whether item is digital |
| `grad` | String | CSS gradient class |
| `status` | String | Per-item fulfilment status: pending, packed, out_for_delivery, delivered, cancelled |
| `deliverySlot` | String | Delivery time slot selected at checkout |

**Pre-save Hook:**

- Generates `orderNumber` atomically using the `Counter` collection before first save. Format: `HT-{YEAR}-{SEQUENCE}` (e.g. `HT-2026-0042`)

**Post-save Hook:**

- After status updates, checks if every item in the order has status `delivered` or `digital`; if so, promotes the top-level `order.status` to `delivered` automatically

---

### 5.6 Review Model

**Collection:** `reviews`

| Field | Type | Constraints | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `seller` | ObjectId | Required, Ref: User | Reviewed seller |
| `buyer` | ObjectId | Required, Ref: User | Reviewer |
| `order` | ObjectId | Required, Ref: Order | Source order |
| `rating` | Number | Required, 1–5 | Star rating |
| `body` | String | Optional, max 600 | Review text |
| `createdAt` | Date | Auto | Timestamp |
| `updatedAt` | Date | Auto | Timestamp |

**Indexes:**

- Unique compound index: `{ buyer: 1, order: 1 }` — enforces one review per buyer per order

**Post-save / Post-delete Hooks:**

- After any review is saved or deleted, an aggregation pipeline recalculates the seller's `rating` (average of all their reviews) and `reviewCount`, then persists these values back to the `User` document

---

### 5.7 Counter Model (Utility)

**Collection:** `counters`

| Field | Type | Description |
|---|---|---|
| `_id` | String | Counter identifier (e.g. `orders_2026`) |
| `seq` | Number | Current sequence value |

**Static Method:**

- `Counter.nextSeq(id)` — atomically increments and returns the next sequence number using MongoDB's `findOneAndUpdate` with `upsert: true`, ensuring no duplicate order numbers under concurrent requests

---

## 6. API Design

### 6.1 Base URL

| Environment | Base URL |
|---|---|
| Development | `http://localhost:5001/api` |
| Production | `https://<render-service>.onrender.com/api` |

### 6.2 Response Format

All successful responses follow this envelope:

```json
{
  "success": true,
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": [ ... ]
}
```

### 6.3 Authentication

Protected routes require a valid JWT delivered as:

- **Primary:** `token` cookie (httpOnly, sent automatically by browser)
- **Fallback:** `Authorization: Bearer <token>` header

### 6.4 Authentication Routes `/api/auth`

| Method | Endpoint | Auth | Request Body | Response |
|---|---|---|---|---|
| `POST` | `/register` | ❌ | `name`, `email`, `password`, `postcode`?, `neighbourhood`?, `isSeller`? | `{ user, token }` |
| `POST` | `/login` | ❌ | `email`, `password` | `{ user, token }` |
| `POST` | `/logout` | ❌ | — | `{ message }` — clears cookie |
| `GET` | `/me` | ✅ | — | `{ user }` |
| `GET` | `/me/saved` | ✅ | — | `{ listings[] }` |
| `PATCH` | `/me` | ✅ | `name`?, `postcode`?, `neighbourhood`?, `grad`?, `sellerProfile`? | `{ user }` |
| `PATCH` | `/me/password` | ✅ | `currentPassword`, `newPassword` | `{ message }` |

### 6.5 Listings Routes `/api/listings`

| Method | Endpoint | Auth | Query Params / Body | Response |
|---|---|---|---|---|
| `GET` | `/` | ❌ | `category`, `condition`, `minPrice`, `maxPrice`, `neighbourhood`, `digital`, `sort`, `page`, `limit`, `status`, `lat`, `lon`, `radius` | `{ listings[], total, page, pages }` |
| `GET` | `/:id` | ❌ | — | `{ listing }` — increments `views` |
| `POST` | `/` | ✅ Seller | `title`, `price`, `category`, `condition`, `description`?, `images[]`?, `stock`?, `digital`?, `deliveryOptions`?, ... | `{ listing }` |
| `PATCH` | `/:id` | ✅ Owner | Any mutable listing fields | `{ listing }` |
| `DELETE` | `/:id` | ✅ Owner | — | `{ message }` |
| `GET` | `/seller/:sellerId` | ❌ | — | `{ listings[] }` |
| `PATCH` | `/:id/save` | ✅ | — | `{ saved: boolean }` — toggles wishlist |

**Sort Options:**

| Value | Behaviour |
|---|---|
| `newest` | Sort by `createdAt` descending (default) |
| `oldest` | Sort by `createdAt` ascending |
| `price_asc` | Sort by `price` ascending |
| `price_desc` | Sort by `price` descending |

### 6.6 Sellers Routes `/api/sellers`

| Method | Endpoint | Auth | Query Params / Body | Response |
|---|---|---|---|---|
| `GET` | `/` | ❌ | `neighbourhood`, `page`, `limit` | `{ sellers[], total }` — sorted by rating |
| `GET` | `/:id` | ❌ | — | `{ seller }` |
| `GET` | `/:id/listings` | ❌ | `category` | `{ listings[] }` — active only |
| `GET` | `/:id/reviews` | ❌ | — | `{ reviews[] }` — latest 20 |
| `POST` | `/:id/reviews` | ✅ | `rating`, `body`?, `orderId` | `{ review }` |

### 6.7 Orders Routes `/api/orders`

| Method | Endpoint | Auth | Request Body / Query | Response |
|---|---|---|---|---|
| `POST` | `/` | ✅ | `items[]`, `deliveryAddress`, `paymentMethod`, `slotPicks` | `{ order }` |
| `GET` | `/` | ✅ | `status`?, `page`, `limit` | `{ orders[], total }` |
| `GET` | `/:id` | ✅ Buyer | — | `{ order }` |
| `PATCH` | `/:id/status` | ✅ | `status`, `itemListingId`? | `{ order }` |
| `GET` | `/seller` | ✅ Seller | `status`? | `{ orders[] }` |

**Order Status Transitions:**

```
pending ──► active ──► delivered
   │                      ▲
   └──► cancelled          │
                           │
         (auto-promoted when all items = delivered)
```

**Item-Level Status Transitions:**

```
pending ──► packed ──► out_for_delivery ──► delivered
   │
   └──► cancelled
```

### 6.8 Upload Route `/api/upload`

| Method | Endpoint | Auth | Content-Type | Response |
|---|---|---|---|---|
| `POST` | `/` | ✅ | `multipart/form-data` (field: `image`) | `{ url, publicId }` |

**Constraints:**

- Maximum file size: 5 MB
- Accepted MIME types: `image/jpeg`, `image/png`, `image/webp`
- File is streamed directly to Cloudinary — not written to disk

### 6.9 Health Check

| Method | Endpoint | Response |
|---|---|---|
| `GET` | `/api/health` | `{ status: 'ok', env, ts }` |

---

## 7. Frontend Architecture

### 7.1 Routing

HavenTrade uses **hash-based client-side routing** rather than the browser History API. This sidesteps server-side redirect configuration requirements when hosted on static CDNs.

**Route Format:** `/#<screen-name>?<key>=<value>&...`

**Examples:**

```
/#landing
/#home?category=Furniture&condition=Good
/#pdp?id=64f8a1b2c3d4e5f6a7b8c9d0
/#search?q=vintage+lamp
/#storefront?id=64f8a1b2c3d4e5f6a7b8c9d1
```

**Router Implementation (App.jsx):**

```javascript
// Parses hash into { route, params }
function parseHash() {
  const [route, qs] = window.location.hash.replace('#', '').split('?');
  return { route, params: Object.fromEntries(new URLSearchParams(qs)) };
}

// Pushes new route
function navigate(screen, params = {}) {
  const qs = new URLSearchParams(params).toString();
  window.location.hash = qs ? `${screen}?${qs}` : screen;
}

// Listens for browser back/forward
window.addEventListener('hashchange', () => setState(parseHash()));
```

### 7.2 Screen Inventory

| Screen | Hash Route | Auth Guard | Purpose |
|---|---|---|---|
| **LandingScreen** | `landing` | ❌ | Public marketing page — featured sellers, categories, trust indicators, CTAs |
| **HomeFeedScreen** | `home` | ✅ | Authenticated browse feed with live filter/sort controls |
| **PDPScreen** | `pdp?id=` | ❌ | Product detail — image gallery, seller card, add to cart, related listings |
| **CartScreen** | `cart` | ❌ | Cart review — edit quantities, remove items, subtotal |
| **CheckoutScreen** | `checkout` | ❌ | Multi-step: address → delivery slots → payment → confirm |
| **ConfirmationScreen** | `confirmation` | ❌ | Order placed — order number, summary, address |
| **SearchScreen** | `search?q=` | ❌ | Full-text search across listings |
| **WishlistScreen** | `wishlist` | ❌ | Saved items (localStorage + API) |
| **SellersScreen** | `sellers` | ❌ | Browse all sellers — filter by neighbourhood, sorted by rating |
| **StorefrontScreen** | `storefront?id=` | ❌ | Seller page — listings, about, reviews, policies tabs |
| **ProfileScreen** | `profile` | ✅ | Edit profile, change password, upgrade to seller |
| **DashboardScreen** | `dashboard` | ✅ | Seller KPIs — live orders, active listings, revenue |
| **EditorScreen** | `editor` | ✅ | Create / edit listing — image upload, all fields |
| **OrderHistoryScreen** | `orders` | ✅ | Buyer order history — filter by status, item detail |
| **SignInScreen** | `signin` | ❌ | Email + password login |
| **SignUpScreen** | `signup` | ❌ | Registration — name, email, password, optional seller flag |
| **DesignSystemScreen** | `design` | ❌ | Internal design system showcase |

### 7.3 Component Inventory

| Component | Key Props | Responsibility |
|---|---|---|
| **Header** | `route`, `navigate`, `cartCount`, `savedCount`, `isLanding` | Top navigation bar — logo, search input, icon links, cart/saved counts |
| **Footer** | `navigate` | Site footer — navigation links, brand, newsletter stub |
| **ListingCard** | `listing`, `onClick`, `saved`, `onSave`, `sold` | Product card — image, title, price, seller avatar, save heart |
| **SellerAvatar** | `seller`, `size`, `showName`, `showRating` | Circular avatar — initials, gradient background, optional name and rating |
| **SellerCardCompact** | `seller`, `onClick` | Compact seller row — avatar, name, neighbourhood, rating, review count |
| **Brand** | — | Logo components: `HTMonogram` and `HTWordmark` with size and colour variants |
| **Icons** | — | SVG icon library: `HeartIcon`, `StarIcon`, `PinIcon`, `SearchIcon`, `CartIcon`, etc. |
| **MarketTicket** | `label`, `value`, `variant` | Styled info badge — variants: default, saffron, dark, moss, peach, lg |
| **StatusPill** | `status`, `size` | Order/item status indicator styled as a coloured pill |
| **ConditionBadge** | `condition`, `conditionLevel` | Item condition label — colour-coded from New (green) to For parts (red) |
| **PulsePanel** | `children`, `className` | Animated shimmer panel for loading states |
| **TrustStrip** | — | Row of trust signals: secure checkout, fast delivery, community |
| **PostcodeInput** | `value`, `onChange`, `placeholder` | Postcode/location input with uppercase normalisation |
| **DeliverySlotPicker** | `sellerId`, `onSelect` | Time slot grid for selecting delivery window per seller |
| **BackLink** | `onBack`, `backLabel` | Breadcrumb-style back navigation button |

### 7.4 API Layer (`client/src/api/index.js`)

All HTTP requests are centralised in a single module. Key responsibilities:

1. **Base URL resolution** — reads `VITE_API_URL` from environment
2. **Credentials inclusion** — all requests send `credentials: 'include'` to attach the auth cookie
3. **Error normalisation** — unwraps API error envelopes into thrown `Error` objects
4. **Data normalisation** — `normalizeListing()` and `normalizeSeller()` flatten MongoDB documents (converting `_id` to `id`, merging nested seller objects) so UI components work identically with static seed data and live API data

### 7.5 Static Seed Data (`client/src/data/index.js`)

Exported constants `LISTINGS`, `SELLERS`, and `NEIGHBOURHOODS` serve as fallback data when the API is unreachable or for populating the public-facing landing page and initial home feed. Normalised to the same shape as API responses.

---

## 8. Authentication & Security

### 8.1 Authentication Flow

```
Registration / Login
        │
        ▼
POST /api/auth/register OR /api/auth/login
        │
        ▼
Server validates credentials
        │ bcrypt.compare() / hash for new users
        ▼
JWT signed:  { id: userId }
   Secret:   JWT_SECRET (env)
   Expires:  JWT_EXPIRES_IN (default: 7d)
        │
        ▼
Response: Set-Cookie: token=<jwt>; HttpOnly; SameSite=Lax; Secure (prod)
        │
        ▼
Client: cookie stored by browser, sent automatically on every request
        │
        ▼
On page load: AuthContext calls GET /api/auth/me
   → valid cookie  → user set in state (authenticated)
   → invalid/no cookie → user cleared (guest)
```

### 8.2 Route Protection Middleware

**`protect` middleware:**

```
Incoming Request
        │
        ▼
Extract token from req.cookies.token OR Authorization header
        │
   No token?  ──► 401 Unauthorized
        │
        ▼
jwt.verify(token, JWT_SECRET)
        │
   Invalid/expired?  ──► 401 Unauthorized
        │
        ▼
User.findById(decoded.id).select('-password')
        │
   User not found?  ──► 401 Unauthorized
        │
        ▼
req.user = user
        │
        ▼
next() — proceed to controller
```

**`requireSeller` middleware:**

- Runs after `protect`
- Checks `req.user.isSeller === true`
- Returns `403 Forbidden` if not a seller

### 8.3 Password Security

| Concern | Implementation |
|---|---|
| Hashing algorithm | bcrypt with 12 salt rounds |
| Storage | Only the hash is stored; plaintext never persists |
| Serialisation | `User.toJSON()` strips `password` before any response |
| Change flow | Requires `currentPassword` verified before accepting `newPassword` |

### 8.4 Input Validation

`express-validator` is applied at the route level before controllers run:

- `register`: validates email format, password minimum length, name length
- `login`: validates email format and password presence
- `createListing`: validates required fields, price range, category/condition enums
- `createReview`: validates rating is 1–5, body length

### 8.5 CORS Configuration

```javascript
cors({
  origin: process.env.CLIENT_URL,   // Exact origin match (no wildcard)
  credentials: true,                 // Required for cookie transport
})
```

In production, `CLIENT_URL` is set to the Vercel deployment URL.

---

## 9. State Management

### 9.1 Strategy

HavenTrade deliberately avoids heavyweight state libraries (Redux, Zustand, Recoil). State is managed through two mechanisms:

1. **React Context API** — for global, cross-cutting concerns (user session)
2. **App-level `useState`** — for UI state shared between screens (cart, saved, navigation)

### 9.2 AuthContext

**Provider:** `client/src/context/AuthContext.jsx`  
**Scope:** Entire application

| State | Type | Description |
|---|---|---|
| `user` | Object / null | Current authenticated user (null = guest) |
| `loading` | Boolean | True while verifying session on app load |
| `isAuthenticated` | Boolean | Derived: `user !== null` |

| Method | Description |
|---|---|
| `login(email, password)` | Calls `POST /api/auth/login`, stores returned user |
| `register(data)` | Calls `POST /api/auth/register`, stores returned user |
| `logout()` | Calls `POST /api/auth/logout`, clears user from state |
| `refreshUser()` | Calls `GET /api/auth/me`, re-syncs user from server |

On mount, `AuthContext` calls `api.getMe()`. If the session cookie is valid, the user is restored; otherwise the state remains guest.

### 9.3 App-Level State (App.jsx)

| State | Persistence | Description |
|---|---|---|
| `route` | URL hash | Current screen identifier |
| `params` | URL hash | Current screen query parameters |
| `cart` | `localStorage (ht_cart)` | Array of `{ lid, qty }` |
| `savedSet` | `localStorage (ht_saved)` | Set of saved listing IDs |
| `orders` | `localStorage (ht_orders)` | Placed orders for confirmation screen |
| `navStack` | In-memory | History stack for back navigation |
| `toast` | In-memory | Temporary notification `{ message, type }` |

### 9.4 Local Persistence

Cart and wishlist are written to `localStorage` on every change so they survive page reloads without requiring a server round-trip. On app boot these are read from storage and hydrated into state.

---

## 10. Design System

### 10.1 Typography

| Role | Family | Fallback |
|---|---|---|
| Heading / Display | Fraunces (serif) | Georgia, serif |
| Body / UI | Inter (sans-serif) | System UI, sans-serif |
| Code / Mono | JetBrains Mono | Courier New, monospace |

### 10.2 Colour Palette

| Token | Hex | Usage |
|---|---|---|
| `canvas` | `#FFFFFF` | Page background |
| `surface` | `#FAFAFA` | Card background |
| `surface-2` | `#F2F2F2` | Alternate surface |
| `surface-peach` | `#F8C4B0` | Warm accent surface |
| `hearth` | `#3B82F6` | Primary brand / CTA blue |
| `hearth-glow` | `#2563EB` | CTA hover state |
| `saffron` | `#F2B544` | Accent gold / highlight |
| `moss` | `#2F5D3F` | Success / secondary |
| `moss-soft` | `#E5F0E8` | Moss tint background |
| `ink` | `#0A0F1C` | Primary text |
| `ink-muted` | `#3D4B6B` | Secondary text |
| `ink-subtle` | `#6B7A9A` | Placeholder / disabled text |
| `danger` | `#B8341F` | Error / destructive actions |
| `border` | `#E2E8F0` | Default border |
| `border-strong` | `#CBD5E1` | Emphasis border |

### 10.3 Gradient Classes

User avatars and listing cards use gradient backgrounds determined by the `grad` field stored in the database:

| Class | Description |
|---|---|
| `grad-cool` | Blue-to-purple gradient |
| `grad-vintage` | Warm amber-to-orange gradient |
| `grad-saffron` | Yellow-to-gold gradient |
| `grad-plum` | Deep purple gradient |
| `grad-cream` | Off-white warm gradient |
| `grad-peach` | Soft peach-to-pink gradient |
| `grad-deepmoss` | Dark forest green gradient |

### 10.4 Elevation / Shadow Scale

| Token | CSS Shadow | Use |
|---|---|---|
| `shadow-sm` | `0 2px 6px rgba(10,15,28,0.05)` | Subtle card lift |
| `shadow-md` | `0 4px 12px rgba(10,15,28,0.09)` | Modal, dropdown |
| `shadow-lift` | Compound | Interactive cards on hover |
| `shadow-lift-hover` | Compound elevated | Card hover state |
| `shadow-cta` | Blue glow | Primary CTA buttons |

### 10.5 Spacing & Radii

- Extended border radius: `4xl` = `2rem` (32px) — used on large pill buttons and modal sheets
- Letter-spacing extensions: `widest-2` (0.18em), `widest-3` (0.24em) — used in uppercase labels

### 10.6 Condition Badge Colours

| Condition | Level | Visual |
|---|---|---|
| New | 5 | Solid green |
| Like new | 4 | Teal |
| Good | 3 | Blue |
| Fair | 2 | Amber |
| For parts | 1 | Red |

### 10.7 Order Status Pills

| Status | Colour |
|---|---|
| `pending` | Grey |
| `packed` | Amber |
| `out_for_delivery` | Blue |
| `delivered` | Green |
| `cancelled` | Red |

---

## 11. External Integrations

### 11.1 Cloudinary — Image Hosting

**Purpose:** Store and serve all listing and seller images via a global CDN with on-the-fly transformations.

**Upload Flow:**

```
User selects image file in EditorScreen
        │
        ▼
POST /api/upload (multipart/form-data, field: image)
        │
        ▼
multer parses file into memory buffer (max 5 MB)
        │
        ▼
uploadToCloudinary() streams buffer to Cloudinary API
   Options: auto format, auto quality, overwrite enabled
        │
        ▼
Cloudinary returns { secure_url, public_id }
        │
        ▼
Controller returns { url, publicId } to client
        │
        ▼
Client stores url in listing.images[]
```

**Image Resolution (`imgUrl()` utility):**

```javascript
// In development (localhost): serve from public/images/
// In production: apply Cloudinary transformations
function imgUrl(path, { width, quality } = {}) {
  if (import.meta.env.DEV) {
    return `/images/${path}`;
  }
  return `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,w_${width}/${path}`;
}
```

This dual-path approach allows the application to run completely offline in development without Cloudinary credentials.

### 11.2 MongoDB Atlas — Cloud Database

- **Connection string:** Configured via `MONGO_URI` environment variable
- **Connection strategy:** `db.js` implements a retry loop — attempts connection up to 5 times with 3-second delays before giving up, preventing cold-start failures on Render's free tier
- **Compatibility:** All Mongoose queries and indexes are written to work identically on local MongoDB and Atlas

### 11.3 Vercel — Frontend Hosting

- Hosts the compiled Vite/React build as static assets on Vercel's global CDN
- `VITE_API_URL` environment variable points to the Render backend URL at build time
- No server-side rendering — pure SPA with hash routing

### 11.4 Render — Backend Hosting

- Hosts the Express.js API as a Node.js web service
- `PORT` is injected by Render; the server reads `process.env.PORT`
- Free tier instances sleep after inactivity; the retry logic in `db.js` handles the consequent delayed MongoDB reconnection

---

## 12. Deployment Architecture

### 12.1 Infrastructure Diagram

```
                    ┌──────────────────────────────┐
                    │         User's Browser        │
                    └──────────────┬───────────────┘
                                   │ HTTPS
                    ┌──────────────▼───────────────┐
                    │         Vercel CDN            │
                    │   (React SPA static build)    │
                    │                               │
                    │  Domain: haventrade.vercel.app│
                    └──────────────┬───────────────┘
                                   │ HTTPS API calls
                                   │ (VITE_API_URL)
                    ┌──────────────▼───────────────┐
                    │       Render Web Service      │
                    │     (Express.js Node.js)      │
                    │                               │
                    │  Domain: *.onrender.com       │
                    └──────┬───────────┬───────────┘
                           │           │
              Mongoose ODM │           │ Cloudinary SDK
                           │           │
          ┌────────────────▼──┐  ┌─────▼──────────────┐
          │   MongoDB Atlas   │  │     Cloudinary      │
          │  (M0 Free Tier)   │  │  (Free tier CDN)    │
          └───────────────────┘  └─────────────────────┘
```

### 12.2 Build & Deploy Process

**Frontend (Vercel):**

1. Push to `main` branch triggers Vercel build
2. Vite compiles React app: `npm run build --prefix client`
3. Output (`client/dist/`) is deployed to CDN edge nodes globally
4. Environment variable `VITE_API_URL` is injected at build time

**Backend (Render):**

1. Push to `main` branch triggers Render deploy
2. Render runs `npm start` in the `server/` directory
3. Server reads all environment variables from Render's dashboard config
4. Express app starts on the `PORT` assigned by Render

### 12.3 Environment Summary

| Variable | Set On | Value (Example) |
|---|---|---|
| `VITE_API_URL` | Vercel | `https://haventrade-api.onrender.com/api` |
| `PORT` | Render (injected) | `10000` |
| `MONGO_URI` | Render | MongoDB Atlas connection string |
| `JWT_SECRET` | Render | Random 64-character string |
| `JWT_EXPIRES_IN` | Render | `7d` |
| `CLIENT_URL` | Render | `https://haventrade.vercel.app` |
| `NODE_ENV` | Render | `production` |
| `CLOUDINARY_CLOUD_NAME` | Render | `dsqhopa3g` |
| `CLOUDINARY_API_KEY` | Render | Cloudinary account key |
| `CLOUDINARY_API_SECRET` | Render | Cloudinary account secret |

---

## 13. Environment Configuration

### 13.1 Server Environment (`server/.env`)

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/haventrade
JWT_SECRET=replace_with_min_32_char_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3001
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 13.2 Client Environment (`client/.env`)

```env
VITE_API_URL=http://localhost:5001/api
```

### 13.3 Client Production Environment (`client/.env.production`)

```env
VITE_API_URL=https://your-render-backend.onrender.com/api
```

### 13.4 Local Development Setup

```bash
# 1. Install all dependencies
npm run install:all

# 2. Create server/.env (copy from server/.env.example, fill in values)

# 3. Create client/.env with VITE_API_URL=http://localhost:5001/api

# 4. Start both client and server concurrently
npm run dev
```

- API runs on: `http://localhost:5001`
- Client runs on: `http://localhost:3001`
- Images served locally from `client/public/images/` (no Cloudinary needed in dev)

---

## 14. Data Flow Diagrams

### 14.1 Buyer Checkout Flow

```
HomeFeedScreen
   │  User clicks listing card
   ▼
PDPScreen
   │  User clicks "Add to Cart"
   ▼
App.jsx addToCart()
   │  Updates cart state + localStorage
   ▼
CartScreen
   │  User reviews items, adjusts qty
   ▼
CheckoutScreen — Step 1: Review
   │
   ▼ Step 2: Delivery Address
   │  User enters name, street, postcode, city
   │
   ▼ Step 3: Delivery Slots
   │  DeliverySlotPicker rendered per seller group
   │
   ▼ Step 4: Payment Method
   │  User selects iDEAL / Card
   │
   ▼ Place Order
   │  POST /api/orders  { items, deliveryAddress, paymentMethod, slotPicks }
   │
   ▼ Server creates Order document
   │  Generates orderNumber via Counter
   │  Sets paymentStatus: 'paid' (demo)
   │
   ▼
ConfirmationScreen
   │  Displays order number, summary, address
   ▼
App.jsx clears cart
```

### 14.2 Seller Listing Creation Flow

```
DashboardScreen
   │  Seller clicks "New Listing"
   ▼
EditorScreen
   │  Seller fills form: title, price, category, condition, description
   │
   │  Seller uploads images:
   │    POST /api/upload (each image)
   │    Cloudinary returns URL
   │    URL appended to images[]
   │
   ▼  Seller clicks "Publish"
   │
   POST /api/listings  (requires Seller JWT)
   │
   ▼
Server creates Listing document:
   │  seller = req.user._id
   │  status = 'active'
   │  conditionLevel auto-set
   │
   ▼
EditorScreen navigates to DashboardScreen
   │
   ▼
DashboardScreen refreshes — new listing visible in active count
```

### 14.3 Review Submission Flow

```
OrderHistoryScreen
   │  Buyer sees delivered order
   │  Clicks "Leave Review"
   ▼
StorefrontScreen (reviews tab)
   │  Star rating picker + text body
   │
   POST /api/sellers/:id/reviews  { rating, body, orderId }
   │
   ▼
Server creates Review document
   │  Enforces unique (buyer + order) constraint
   │
   ▼ Post-save hook triggers
   │
   Review.aggregate() computes new avg rating for seller
   User.findByIdAndUpdate(sellerId, { rating, reviewCount })
   │
   ▼
StorefrontScreen refreshes — new review and updated rating visible
```

---

## 15. Key Feature Walkthroughs

### 15.1 Neighbourhood-Based Discovery

Listings store a `neighbourhood` string and a GeoJSON `location` point. The home feed and search can filter by neighbourhood name (exact match) or proximity radius (using MongoDB's `$near` geospatial operator with the `2dsphere` index). The `NEIGHBOURHOODS` constant in `client/src/data/index.js` provides the full list of Abuja districts for dropdown filters.

### 15.2 Offline-Capable Development Mode

The `imgUrl()` utility checks `import.meta.env.DEV`. In development, it constructs a path under `client/public/images/`, which mirrors the Cloudinary folder structure. This means the entire application, including all product images, works without an internet connection or Cloudinary credentials during development.

### 15.3 Atomic Order Numbering

To ensure unique, sequential order numbers (`HT-2026-0001`) under concurrent requests, the `Counter` model uses MongoDB's atomic `findOneAndUpdate` with `{ $inc: { seq: 1 } }` and `upsert: true`. This prevents race conditions that would arise from a read-then-write pattern.

### 15.4 Seller Rating Aggregation

Rather than computing ratings at query time, the `Review` model uses Mongoose post-save and post-delete hooks to run an aggregation pipeline (`$avg` of `rating` grouped by `seller`) and write the result directly back to `User.rating` and `User.reviewCount`. This makes seller profile reads cheap (no join needed) at the cost of a write on each review mutation.

### 15.5 Data Normalisation Layer

Because the home feed merges static seed data with live API data, a normalisation layer in `client/src/api/index.js` ensures a uniform shape regardless of source:

- MongoDB documents use `_id`; normalised to `id`
- Populated `seller` fields are flattened
- Missing fields are given safe defaults

This allows all UI components to be written once without conditional logic for data source.

### 15.6 Payment Flow (Demo Mode)

The checkout and payment UI is fully functional as a user flow. However, live payment processing (Paystack / Flutterwave) is not yet integrated. When an order is placed, the server immediately sets `paymentStatus: 'paid'`. The architecture is designed so that a real payment gateway can be inserted at the `POST /api/orders` controller — the order would be created with `paymentStatus: 'pending'`, the gateway webhook would update it to `paid`, and fulfilment would begin from there.

---

*End of Design Document*
