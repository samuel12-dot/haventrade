import mongoose from 'mongoose';

const CATEGORIES = [
  'Furniture', 'Electronics', 'Vintage', 'Kids & Baby',
  'Clothing', 'Books & Media', 'Home & Garden', 'Free',
];

const CONDITIONS = ['New', 'Like new', 'Good', 'Fair', 'For parts'];

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: CATEGORIES,
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      enum: CONDITIONS,
    },
    conditionLevel: {
      type: Number,
      min: 1,
      max: 5,
    },
    // Display gradient — matches CSS class names in the frontend
    grad: {
      type: String,
      default: 'grad-vintage',
    },
    neighbourhood: {
      type: String,
      trim: true,
    },
    postcode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    // GeoJSON point for future radius-based search
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [4.5, 51.9] }, // Rotterdam centroid
    },
    stock: {
      type: Number,
      default: 1,
      min: 0,
    },
    digital: {
      type: Boolean,
      default: false,
    },
    // Delivery ETA label shown in the UI
    eta: {
      type: String,
      default: 'today',
    },
    // Sub-label shown beneath the title on cards
    sub: {
      type: String,
    },
    images: [String],
    // Physical item details
    dimensions: String,
    weight:     String,
    materials:  String,
    // Digital item details
    format:  String,
    license: String,
    // Delivery options
    deliveryOptions: {
      cargo:    { type: Boolean, default: true },
      self:     { type: Boolean, default: false },
      pickup:   { type: Boolean, default: false },
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'sold', 'archived'],
      default: 'active',
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

listingSchema.index({ location: '2dsphere' });
listingSchema.index({ category: 1, status: 1 });
listingSchema.index({ seller: 1, status: 1 });
listingSchema.index({ price: 1 });

// Auto-set conditionLevel from condition string
listingSchema.pre('save', function (next) {
  const map = { New: 5, 'Like new': 4, Good: 3, Fair: 2, 'For parts': 1 };
  if (this.isModified('condition')) {
    this.conditionLevel = map[this.condition] ?? 3;
  }
  next();
});

listingSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export default mongoose.model('Listing', listingSchema);
