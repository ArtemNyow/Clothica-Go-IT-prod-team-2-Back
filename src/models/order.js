import { Schema, model } from 'mongoose';
import { SIZES } from '../constants/size.js';
import { ORDER_STATUS, STATUS } from '../constants/status.js';

const orderItemSchema = new Schema(
  {
    goodId: {
      type: Schema.Types.ObjectId,
      ref: 'Good',
      required: true,
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      enum: SIZES,
      required: true,
    },
  },
  { _id: false }
);


const shippingInfoSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postOffice: {
      type: String,
      required: true,
    },
    comment: String,
  },
  { _id: false }
);



const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    items: [orderItemSchema],
    shippingInfo: {
      type: shippingInfoSchema,
      required: true,
    },
    totals: {
      subtotal: {
        type: Number,
        required: true,
      },
      shipping: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
      },
    },
    status: {
      type: String,
      default: STATUS.IN_PROGRESS,
      enum: ORDER_STATUS,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const count = await this.constructor.countDocuments();
    this.orderNumber = `№${date}${(count + 1).toString().padStart(3, '0')}`;
  }
  next();
});

export const Order = model('Order', orderSchema);

