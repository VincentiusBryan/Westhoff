"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
const getUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            username: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            id: 'asc',
        },
    });
};
exports.getUsers = getUsers;
const getUserById = async (id) => {
    return await prisma.user.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            username: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};
exports.getUserById = getUserById;
const createUser = async (data) => {
    const passwordHash = await bcryptjs_1.default.hash(data.password, 10);
    return await prisma.user.create({
        data: {
            username: data.username,
            password: passwordHash,
            role: data.role,
        },
        select: {
            id: true,
            username: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};
exports.createUser = createUser;
const updateUser = async (id, data) => {
    const updateData = {
        username: data.username,
        role: data.role,
    };
    if (data.password) {
        updateData.password = await bcryptjs_1.default.hash(data.password, 10);
    }
    return await prisma.user.update({
        where: {
            id: id,
        },
        data: updateData,
        select: {
            id: true,
            username: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};
exports.updateUser = updateUser;
const deleteUser = async (id) => {
    return await prisma.user.delete({
        where: {
            id: id,
        },
    });
};
exports.deleteUser = deleteUser;
