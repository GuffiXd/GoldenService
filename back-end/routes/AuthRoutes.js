// routes/auth.js
const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/AuthController");
const authMiddleware = require("../middleware/auth");

router.post("/register", authCtrl.register);
router.post("/login", authCtrl.login);
router.get("/me", authMiddleware, authCtrl.me);

router.put("/update-profile", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Не авторизован" });
  
      const { name, email, phone } = req.body;
  
      const updatedUser = await User.update(
        { name, email, phone },
        { where: { id: req.user.id }, returning: true }
      );
  
      res.json({
        success: true,
        user: updatedUser[1][0], // Sequelize возвращает [count, rows]
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  });

module.exports = router;