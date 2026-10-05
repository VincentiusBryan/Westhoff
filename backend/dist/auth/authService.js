"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'westhoff-secret-key';
const login = async (username, password) => {
    const user = await prisma.user.findUnique({
        where: {
            username: username,
        },
    });
    if (!user) {
        throw new Error('Username atau password salah');
    }
    const passwordMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!passwordMatch) {
        throw new Error('Username atau password salah');
    }
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        username: user.username,
        role: user.role,
    }, JWT_SECRET, {
        expiresIn: '1d',
    });
    return {
        token: token,
        user: {
            id: user.id,
            username: user.username,
            role: user.role,
        },
    };
};
exports.login = login;
