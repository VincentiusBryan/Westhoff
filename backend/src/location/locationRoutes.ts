
import { Router } from 'express';
import {
  getLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
} from './locationController';
import {
  authenticateToken,
  authorizeRoles,
} from '../middleware/authMiddleware';

const router = Router();

router.get(
  '/',
  authenticateToken,
  authorizeRoles('OWNER', 'DAPUR', 'TOKO'),
  getLocations
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('OWNER', 'DAPUR', 'TOKO'),
  getLocationById
);

router.post(
  '/',
  authenticateToken,
  authorizeRoles('OWNER'),
  createLocation
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('OWNER'),
  updateLocation
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('OWNER'),
  deleteLocation
);

export default router;
