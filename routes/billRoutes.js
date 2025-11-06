import express from "express";
import { createBill } from "../controllers/billController.js";
import { upload } from "../middlewares/upload.js"; // import จาก middleware

const router = express.Router();

router.post(
  "/bills",
  upload.fields([
    { name: "images", maxCount: 8 },
    { name: "signature", maxCount: 1 }
  ]),
  createBill
);

export default router;