const Callback = require("../models/CallbackModel");

// 📩 Создание новой заявки
exports.createCallback = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Пожалуйста, заполните все поля" });
    }

    await Callback.create({ name, email });

    res.status(201).json({ message: "Заявка успешно отправлена" });
  } catch (error) {
    console.error("Ошибка при создании заявки:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// 📋 Получение всех заявок
exports.getAllCallbacks = async (req, res) => {
  try {
    const callbacks = await Callback.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(callbacks);
  } catch (error) {
    console.error("Ошибка при получении заявок:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// ❌ Удаление заявки (по id)
exports.deleteCallback = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Callback.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: "Заявка не найдена" });
    }

    res.json({ message: "Заявка удалена" });
  } catch (error) {
    console.error("Ошибка при удалении:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
