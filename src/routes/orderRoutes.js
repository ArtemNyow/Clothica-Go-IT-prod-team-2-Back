import express from 'express';
import { celebrate } from 'celebrate';
import {
  createOrder,
  getUserOrders,
  updateOrderStatus,
  getAllOrders,
} from '../controllers/orderController.js';
import {
  createOrderSchema,
  getUserOrdersSchema,
  updateOrderStatusSchema,
  getAllOrdersSchema,
} from '../validations/orderValidation.js';
import { authenticate } from '../middleware/authenticate.js';
import { isAdmin } from '../middleware/isAdmin.js';
// import { optionalAuth } from '../middleware/optionalAuth.js';

const router = express.Router();

router.post('/api/orders', celebrate(createOrderSchema), createOrder);
// router.post('/api/orders', optionalAuth, celebrate(createOrderSchema), createOrder);

router.get(
  '/api/orders/my',
  authenticate,
  celebrate(getUserOrdersSchema),
  getUserOrders,
);

router.get(
  '/api/orders/all',
  authenticate,
  isAdmin,
  celebrate(getAllOrdersSchema),
  getAllOrders,
);

router.patch(
  '/api/orders/:id/status',
  authenticate,
  isAdmin,
  celebrate(updateOrderStatusSchema),
  updateOrderStatus,
);

export default router;
