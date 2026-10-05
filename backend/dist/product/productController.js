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
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const productService = __importStar(require("./productService"));
const getProducts = async (req, res) => {
    try {
        const products = await productService.getProducts();
        res.json(products);
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal mengambil data product',
        });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                message: 'ID product tidak valid',
            });
            return;
        }
        const product = await productService.getProductById(id);
        if (!product) {
            res.status(404).json({
                message: 'Product tidak ditemukan',
            });
            return;
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal mengambil data product',
        });
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    try {
        const { kodeBarang, name, categoryId, unitId, hargaBeli, hargaJual, } = req.body;
        const product = await productService.createProduct({
            kodeBarang,
            name,
            categoryId: Number(categoryId),
            unitId: Number(unitId),
            hargaBeli: hargaBeli !== undefined && hargaBeli !== null
                ? Number(hargaBeli)
                : null,
            hargaJual: hargaJual !== undefined && hargaJual !== null
                ? Number(hargaJual)
                : null,
        });
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal menambahkan product',
        });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                message: 'ID product tidak valid',
            });
            return;
        }
        const { kodeBarang, name, categoryId, unitId, hargaBeli, hargaJual, isActive, } = req.body;
        const product = await productService.updateProduct(id, {
            kodeBarang,
            name,
            categoryId: Number(categoryId),
            unitId: Number(unitId),
            hargaBeli: hargaBeli !== undefined && hargaBeli !== null
                ? Number(hargaBeli)
                : null,
            hargaJual: hargaJual !== undefined && hargaJual !== null
                ? Number(hargaJual)
                : null,
            isActive,
        });
        res.json(product);
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal mengubah product',
        });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                message: 'ID product tidak valid',
            });
            return;
        }
        await productService.deleteProduct(id);
        res.json({
            message: 'Product berhasil dihapus',
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal menghapus product',
        });
    }
};
exports.deleteProduct = deleteProduct;
