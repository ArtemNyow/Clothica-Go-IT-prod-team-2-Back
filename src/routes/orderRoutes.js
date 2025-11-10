import express from 'express';
import { celebrate } from 'celebrate';
import {
  createOrderController,
  getUserOrdersController,
  getAllOrdersController,
  updateOrderStatusController,
} from '../controllers/orderController.js';

import { authenticate } from '../middleware/authenticate.js';
import { isAdmin } from '../middleware/isAdmin.js';
import {
  createOrderSchema,
  getUserOrdersSchema,
  getAllOrdersSchema,
  updateOrderStatusSchema,
} from '../validations/orderValidation.js';
import { optionalAuthenticate } from '../middleware/optionalAuthenticate.js';

const router = express.Router();

router.post(
  '/api/orders',
  optionalAuthenticate,
  celebrate(createOrderSchema),
  createOrderController,
);

router.get(
  '/api/orders/my',
  authenticate,
  celebrate(getUserOrdersSchema),
  getUserOrdersController,
);

router.get(
  '/api/orders/all',
  authenticate,
  isAdmin,
  celebrate(getAllOrdersSchema),
  getAllOrdersController,
);

router.patch(
  '/api/orders/:id/status',
  authenticate,
  isAdmin,
  celebrate(updateOrderStatusSchema),
  updateOrderStatusController,
);

export default router;
