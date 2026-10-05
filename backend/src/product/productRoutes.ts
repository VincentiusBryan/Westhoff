
import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from './productController';
import {
  authenticateToken,
  authorizeRoles,
} from '../middleware/authMiddleware';

const router = Router();

router.get(
  '/',
  authenticateToken,
  authorizeRoles('OWNER', 'DAPUR', 'TOKO'),
  getProducts
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('OWNER', 'DAPUR', 'TOKO'),
  getProductById
);

router.post(
  '/',
  authenticateToken,
  authorizeRoles('OWNER'),
  createProduct
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('OWNER'),
  updateProduct
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('OWNER'),
  deleteProduct
);

export default router;
