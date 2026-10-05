import { Request, Response } from 'express';
import * as locationService from './locationService';

export const getLocations = async (req: Request, res: Response) => {
  try {
    const locations = await locationService.getLocations();

    res.json(locations);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil data location',
    });
  }
};

export const getLocationById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        message: 'ID location tidak valid',
      });
      return;
    }

    const location = await locationService.getLocationById(id);

    if (!location) {
      res.status(404).json({
        message: 'Location tidak ditemukan',
      });
      return;
    }

    res.json(location);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil data location',
    });
  }
};

export const createLocation = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const location = await locationService.createLocation(name);

    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal menambahkan location',
    });
  }
};

export const updateLocation = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        message: 'ID location tidak valid',
      });
      return;
    }

    const { name } = req.body;

    const location = await locationService.updateLocation(id, name);

    res.json(location);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengubah location',
    });
  }
};

export const deleteLocation = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        message: 'ID location tidak valid',
      });
      return;
    }

    await locationService.deleteLocation(id);

    res.json({
      message: 'Location berhasil dihapus',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal menghapus location',
    });
  }
};
