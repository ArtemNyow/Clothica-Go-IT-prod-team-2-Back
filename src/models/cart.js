import { Schema, model } from 'mongoose';
import { SIZES } from '../constants/size.js';

const cartItemSchema = new Schema(
  {
    goodId: {
      type: Schema.Types.ObjectId,
      ref: 'Good',
      required: true,
    },
    size: {
      type: String,
      enum: SIZES,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    sessionId: {
      type: String,
      index: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

cartSchema.index({ userId: 1 });

export const Cart = model('Cart', cartSchema);

