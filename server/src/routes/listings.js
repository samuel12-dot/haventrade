import { Router } from 'express';
import { body } from 'express-validator';
import {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  getSellerListings,
  saveListing,
} from '../controllers/listingsController.js';
import { protect, requireSeller } from '../middleware/auth.js';

const router = Router();

const listingValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be 0 or greater'),
  body('category').notEmpty().withMessage('Category is required'),
  body('condition').notEmpty().withMessage('Condition is required'),
];

router.get('/',                 getListings);
router.get('/seller/:sellerId', getSellerListings);
router.get('/:id',              getListing);
router.post('/',    protect, requireSeller, listingValidation, createListing);
router.patch('/:id/save', protect, saveListing);
router.patch('/:id', protect, requireSeller, updateListing);
router.delete('/:id', protect, requireSeller, deleteListing);

export default router;
