import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Display name is required'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    postcode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    neighbourhood: {
      type: String,
      trim: true,
    },
    // Display gradient (matches CSS class name in the frontend)
    grad: {
      type: String,
      default: 'grad-cool',
    },
    // Seller profile — populated when the user opens a stall
    sellerProfile: {
      tagline:      { type: String, default: '' },
      since:        { type: String },
      workshopAddress: { type: String },
      openingHours: { type: String },
      languages:    [String],
    },
    isSeller: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    savedListings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method — compare plaintext password
userSchema.methods.matchPassword = async function (plaintext) {
  return bcrypt.compare(plaintext, this.password);
};

// Strip sensitive fields from JSON responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

export default mongoose.model('User', userSchema);
