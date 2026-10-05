"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getProducts = async () => {
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
exports.getProducts = getProducts;
const getProductById = async (id) => {
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
exports.getProductById = getProductById;
const createProduct = async (data) => {
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
exports.createProduct = createProduct;
const updateProduct = async (id, data) => {
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
exports.updateProduct = updateProduct;
const deleteProduct = async (id) => {
    return await prisma.product.delete({
        where: {
            id: id,
        },
    });
};
exports.deleteProduct = deleteProduct;
