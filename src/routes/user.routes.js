import {
  deleteUser,
  fetchAllUsers,
  getUserById,
  updateUser,
} from '#controllers/user.controller.js';
import { authenticate } from '#middleware/auth.middleware.js';
import express from 'express';

const router = express.Router();

router.get('/', fetchAllUsers);
router.get('/:id', getUserById);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, deleteUser);

export default router;
