# HavenTrade — Test Document

**Project:** HavenTrade  
**Version:** 1.0  
**Date:** June 2026  
**Author:** Samuel Ogunduyile

---

## 1. Overview

This document defines test cases for the HavenTrade MERN stack marketplace. Only **Critical** and **High** severity cases are included. Tests cover the REST API, database models, authentication, frontend screens, and security.

**Test Database:** `haventrade_test` (wiped between suites)  
**Base URL (local):** `http://localhost:5001/api`

---

## 2. Test Fixtures

| Handle | Role | Email | Password |
|---|---|---|---|
| `buyerUser` | Buyer | `buyer@test.com` | `password123` |
| `sellerUser` | Seller | `seller@test.com` | `password123` |
| `sellerUser2` | Seller | `seller2@test.com` | `password123` |

| Handle | Title | Category | Price | Status | Owner |
|---|---|---|---|---|---|
| `activeListing` | Vintage Teak Armchair | Furniture | 45000 | active | `sellerUser` |
| `draftListing` | Oak Coffee Table | Furniture | 28000 | draft | `sellerUser` |
| `digitalListing` | Interior Design PDF | Books & Media | 5000 | active | `sellerUser2` |

---

## 3. Authentication Tests

| ID | Description | Method | Endpoint | Auth | Expected |
|---|---|---|---|---|---|
| AUTH-01 | Register new buyer | POST | `/auth/register` | ❌ | `201`, user object, no `password` field, `token` cookie set |
| AUTH-02 | Register as seller (`isSeller: true`) | POST | `/auth/register` | ❌ | `201`, `user.isSeller === true` |
| AUTH-03 | Register with duplicate email | POST | `/auth/register` | ❌ | `400`, no duplicate created |
| AUTH-04 | Register with invalid email format | POST | `/auth/register` | ❌ | `400`, validation error on `email` |
| AUTH-05 | Register with password under 8 chars | POST | `/auth/register` | ❌ | `400`, validation error on `password` |
| AUTH-06 | Login with correct credentials | POST | `/auth/login` | ❌ | `200`, user object, `token` cookie set |
| AUTH-07 | Login with wrong password | POST | `/auth/login` | ❌ | `401`, no cookie set |
| AUTH-08 | Login with non-existent email | POST | `/auth/login` | ❌ | `401` |
| AUTH-09 | Get current user (authenticated) | GET | `/auth/me` | ✅ | `200`, user object, no `password` |
| AUTH-10 | Get current user (no cookie) | GET | `/auth/me` | ❌ | `401` |
| AUTH-11 | Logout clears cookie | POST | `/auth/logout` | ✅ | `200`, cookie cleared, subsequent `/me` returns `401` |
| AUTH-12 | Update profile fields | PATCH | `/auth/me` | ✅ | `200`, updated fields reflected |
| AUTH-13 | Change password (correct current) | PATCH | `/auth/me/password` | ✅ | `200`, login with new password succeeds |
| AUTH-14 | Change password (wrong current) | PATCH | `/auth/me/password` | ✅ | `401` |

---

## 4. Listings API Tests

| ID | Description | Method | Endpoint | Auth | Expected |
|---|---|---|---|---|---|
| LIST-01 | Get all active listings | GET | `/listings` | ❌ | `200`, array, all items `status: active` |
| LIST-02 | Filter by category | GET | `/listings?category=Furniture` | ❌ | All results have `category: Furniture` |
| LIST-03 | Filter by price range | GET | `/listings?minPrice=10000&maxPrice=50000` | ❌ | All prices within range |
| LIST-04 | Paginate results | GET | `/listings?page=1&limit=5` | ❌ | Exactly 5 results, `total`/`page`/`pages` present |
| LIST-05 | Get single listing (increments views) | GET | `/listings/:id` | ❌ | `200`, `views` increments by 1 each call |
| LIST-06 | Get non-existent listing | GET | `/listings/000000000000000000000000` | ❌ | `404` |
| LIST-07 | Create listing (seller) | POST | `/listings` | ✅ Seller | `201`, `seller` = auth user, `conditionLevel` auto-set |
| LIST-08 | Create listing (buyer, non-seller) | POST | `/listings` | ✅ Buyer | `403` |
| LIST-09 | Create listing (unauthenticated) | POST | `/listings` | ❌ | `401` |
| LIST-10 | Create listing with invalid category | POST | `/listings` | ✅ Seller | `400` |
| LIST-11 | Update listing (owner) | PATCH | `/listings/:id` | ✅ Owner | `200`, updated fields saved |
| LIST-12 | Update listing (non-owner) | PATCH | `/listings/:id` | ✅ Other | `403` |
| LIST-13 | Delete listing (owner) | DELETE | `/listings/:id` | ✅ Owner | `200`, subsequent GET returns `404` |
| LIST-14 | Delete listing (non-owner) | DELETE | `/listings/:id` | ✅ Other | `403` |
| LIST-15 | Toggle save (save) | PATCH | `/listings/:id/save` | ✅ | `200`, `{ saved: true }`, added to `savedListings` |
| LIST-16 | Toggle save (unsave) | PATCH | `/listings/:id/save` | ✅ | `200`, `{ saved: false }`, removed from `savedListings` |

