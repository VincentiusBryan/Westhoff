
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCategories = async () => {
  return await prisma.category.findMany({
    include: {
      products: true,
    },
    orderBy: {
      id: 'asc',
    },
  });
};

export const getCategoryById = async (id: number) => {
  return await prisma.category.findUnique({
    where: {
      id: id,
    },
    include: {
      products: true,
    },
  });
};

export const createCategory = async (name: string) => {
  return await prisma.category.create({
    data: {
      name: name,
    },
  });
};

export const updateCategory = async (id: number, name: string) => {
  return await prisma.category.update({
    where: {
      id: id,
    },
    data: {
      name: name,
    },
  });
};

export const deleteCategory = async (id: number) => {
  return await prisma.category.delete({
    where: {
      id: id,
    },
  });
};
