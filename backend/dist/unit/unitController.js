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
exports.deleteUnit = exports.updateUnit = exports.createUnit = exports.getUnitById = exports.getUnits = void 0;
const unitService = __importStar(require("./unitService"));
const getUnits = async (req, res) => {
    try {
        const units = await unitService.getUnits();
        res.json(units);
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal mengambil data unit',
        });
    }
};
exports.getUnits = getUnits;
const getUnitById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                message: 'ID unit tidak valid',
            });
            return;
        }
        const unit = await unitService.getUnitById(id);
        if (!unit) {
            res.status(404).json({
                message: 'Unit tidak ditemukan',
            });
            return;
        }
        res.json(unit);
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal mengambil data unit',
        });
    }
};
exports.getUnitById = getUnitById;
const createUnit = async (req, res) => {
    try {
        const { name, symbol } = req.body;
        const unit = await unitService.createUnit({
            name,
            symbol,
        });
        res.status(201).json(unit);
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal menambahkan unit',
        });
    }
};
exports.createUnit = createUnit;
const updateUnit = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                message: 'ID unit tidak valid',
            });
            return;
        }
        const { name, symbol } = req.body;
        const unit = await unitService.updateUnit(id, {
            name,
            symbol,
        });
        res.json(unit);
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal mengubah unit',
        });
    }
};
exports.updateUnit = updateUnit;
const deleteUnit = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                message: 'ID unit tidak valid',
            });
            return;
        }
        await unitService.deleteUnit(id);
        res.json({
            message: 'Unit berhasil dihapus',
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal menghapus unit',
        });
    }
};
exports.deleteUnit = deleteUnit;
