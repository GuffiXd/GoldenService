// back-end/controllers/orderController.js
const Lock = require("../models/LockModel");
const Worders = require("../models/WholesaleModel"); // Исправлено: было WholesaleModel
const { Op } = require("sequelize");

const WholesaleController = {
  // Поиск замков
  searchLocks: async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || q.trim().length < 2) return res.json([]);

      const locks = await Lock.findAll({
        where: {
          in_stock: true,
          [Op.or]: [
            { name: { [Op.like]: `%${q.trim()}%` } },
            { article: { [Op.like]: `%${q.trim()}%` } },
          ],
        },
        attributes: ["id", "name", "article", "price", "price_with_discount"],
        limit: 6,
      });

      res.json(locks);
    } catch (error) {
      console.error("Ошибка поиска замков:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  },

  // Создание заказа
  createOrder: async (req, res) => {
    try {
      const {
        name,
        company,
        phone,
        lockId,
        quantity = 1,
        logo = false,
        installation = false,
        totalCost,
      } = req.body;

      // Валидация
      if (!name || !phone || !lockId || !totalCost) {
        return res.status(400).json({ message: "Заполните обязательные поля" });
      }

      const order = await Worders.create({
        name: name.trim(),
        company: company?.trim() || null,
        phone: phone.trim(),
        lockId: parseInt(lockId),
        quantity: parseInt(quantity),
        logo: Boolean(logo),
        installation: Boolean(installation),
        totalCost: parseFloat(totalCost),
      });

      res.status(201).json({ success: true, order });
    } catch (error) {
      console.error("Ошибка создания заказа:", error);
      res.status(500).json({ message: "Ошибка сервера при создании заказа" });
    }
  },
};

// Правильный экспорт
module.exports = WholesaleController;