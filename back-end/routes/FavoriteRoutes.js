const express = require("express");
const router = express.Router();
const { Favorite, Lock } = require("../models"); // Импортируем из index.js

// Middleware для проверки авторизации
const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Пожалуйста, войдите в систему" });
  }
  next();
};

// GET: Получить все избранные товары текущего пользователя
router.get("/", isAuthenticated, async (req, res) => {
  try {
    // Ищем все замки, которые связаны с текущим пользователем через таблицу Favorite
    const favorites = await Lock.findAll({
      include: [
        {
          model: Favorite,
          where: { userId: req.user.id }, // Фильтр по юзеру
          attributes: [], // Не тянем лишние поля из связующей таблицы
        },
      ],
    });
    res.json(favorites);
  } catch (err) {
    console.error("Ошибка получения избранного:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST: Добавить товар в избранное
router.post("/:lockId", isAuthenticated, async (req, res) => {
  const { lockId } = req.params;
  const userId = req.user.id;

  try {
    // findOrCreate предотвращает дубликаты
    const [fav, created] = await Favorite.findOrCreate({
      where: { userId, lockId },
      defaults: { userId, lockId },
    });

    if (!created) {
      return res.json({ success: true, message: "Уже в избранном" });
    }

    res.json({ success: true, message: "Добавлено в избранное" });
  } catch (err) {
    console.error("Ошибка добавления:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Удалить товар из избранного
router.delete("/:lockId", isAuthenticated, async (req, res) => {
  const { lockId } = req.params;
  const userId = req.user.id;

  try {
    const deleted = await Favorite.destroy({
      where: { userId, lockId },
    });

    if (deleted) {
      res.json({ success: true, message: "Удалено из избранного" });
    } else {
      res.status(404).json({ message: "Товар не найден в избранном" });
    }
  } catch (err) {
    console.error("Ошибка удаления:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;