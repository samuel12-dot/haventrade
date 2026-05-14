import { validationResult } from 'express-validator';
import Listing from '../models/Listing.js';
import User from '../models/User.js';

// GET /api/listings
export async function getListings(req, res, next) {
  try {
    const {
      category, condition, minPrice, maxPrice,
      neighbourhood, digital, sort = 'newest',
      page = 1, limit = 24, status = 'active',
      lat, lon, radius = 2,
    } = req.query;

    const filter = { status };
    if (category)      filter.category      = category;
    if (condition)     filter.condition      = condition;
    if (neighbourhood) filter.neighbourhood  = neighbourhood;
    if (digital !== undefined) filter.digital = digital === 'true';
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (lat && lon) {
      filter.location = {
        $near: {
          $geometry:    { type: 'Point', coordinates: [Number(lon), Number(lat)] },
          $maxDistance: Number(radius) * 1000,
        },
      };
    }

    const sortMap = {
      newest:     { createdAt: -1 },
      oldest:     { createdAt:  1 },
      price_asc:  { price:  1 },
      price_desc: { price: -1 },
    };

    const skip  = (Number(page) - 1) * Number(limit);
    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .populate('seller', 'name neighbourhood grad rating reviewCount isSeller')
        .sort(sortMap[sort] || { createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Listing.countDocuments(filter),
    ]);

    res.json({
      listings,
      total,
      page:  Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/listings/:id
export async function getListing(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('seller', 'name neighbourhood grad rating reviewCount isSeller sellerProfile since');

    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    // Increment view count (fire-and-forget)
    Listing.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }).exec();

    res.json({ listing });
  } catch (err) {
    next(err);
  }
}

// POST /api/listings  (auth + seller required)
export async function createListing(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: errors.array()[0].msg });
    }

    const listing = await Listing.create({ ...req.body, seller: req.user._id });
    await listing.populate('seller', 'name neighbourhood grad');
    res.status(201).json({ listing });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/listings/:id  (owner only)
export async function updateListing(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (!listing.seller.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not your listing' });
    }

    const allowed = [
      'title', 'description', 'price', 'category', 'condition', 'grad',
      'stock', 'eta', 'sub', 'images', 'dimensions', 'weight', 'materials',
      'format', 'license', 'deliveryOptions', 'status',
    ];
    allowed.forEach((f) => { if (req.body[f] !== undefined) listing[f] = req.body[f]; });
    await listing.save();

    res.json({ listing });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/listings/:id  (owner only)
export async function deleteListing(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (!listing.seller.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not your listing' });
    }

    await listing.deleteOne();
    res.json({ message: 'Listing removed' });
  } catch (err) {
    next(err);
  }
}

// GET /api/listings/seller/:sellerId
export async function getSellerListings(req, res, next) {
  try {
    const listings = await Listing.find({
      seller: req.params.sellerId,
      status: 'active',
    })
      .sort({ createdAt: -1 })
      .populate('seller', 'name neighbourhood grad');

    res.json({ listings });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/listings/:id/save  — toggle saved state for authenticated user
export async function saveListing(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select('savedListings');
    const alreadySaved = user.savedListings.some((id) => id.equals(req.params.id));

    const update = alreadySaved
      ? { $pull:     { savedListings: req.params.id } }
      : { $addToSet: { savedListings: req.params.id } };

    await User.findByIdAndUpdate(req.user._id, update);
    res.json({ saved: !alreadySaved });
  } catch (err) {
    next(err);
  }
}
