import createError from 'http-errors';
import { User } from '../models/user.js';

export async function isAdmin(req, res, next) {
  try {
    const user = req.user;

    if (!user) {
      throw createError(401, 'Unauthorized');
    }

    if (!user.isAdmin) {
      throw createError(403, 'Access denied. Admin role required.');
    }

    next();
  } catch (error) {
    next(error);
  }
}
