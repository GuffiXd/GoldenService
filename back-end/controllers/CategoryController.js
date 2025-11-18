// back-end/controllers/CategoryController.js
const sequelize = require("../config/db");
const Category = require("../models/CategoryModel");
const Lock = require("../models/LockModel");

const categoryController = {
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.findAll({ order: [["name", "ASC"]] });
      res.json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Ошибка загрузки категорий" });
    }
  },

  // САМЫЙ НАДЁЖНЫЙ СПОСОБ — ЧИСТЫЙ SQL (НИКАКИХ АССОЦИАЦИЙ!)
  getCategoriesWithCount: async (req, res) => {
    try {
      const [results] = await sequelize.query(`
        SELECT 
          c.id,
          c.name,
          c.slug,
          COUNT(l.id) AS locksCount
        FROM categories c
        LEFT JOIN locks l ON c.id = l.categoryId
        GROUP BY c.id, c.name, c.slug
        ORDER BY c.name ASC
      `);

      const formatted = results.map(row => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        count: Number(row.locksCount) || 0
      }));

      res.json(formatted);
    } catch (error) {
      console.error("Ошибка getCategoriesWithCount:", error);
      res.status(500).json({ error: "Не удалось загрузить счётчики" });
    }
  },

  getCategoryBySlug: async (req, res) => {
    try {
      const { slug } = req.params;
      const category = await Category.findOne({
        where: { slug },
        include: [{ model: Lock, as: "locks" }], // ← теперь везде "locks"
      });
      if (!category) return res.status(404).json({ error: "Категория не найдена" });
      res.json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  },
};

module.exports = categoryController;