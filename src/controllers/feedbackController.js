import { Feedback } from '../models/feedback.js';
import { Good } from '../models/good.js';
import { Category } from '../models/category.js';
import createHttpError from 'http-errors';

export const getFeedbacks = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, goodId } = req.query;
    const skip = (page - 1) * perPage;

    const filter = goodId ? { goodId } : {};
    const feedbacksQuery = Feedback.find(filter).lean();

    const [totalFeedbacks, feedbacks] = await Promise.all([
      feedbacksQuery.clone().countDocuments(),
      feedbacksQuery.skip(skip).limit(perPage),
    ]);

    const fullFeedbacks = await Promise.all(
      feedbacks.map(async (fb) => {
        const good = await Good.findById(fb.goodId).select('category').lean();

        let categoryId = null;
        let categoryName = null;

        if (good?.category) {
          const category = await Category.findById(good.category)
            .select('_id name')
            .lean();

          if (category) {
            categoryId = category._id;
          }
        }

        return {
          ...fb,
          categoryId,
        };
      }),
    );

    const totalPages = Math.ceil(totalFeedbacks / perPage);

    res.status(200).json({
      page,
      perPage,
      totalFeedbacks,
      totalPages,
      feedbacks: fullFeedbacks,
    });
  } catch (err) {
    next(err);
  }
};
export const createFeedback = async (req, res) => {
  const feedback = await Feedback.create({
    ...req.body,
  });
  res.status(201).json(feedback);
};
