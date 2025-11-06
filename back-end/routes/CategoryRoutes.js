// back-end/routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/CategoryController");

// Все категории
router.get("/", categoryController.getAllCategories);

// Категория + замки по slug
router.get("/:slug", categoryController.getCategoryBySlug);

module.exports = router;