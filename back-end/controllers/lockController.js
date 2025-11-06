// back-end/controllers/lockController.js
const Lock = require('../models/LockModel');
const { Op } = require('sequelize');

// ВСЁ В ОДНОМ ОБЪЕКТЕ — ЧИСТО И ПРАВИЛЬНО
const lockController = {
  // Все замки
  getAllLocks: async (req, res) => {
    try {
      const locks = await Lock.findAll();
      res.json(locks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Слайдер (избранные + со скидкой)
  getSliderLocks: async (req, res) => {
    try {
      const slider = await Lock.findAll({
        where: {
          is_featured: true,
          price_with_discount: { [Op.not]: null }
        },
        limit: 5,
        order: [['createdAt', 'DESC']]
      });
      res.json(slider);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Популярные
  getPopularLocks: async (req, res) => {
    try {
      const popularLocks = await Lock.findAll({
        where: { is_popular: true },
        limit: 8,
        order: [["createdAt", "DESC"]],
      });
      res.json(popularLocks);
    } catch (error) {
      console.error("Ошибка при получении популярных замков:", error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }
};

module.exports = lockController; // ← ТОЛЬКО ЭТО!