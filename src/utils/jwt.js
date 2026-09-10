import logger from '#config/logger.js';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'your_secret_key'; // Replace with your own secret key

const JWT_EXPIRES_IN = '1d';

export const jwttoken = {
  sign: payload => {
    try {
      return jwt.sign(payload, jwtSecret, { expiresIn: JWT_EXPIRES_IN });
    } catch (error) {
      logger.error('Error signing JWT token:', error);
      throw new Error('Error signing JWT token', { cause: error });
    }
  },

  verify: token => {
    try {
      return jwt.verify(token, jwtSecret);
    } catch (error) {
      logger.error('Error verifying JWT token:', error);
      throw new Error('Error verifying JWT token', { cause: error });
    }
  },
};
