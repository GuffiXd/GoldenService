// back-end/controllers/lockController.js
const Lock = require("../models/LockModel");
const { Op } = require("sequelize");

// === Вспомогательные функции ===
const parsePagination = (page = 1, limit = 12) => {
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
  return { page: parsedPage, limit: parsedLimit };
};

const parseSort = (sort = "createdAt", order = "DESC") => {
  const validFields = ["name", "price", "createdAt", "updatedAt", "id"];
  const field = validFields.includes(sort) ? sort : "createdAt";
  const dir = ["ASC", "DESC"].includes(String(order).toUpperCase()) ? order.toUpperCase() : "DESC";
  return [[field, dir]];
};

// === Безопасное преобразование цен (главная причина 500 ошибок!) ===
const formatLockPrices = (lock) => {
  const data = lock.toJSON ? lock.toJSON() : { ...lock };

  return {
    ...data,
    price: Number(data.price) || 0,
    price_with_discount: data.price_with_discount ? Number(data.price_with_discount) : null,
  };
};

// === Контроллер ===
const lockController = {
  // 1. Все замки (каталог)
  getAllLocks: async (req, res) => {
    try {
      const {
        page,
        limit,
        search,
        category,
        min_price,
        max_price,
        in_stock,
        sort,
        order,
      } = req.query;

      const { page: currentPage, limit: pageSize } = parsePagination(page, limit);
      const offset = (currentPage - 1) * pageSize;

      const where = {};

      if (search && search.trim().length >= 2) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search.trim()}%` } },
          { article: { [Op.like]: `%${search.trim()}%` } },
        ];
      }

      if (category) where.categoryId = category;
      if (in_stock === "true") where.in_stock = true;

      if (min_price || max_price) {
        where.price = {};
        if (min_price) where.price[Op.gte] = Number(min_price);
        if (max_price) where.price[Op.lte] = Number(max_price);
      }

      const { count, rows } = await Lock.findAndCountAll({
        where,
        order: parseSort(sort, order),
        limit: pageSize,
        offset,
        attributes: [
          "id", "name", "article", "price", "price_with_discount",
          "image_path", "in_stock", "is_popular", "is_featured", "categoryId"
        ],
      });

      const formattedRows = rows.map(formatLockPrices);

      res.json({
        data: formattedRows,
        pagination: {
          total: count,
          page: currentPage,
          limit: pageSize,
          pages: Math.ceil(count / pageSize),
        },
      });
    } catch (err) {
      console.error("getAllLocks error:", err);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  },

  // 2. Слайдер (акции)
  getSliderLocks: async (req, res) => {
    try {
      const locks = await Lock.findAll({
        where: {
          is_featured: true,
          price_with_discount: { [Op.not]: null },
        },
        limit: 5,
        order: [["updatedAt", "DESC"]],
        attributes: ["id", "name", "price", "price_with_discount", "image_path"],
      });

      res.json(locks.map(formatLockPrices));
    } catch (err) {
      console.error("getSliderLocks error:", err);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  },

  // 3. Популярные
  getPopularLocks: async (req, res) => {
    try {
      const locks = await Lock.findAll({
        where: { is_popular: true },
        limit: 8,
        order: [["updatedAt", "DESC"]],
        attributes: ["id", "name", "price", "price_with_discount", "image_path", "in_stock"],
      });

      res.json(locks.map(formatLockPrices));
    } catch (err) {
      console.error("getPopularLocks error:", err);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  },

  // 4. Быстрый поиск для хедера
  searchLocks: async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || q.trim().length < 2) return res.json([]);

      const locks = await Lock.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${q.trim()}%` } },
            { article: { [Op.like]: `%${q.trim()}%` } },
          ],
        },
        attributes: ["id", "name", "price", "price_with_discount", "image_path"],
        limit: 5,
      });

      res.json(locks.map(formatLockPrices));
    } catch (err) {
      console.error("searchLocks error:", err);
      res.status(500).json({ error: "Ошибка поиска" });
    }
  },

  // 5. Один товар по ID — САМАЯ ВАЖНАЯ ФУНКЦИЯ (была дублирована и ломала всё!)
  getLockById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Неверный ID" });
      }

      const lock = await Lock.findByPk(id, {
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      if (!lock) {
        return res.status(404).json({ error: "Товар не найден" });
      }

      res.json(formatLockPrices(lock));
    } catch (err) {
      console.error("getLockById error:", err);
      res.status(500).json({ error: "Ошибка сервера", details: err.message });
    }
  },
};

module.exports = lockController;