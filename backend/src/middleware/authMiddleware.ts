import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      message: 'Token tidak ditemukan',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({
      message: 'Token tidak valid',
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'Westhoff123'
    ) as {
      id: number;
      username: string;
      role: string;
    };

    req.user = decoded;
    console.log('JWT DECODED:', decoded);

    next();
  } catch (error) {
    res.status(401).json({
      message: 'Token tidak valid atau sudah expired',
    });
  }
};

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      res.status(401).json({
        message: 'User belum terautentikasi',
      });
      return;
    }

    // Normalisasi ke UPPERCASE agar pengecekan case-insensitive (mencegah bug mismatch 'dapur' vs 'DAPUR')
    const userRole = req.user.role?.toUpperCase();
    const normalizedAllowedRoles = allowedRoles.map((role) => role.toUpperCase());

    if (!normalizedAllowedRoles.includes(userRole)) {
      res.status(403).json({
        message: 'Anda tidak memiliki akses',
      });
      return;
    }

    next();
  };
};