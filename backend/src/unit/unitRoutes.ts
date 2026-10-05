import { Router } from 'express';
import {
  getUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit,
} from './unitController';
import {
  authenticateToken,
  authorizeRoles,
} from '../middleware/authMiddleware';

const router = Router();

router.get(
  '/',
  authenticateToken,
  authorizeRoles('OWNER', 'DAPUR', 'TOKO'),
  getUnits
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('OWNER', 'DAPUR', 'TOKO'),
  getUnitById
);

router.post(
  '/',
  authenticateToken,
  authorizeRoles('OWNER'),
  createUnit
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('OWNER'),
  updateUnit
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('OWNER'),
  deleteUnit
);

export default router;
