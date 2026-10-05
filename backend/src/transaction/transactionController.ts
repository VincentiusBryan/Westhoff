import { Response } from 'express';
import { TransactionType } from '@prisma/client';
import * as transactionService from './transactionService';
import { AuthRequest } from '../middleware/authMiddleware';

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await transactionService.getTransactions();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil data transaction',
    });
  }
};

export const getTransactionById = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        message: 'ID transaction tidak valid',
      });
      return;
    }

    const transaction = await transactionService.getTransactionById(id);

    if (!transaction) {
      res.status(404).json({
        message: 'Transaction tidak ditemukan',
      });
      return;
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil data transaction',
    });
  }
};

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const {
      transactionNumber,
      type,
      fromLocationId,
      toLocationId,
      notes,
      items,
    } = req.body;

    if (!req.user) {
      res.status(401).json({
        message: 'User belum terautentikasi',
      });
      return;
    }

    if (!Object.values(TransactionType).includes(type)) {
      res.status(400).json({
        message: 'Type transaction tidak valid',
      });
      return;
    }

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        message: 'Items transaction wajib diisi',
      });
      return;
    }

    if (req.user.role === 'DAPUR') {
      if (
        type !== TransactionType.PRODUKSI &&
        type !== TransactionType.MUTASI
      ) {
        res.status(403).json({
          message: 'DAPUR tidak memiliki akses untuk transaction ini',
        });
        return;
      }
    }

    if (req.user.role === 'TOKO') {
      if (type !== TransactionType.PENGELUARAN) {
        res.status(403).json({
          message: 'TOKO tidak memiliki akses untuk transaction ini',
        });
        return;
      }
    }

    const parsedFromLocationId =
      req.user.role === 'TOKO' || fromLocationId == null
        ? null
        : Number(fromLocationId);

    const parsedToLocationId =
      req.user.role === 'TOKO' || toLocationId == null
        ? null
        : Number(toLocationId);

    const transaction = await transactionService.createTransaction({
      transactionNumber,
      type,
      fromLocationId: parsedFromLocationId,
      toLocationId: parsedToLocationId,
      userId: req.user.id,
      notes: notes ?? null,
      items: items.map(
        (item: { productId: number; quantity: number }) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
        })
      ),
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : 'Gagal membuat transaction',
    });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        message: 'ID transaction tidak valid',
      });
      return;
    }

    await transactionService.deleteTransaction(id);

    res.json({
      message: 'Transaction berhasil dihapus',
    });
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : 'Gagal menghapus transaction',
    });
  }
};