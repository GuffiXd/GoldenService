// back-end/controllers/lockController.js
const { Op } = require("sequelize");
const Lock = require("../models/LockModel");
const Review = require("../models/ReviewModel");
const Category = require("../models/CategoryModel");


const formatLock = (lock) => {
  const data = lock.toJSON ? lock.toJSON() : lock;
  return {
    ...data,
    price: Number(data.price) || 0,
    price_with_discount: data.price_with_discount ? Number(data.price_with_discount) : null,
  };
};


const lockController = {

  getAllLocks: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 12,
        search,
        category,
        min_price,
        max_price,
        in_stock,
        sort = "createdAt",
        order = "DESC",
      } = req.query;

      const pageNum = Math.max(1, parseInt(page, 10));
      const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
      const offset = (pageNum - 1) * limitNum;

      const where = {};

      if (search?.trim()) {
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

      const validSort = ["name", "price", "createdAt", "id"].includes(sort) ? sort : "createdAt";
      const orderDir = order.toUpperCase() === "ASC" ? "ASC" : "DESC";

      const { count, rows } = await Lock.findAndCountAll({
        where,
        include: [
          { model: Category, as: "category", attributes: ["name", "slug"] },
        ],
        order: [[validSort, orderDir]],
        limit: limitNum,
        offset,
      });

      res.json({
        data: rows.map(formatLock),
        pagination: {
          total: count,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(count / limitNum),
        },
      });
    } catch (err) {
      console.error("getAllLocks error:", err);
      res.status(500).json({ error: "Ошибка загрузки каталога" });
    }
  },


  getLockById: async (req, res) => {
    try {
      const { id } = req.params;

      const lock = await Lock.findByPk(id, {
        include: [
          { model: Category, as: "category", attributes: ["id", "name", "slug"] },
          {
            model: Review,
            as: "reviews",
            attributes: ["id", "author", "rating", "text", "date", "isVerified"],
            order: [["createdAt", "DESC"]],
            limit: 3,
          },
        ],
      });

      if (!lock) {
        return res.status(404).json({ error: "Замок не найден" });
      }

      res.json(formatLock(lock));
    } catch (err) {
      console.error("getLockById error:", err);
      res.status(500).json({ error: "Ошибка загрузки товара" });
    }
  },


  getPopularLocks: async (req, res) => {
    try {
      const locks = await Lock.findAll({
        where: { is_popular: true, in_stock: true },
        include: [{ model: Category, as: "category", attributes: ["slug"] }],
        limit: 8,
        order: [["updatedAt", "DESC"]],
      });

      res.json(locks.map(formatLock));
    } catch (err) {
      console.error("getPopularLocks error:", err);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  },


  getSliderLocks: async (req, res) => {
    try {
      const locks = await Lock.findAll({
        where: {
          price_with_discount: { [Op.not]: null },
          in_stock: true,
        },
        limit: 6,
        order: [["updatedAt", "DESC"]],
      });

      res.json(locks.map(formatLock));
    } catch (err) {
      console.error("getSliderLocks error:", err);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  },


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
          in_stock: true,
        },
        attributes: ["id", "name", "article", "price", "price_with_discount", "image_path"],
        limit: 6,
      });

      res.json(locks.map(formatLock));
    } catch (err) {
      console.error("searchLocks error:", err);
      res.status(500).json({ error: "Ошибка поиска" });
    }
  },
};

module.exports = lockController;