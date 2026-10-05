
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProducts = async () => {
  return await prisma.product.findMany({
    include: {
      category: true,
      unit: true,
    },
    orderBy: {
      id: 'asc',
    },
  });
};

export const getProductById = async (id: number) => {
  return await prisma.product.findUnique({
    where: {
      id: id,
    },
    include: {
      category: true,
      unit: true,
    },
  });
};

export const createProduct = async (data: {
  kodeBarang: string;
  name: string;
  categoryId: number;
  unitId: number;
  hargaBeli?: number | null;
  hargaJual?: number | null;
}) => {
  return await prisma.product.create({
    data: {
      kodeBarang: data.kodeBarang,
      name: data.name,
      categoryId: data.categoryId,
      unitId: data.unitId,
      hargaBeli: data.hargaBeli ?? null,
      hargaJual: data.hargaJual ?? null,
    },
    include: {
      category: true,
      unit: true,
    },
  });
};

export const updateProduct = async (
  id: number,
  data: {
    kodeBarang: string;
    name: string;
    categoryId: number;
    unitId: number;
    hargaBeli?: number | null;
    hargaJual?: number | null;
    isActive: boolean;
  }
) => {
  return await prisma.product.update({
    where: {
      id: id,
    },
    data: {
      kodeBarang: data.kodeBarang,
      name: data.name,
      categoryId: data.categoryId,
      unitId: data.unitId,
      hargaBeli: data.hargaBeli ?? null,
      hargaJual: data.hargaJual ?? null,
      isActive: data.isActive,
    },
    include: {
      category: true,
      unit: true,
    },
  });
};

export const deleteProduct = async (id: number) => {
  return await prisma.product.delete({
    where: {
      id: id,
    },
  });
};
