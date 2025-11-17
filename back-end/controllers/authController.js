const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const JWT_SECRET = process.env.JWT_SECRET || "golden-soft-2025-secret";

exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: "Email уже занят" });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, phone, password: hashed });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "30d" });

    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Неверные данные" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "30d" });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

exports.me = async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: { exclude: ["password"] } });
  res.json({ user });
};