
import { Router } from 'express';
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  deleteTransaction,
} from './transactionController';
import {
  authenticateToken,
  authorizeRoles,
} from '../middleware/authMiddleware';

const router = Router();

router.get(
  '/',
  authenticateToken,
  authorizeRoles('OWNER', 'DAPUR', 'TOKO'),
  getTransactions
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('OWNER', 'DAPUR', 'TOKO'),
  getTransactionById
);

router.post(
  '/',
  authenticateToken,
  authorizeRoles('OWNER', 'DAPUR', 'TOKO'),
  createTransaction
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('OWNER'),
  deleteTransaction
);

export default router;
