import createHttpError from 'http-errors';
import { Subscription } from "../models/subscription.js";

export const createSubscription = async (req, res, next) => {
  const { email } = req.body;

  const exists = await Subscription.findOne({ email });

  if (exists) {
    next(createHttpError(409, 'Ця електронна адреса вже підписана на розсилку'));
    return;
  }

  const subscription = await Subscription.create({ email });

  res.status(201).json({
    message: 'Дякуємо за підписку! Ви будете в курсі всіх новин та акцій',
    data: subscription,
  });
};
