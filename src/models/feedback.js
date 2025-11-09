import { Schema, model } from 'mongoose';
import { Good } from './good.js';
import { Category } from './category.js';

const feedbackSchema = new Schema(
  {
    goodId: {
      type: Schema.Types.ObjectId,
      ref: 'Good',
      required: true,
    },
    category: {
      type: String,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    rate: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

feedbackSchema.pre('save', async function (next) {
  try {
    if (this.goodId && !this.category) {
      const good = await Good.findById(this.goodId).select('category').lean();
      if (good?.category) {
        const cat = await Category.findById(good.category)
          .select('name')
          .lean();
        if (cat?.name) {
          this.category = cat.name;
        }
      }
    }
    if (!this.date) {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      this.date = `${yyyy}-${mm}-${dd}`;
    }

    next();
  } catch (err) {
    next(err);
  }
});

feedbackSchema.post('save', async function (doc, next) {
  try {
    await Good.findByIdAndUpdate(
      doc.goodId,
      { $addToSet: { feedbacks: doc._id } },
      { new: true },
    );
    next();
  } catch (err) {
    next(err);
  }
});
export const Feedback = model('Feedback', feedbackSchema);
