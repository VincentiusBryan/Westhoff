"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getCategories = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getCategories = async () => {
    return await prisma.category.findMany({
        include: {
            products: true,
        },
        orderBy: {
            id: 'asc',
        },
    });
};
exports.getCategories = getCategories;
const getCategoryById = async (id) => {
    return await prisma.category.findUnique({
        where: {
            id: id,
        },
        include: {
            products: true,
        },
    });
};
exports.getCategoryById = getCategoryById;
const createCategory = async (name) => {
    return await prisma.category.create({
        data: {
            name: name,
        },
    });
};
exports.createCategory = createCategory;
const updateCategory = async (id, name) => {
    return await prisma.category.update({
        where: {
            id: id,
        },
        data: {
            name: name,
        },
    });
};
exports.updateCategory = updateCategory;
const deleteCategory = async (id) => {
    return await prisma.category.delete({
        where: {
            id: id,
        },
    });
};
exports.deleteCategory = deleteCategory;
