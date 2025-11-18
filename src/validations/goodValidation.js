import { GENDERS } from '../constants/gender.js';
import { SIZES } from '../constants/size.js';
import { objectIdValidator } from './idValidation.js';
import { Joi, Segments } from 'celebrate';

const splitSizes = (value, helpers) => {
  if (!value) return undefined;

  // Завжди приводимо до масиву
  const arr = Array.isArray(value) ? value : [value];

  const invalid = arr.filter((s) => !SIZES.includes(s));
  if (invalid.length) {
    return helpers.message(`Size must be one of: ${SIZES.join(', ')}`);
  }

  return arr;
};

export const getGoodsSchema = celebrate({
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).default(12),
    category: Joi.string().custom(objectIdValidator),
    size: Joi.alternatives()
      .try(
        Joi.string(), // одиночний size
        Joi.array().items(Joi.string()), // кілька size
      )
      .custom(splitSizes)
      .optional(),
    minPrice: Joi.number(),
    maxPrice: Joi.number(),
    gender: Joi.string()
      .valid(...GENDERS)
      .messages({
        'any.only': `Gender must be one of: ${GENDERS.join(', ')}`,
      }),
  }),
});
