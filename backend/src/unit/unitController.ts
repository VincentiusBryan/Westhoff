
import { Request, Response } from 'express';
import * as unitService from './unitService';

export const getUnits = async (req: Request, res: Response) => {
  try {
    const units = await unitService.getUnits();

    res.json(units);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil data unit',
    });
  }
};

export const getUnitById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        message: 'ID unit tidak valid',
      });
      return;
    }

    const unit = await unitService.getUnitById(id);

    if (!unit) {
      res.status(404).json({
        message: 'Unit tidak ditemukan',
      });
      return;
    }

    res.json(unit);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil data unit',
    });
  }
};

export const createUnit = async (req: Request, res: Response) => {
  try {
    const { name, symbol } = req.body;

    const unit = await unitService.createUnit({
      name,
      symbol,
    });

    res.status(201).json(unit);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal menambahkan unit',
    });
  }
};

export const updateUnit = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        message: 'ID unit tidak valid',
      });
      return;
    }

    const { name, symbol } = req.body;

    const unit = await unitService.updateUnit(id, {
      name,
      symbol,
    });

    res.json(unit);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengubah unit',
    });
  }
};

export const deleteUnit = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        message: 'ID unit tidak valid',
      });
      return;
    }

    await unitService.deleteUnit(id);

    res.json({
      message: 'Unit berhasil dihapus',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal menghapus unit',
    });
  }
};
