"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({
            message: 'Token tidak ditemukan',
        });
        return;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({
            message: 'Token tidak valid',
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'Westhoff123');
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({
            message: 'Token tidak valid atau sudah expired',
        });
    }
};
exports.authenticateToken = authenticateToken;
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                message: 'User belum terautentikasi',
            });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                message: 'Anda tidak memiliki akses',
            });
            return;
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
