"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeRequest = exports.getRequests = exports.createRequest = void 0;
const mutationService_1 = require("./mutationService");
const createRequest = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        const { notes, items } = req.body;
        const userId = req.user.id;
        const requestNumber = `REQ-${Date.now()}-${userId}`;
        const request = await (0, mutationService_1.createMutationRequest)(requestNumber, userId, notes || null, items);
        return res.status(201).json({
            message: 'Request barang berhasil dibuat',
            data: request
        });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({
            message: error instanceof Error
                ? error.message
                : 'Gagal membuat request barang'
        });
    }
};
exports.createRequest = createRequest;
const getRequests = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        const requests = await (0, mutationService_1.getMutationRequests)(req.user.id, req.user.role);
        return res.status(200).json({
            data: requests
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error instanceof Error
                ? error.message
                : 'Gagal mengambil request barang'
        });
    }
};
exports.getRequests = getRequests;
const completeRequest = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        const requestId = Number(req.params.id);
        if (!Number.isInteger(requestId)) {
            return res.status(400).json({
                message: 'ID request tidak valid'
            });
        }
        const result = await (0, mutationService_1.completeMutationRequest)(requestId, req.user.id);
        return res.status(200).json({
            message: 'Request berhasil diselesaikan dan stock berhasil dipindahkan',
            data: result
        });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({
            message: error instanceof Error
                ? error.message
                : 'Gagal menyelesaikan request'
        });
    }
};
exports.completeRequest = completeRequest;
