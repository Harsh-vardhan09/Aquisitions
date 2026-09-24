import logger from '#config/logger.js';
import {
  deleteUser as deleteUserService,
  getAllUsers,
  getUserById as getUserByIdService,
  updateUser as updateUserService,
} from '#services/user.services.js';
import { formatValidationError } from '#utils/format.js';
import {
  updateUserSchema,
  userIdSchema,
} from '#validations/users.validation.js';

const validationFailed = (res, error) =>
  res.status(400).json({
    error: 'validation failed',
    details: formatValidationError(error),
  });

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('Getting all users');
    const allUsers = await getAllUsers();

    res.json({
      message: 'Successfully retrieved users',
      users: allUsers,
      count: allUsers.length,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const params = userIdSchema.safeParse(req.params);
    if (!params.success) return validationFailed(res, params.error);

    const { id } = params.data;
    logger.info(`Getting user ${id}`);
    const user = await getUserByIdService(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'Successfully retrieved user', user });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const params = userIdSchema.safeParse(req.params);
    if (!params.success) return validationFailed(res, params.error);

    const body = updateUserSchema.safeParse(req.body);
    if (!body.success) return validationFailed(res, body.error);

    const { id } = params.data;
    const updates = body.data;
    const isAdmin = req.user.role === 'admin';

    if (!isAdmin && req.user.id !== id) {
      logger.warn(`User ${req.user.id} tried to update user ${id}`);
      return res
        .status(403)
        .json({ error: 'You can only update your own information' });
    }
    if (updates.role && !isAdmin) {
      logger.warn(`User ${req.user.id} tried to change role of user ${id}`);
      return res
        .status(403)
        .json({ error: 'Only admins can change user roles' });
    }

    const user = await updateUserService(id, updates);
    logger.info(`User ${id} updated by ${req.user.id}`);
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    logger.error(error);
    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    if (error.cause?.code === '23505' || error.code === '23505') {
      return res.status(409).json({ error: 'email already exists' });
    }
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const params = userIdSchema.safeParse(req.params);
    if (!params.success) return validationFailed(res, params.error);

    const { id } = params.data;
    if (req.user.role !== 'admin' && req.user.id !== id) {
      logger.warn(`User ${req.user.id} tried to delete user ${id}`);
      return res
        .status(403)
        .json({ error: 'You can only delete your own account' });
    }

    const user = await deleteUserService(id);
    logger.info(`User ${id} deleted by ${req.user.id}`);
    res.json({ message: 'User deleted successfully', user });
  } catch (error) {
    logger.error(error);
    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    next(error);
  }
};
