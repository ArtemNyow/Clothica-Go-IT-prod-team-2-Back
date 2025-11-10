import { Joi, Segments } from 'celebrate';
import { SIZES } from '../constants/size.js';

export const addToCartSchema = {
  [Segments.BODY]: Joi.object({
    goodId: Joi.string().required(),
    size: Joi.string()
      .valid(...SIZES)
      .required(),
    qty: Joi.number().integer().min(1).default(1),
  }),
};

export const updateCartItemSchema = {
  [Segments.BODY]: Joi.object({
    goodId: Joi.string().required(),
    size: Joi.string()
      .valid(...SIZES)
      .required(),
    qty: Joi.number().integer().min(1).required(),
  }),
};

export const removeFromCartSchema = {
  [Segments.BODY]: Joi.object({
    goodId: Joi.string().required(),
    size: Joi.string()
      .valid(...SIZES)
      .required(),
  }),
};