---

## 5. Sellers API Tests

| ID | Description | Method | Endpoint | Auth | Expected |
|---|---|---|---|---|---|
| SELL-01 | Get all sellers sorted by rating | GET | `/sellers` | ❌ | `200`, only `isSeller: true` users, sorted by rating desc |
| SELL-02 | Get seller profile | GET | `/sellers/:id` | ❌ | `200`, seller object, no `password` |
| SELL-03 | Get seller's active listings | GET | `/sellers/:id/listings` | ❌ | All results are active and belong to that seller |
| SELL-04 | Create review (valid) | POST | `/sellers/:id/reviews` | ✅ | `201`, seller `rating` and `reviewCount` recalculated |
| SELL-05 | Create duplicate review (same buyer + order) | POST | `/sellers/:id/reviews` | ✅ | `400`, no duplicate created |
| SELL-06 | Create review with rating > 5 | POST | `/sellers/:id/reviews` | ✅ | `400` |
| SELL-07 | Create review (unauthenticated) | POST | `/sellers/:id/reviews` | ❌ | `401` |

---

## 6. Orders API Tests

| ID | Description | Method | Endpoint | Auth | Expected |
|---|---|---|---|---|---|
| ORD-01 | Place valid order | POST | `/orders` | ✅ | `201`, `orderNumber` = `HT-YYYY-XXXX`, `paymentStatus: paid` |
| ORD-02 | Place order with empty items | POST | `/orders` | ✅ | `400` |
| ORD-03 | Place order with non-existent listing | POST | `/orders` | ✅ | `404` |
| ORD-04 | Place order (unauthenticated) | POST | `/orders` | ❌ | `401` |
| ORD-05 | Place order with missing delivery address | POST | `/orders` | ✅ | `400` |
| ORD-06 | Get buyer's orders | GET | `/orders` | ✅ | `200`, only orders belonging to auth user |
| ORD-07 | Get single order (correct buyer) | GET | `/orders/:id` | ✅ Buyer | `200`, full order with items |
| ORD-08 | Get single order (wrong user) | GET | `/orders/:id` | ✅ Other | `403 Forbidden` |
| ORD-09 | Update item status to `packed` (seller) | PATCH | `/orders/:id/status` | ✅ Seller | `200`, only that item's status updated |
| ORD-10 | All items delivered → order auto-promoted | PATCH | `/orders/:id/status` | ✅ Seller | `order.status` becomes `delivered` automatically |
| ORD-11 | Get seller orders (seller) | GET | `/orders/seller` | ✅ Seller | `200`, orders containing seller's items |
| ORD-12 | Get seller orders (non-seller) | GET | `/orders/seller` | ✅ Buyer | `403` |
| ORD-13 | Two concurrent orders get unique numbers | POST | `/orders` × 2 | ✅ | Both succeed, `orderNumber` values are different |

---

## 7. Upload API Tests

| ID | Description | Method | Endpoint | Auth | Expected |
|---|---|---|---|---|---|
| UPL-01 | Upload valid JPEG (< 5 MB) | POST | `/upload` | ✅ | `200`, `{ url, publicId }` returned |
| UPL-02 | Upload file exceeding 5 MB | POST | `/upload` | ✅ | `400` |
| UPL-03 | Upload non-image file (PDF, TXT) | POST | `/upload` | ✅ | `400` |
| UPL-04 | Upload without authentication | POST | `/upload` | ❌ | `401` |

---

## 8. Database Model Tests

