// One-time script: find Kelvin's listings and re-upload a missing Cloudinary image.
// Usage: node scripts/reupload-image.mjs <local-image-path>
// Example: node scripts/reupload-image.mjs ../client/public/images/products/my-item/my-item1.png

import 'dotenv/config';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { readFileSync } from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

await mongoose.connect(process.env.MONGO_URI);

// ── 1. Find Kelvin's listings ────────────────────────────────
const User    = (await import('../src/models/User.js')).default;
const Listing = (await import('../src/models/Listing.js')).default;

const kelvin = await User.findOne({ $or: [{ email: /kelvin/i }, { name: /kelvin/i }] }).lean();
if (!kelvin) {
  const allUsers = await User.find({}, 'email name').lean();
  console.log('No user matching "kelvin" found. All users:');
  allUsers.forEach(u => console.log(' -', u.email, '|', u.name));
  process.exit(1);
}

console.log(`Found user: ${kelvin.email} (${kelvin.name || kelvin._id})`);

const listings = await Listing.find({ seller: kelvin._id }).lean();
console.log(`\nListings (${listings.length}):`);
listings.forEach((l, i) => {
  console.log(`\n[${i}] ${l.title}`);
  (l.images || []).forEach(img => console.log('    ', img));
});

// ── 2. Optionally re-upload an image ────────────────────────
const localPath = process.argv[2];
if (!localPath) {
  console.log('\nTo re-upload an image, run:\n  node scripts/reupload-image.mjs <local-image-path>');
  await mongoose.disconnect();
  process.exit(0);
}

const buffer   = readFileSync(path.resolve(localPath));
const fileName = path.basename(localPath, path.extname(localPath));

const result = await new Promise((resolve, reject) => {
  cloudinary.uploader
    .upload_stream(
      { folder: 'haventrade', public_id: fileName, overwrite: true, resource_type: 'image' },
      (err, r) => (err ? reject(err) : resolve(r))
    )
    .end(buffer);
});

console.log('\nUploaded successfully:');
console.log('  URL:      ', result.secure_url);
console.log('  Public ID:', result.public_id);

// ── 3. Patch the listing that references this file ───────────
for (const l of listings) {
  const idx = (l.images || []).findIndex(
    img => img.includes(fileName) || img.includes(path.basename(localPath))
  );
  if (idx !== -1) {
    l.images[idx] = result.secure_url;
    await Listing.findByIdAndUpdate(l._id, { images: l.images });
    console.log(`\nUpdated listing "${l.title}" image[${idx}] → ${result.secure_url}`);
  }
}

await mongoose.disconnect();
