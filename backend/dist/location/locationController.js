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
exports.deleteLocation = exports.updateLocation = exports.createLocation = exports.getLocationById = exports.getLocations = void 0;
const locationService = __importStar(require("./locationService"));
const getLocations = async (req, res) => {
    try {
        const locations = await locationService.getLocations();
        res.json(locations);
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal mengambil data location',
        });
    }
};
exports.getLocations = getLocations;
const getLocationById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                message: 'ID location tidak valid',
            });
            return;
        }
        const location = await locationService.getLocationById(id);
        if (!location) {
            res.status(404).json({
                message: 'Location tidak ditemukan',
            });
            return;
        }
        res.json(location);
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal mengambil data location',
        });
    }
};
exports.getLocationById = getLocationById;
const createLocation = async (req, res) => {
    try {
        const { name } = req.body;
        const location = await locationService.createLocation(name);
        res.status(201).json(location);
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal menambahkan location',
        });
    }
};
exports.createLocation = createLocation;
const updateLocation = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                message: 'ID location tidak valid',
            });
            return;
        }
        const { name } = req.body;
        const location = await locationService.updateLocation(id, name);
        res.json(location);
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal mengubah location',
        });
    }
};
exports.updateLocation = updateLocation;
const deleteLocation = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                message: 'ID location tidak valid',
            });
            return;
        }
        await locationService.deleteLocation(id);
        res.json({
            message: 'Location berhasil dihapus',
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal menghapus location',
        });
    }
};
exports.deleteLocation = deleteLocation;
