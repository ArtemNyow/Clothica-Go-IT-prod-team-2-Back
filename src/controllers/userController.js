import createHttpError from 'http-errors';
import { User } from '../models/user.js';

export const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) {
      throw createHttpError(401, 'Не авторизований');
    }
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
};

export const updateCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) {
      throw createHttpError(401, 'Не авторизований');
    }

    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw createHttpError(404, 'Користувача не знайдено');
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
