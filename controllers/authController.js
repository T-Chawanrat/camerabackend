// controllers/authController.js
import db from "../config/db.js";
// import bcrypt from "bcrypt";      // ❌ ปิด bcrypt ชั่วคราว
// import jwt from "jsonwebtoken";   // ❌ ปิด JWT ชั่วคราว

export const login = async (req, res) => {
  let connection;
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "กรุณากรอก username และ password" });
    }

    connection = await db.getConnection();

    const [rows] = await connection.query(
      `
SELECT 
  user_id,
  username,
  password,
  is_actived,
  is_deleted,
  first_name,
  last_name,
  license_plate,
  warehouse_name
FROM um_users
WHERE username = ?
LIMIT 1
  `,
      [username]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบบัญชีผู้ใช้นี้" });
    }

    const user = rows[0];

    // validate user status (จะคงไว้ก็ได้ เพื่อกัน user ที่ถูกปิด)
    // if (user.is_actived !== "Y" || user.is_deleted !== "N") {
    //   return res.status(403).json({ message: "บัญชีถูกปิดใช้งาน" });
    // }

    // ------------------------------
    // ❌ ปิดส่วน bcrypt + hash ทิ้งทั้งหมด
    /*
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }
    */
    // ------------------------------

    // ✅ ใช้ plain password เทียบตรง ๆ ชั่วคราว
    if (password !== user.password) {
      return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }

    // ------------------------------
    // ❌ ปิดการ generate JWT token ชั่วคราว
    /*
    const token = jwt.sign(
      {
        user_id: user.user_id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "1d" }
    );

    return res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
      },
    });
    */
    // ------------------------------

    // ✅ เวอร์ชันง่ายสุดสำหรับ demo: คืนแค่ message + user
    return res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      user: {
        user_id: user.user_id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        license_plate: user.license_plate,
        warehouse_name: user.warehouse_name,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
  } finally {
    if (connection) connection.release();
  }
};
