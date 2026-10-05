import { Request, Response } from 'express';
import * as productService from './productService';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getProducts();

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil data product',
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        message: 'ID product tidak valid',
      });
      return;
    }

    const product = await productService.getProductById(id);

    if (!product) {
      res.status(404).json({
        message: 'Product tidak ditemukan',
      });
      return;
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil data product',
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      kodeBarang,
      name,
      categoryId,
      unitId,
      hargaBeli,
      hargaJual,
    } = req.body;

    const product = await productService.createProduct({
      kodeBarang,
      name,
      categoryId: Number(categoryId),
      unitId: Number(unitId),
      hargaBeli:
        hargaBeli !== undefined && hargaBeli !== null
          ? Number(hargaBeli)
          : null,
      hargaJual:
        hargaJual !== undefined && hargaJual !== null
          ? Number(hargaJual)
          : null,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal menambahkan product',
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        message: 'ID product tidak valid',
      });
      return;
    }

    const {
      kodeBarang,
      name,
      categoryId,
      unitId,
      hargaBeli,
      hargaJual,
      isActive,
    } = req.body;

    const product = await productService.updateProduct(id, {
      kodeBarang,
      name,
      categoryId: Number(categoryId),
      unitId: Number(unitId),
      hargaBeli:
        hargaBeli !== undefined && hargaBeli !== null
          ? Number(hargaBeli)
          : null,
      hargaJual:
        hargaJual !== undefined && hargaJual !== null
          ? Number(hargaJual)
          : null,
      isActive,
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengubah product',
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        message: 'ID product tidak valid',
      });
      return;
    }

    await productService.deleteProduct(id);

    res.json({
      message: 'Product berhasil dihapus',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal menghapus product',
    });
  }
};
