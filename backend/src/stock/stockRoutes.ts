import { Router } from "express";

import {
  getStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
} from "./stockController";

import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware";

const router = Router();

router.get(
  "/",
  authenticateToken,
  authorizeRoles("OWNER", "DAPUR", "TOKO"),
  getStocks
);

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("OWNER", "DAPUR", "TOKO"),
  getStockById
);

router.post(
  "/",
  authenticateToken,
  authorizeRoles("OWNER"),
  createStock
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("OWNER"),
  updateStock
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("OWNER"),
  deleteStock
);

export default router;