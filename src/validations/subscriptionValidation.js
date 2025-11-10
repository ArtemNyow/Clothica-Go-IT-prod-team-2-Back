import { Joi, Segments } from 'celebrate';

export const createSubscriptionSchema = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.empty': 'Email є обовʼязковим',
        'string.email': 'Невірний формат email',
      }),
  }),
};
