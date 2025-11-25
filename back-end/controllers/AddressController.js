const { Address } = require("../models");

exports.getAll = async (req, res) => {
  try {
    const addresses = await Address.findAll({
      where: { userId: req.user.id },
      order: [["isDefault", "DESC"], ["createdAt", "DESC"]],
    });
    res.json(addresses);
  } catch (err) {
    console.error("Ошибка получения адресов:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, address, apartment, entrance, floor, intercom, comment, isDefault } = req.body;
    
    const newAddress = await Address.create({
      userId: req.user.id,
      title: title || "Мой адрес",
      address,
      apartment,
      entrance,
      floor,
      intercom,
      comment,
      isDefault: !!isDefault,
    });

    res.status(201).json(newAddress);
  } catch (err) {
    console.error("Ошибка создания адреса:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Address.destroy({
      where: { id, userId: req.user.id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Адрес не найден" });
    }

    res.json({ message: "Адрес удален" });
  } catch (err) {
    console.error("Ошибка удаления адреса:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, address, apartment, entrance, floor, intercom, comment, isDefault } = req.body;

    const addr = await Address.findOne({ where: { id, userId: req.user.id } });
    if (!addr) return res.status(404).json({ message: "Адрес не найден" });

    await addr.update({
      title, address, apartment, entrance, floor, intercom, comment, isDefault
    });

    res.json(addr);
  } catch (err) {
    console.error("Ошибка обновления адреса:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
