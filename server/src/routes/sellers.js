import { Router } from 'express';
import {
  getSellers,
  getSeller,
  getSellerListings,
  getSellerReviews,
  createReview,
} from '../controllers/sellersController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/',                      getSellers);
router.get('/:id',                   getSeller);
router.get('/:id/listings',          getSellerListings);
router.get('/:id/reviews',           getSellerReviews);
router.post('/:id/reviews', protect, createReview);

export default router;
