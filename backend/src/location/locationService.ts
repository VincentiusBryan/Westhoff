import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getLocations = async () => {
  return await prisma.location.findMany({
    include: {
      stocks: true,
    },
    orderBy: {
      id: 'asc',
    },
  });
};

export const getLocationById = async (id: number) => {
  return await prisma.location.findUnique({
    where: {
      id: id,
    },
    include: {
      stocks: true,
    },
  });
};

export const createLocation = async (name: string) => {
  return await prisma.location.create({
    data: {
      name: name,
    },
  });
};

export const updateLocation = async (id: number, name: string) => {
  return await prisma.location.update({
    where: {
      id: id,
    },
    data: {
      name: name,
    },
  });
};

export const deleteLocation = async (id: number) => {
  return await prisma.location.delete({
    where: {
      id: id,
    },
  });
};
