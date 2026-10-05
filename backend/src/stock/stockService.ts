import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getStocks = async () => {
  return await prisma.stock.findMany({
    include: {
      product: {
        include: {
          category: true,
          unit: true,
        },
      },
      location: true,
    },
    orderBy: {
      id: "asc",
    },
  });
};

export const getStockById = async (
  id: number
) => {
  return await prisma.stock.findUnique({
    where: {
      id: id,
    },
    include: {
      product: {
        include: {
          category: true,
          unit: true,
        },
      },
      location: true,
    },
  });
};

export const createStock = async (
  data: {
    productId: number;
    locationId: number;
    quantity: number;
  }
) => {
  return await prisma.stock.create({
    data: {
      productId: data.productId,
      locationId: data.locationId,
      quantity: data.quantity,
    },
    include: {
      product: {
        include: {
          category: true,
          unit: true,
        },
      },
      location: true,
    },
  });
};

export const updateStock = async (
  id: number,
  data: {
    productId: number;
    locationId: number;
    quantity: number;
  }
) => {
  return await prisma.stock.update({
    where: {
      id: id,
    },
    data: {
      productId: data.productId,
      locationId: data.locationId,
      quantity: data.quantity,
    },
    include: {
      product: {
        include: {
          category: true,
          unit: true,
        },
      },
      location: true,
    },
  });
};

export const deleteStock = async (
  id: number
) => {
  return await prisma.stock.delete({
    where: {
      id: id,
    },
  });
};