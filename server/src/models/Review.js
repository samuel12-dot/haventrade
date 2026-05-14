import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    body: {
      type: String,
      trim: true,
      maxlength: [600, 'Review cannot exceed 600 characters'],
    },
  },
  { timestamps: true }
);

// One review per buyer per order
reviewSchema.index({ buyer: 1, order: 1 }, { unique: true });

// Recalculate seller's aggregate rating after every save/remove
async function updateSellerRating(sellerId) {
  const stats = await mongoose.model('Review').aggregate([
    { $match: { seller: sellerId } },
    { $group: { _id: '$seller', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const { avg = 0, count = 0 } = stats[0] ?? {};
  await mongoose.model('User').findByIdAndUpdate(sellerId, {
    rating: Math.round(avg * 10) / 10,
    reviewCount: count,
  });
}

reviewSchema.post('save', (doc) => updateSellerRating(doc.seller));
reviewSchema.post('findOneAndDelete', (doc) => { if (doc) updateSellerRating(doc.seller); });

export default mongoose.model('Review', reviewSchema);
