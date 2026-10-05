"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const userService = __importStar(require("./userService"));
const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal mengambil data user',
        });
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                message: 'ID user tidak valid',
            });
            return;
        }
        const user = await userService.getUserById(id);
        if (!user) {
            res.status(404).json({
                message: 'User tidak ditemukan',
            });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal mengambil data user',
        });
    }
};
exports.getUserById = getUserById;
const createUser = async (req, res) => {
    try {
        const { username, password, role, } = req.body;
        if (!username || !password || !role) {
            res.status(400).json({
                message: 'Username, password, dan role wajib diisi',
            });
            return;
        }
        if (!Object.values(client_1.UserRole).includes(role)) {
            res.status(400).json({
                message: 'Role user tidak valid',
            });
            return;
        }
        const user = await userService.createUser({
            username,
            password,
            role,
        });
        res.status(201).json({
            message: 'User berhasil dibuat',
            user,
        });
    }
    catch (error) {
        if (error instanceof Error &&
            error.message.includes('Unique constraint')) {
            res.status(400).json({
                message: 'Username sudah digunakan',
            });
            return;
        }
        res.status(400).json({
            message: error instanceof Error
                ? error.message
                : 'Gagal membuat user',
        });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                message: 'ID user tidak valid',
            });
            return;
        }
        const { username, password, role, } = req.body;
        if (!username || !role) {
            res.status(400).json({
                message: 'Username dan role wajib diisi',
            });
            return;
        }
        if (!Object.values(client_1.UserRole).includes(role)) {
            res.status(400).json({
                message: 'Role user tidak valid',
            });
            return;
        }
        const user = await userService.updateUser(id, {
            username,
            password,
            role,
        });
        res.json({
            message: 'User berhasil diubah',
            user,
        });
    }
    catch (error) {
        if (error instanceof Error &&
            error.message.includes('Unique constraint')) {
            res.status(400).json({
                message: 'Username sudah digunakan',
            });
            return;
        }
        res.status(400).json({
            message: error instanceof Error
                ? error.message
                : 'Gagal mengubah user',
        });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                message: 'ID user tidak valid',
            });
            return;
        }
        if (req.user?.id === id) {
            res.status(400).json({
                message: 'User yang sedang login tidak dapat dihapus',
            });
            return;
        }
        await userService.deleteUser(id);
        res.json({
            message: 'User berhasil dihapus',
        });
    }
    catch (error) {
        res.status(400).json({
            message: error instanceof Error
                ? error.message
                : 'Gagal menghapus user',
        });
    }
};
exports.deleteUser = deleteUser;
