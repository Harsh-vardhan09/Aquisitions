import logger from '#config/logger.js';
import { authenticateUser, createUser } from '#services/auth.service.js';
import { cookies } from '#utils/cookies.js';
import { formatValidationError } from '#utils/format.js';
import { jwttoken } from '#utils/jwt.js';
import { signInSchema, signUpSchema } from '#validations/auth.validation.js';

export const signup = async (req, res, next) => {
  try {
    const validationResult = signUpSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { name, email, password, role } = validationResult.data;

    //auth service
    const user = await createUser({ name, email, password, role });

    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, 'token', token);

    logger.info(`user registered successfully:${email}`);
    res.status(201).json({
      message: 'User registered',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    logger.error('signup error', error);

    if (error.message === 'user with this email already exists') {
      return res.status(409).json({ error: 'email already exists' });
    }

    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const validationResult = signInSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;

    //auth service
    const user = await authenticateUser({ email, password });

    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, 'token', token);

    logger.info(`user signed in successfully:${email}`);
    res.status(200).json({
      message: 'User signed in',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('signin error', error);

    if (
      error.message === 'User not found' ||
      error.message === 'Invalid password'
    ) {
      return res.status(401).json({ error: 'invalid email or password' });
    }

    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    cookies.clear(res, 'token');

    logger.info('user signed out successfully');
    res.status(200).json({ message: 'User signed out' });
  } catch (error) {
    logger.error('signout error', error);
    next(error);
  }
};
