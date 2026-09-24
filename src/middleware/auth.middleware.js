import { cookies } from '#utils/cookies.js';
import { jwttoken } from '#utils/jwt.js';

export const authenticate = (req, res, next) => {
  try {
    const token = cookies.get(req, 'token');
    if (!token) return res.status(401).json({ error: 'Authentication required' });
    req.user = jwttoken.verify(token);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
