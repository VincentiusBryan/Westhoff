import { Router } from 'express';
import {
  createRequest,
  getRequests,
  completeRequest
} from './mutationController';
import {
  authenticateToken,
  authorizeRoles
} from '../middleware/authMiddleware';

const router = Router();

// Membuat request mutasi (TOKO dan OWNER)
router.post(
  '/',
  authenticateToken,
  authorizeRoles('TOKO', 'OWNER'),
  createRequest
);

// Mengambil list request mutasi
router.get(
  '/',
  authenticateToken,
  authorizeRoles('OWNER', 'DAPUR', 'TOKO', 'ADMIN'),
  getRequests
);

// Menyelesaikan request mutasi (DAPUR, OWNER, dan ADMIN jika ada)
router.put(
  '/:id/complete',
  authenticateToken,
  authorizeRoles('DAPUR', 'OWNER', 'ADMIN'),
  completeRequest
);

export default router;