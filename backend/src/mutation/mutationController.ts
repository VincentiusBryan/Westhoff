import { Response } from 'express';
import {
  createMutationRequest,
  getMutationRequests,
  completeMutationRequest
} from './mutationService';
import { AuthRequest } from '../middleware/authMiddleware';

export const createRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    const { notes, items } = req.body;

    const userId = req.user.id;

    const requestNumber = `REQ-${Date.now()}-${userId}`;

    const request = await createMutationRequest(
      requestNumber,
      userId,
      notes || null,
      items
    );

    return res.status(201).json({
      message: 'Request barang berhasil dibuat',
      data: request
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : 'Gagal membuat request barang'
    });
  }
};

export const getRequests = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    const requests = await getMutationRequests(
      req.user.id,
      req.user.role
    );

    return res.status(200).json({
      data: requests
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : 'Gagal mengambil request barang'
    });
  }
};

export const completeRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    const requestId = Number(req.params.id);

    if (!Number.isInteger(requestId)) {
      return res.status(400).json({
        message: 'ID request tidak valid'
      });
    }

    const result = await completeMutationRequest(
      requestId,
      req.user.id
    );

    return res.status(200).json({
      message: 'Request berhasil diselesaikan dan stock berhasil dipindahkan',
      data: result
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : 'Gagal menyelesaikan request'
    });
  }
};