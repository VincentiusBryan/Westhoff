import { Request, Response } from "express";
import * as stockService from "./stockService";

export const getStocks = async (
  req: Request,
  res: Response
) => {
  try {
    const stocks =
      await stockService.getStocks();

    res.json(stocks);
  } catch (error) {
    console.error(
      "GET STOCK ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Gagal mengambil data stock",
    });
  }
};

export const getStockById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        message:
          "ID stock tidak valid",
      });

      return;
    }

    const stock =
      await stockService.getStockById(id);

    if (!stock) {
      res.status(404).json({
        message:
          "Stock tidak ditemukan",
      });

      return;
    }

    res.json(stock);
  } catch (error) {
    console.error(
      "GET STOCK BY ID ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Gagal mengambil data stock",
    });
  }
};

export const createStock = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      productId,
      locationId,
      quantity,
    } = req.body;

    const stock =
      await stockService.createStock({
        productId: Number(productId),
        locationId: Number(locationId),
        quantity: Number(quantity),
      });

    res.status(201).json(stock);
  } catch (error) {
    console.error(
      "CREATE STOCK ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Gagal menambahkan stock",
    });
  }
};

export const updateStock = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        message:
          "ID stock tidak valid",
      });

      return;
    }

    const {
      productId,
      locationId,
      quantity,
    } = req.body;

    const stock =
      await stockService.updateStock(
        id,
        {
          productId: Number(productId),
          locationId: Number(locationId),
          quantity: Number(quantity),
        }
      );

    res.json(stock);
  } catch (error) {
    console.error(
      "UPDATE STOCK ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Gagal mengubah stock",
    });
  }
};

export const deleteStock = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        message:
          "ID stock tidak valid",
      });

      return;
    }

    await stockService.deleteStock(id);

    res.json({
      message:
        "Stock berhasil dihapus",
    });
  } catch (error) {
    console.error(
      "DELETE STOCK ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Gagal menghapus stock",
    });
  }
};