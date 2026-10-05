
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUnits = async () => {
  return await prisma.unit.findMany({
    include: {
      products: true,
    },
    orderBy: {
      id: 'asc',
    },
  });
};

export const getUnitById = async (id: number) => {
  return await prisma.unit.findUnique({
    where: {
      id: id,
    },
    include: {
      products: true,
    },
  });
};

export const createUnit = async (data: {
  name: string;
  symbol: string;
}) => {
  return await prisma.unit.create({
    data: {
      name: data.name,
      symbol: data.symbol,
    },
  });
};

export const updateUnit = async (
  id: number,
  data: {
    name: string;
    symbol: string;
  }
) => {
  return await prisma.unit.update({
    where: {
      id: id,
    },
    data: {
      name: data.name,
      symbol: data.symbol,
    },
  });
};

export const deleteUnit = async (id: number) => {
  return await prisma.unit.delete({
    where: {
      id: id,
    },
  });
};
