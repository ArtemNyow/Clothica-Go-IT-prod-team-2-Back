import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  createFeedback,
  getFeedbacks,
} from '../controllers/feedbackController.js';
import {
  getFeedbacksSchema,
  createFeedbackSchema,
} from '../validations/feedbackValidation.js';

const router = Router();

router.get('/api/feedbacks', celebrate(getFeedbacksSchema), getFeedbacks);

router.post('/api/feedbacks', celebrate(createFeedbackSchema), createFeedback);

export default router;
