import express from 'express';
import { celebrate } from 'celebrate';
import { createSubscription } from '../controllers/subscriptionController.js';
import { createSubscriptionSchema } from '../validations/subscriptionValidation.js';

const router = express.Router();

router.post(
  '/api/subscriptions',
  celebrate(createSubscriptionSchema),
  createSubscription,
);

export default router;
