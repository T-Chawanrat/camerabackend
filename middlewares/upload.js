import multer from "multer";
import path from "path";

// กำหนดตำแหน่งเก็บไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // ต้องมีโฟลเดอร์นี้อยู่จริง
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์ใหม่
  },
});

const upload = multer({ storage });
export default upload;
