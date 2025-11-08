import { Joi, Segments } from 'celebrate';

export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    phone: Joi.string()
      .pattern(/^\d{9,15}$/)
      .required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().required(),
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
