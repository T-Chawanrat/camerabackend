import express from "express";
import { createBill, upload } from "../controllers/billController.js";

const router = express.Router();

router.post("/bills", upload.array("images", 8), createBill);

export default router;
