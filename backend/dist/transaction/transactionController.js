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
exports.deleteTransaction = exports.createTransaction = exports.getTransactionById = exports.getTransactions = void 0;
const client_1 = require("@prisma/client");
const transactionService = __importStar(require("./transactionService"));
const getTransactions = async (req, res) => {
    try {
        const transactions = await transactionService.getTransactions();
        res.json(transactions);
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal mengambil data transaction',
        });
    }
};
exports.getTransactions = getTransactions;
const getTransactionById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                message: 'ID transaction tidak valid',
            });
            return;
        }
        const transaction = await transactionService.getTransactionById(id);
        if (!transaction) {
            res.status(404).json({
                message: 'Transaction tidak ditemukan',
            });
            return;
        }
        res.json(transaction);
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal mengambil data transaction',
        });
    }
};
exports.getTransactionById = getTransactionById;
const createTransaction = async (req, res) => {
    try {
        const { transactionNumber, type, fromLocationId, toLocationId, notes, items, } = req.body;
        if (!req.user) {
            res.status(401).json({
                message: 'User belum terautentikasi',
            });
            return;
        }
        if (!Object.values(client_1.TransactionType).includes(type)) {
            res.status(400).json({
                message: 'Type transaction tidak valid',
            });
            return;
        }
        if (!Array.isArray(items) || items.length === 0) {
            res.status(400).json({
                message: 'Items transaction wajib diisi',
            });
            return;
        }
        if (req.user.role === 'DAPUR') {
            if (type !== client_1.TransactionType.PRODUKSI &&
                type !== client_1.TransactionType.MUTASI) {
                res.status(403).json({
                    message: 'DAPUR tidak memiliki akses untuk transaction ini',
                });
                return;
            }
        }
        if (req.user.role === 'TOKO') {
            if (type !== client_1.TransactionType.PENGELUARAN) {
                res.status(403).json({
                    message: 'TOKO tidak memiliki akses untuk transaction ini',
                });
                return;
            }
        }
        const transaction = await transactionService.createTransaction({
            transactionNumber,
            type,
            fromLocationId: fromLocationId !== undefined &&
                fromLocationId !== null
                ? Number(fromLocationId)
                : null,
            toLocationId: toLocationId !== undefined &&
                toLocationId !== null
                ? Number(toLocationId)
                : null,
            userId: req.user.id,
            notes: notes ?? null,
            items: items.map((item) => ({
                productId: Number(item.productId),
                quantity: Number(item.quantity),
            })),
        });
        res.status(201).json(transaction);
    }
    catch (error) {
        res.status(400).json({
            message: error instanceof Error
                ? error.message
                : 'Gagal membuat transaction',
        });
    }
};
exports.createTransaction = createTransaction;
const deleteTransaction = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                message: 'ID transaction tidak valid',
            });
            return;
        }
        await transactionService.deleteTransaction(id);
        res.json({
            message: 'Transaction berhasil dihapus',
        });
    }
    catch (error) {
        res.status(400).json({
            message: error instanceof Error
                ? error.message
                : 'Gagal menghapus transaction',
        });
    }
};
exports.deleteTransaction = deleteTransaction;
