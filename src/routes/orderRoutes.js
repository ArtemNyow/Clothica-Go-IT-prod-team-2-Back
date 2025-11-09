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

const router = express.Router();

router.post('/orders', celebrate(createOrderSchema), createOrder);

router.get(
  '/orders/my',
  authenticate,
  celebrate(getUserOrdersSchema),
  getUserOrders
);

router.get(
  '/orders/all',
  authenticate,
  isAdmin,
  celebrate(getAllOrdersSchema),
  getAllOrders
);


router.patch(
  '/orders/:id/status',
  authenticate,
  isAdmin,
  celebrate(updateOrderStatusSchema),
  updateOrderStatus
);

export default router;
