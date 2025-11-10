import { Joi, Segments } from 'celebrate';
import { ORDER_STATUS } from '../constants/status.js';

export const createOrderSchema = {
  [Segments.BODY]: Joi.object({
    shippingInfo: Joi.object({
      firstName: Joi.string().min(2).max(50).required().messages({
        "string.min": "Ім'я має містити мінімум {#limit} символи",
        "string.max": "Ім'я має містити не більше {#limit} символів",
        "any.required": "Ім'я обов'язкове",
      }),
      lastName: Joi.string().min(2).max(50).required().messages({
        "string.min": "Прізвище має містити мінімум {#limit} символи",
        "string.max": "Прізвище має містити не більше {#limit} символів",
        "any.required": "Прізвище обов'язкове",
      }),
      phone: Joi.string()
        .pattern(/^\+?3?8?(0\d{9})$/)
        .required()
        .custom((value, helpers) => {
          const cleaned = value.replace(/\D/g, '');

          let normalized;
          if (cleaned.startsWith('380')) {
            normalized = `+${cleaned}`;
          } else if (cleaned.startsWith('80')) {
            normalized = `+3${cleaned}`;
          } else if (cleaned.startsWith('0')) {
            normalized = `+38${cleaned}`;
          } else {
            return helpers.error('string.pattern.base');
          }

          if (normalized.length !== 13) {
            return helpers.error('string.pattern.base');
          }

          return normalized;
        })
        .messages({
          "string.pattern.base": "Невірний формат телефону. Введіть номер у форматі +380XXXXXXXXX або 0XXXXXXXXX",
          "any.required": "Телефон обов'язковий",
        }),
      city: Joi.string().min(2).max(100).required().messages({
        "string.min": "Місто має містити мінімум {#limit} символи",
        "string.max": "Місто має містити не більше {#limit} символів",
        "any.required": "Місто обов'язкове",
      }),
      postOffice: Joi.string().min(1).max(200).required().messages({
        "string.min": "Номер відділення має містити мінімум {#limit} символ",
        "string.max": "Номер відділення має містити не більше {#limit} символів",
        "any.required": "Номер відділення обов'язковий",
      }),
      comment: Joi.string().max(500).allow('', null).messages({
        "string.max": "Коментар не може перевищувати {#limit} символів",
      }),
    })
      .required()
      .messages({
        "any.required": "Інформація про доставку обов'язкова",
      }),
  }),
};


export const getUserOrdersSchema = {
  [Segments.QUERY]: Joi.object({
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
        "string.pattern.base": "Невірний формат ID замовлення",
        "any.required": "ID замовлення обов'язковий",
      }),
  }),
  [Segments.BODY]: Joi.object({
    status: Joi.string()
      .valid(...ORDER_STATUS)
      .required()
      .messages({
        "any.only": `Невірний статус. Допустимі: ${ORDER_STATUS.join(', ')}`,
        "any.required": "Статус обов'язковий",
      }),
  }),
};


export const getAllOrdersSchema = {
  [Segments.QUERY]: Joi.object({
    status: Joi.string()
      .valid(...ORDER_STATUS)
      .optional()
      .messages({
        "any.only": `Невірний статус. Допустимі: ${ORDER_STATUS.join(', ')}`,
      }),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  }),
};
