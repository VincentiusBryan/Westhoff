
import { Request, Response } from 'express';
import * as categoryService from './categoryService';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getCategories();

    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil data category',
    });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        message: 'ID category tidak valid',
      });
      return;
    }

    const category = await categoryService.getCategoryById(id);

    if (!category) {
      res.status(404).json({
        message: 'Category tidak ditemukan',
      });
      return;
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil data category',
    });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const category = await categoryService.createCategory(name);

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal menambahkan category',
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        message: 'ID category tidak valid',
      });
      return;
    }

    const { name } = req.body;

    const category = await categoryService.updateCategory(id, name);

    res.json(category);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengubah category',
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        message: 'ID category tidak valid',
      });
      return;
    }

    await categoryService.deleteCategory(id);

    res.json({
      message: 'Category berhasil dihapus',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal menghapus category',
    });
  }
};
