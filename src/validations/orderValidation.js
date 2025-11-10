import { Joi, Segments } from 'celebrate';
import { SIZES } from '../constants/size.js';
import { ORDER_STATUS } from '../constants/status.js';

export const createOrderSchema = {
  [Segments.BODY]: Joi.object({
    items: Joi.array()
      .items(
        Joi.object({
          goodId: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
              'string.pattern.base': 'Невірний формат ID товару',
              'any.required': "ID товару обов'язковий",
            }),
          qty: Joi.number().integer().min(1).required().messages({
            'number.base': 'Кількість повинна бути числом',
            'number.min': 'Мінімальна кількість — 1',
            'any.required': "Кількість обов'язкова",
          }),
          price: Joi.number().min(0).required().messages({
            'number.base': 'Ціна повинна бути числом',
            'number.min': "Ціна не може бути від'ємною",
            'any.required': "Ціна обов'язкова",
          }),
          size: Joi.string()
            .valid(...SIZES)
            .required()
            .messages({
              'any.only': `Розмір має бути одним з: ${SIZES.join(', ')}`,
              'any.required': "Розмір обов'язковий",
            }),
        }),
      )
      .min(1)
      .required()
      .messages({
        'array.min': 'Повинна бути хоча б одна позиція у замовленні',
        'any.required': "Товари обов'язкові",
      }),
    shippingInfo: Joi.object({
      firstName: Joi.string().min(2).max(50).required(),
      lastName: Joi.string().min(2).max(50).required(),
      phone: Joi.string()
        .pattern(/^\+?3?8?(0\d{9})$/)
        .required(),
      city: Joi.string().min(2).max(100).required(),
      postOffice: Joi.string().min(1).max(200).required(),
      comment: Joi.string().max(500).allow('', null),
    }).required(),
  }),
};

export const getUserOrdersSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  }),
};

export const getAllOrdersSchema = {
  [Segments.QUERY]: Joi.object({
    status: Joi.string()
      .valid(...ORDER_STATUS)
      .optional()
      .messages({
        'any.only': `Невірний статус. Допустимі: ${ORDER_STATUS.join(', ')}`,
      }),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  }),
};

export const updateOrderStatusSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Невірний формат ID замовлення',
        'any.required': "ID замовлення обов'язковий",
      }),
  }),
  [Segments.BODY]: Joi.object({
    status: Joi.string()
      .valid(...ORDER_STATUS)
      .required()
      .messages({
        'any.only': `Невірний статус. Допустимі: ${ORDER_STATUS.join(', ')}`,
        'any.required': "Статус обов'язковий",
      }),
  }),
};
