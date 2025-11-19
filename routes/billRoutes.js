import express from "express";
import {
  createBill,
  getBill,
  getBills,
  downloadImage,
} from "../controllers/billController.js";
import { login } from "../controllers/authController.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post(
  "/bills",
  upload.fields([
    { name: "images", maxCount: 8 },
    { name: "signature", maxCount: 1 },
  ]),
  createBill
);

router.post("/login", login);
router.get("/bills/:id", getBill);
router.get("/bills", getBills);
router.get("/bills/:id/downloadImage", downloadImage);

export default router;
