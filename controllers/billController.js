import db from "../config/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// ตั้งค่า multer สำหรับเก็บรูปในโฟลเดอร์ uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });

// Controller สำหรับเพิ่ม bill ใหม่
export const createBill = async (req, res) => {
  try {
    const {
      user_id,
      receive_code,
      name,
      surname,
      license_plate,
      warehouse_name,
      remark,
    } = req.body;
    const imagePaths = req.files?.map((file) => file.path).join(",") || "";

    const [result] = await db.query(
      `INSERT INTO bills (user_id, receive_code, name, surname, license_plate, warehouse_name, sign, remark) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        receive_code,
        name,
        surname,
        license_plate,
        warehouse_name,
        imagePaths,
        remark,
      ]
    );

    res.status(201).json({ message: "บันทึกสำเร็จ", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
  }
};
