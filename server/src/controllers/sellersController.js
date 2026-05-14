import User from '../models/User.js';
import Listing from '../models/Listing.js';
import Review from '../models/Review.js';

// GET /api/sellers  — list all sellers
export async function getSellers(req, res, next) {
  try {
    const { neighbourhood, page = 1, limit = 20 } = req.query;
    const filter = { isSeller: true };
    if (neighbourhood) filter.neighbourhood = neighbourhood;

    const skip = (Number(page) - 1) * Number(limit);
    const [sellers, total] = await Promise.all([
      User.find(filter)
        .select('name neighbourhood grad rating reviewCount sellerProfile isSeller createdAt')
        .sort({ rating: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    res.json({ sellers, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
}

// GET /api/sellers/:id
export async function getSeller(req, res, next) {
  try {
    const seller = await User.findOne({ _id: req.params.id, isSeller: true })
      .select('name neighbourhood grad rating reviewCount sellerProfile isSeller createdAt');

    if (!seller) return res.status(404).json({ message: 'Seller not found' });
    res.json({ seller });
  } catch (err) {
    next(err);
  }
}

// GET /api/sellers/:id/listings
export async function getSellerListings(req, res, next) {
  try {
    const { category } = req.query;
    const filter = { seller: req.params.id, status: 'active' };
    if (category) filter.category = category;

    const listings = await Listing.find(filter)
      .sort({ createdAt: -1 })
      .populate('seller', 'name neighbourhood grad');

    res.json({ listings });
  } catch (err) {
    next(err);
  }
}

// GET /api/sellers/:id/reviews
export async function getSellerReviews(req, res, next) {
  try {
    const reviews = await Review.find({ seller: req.params.id })
      .populate('buyer', 'name grad')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ reviews });
  } catch (err) {
    next(err);
  }
}

// POST /api/sellers/:id/reviews  (auth required, buyer only)
export async function createReview(req, res, next) {
  try {
    const { rating, body, orderId } = req.body;
    const review = await Review.create({
      seller: req.params.id,
      buyer:  req.user._id,
      order:  orderId,
      rating,
      body,
    });
    await review.populate('buyer', 'name grad');
    res.status(201).json({ review });
  } catch (err) {
    next(err);
  }
}
