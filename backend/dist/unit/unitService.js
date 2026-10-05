"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUnit = exports.updateUnit = exports.createUnit = exports.getUnitById = exports.getUnits = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUnits = async () => {
    return await prisma.unit.findMany({
        include: {
            products: true,
        },
        orderBy: {
            id: 'asc',
        },
    });
};
exports.getUnits = getUnits;
const getUnitById = async (id) => {
    return await prisma.unit.findUnique({
        where: {
            id: id,
        },
        include: {
            products: true,
        },
    });
};
exports.getUnitById = getUnitById;
const createUnit = async (data) => {
    return await prisma.unit.create({
        data: {
            name: data.name,
            symbol: data.symbol,
        },
    });
};
exports.createUnit = createUnit;
const updateUnit = async (id, data) => {
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
exports.updateUnit = updateUnit;
const deleteUnit = async (id) => {
    return await prisma.unit.delete({
        where: {
            id: id,
        },
    });
};
exports.deleteUnit = deleteUnit;
