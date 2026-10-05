"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const productRoutes_1 = __importDefault(require("./product/productRoutes"));
const stockRoutes_1 = __importDefault(require("./stock/stockRoutes"));
const categoryRoutes_1 = __importDefault(require("./category/categoryRoutes"));
const unitRoutes_1 = __importDefault(require("./unit/unitRoutes"));
const locationRoutes_1 = __importDefault(require("./location/locationRoutes"));
const transactionRoutes_1 = __importDefault(require("./transaction/transactionRoutes"));
const authRoutes_1 = __importDefault(require("./auth/authRoutes"));
const userRoutes_1 = __importDefault(require("./user/userRoutes"));
const mutationRoutes_1 = __importDefault(require("./mutation/mutationRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json({
        message: "Westhoff Backend API berjalan",
    });
});
app.use("/api/products", productRoutes_1.default);
app.use("/api/stocks", stockRoutes_1.default);
app.use("/api/categories", categoryRoutes_1.default);
app.use("/api/units", unitRoutes_1.default);
app.use("/api/locations", locationRoutes_1.default);
app.use("/api/transactions", transactionRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use('/api/mutation', mutationRoutes_1.default);
const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server berjalan di http://0.0.0.0:${PORT}`);
});
