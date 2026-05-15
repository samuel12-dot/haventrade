/**
 * Seed the database with the prototype data from the frontend.
 * Run once:  node src/utils/seed.js
 * Wipe + re-seed:  node src/utils/seed.js --fresh
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import User    from '../models/User.js';
import Listing from '../models/Listing.js';

await mongoose.connect(process.env.MONGO_URI);
console.log('Connected to MongoDB');

const fresh = process.argv.includes('--fresh');
if (fresh) {
  await User.deleteMany({});
  await Listing.deleteMany({});
  console.log('Cleared existing data');
}

// ── Seller accounts ────────────────────────────────────────────

const sellerSeeds = [
  {
    _slug: 'sanne',
    name: "Sanne's Studio",
    email: 'sanne@haventrade.ng',
    password: 'password123',
    postcode: '900237',
    neighbourhood: 'Maitama',
    grad: 'grad-vintage',
    isSeller: true,
    isVerified: true,
    rating: 4.9,
    reviewCount: 312,
    sellerProfile: {
      tagline: 'Refinishing mid-century furniture out of a small atelier on Aminu Kano Crescent. One careful piece at a time.',
      since: "spring '24",
      workshopAddress: 'Aminu Kano Crescent 47-B',
      openingHours: 'Wed–Sat, 13:00–18:00',
      languages: ['EN', 'HA', 'YO'],
    },
  },
  {
    _slug: 'pieter',
    name: "Pieter's Tech",
    email: 'pieter@haventrade.ng',
    password: 'password123',
    postcode: '900286',
    neighbourhood: 'Wuse 2',
    grad: 'grad-cool',
    isSeller: true,
    isVerified: true,
    rating: 4.7,
    reviewCount: 184,
    sellerProfile: { tagline: 'Tested electronics with the original cables and boxes.', since: "fall '24" },
  },
  {
    _slug: 'aisha',
    name: "Aisha's Sourdough",
    email: 'aisha@haventrade.ng',
    password: 'password123',
    postcode: '900103',
    neighbourhood: 'Garki',
    grad: 'grad-saffron',
    isSeller: true,
    isVerified: true,
    rating: 5.0,
    reviewCount: 96,
    sellerProfile: { tagline: 'Sourdough, ferments, the occasional jar of jam.', since: "winter '25" },
  },
  {
    _slug: 'linda',
    name: "Linda's Vintage",
    email: 'linda@haventrade.ng',
    password: 'password123',
    postcode: '900105',
    neighbourhood: 'Utako',
    grad: 'grad-plum',
    isSeller: true,
    isVerified: true,
    rating: 4.8,
    reviewCount: 211,
    sellerProfile: { tagline: "Brass, ceramic, the odd Le Creuset that's seen a kitchen or two.", since: "summer '23" },
  },
  {
    _slug: 'mark',
    name: "Mark's Move-Out",
    email: 'mark@haventrade.ng',
    password: 'password123',
    postcode: '900104',
    neighbourhood: 'Asokoro',
    grad: 'grad-cream',
    isSeller: true,
    rating: 4.6,
    reviewCount: 58,
    sellerProfile: { tagline: 'Moving out of a 4-bedroom. Everything must walk.', since: "spring '26" },
  },
  {
    _slug: 'daan',
    name: "Daan's Closet",
    email: 'daan@haventrade.ng',
    password: 'password123',
    postcode: '900285',
    neighbourhood: 'Wuse 2',
    grad: 'grad-peach',
    isSeller: true,
    rating: 4.8,
    reviewCount: 142,
    sellerProfile: { tagline: 'Carefully curated second-hand clothing.', since: "fall '24" },
  },
  {
    _slug: 'pixel',
    name: 'Pixel Dispatch',
    email: 'pixel@haventrade.ng',
    password: 'password123',
    postcode: '900108',
    neighbourhood: 'Gwarinpa',
    grad: 'grad-deepmoss',
    isSeller: true,
    isVerified: true,
    rating: 4.9,
    reviewCount: 88,
    sellerProfile: { tagline: 'Abuja architecture prints and digital goods.', since: "winter '25" },
  },
];

const sellerMap = {};
for (const { _slug, ...data } of sellerSeeds) {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    sellerMap[_slug] = existing._id;
    console.log(`  skip (exists): ${data.name}`);
  } else {
    const user = await User.create(data);
    sellerMap[_slug] = user._id;
    console.log(`  created seller: ${data.name}`);
  }
}

// ── Listings ───────────────────────────────────────────────────

const listingSeeds = [
  { title: 'Vintage teak armchair',       price: 85000,  sellerId: 'sanne',  category: 'Furniture',     condition: 'Like new', neighbourhood: 'Maitama',  grad: 'grad-vintage',   eta: 'today, 18:00', stock: 1,  sub: 'Like new · Refinished walnut frame',       description: 'Sourced from a 1960s living room in Maitama, carefully refinished — joints re-glued, hand-rubbed Danish oil. Ready for another fifty years.' },
  { title: 'Sony WH-1000XM4 headphones',  price: 120000, sellerId: 'pieter', category: 'Electronics',   condition: 'Good',     neighbourhood: 'Wuse 2',   grad: 'grad-cool',      eta: 'today, 19:00', stock: 1,  sub: 'Good · Original case, light wear' },
  { title: 'IKEA Kallax bookshelf, 4×4',  price: 30000,  sellerId: 'mark',   category: 'Furniture',     condition: 'Fair',     neighbourhood: 'Asokoro',  grad: 'grad-cream',     eta: 'tomorrow, 09:00', stock: 1, sub: 'Fair · Some scratches, sturdy' },
  { title: 'Sourdough starter kit',        price: 0,      sellerId: 'aisha',  category: 'Free',          condition: 'New',      neighbourhood: 'Garki',    grad: 'grad-saffron',   eta: 'today, 18:00', stock: 4,  sub: 'Free · 100g starter + recipe card' },
  { title: 'Mid-century pendant lamp',     price: 65000,  sellerId: 'linda',  category: 'Vintage',       condition: 'Like new', neighbourhood: 'Utako',    grad: 'grad-plum',      eta: 'today, 19:00', stock: 1,  sub: 'Like new · Brass, brushed shade' },
  { title: 'Patagonia raincoat, women\'s M', price: 40000, sellerId: 'daan', category: 'Clothing',      condition: 'Good',     neighbourhood: 'Wuse 2',   grad: 'grad-peach',     eta: 'today, 20:00', stock: 1,  sub: 'Good · Lightly worn, no rips' },
  { title: 'Wooden train set, 50 pieces',  price: 15000,  sellerId: 'mark',   category: 'Kids & Baby',   condition: 'Like new', neighbourhood: 'Asokoro',  grad: 'grad-saffron',   eta: 'tomorrow, 10:00', stock: 1, sub: 'Like new · Beechwood, all pieces' },
  { title: 'Monstera cutting, rooted',     price: 5000,   sellerId: 'aisha',  category: 'Home & Garden', condition: 'New',      neighbourhood: 'Garki',    grad: 'grad-moss',      eta: 'today, 18:00', stock: 6,  sub: 'New · 4 leaves, healthy roots' },
  { title: 'Abuja architecture print, A2', price: 8000,   sellerId: 'pixel', category: 'Books & Media', condition: 'New',      neighbourhood: 'Gwarinpa', grad: 'grad-deepmoss',  eta: 'instant',      stock: 99, digital: true, sub: 'Digital · 300 DPI PDF + PNG', format: 'PDF + PNG', license: 'Personal use' },
  { title: 'Le Creuset 24cm dutch oven',   price: 60000,  sellerId: 'linda',  category: 'Home & Garden', condition: 'Good',     neighbourhood: 'Utako',    grad: 'grad-terracotta', eta: 'today, 19:00', stock: 1, sub: 'Good · Cherry red, well-loved' },
  { title: 'Sourdough loaf, baked today',  price: 6000,   sellerId: 'aisha',  category: 'Home & Garden', condition: 'New',      neighbourhood: 'Garki',    grad: 'grad-sun',       eta: 'today, 17:00', stock: 3,  sub: 'New · 800g, naturally leavened' },
  { title: 'Eames-style lounge, walnut',   price: 240000, sellerId: 'sanne',  category: 'Furniture',     condition: 'Like new', neighbourhood: 'Maitama',  grad: 'grad-terracotta', eta: 'today, 20:00', stock: 1, sub: 'Like new · Reupholstered cognac leather', description: 'Beautifully refurbished Eames-style lounge with ottoman. New cognac leather upholstery, walnut shell refinished.' },
];

let created = 0;
for (const { sellerId, ...data } of listingSeeds) {
  const seller = sellerMap[sellerId];
  if (!seller) { console.warn(`  no seller for ${sellerId}`); continue; }

  const exists = await Listing.findOne({ title: data.title, seller });
  if (exists) { console.log(`  skip (exists): ${data.title}`); continue; }

  await Listing.create({ ...data, seller });
  created++;
  console.log(`  created listing: ${data.title}`);
}

console.log(`\nSeed complete — ${created} listings created`);
await mongoose.disconnect();
