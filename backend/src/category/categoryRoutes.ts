
import { Router } from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from './categoryController';
import {
  authenticateToken,
  authorizeRoles,
} from '../middleware/authMiddleware';

const router = Router();

router.get(
  '/',
  authenticateToken,
  authorizeRoles('OWNER', 'DAPUR', 'TOKO'),
  getCategories
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('OWNER', 'DAPUR', 'TOKO'),
  getCategoryById
);

router.post(
  '/',
  authenticateToken,
  authorizeRoles('OWNER'),
  createCategory
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('OWNER'),
  updateCategory
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('OWNER'),
  deleteCategory
);

export default router;
