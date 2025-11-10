import createError from 'http-errors';
import User from '../models/user.js';

export async function isAdmin(req, res, next) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw createError(401, 'Unauthorized');
    }

    const user = await User.findById(userId);

    if (!user) {
      throw createError(404, 'User not found');
    }

    if (user.role !== 'admin') {
      throw createError(403, 'Access denied. Admin role required.');
    }

    next();
  } catch (error) {
    next(error);
  }
}
