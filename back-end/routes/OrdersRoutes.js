// backend/routes/OrdersRoutes.js
const express = require("express");
const router = express.Router();

const Order = require("../models/OrderModel");
const OrderItem = require("../models/OrderItemModel");
const Lock = require("../models/LockModel");

router.get("/user/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: "Неверный ID пользователя" });
    }

    const orders = await Order.findAll({
      where: { userId },
      attributes: [
        "id",
        "status",
        "total_price",
        "payment_method",
        "createdAt",
        "address",
      ],

      include: [
        {
          model: Lock,
          as: "items", // ← ВАЖНО!
          attributes: ["id", "name", "image_path", "article"],

          through: {
            model: OrderItem,
            attributes: ["quantity", "price_at_purchase"],
          },
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    res.json(orders);
  } catch (err) {
    console.error("Ошибка в /api/orders/user/:userId:", err);
    res.status(500).json({
      error: "Ошибка сервера",
      details: err.message,
    });
  }
});

module.exports = router;
