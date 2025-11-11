import express from "express";
import {
  createBill,
  getBill,
  getBills,
} from "../controllers/billController.js";
import { upload } from "../middlewares/upload.js"; // import จาก middleware

const router = express.Router();

router.post(
  "/bills",
  upload.fields([
    { name: "images", maxCount: 8 },
    { name: "signature", maxCount: 1 },
  ]),
  createBill
);

router.get("/bills/:id", getBill);
router.get("/bills", getBills);

export default router;
