// back-end/routes/LockRoutes.js
const express = require("express");
const router = express.Router();
const lockController = require("../controllers/lockController");

// Все роуты:
router.get("/", lockController.getAllLocks);                    // каталог
router.get("/popular", lockController.getPopularLocks);        // ← ЭТОТ РОУТ!
router.get("/slider", lockController.getSliderLocks);          // слайдер
router.get("/search", lockController.searchLocks);             // поиск
router.get("/:id", lockController.getLockById);                // страница товара

module.exports = router;