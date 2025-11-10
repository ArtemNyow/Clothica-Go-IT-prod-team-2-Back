import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const optionalAuth = async (req, res, next) => {
 
  if (req.cookies.accessToken) {
    try {
      const session = await Session.findOne({
        accessToken: req.cookies.accessToken,
      });

      if (session) {
        const isAccessTokenExpired =
          new Date() > new Date(session.accessTokenValidUntil);

        if (!isAccessTokenExpired) {
          const user = await User.findById(session.userId);

          if (user) {
            req.user = user;
          }
        }
      }
    } catch (error) {
      req.user = null;
    }
  }

  next();
};
