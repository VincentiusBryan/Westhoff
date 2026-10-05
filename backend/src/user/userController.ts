
import { Response } from 'express';
import { UserRole } from '@prisma/client';
import * as userService from './userService';
import { AuthRequest } from '../middleware/authMiddleware';

export const getUsers = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const users = await userService.getUsers();

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil data user',
    });
  }
};

export const getUserById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        message: 'ID user tidak valid',
      });
      return;
    }

    const user = await userService.getUserById(id);

    if (!user) {
      res.status(404).json({
        message: 'User tidak ditemukan',
      });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil data user',
    });
  }
};

export const createUser = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      username,
      password,
      role,
    } = req.body;

    if (!username || !password || !role) {
      res.status(400).json({
        message: 'Username, password, dan role wajib diisi',
      });
      return;
    }

    if (!Object.values(UserRole).includes(role)) {
      res.status(400).json({
        message: 'Role user tidak valid',
      });
      return;
    }

    const user = await userService.createUser({
      username,
      password,
      role,
    });

    res.status(201).json({
      message: 'User berhasil dibuat',
      user,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('Unique constraint')
    ) {
      res.status(400).json({
        message: 'Username sudah digunakan',
      });
      return;
    }

    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : 'Gagal membuat user',
    });
  }
};

export const updateUser = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        message: 'ID user tidak valid',
      });
      return;
    }

    const {
      username,
      password,
      role,
    } = req.body;

    if (!username || !role) {
      res.status(400).json({
        message: 'Username dan role wajib diisi',
      });
      return;
    }

    if (!Object.values(UserRole).includes(role)) {
      res.status(400).json({
        message: 'Role user tidak valid',
      });
      return;
    }

    const user = await userService.updateUser(id, {
      username,
      password,
      role,
    });

    res.json({
      message: 'User berhasil diubah',
      user,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('Unique constraint')
    ) {
      res.status(400).json({
        message: 'Username sudah digunakan',
      });
      return;
    }

    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : 'Gagal mengubah user',
    });
  }
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        message: 'ID user tidak valid',
      });
      return;
    }

    if (req.user?.id === id) {
      res.status(400).json({
        message: 'User yang sedang login tidak dapat dihapus',
      });
      return;
    }

    await userService.deleteUser(id);

    res.json({
      message: 'User berhasil dihapus',
    });
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : 'Gagal menghapus user',
    });
  }
};
