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
exports.deleteStock = exports.updateStock = exports.createStock = exports.getStockById = exports.getStocks = void 0;
const stockService = __importStar(require("./stockService"));
const getStocks = async (req, res) => {
    try {
        const stocks = await stockService.getStocks();
        res.json(stocks);
    }
    catch (error) {
        console.error("GET STOCK ERROR:", error);
        res.status(500).json({
            message: "Gagal mengambil data stock",
        });
    }
};
exports.getStocks = getStocks;
const getStockById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                message: "ID stock tidak valid",
            });
            return;
        }
        const stock = await stockService.getStockById(id);
        if (!stock) {
            res.status(404).json({
                message: "Stock tidak ditemukan",
            });
            return;
        }
        res.json(stock);
    }
    catch (error) {
        console.error("GET STOCK BY ID ERROR:", error);
        res.status(500).json({
            message: "Gagal mengambil data stock",
        });
    }
};
exports.getStockById = getStockById;
const createStock = async (req, res) => {
    try {
        const { productId, locationId, quantity, } = req.body;
        const stock = await stockService.createStock({
            productId: Number(productId),
            locationId: Number(locationId),
            quantity: Number(quantity),
        });
        res.status(201).json(stock);
    }
    catch (error) {
        console.error("CREATE STOCK ERROR:", error);
        res.status(500).json({
            message: "Gagal menambahkan stock",
        });
    }
};
exports.createStock = createStock;
const updateStock = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                message: "ID stock tidak valid",
            });
            return;
        }
        const { productId, locationId, quantity, } = req.body;
        const stock = await stockService.updateStock(id, {
            productId: Number(productId),
            locationId: Number(locationId),
            quantity: Number(quantity),
        });
        res.json(stock);
    }
    catch (error) {
        console.error("UPDATE STOCK ERROR:", error);
        res.status(500).json({
            message: "Gagal mengubah stock",
        });
    }
};
exports.updateStock = updateStock;
const deleteStock = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                message: "ID stock tidak valid",
            });
            return;
        }
        await stockService.deleteStock(id);
        res.json({
            message: "Stock berhasil dihapus",
        });
    }
    catch (error) {
        console.error("DELETE STOCK ERROR:", error);
        res.status(500).json({
            message: "Gagal menghapus stock",
        });
    }
};
exports.deleteStock = deleteStock;
