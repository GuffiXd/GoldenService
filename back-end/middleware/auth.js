// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const JWT_SECRET = process.env.JWT_SECRET || "golden-soft-2025-secret";

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Нет токена" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Загружаем полного пользователя из БД с ролью
    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "name", "email", "phone", "role"],
    });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Пользователь не найден" 
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false, 
      message: "Недействительный или просроченный токен" 
    });
  }
};