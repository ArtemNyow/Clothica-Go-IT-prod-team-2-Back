import { Joi, Segments } from 'celebrate';

export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    phone: Joi.string()
      .pattern(/^\d{9,15}$/)
      .required(),
    password: Joi.string().min(8).max(128).required(),
    firstName: Joi.string().required().max(32),
  }),
};

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    phone: Joi.string()
      .pattern(/^\d{9,15}$/)
      .required(),
    password: Joi.string().required(),
  }),
};
