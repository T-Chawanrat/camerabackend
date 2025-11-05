import express from "express";
import cors from "cors";
import billRoutes from "./routes/billRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/", billRoutes);

const PORT = 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
