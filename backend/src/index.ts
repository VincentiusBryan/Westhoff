import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./product/productRoutes";
import stockRoutes from "./stock/stockRoutes";
import categoryRoutes from "./category/categoryRoutes";
import unitRoutes from "./unit/unitRoutes";
import locationRoutes from "./location/locationRoutes";
import transactionRoutes from "./transaction/transactionRoutes";
import authRoutes from "./auth/authRoutes";
import userRoutes from "./user/userRoutes";
import mutationRoutes from './mutation/mutationRoutes';


dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message:
      "Westhoff Backend API berjalan",
  });
});

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/stocks",
  stockRoutes
);

app.use(
  "/api/categories",
  categoryRoutes
);

app.use(
  "/api/units",
  unitRoutes
);

app.use(
  "/api/locations",
  locationRoutes
);

app.use(
  "/api/transactions",
  transactionRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use('/api/mutation', mutationRoutes);

const PORT = 5000;

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `Server berjalan di http://0.0.0.0:${PORT}`
    );
  }
);