const express = require("express");
const router = express.Router();

const User = require("../models/UserModel");
const Lock = require("../models/LockModel");
const Order = require("../models/OrderModel");

// Статичное значение "Лет на рынке"
const YEARS_ON_MARKET = 7;

router.get("/", async (req, res) => {
  try {
    const usersCount = await User.count();
    const productsCount = await Lock.count();
    const ordersCount = await Order.count();

    const stats = [
      { id: 1, title: "Счастливые клиенты", value: usersCount },
      { id: 2, title: "Продуктов на выбор", value: productsCount },
      { id: 3, title: "Продаж в день", value: ordersCount },
      { id: 4, title: "Лет на рынке", value: YEARS_ON_MARKET },
    ];

    return res.json(stats);
  } catch (err) {
    console.error("Ошибка статистики:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

module.exports = router;
