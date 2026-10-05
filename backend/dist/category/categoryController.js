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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getCategories = void 0;
const categoryService = __importStar(require("./categoryService"));
const getCategories = async (req, res) => {
    try {
        const categories = await categoryService.getCategories();
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal mengambil data category',
        });
    }
};
exports.getCategories = getCategories;
const getCategoryById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                message: 'ID category tidak valid',
            });
            return;
        }
        const category = await categoryService.getCategoryById(id);
        if (!category) {
            res.status(404).json({
                message: 'Category tidak ditemukan',
            });
            return;
        }
        res.json(category);
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal mengambil data category',
        });
    }
};
exports.getCategoryById = getCategoryById;
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await categoryService.createCategory(name);
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal menambahkan category',
        });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                message: 'ID category tidak valid',
            });
            return;
        }
        const { name } = req.body;
        const category = await categoryService.updateCategory(id, name);
        res.json(category);
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal mengubah category',
        });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                message: 'ID category tidak valid',
            });
            return;
        }
        await categoryService.deleteCategory(id);
        res.json({
            message: 'Category berhasil dihapus',
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal menghapus category',
        });
    }
};
exports.deleteCategory = deleteCategory;
