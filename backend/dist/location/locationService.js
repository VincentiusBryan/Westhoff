"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLocation = exports.updateLocation = exports.createLocation = exports.getLocationById = exports.getLocations = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getLocations = async () => {
    return await prisma.location.findMany({
        include: {
            stocks: true,
        },
        orderBy: {
            id: 'asc',
        },
    });
};
exports.getLocations = getLocations;
const getLocationById = async (id) => {
    return await prisma.location.findUnique({
        where: {
            id: id,
        },
        include: {
            stocks: true,
        },
    });
};
exports.getLocationById = getLocationById;
const createLocation = async (name) => {
    return await prisma.location.create({
        data: {
            name: name,
        },
    });
};
exports.createLocation = createLocation;
const updateLocation = async (id, name) => {
    return await prisma.location.update({
        where: {
            id: id,
        },
        data: {
            name: name,
        },
    });
};
exports.updateLocation = updateLocation;
const deleteLocation = async (id) => {
    return await prisma.location.delete({
        where: {
            id: id,
        },
    });
};
exports.deleteLocation = deleteLocation;
