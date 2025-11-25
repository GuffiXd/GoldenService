const express = require("express");
const router = express.Router();

// Импорт контроллера
const { 
  createOrder, 
  getMyOrders, 
  getUserOrders 
} = require("../controllers/OrderController");

// Импорт middleware авторизации
const authMiddleware = require("../middleware/auth"); 

// --- Маршруты ---

// 1. Создание заказа (Требует авторизации)
router.post("/", authMiddleware, createOrder);

// 2. Получение заказов текущего пользователя (Требует авторизации)
router.get("/my", authMiddleware, getMyOrders);

// 3. Получение заказов по ID пользователя (Можно добавить authMiddleware, если нужно ограничить доступ)
router.get("/user/:userId", authMiddleware, getUserOrders); // Добавил auth для безопасности

module.exports = router;