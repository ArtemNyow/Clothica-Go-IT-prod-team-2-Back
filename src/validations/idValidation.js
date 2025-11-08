import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

export const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

export const idSchema = {
  [Segments.PARAMS]: Joi.object({
    goodId: Joi.string().custom(objectIdValidator).required(),
  }),
};
