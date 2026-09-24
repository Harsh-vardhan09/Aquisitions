import { eq } from 'drizzle-orm';
import { db } from '#config/database.js';
import logger from '#config/logger.js';
import { users } from '#models/user.model.js';

export const getAllUsers = async () => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        created_at: users.createdAt,
        updated_at: users.updatedAt,
      })
      .from(users);
    return allUsers;
  } catch (error) {
    logger.error('Error getting users', error);
    throw error;
  }
};

const publicFields = {
  id: users.id,
  name: users.name,
  email: users.email,
  role: users.role,
  created_at: users.createdAt,
  updated_at: users.updatedAt,
};

export const getUserById = async id => {
  try {
    const [user] = await db
      .select(publicFields)
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user;
  } catch (error) {
    logger.error(`Error getting user ${id}`, error);
    throw error;
  }
};

export const updateUser = async (id, updates) => {
  try {
    const existing = await getUserById(id);
    if (!existing) throw new Error('User not found');

    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning(publicFields);
    return user;
  } catch (error) {
    logger.error(`Error updating user ${id}`, error);
    throw error;
  }
};

export const deleteUser = async id => {
  try {
    const [user] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning(publicFields);
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    logger.error(`Error deleting user ${id}`, error);
    throw error;
  }
};
