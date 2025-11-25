const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminMiddleware = require("../middleware/adminMiddleware");
const AdminController = require("../controllers/AdminController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Настройте storage по необходимости

// Все маршруты защищены авторизацией и проверкой на админа
router.use(auth, adminMiddleware);

// Статистика и пользователи
router.get("/stats", AdminController.getStats);
router.get("/users", AdminController.getUsers);
router.put("/users/:id/role", AdminController.updateUserRole);

// Управление товарами (locks)
router.post("/locks", upload.single("image"), AdminController.createLock);
router.put("/locks/:id", upload.single("image"), AdminController.updateLock);
router.delete("/locks/:id", AdminController.deleteLock);

// Управление заказами
router.get("/orders", AdminController.getAllOrders);
router.put("/orders/:id/status", AdminController.updateOrderStatus);
router.delete("/orders/:id", AdminController.deleteOrder);

module.exports = router;