import db from "../config/db.js";

export const createBill = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const {
      user_id,
      receive_code,
      name,
      surname,
      license_plate,
      warehouse_name,
      remark,
    } = req.body;

    // แก้ไขตรงนี้: req.files เป็น object, ไม่ใช่ array
    const signatureFile = req.files?.signature ? req.files.signature[0] : null;
    const imageFiles = req.files?.images || [];

    console.log("Signature file:", signatureFile);
    console.log("Image files:", imageFiles);

    // 1. บันทึกข้อมูลในตาราง bills (เฉพาะลายเซ็น)
    const [billResult] = await connection.query(
      `INSERT INTO bills (user_id, receive_code, name, surname, license_plate, warehouse_name, sign, remark) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        receive_code,
        name,
        surname,
        license_plate,
        warehouse_name,
        signatureFile ? signatureFile.path : null, // บันทึก path ลายเซ็น
        remark,
      ]
    );

    const billId = billResult.insertId;

    // 2. บันทึกรูปภาพในตาราง bill_images
    if (imageFiles.length > 0) {
      const imageValues = imageFiles.map(file => [billId, file.path]);
      
      await connection.query(
        `INSERT INTO bill_images (bill_id, image_url) VALUES ?`,
        [imageValues]
      );
    }

    await connection.commit();
    
    res.status(201).json({ 
      message: "บันทึกสำเร็จ", 
      id: billId,
      imageCount: imageFiles.length,
      hasSignature: !!signatureFile
    });

  } catch (err) {
    if (connection) await connection.rollback();
    console.error("Error creating bill:", err);
    res.status(500).json({ 
      message: "เกิดข้อผิดพลาดในการบันทึก", 
      error: err.message 
    });
  } finally {
    if (connection) connection.release();
  }
};