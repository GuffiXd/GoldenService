// back-end/routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/CategoryController");

// ВАЖНО: сначала СЛОЖНЫЕ маршруты, потом динамические

router.get("/with-count", categoryController.getCategoriesWithCount); // ← НАВЕРХ
router.get("/", categoryController.getAllCategories);
router.get("/:slug", categoryController.getCategoryBySlug);

module.exports = router;
