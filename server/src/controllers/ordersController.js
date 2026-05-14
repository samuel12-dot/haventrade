import Order from '../models/Order.js';
import Listing from '../models/Listing.js';

// POST /api/orders  — place an order
export async function createOrder(req, res, next) {
  try {
    const { items, deliveryAddress, paymentMethod, slotPicks = {} } = req.body;

    if (!items?.length) {
      return res.status(422).json({ message: 'Cart is empty' });
    }

    // Resolve listings and build line items
    const listingIds = items.map((i) => i.listingId);
    const listings   = await Listing.find({ _id: { $in: listingIds }, status: 'active' });

    const lineItems = [];
    let subtotal    = 0;

    for (const item of items) {
      const listing = listings.find((l) => l._id.toString() === item.listingId);
      if (!listing) {
        return res.status(422).json({ message: `Listing ${item.listingId} not available` });
      }
      if (listing.stock < item.qty) {
        return res.status(422).json({ message: `Not enough stock for "${listing.title}"` });
      }

      const lineTotal = listing.price * item.qty;
      subtotal += lineTotal;

      lineItems.push({
        listing:      listing._id,
        seller:       listing.seller,
        title:        listing.title,
        price:        listing.price,
        qty:          item.qty,
        digital:      listing.digital,
        grad:         listing.grad,
        deliverySlot: slotPicks[listing.seller.toString()] ?? null,
        status:       'pending',
      });
    }

    // Delivery fee: €2.50 per physical seller group
    const physicalSellerIds = [...new Set(
      lineItems.filter((i) => !i.digital).map((i) => i.seller.toString())
    )];
    const deliveryFee = physicalSellerIds.length * 2.5;
    const platformFee = 0.99;
    const total       = subtotal + deliveryFee + platformFee;

    const order = await Order.create({
      buyer: req.user._id,
      items: lineItems,
      deliveryAddress,
      subtotal,
      deliveryFee,
      platformFee,
      total,
      paymentMethod: paymentMethod || 'pending',
      paymentStatus: 'paid',
      status:        'active',
    });

    // Decrement stock for physical items
    for (const item of lineItems) {
      if (!item.digital) {
        await Listing.findByIdAndUpdate(item.listing, { $inc: { stock: -item.qty } });
      }
    }

    await order.populate([
      { path: 'buyer', select: 'name email' },
      { path: 'items.listing', select: 'title grad' },
      { path: 'items.seller',  select: 'name neighbourhood' },
    ]);

    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
}

// GET /api/orders  — buyer's order history
export async function getOrders(req, res, next) {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { buyer: req.user._id };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('items.seller', 'name neighbourhood grad')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(filter),
    ]);

    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/:id
export async function getOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email')
      .populate('items.listing', 'title grad digital')
      .populate('items.seller', 'name neighbourhood grad');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!order.buyer._id.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not your order' });
    }

    res.json({ order });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/orders/:id/status  — seller updates fulfillment
export async function updateOrderStatus(req, res, next) {
  try {
    const { status, itemListingId } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (itemListingId) {
      // Update a single line item's status
      const item = order.items.find((i) => i.listing.toString() === itemListingId);
      if (!item) return res.status(404).json({ message: 'Item not found in order' });
      if (!item.seller.equals(req.user._id)) {
        return res.status(403).json({ message: 'Not your item' });
      }
      item.status = status;
    } else {
      // Update whole order (buyer cancelling, or admin)
      order.status = status;
    }

    // Auto-promote order status if all items delivered
    const allDelivered = order.items.every((i) => i.status === 'delivered' || i.digital);
    if (allDelivered) order.status = 'delivered';

    await order.save();
    res.json({ order });
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/seller — orders containing the seller's items
export async function getSellerOrders(req, res, next) {
  try {
    const { status } = req.query;
    const filter = { 'items.seller': req.user._id };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('buyer', 'name')
      .populate('items.listing', 'title grad')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ orders });
  } catch (err) {
    next(err);
  }
}