| ID | Model | Test | Assertion |
|---|---|---|---|
| MOD-01 | User | Password hashed on save | Stored value starts with `$2b$`; `matchPassword('plaintext')` returns `true` |
| MOD-02 | User | `toJSON()` strips password | `JSON.stringify(user)` contains no `password` key |
| MOD-03 | User | Duplicate email rejected | Second save with same email throws duplicate key error (`code 11000`) |
| MOD-04 | Listing | `conditionLevel` auto-set | `condition: 'Good'` → `conditionLevel: 3`; all 5 values map correctly |
| MOD-05 | Listing | Invalid category rejected | `save()` throws `ValidationError` |
| MOD-06 | Order | `orderNumber` generated on first save | Matches `HT-YYYY-XXXX`; re-saving does not change it |
| MOD-07 | Review | Duplicate buyer+order rejected | Second save with same `{ buyer, order }` throws duplicate key error |
| MOD-08 | Review | Seller rating recalculated on save | Two reviews (4★ + 2★) → `seller.rating = 3`, `reviewCount = 2` |
| MOD-09 | Review | Seller rating recalculated on delete | Delete the 2★ review → `seller.rating = 4`, `reviewCount = 1` |
| MOD-10 | Counter | `nextSeq` is atomic | 10 concurrent calls return 10 unique sequential integers |

---

## 9. Frontend Screen Tests

| ID | Screen | Test | Assertion |
|---|---|---|---|
| SCR-01 | LandingScreen | Renders for guests | Hero, categories, CTA, TrustStrip all visible; no crash |
| SCR-02 | HomeFeedScreen | Blocked for guests | Guest navigating to `/#home` is redirected to sign-in |
| SCR-03 | HomeFeedScreen | Category filter updates URL and results | Clicking "Furniture" sets `?category=Furniture`; only furniture listings shown |
| SCR-04 | PDPScreen | Displays listing detail | Title, price, condition badge, seller card, Add to Cart button all present |
| SCR-05 | PDPScreen | Invalid listing ID shows error | Error state shown; app does not crash |
| SCR-06 | CartScreen | Add and view items | Added item visible with correct title, price, and quantity |
| SCR-07 | CartScreen | Remove item clears cart | Item gone from UI and `localStorage.ht_cart` |
| SCR-08 | CheckoutScreen | Full flow places order | All 4 steps complete; `POST /api/orders` called; redirects to confirmation; cart cleared |
| SCR-09 | CheckoutScreen | Missing address blocks progress | Form does not advance; validation errors shown |
| SCR-10 | DashboardScreen | Blocked for non-sellers | Buyer accessing `/#dashboard` is denied or redirected |
| SCR-11 | EditorScreen | Create listing publishes correctly | `POST /api/listings` called; redirect to dashboard; listing count increments |
| SCR-12 | ProfileScreen | Save profile updates user | `PATCH /api/auth/me` called; updated name reflected in header |

---

## 10. Security Tests

| ID | Test | Steps | Expected |
|---|---|---|---|
| SEC-01 | Password never in API response | Call `/auth/me`, `/sellers/:id`, `/orders` | No `password` field in any response body |
| SEC-02 | Tampered JWT rejected | Modify JWT payload, re-encode, send as cookie | `401 Unauthorized` |
| SEC-03 | Expired JWT rejected | Use token with `expiresIn: '1s'` after 2 seconds | `401 Unauthorized` |
| SEC-04 | Seller route blocked for buyers | `POST /api/listings` as `buyerUser` | `403 Forbidden` |
| SEC-05 | Cross-user order access blocked | User B fetches User A's order ID | `403 Forbidden` |
| SEC-06 | NoSQL injection in query params | `GET /api/listings?category[$gt]=` | `400` or safe empty result; no crash or data leak |
| SEC-07 | XSS in listing title stored safely | Create listing with `<script>alert(1)</script>` as title | Stored as plain string; no script executes when rendered |
| SEC-08 | CORS blocks unauthorised origins | Request with `Origin: http://malicious.com` | `Access-Control-Allow-Origin` header absent or blocked |

---

## 11. Integration Tests

| ID | Flow | Steps | Key Assertions |
|---|---|---|---|
| INT-01 | Full buyer journey | Register → browse → add to cart → checkout → view order history | Order created with correct totals; order history returns it |
| INT-02 | Full seller journey | Register as seller → create listing → listing appears in feed → receive order → update status to delivered | Order auto-promotes to `delivered`; buyer order history reflects status |
| INT-03 | Review pipeline | Buyer leaves review after delivered order → duplicate review attempt | First review succeeds and updates seller rating; second returns `400` |
| INT-04 | Image to listing | Upload image → use returned URL in listing creation → fetch listing | `listing.images[0]` matches uploaded URL |
| INT-05 | Wishlist round-trip | Save listing → verify in `/auth/me/saved` → unsave → verify removed | Saved/unsaved state consistent between API and UI |

---

*End of Test Document — 72 test cases*
