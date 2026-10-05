"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStock = exports.updateStock = exports.createStock = exports.getStockById = exports.getStocks = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getStocks = async () => {
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
exports.getStocks = getStocks;
const getStockById = async (id) => {
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
exports.getStockById = getStockById;
const createStock = async (data) => {
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
exports.createStock = createStock;
const updateStock = async (id, data) => {
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
exports.updateStock = updateStock;
const deleteStock = async (id) => {
    return await prisma.stock.delete({
        where: {
            id: id,
        },
    });
};
exports.deleteStock = deleteStock;
