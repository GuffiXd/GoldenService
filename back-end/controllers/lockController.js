// back-end/controllers/lockController.js
const Lock = require('../models/LockModel');
const { Op } = require('sequelize');

// Объект с методами
const lockController = {
  getAllLocks: async (req, res) => {
    try {
      const locks = await Lock.findAll();
      res.json(locks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ДОБАВЛЯЕМ В ОБЪЕКТ, а не через exports
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
  }
};

module.exports = lockController; // ← экспортируем весь объект