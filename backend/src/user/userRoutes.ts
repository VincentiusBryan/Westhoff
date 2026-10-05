
import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from './userController';
import {
  authenticateToken,
  authorizeRoles,
} from '../middleware/authMiddleware';

const router = Router();

router.get(
  '/',
  authenticateToken,
  authorizeRoles('OWNER'),
  getUsers
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('OWNER'),
  getUserById
);

router.post(
  '/',
  authenticateToken,
  authorizeRoles('OWNER'),
  createUser
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('OWNER'),
  updateUser
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('OWNER'),
  deleteUser
);

export default router;
