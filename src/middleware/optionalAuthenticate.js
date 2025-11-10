import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const optionalAuthenticate = async (req, res, next) => {
  const token = req.cookies.accessToken; // беремо токен з cookie
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const session = await Session.findOne({ accessToken: token });
    if (!session) {
      req.user = null;
      return next();
    }

    const isAccessTokenExpired =
      new Date() > new Date(session.accessTokenValidUntil);
    if (isAccessTokenExpired) {
      req.user = null;
      return next();
    }

    const user = await User.findById(session.userId);
    req.user = user || null;
    next();
  } catch (err) {
    req.user = null;
    next();
  }
};
