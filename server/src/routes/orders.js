import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getSellerOrders,
} from '../controllers/ordersController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect); // all order routes require auth

router.post('/',                createOrder);
router.get('/',                 getOrders);
router.get('/seller',           getSellerOrders);
router.get('/:id',              getOrder);
router.patch('/:id/status',     updateOrderStatus);

export default router;
