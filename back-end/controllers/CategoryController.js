// back-end/controllers/CategoryController.js
const Category = require("../models/CategoryModel");
const Lock = require("../models/LockModel");

const categoryController = {
  // Получить все категории
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.findAll({
        order: [["name", "ASC"]],
      });
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Ошибка загрузки категорий" });
    }
  },

  // Получить категорию + замки по slug
  getCategoryBySlug: async (req, res) => {
    try {
      const { slug } = req.params;

      const category = await Category.findOne({
        where: { slug },
        include: [
          {
            model: Lock,
            as: "Locks",
            order: [["createdAt", "DESC"]],
          },
        ],
      });

      if (!category) {
        return res.status(404).json({ error: "Категория не найдена" });
      }

      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Ошибка сервера" });
    }
  },
};

module.exports = categoryController;