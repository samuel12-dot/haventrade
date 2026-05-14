import mongoose from 'mongoose';
import Counter from './Counter.js';

const orderItemSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title:    { type: String, required: true },
    price:    { type: Number, required: true },
    qty:      { type: Number, required: true, min: 1 },
    digital:  { type: Boolean, default: false },
    grad:     { type: String },
    // Per-item fulfillment status
    status: {
      type: String,
      enum: ['pending', 'packed', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
    deliverySlot: { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    // HT-2026-XXXX style order number
    orderNumber: {
      type: String,
      unique: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [orderItemSchema],
      validate: [(v) => v.length > 0, 'Order must have at least one item'],
    },
    deliveryAddress: {
      name:     String,
      street:   String,
      postcode: String,
      city:     String,
      notes:    String,
    },
    subtotal:    { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0.99 },
    total:       { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['ideal', 'card', 'pending'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Generate order number before first save — atomic counter avoids race conditions
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const year = new Date().getFullYear();
    const seq  = await Counter.nextSeq(`orders_${year}`);
    this.orderNumber = `HT-${year}-${String(seq).padStart(4, '0')}`;
  }
  next();
});

orderSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export default mongoose.model('Order', orderSchema);
