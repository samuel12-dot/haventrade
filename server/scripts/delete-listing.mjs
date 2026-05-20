import 'dotenv/config';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

await mongoose.connect(process.env.MONGO_URI);

const User    = (await import('../src/models/User.js')).default;
const Listing = (await import('../src/models/Listing.js')).default;

const kelvin = await User.findOne({ $or: [{ email: /kelvin/i }, { name: /kelvin/i }] }).lean();
if (!kelvin) { console.log('User not found'); process.exit(1); }

const listings = await Listing.find({ seller: kelvin._id }).lean();

for (const l of listings) {
  // Delete each Cloudinary image
  for (const img of (l.images || [])) {
    if (img.includes('res.cloudinary.com')) {
      const publicId = img.replace(/.*\/upload\/v\d+\//, '').replace(/\.[^.]+$/, '');
      const res = await cloudinary.uploader.destroy(publicId);
      console.log(`Deleted Cloudinary image: ${publicId} → ${res.result}`);
    }
  }
  // Delete the listing from MongoDB
  await Listing.findByIdAndDelete(l._id);
  console.log(`Deleted listing: "${l.title}" (${l._id})`);
}

console.log('\nDone.');
await mongoose.disconnect();
