# HavenTrade

A neighbourhood marketplace for Abuja — buy and sell pre-loved goods with people within 2 km of you. Sellers open a personal storefront, list items with photos, and deliver by cargo bike. Buyers browse by category, save favourites, and checkout in one flow.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (httpOnly cookies) |
| Image storage | Cloudinary |
| Hosting | Vercel (client) · Render (server) · MongoDB Atlas (DB) |

---

## Features

**Buyers**
- Browse listings by category, condition, and neighbourhood
- Search across listings, categories, and sellers
- Save items to a wishlist
- View seller storefronts with ratings and reviews
- Add to cart and checkout with delivery slot selection
- Order history

**Sellers**
- Register as a seller at signup or upgrade from profile settings
- Personal seller dashboard with live order feed and listing count
- Create listings with up to 6 photos, condition rating, price, and delivery options
- Own storefront page with tabs for listings, about, reviews, and policies
- Inline profile completion prompt for missing neighbourhood and tagline

**Both**
- JWT session persisted via httpOnly cookie
- Responsive layout — works on mobile, tablet, and desktop
- Images served from Cloudinary in production, local `public/images` folder on localhost (works offline)

---

## Project Structure

```
haventrade/
├── client/               # React + Vite frontend
│   ├── public/
│   │   └── images/       # Local image copies (products + sellers)
│   └── src/
│       ├── screens/      # One file per page/route
│       ├── components/   # Shared UI components
│       ├── context/      # AuthContext (user session)
│       ├── api/          # Fetch wrapper + data normalisation
│       ├── data/         # Static seed listings and sellers
│       └── utils/        # imgUrl helper (Cloudinary ↔ local)
└── server/               # Express API
    └── src/
        ├── models/       # User, Listing, Order, Review, Counter
        ├── controllers/  # Route handlers
        ├── routes/       # auth, listings, sellers, orders, upload
        └── middleware/   # auth guard, error handler
```

---

## Getting Started (Local)

### Prerequisites
- Node.js 18+
- MongoDB running on `localhost:27017`

### Install

```bash
npm run install:all
```

### Environment — `server/.env`

```
PORT=5001
MONGO_URI=mongodb://localhost:27017/haventrade
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3001
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Run

```bash
npm run dev
```

This starts both the API (`localhost:5001`) and the client (`localhost:3001`) concurrently.

> Images load from `client/public/images/` on localhost — no internet required.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/logout` | Sign out |
| GET | `/api/auth/me` | Current user |
| PATCH | `/api/auth/me` | Update profile |
| PATCH | `/api/auth/me/password` | Change password |
| GET | `/api/listings` | Browse listings (filter by category, condition, neighbourhood) |
| GET | `/api/listings/:id` | Single listing |
| POST | `/api/listings` | Create listing (seller only) |
| PATCH | `/api/listings/:id` | Update listing (owner only) |
| DELETE | `/api/listings/:id` | Delete listing (owner only) |
| GET | `/api/listings/seller/:id` | All listings by a seller |
| GET | `/api/sellers` | All sellers |
| GET | `/api/sellers/:id` | Seller profile |
| GET | `/api/sellers/:id/reviews` | Seller reviews |
| POST | `/api/sellers/:id/reviews` | Leave a review |
| GET | `/api/orders` | Buyer order history |
| POST | `/api/orders` | Place an order |
| GET | `/api/orders/seller` | Orders containing seller's items |
| PATCH | `/api/orders/:id/status` | Update fulfilment status |
| POST | `/api/upload` | Upload image to Cloudinary |

---

## Deployment

**Client → Vercel**
Set `VITE_API_URL` in Vercel environment variables to your Render service URL (e.g. `https://your-app.onrender.com/api`).

**Server → Render**
Set all variables from `server/.env` in the Render service environment, with `MONGO_URI` pointing to MongoDB Atlas and `CLIENT_URL` pointing to your Vercel domain.

---

## Data Model

```
User        name, email, password, postcode, neighbourhood, grad,
            isSeller, isVerified, sellerProfile { tagline, since }

Listing     title, price, category, condition, conditionLevel,
            description, images[], seller (ref), status, stock,
            digital, grad, neighbourhood, eta

Order       buyer (ref), items[{ listing, seller, title, price, qty }],
            subtotal, deliveryFee, platformFee, total, status

Review      seller (ref), buyer (ref), rating, body
```

---

## Notes

- The checkout and payment UI is fully functional as a flow but payment processing (Paystack / Flutterwave) is not yet integrated — placing an order marks it as paid immediately for demo purposes.
- Static seed data (sellers and listings in `client/src/data/`) is used to populate the home feed and is merged with live database content where available.
