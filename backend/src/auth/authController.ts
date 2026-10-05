import { Request, Response } from 'express';
import * as authService from './authService';

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({
        message: 'Username dan password wajib diisi',
      });
      return;
    }

    const result = await authService.login(
      username,
      password
    );

    res.json({
      message: 'Login berhasil',
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    res.status(401).json({
      message:
        error instanceof Error
          ? error.message
          : 'Login gagal',
    });
  }
};
