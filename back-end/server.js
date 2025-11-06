// backend/server.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const path = require("path");

// 🔹 Конфиг БД
const sequelize = require("./config/db");

// 🔹 СИД — УБЕДИСЬ, ЧТО ПУТЬ ПРАВИЛЬНЫЙ
const seedDatabase = require("./seedDatabase");

// 🔹 Маршруты
const lockRoutes = require("./routes/LockRoutes");
const statisticsRoutes = require("./routes/StatisticsRoutes");
const categoryRoutes = require("./routes/CategoryRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
}));
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Статические файлы
app.use("/images", express.static(path.join(__dirname, "images")));

// Роуты
app.use("/api/locks", lockRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/categories", categoryRoutes);

// Главная
app.get("/", (req, res) => {
  res.json({ message: "GoldenService API работает!" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Маршрут не найден" });
});

// Ошибки
app.use((err, req, res, next) => {
  console.error("Ошибка:", err);
  res.status(500).json({ error: "Серверная ошибка" });
});

// === ЗАПУСК СЕРВЕРА ===
const startServer = async () => {
  try {
    // 1. Подключение
    await sequelize.authenticate();
    console.log("Подключение к MySQL: OK");

    // 2. Синхронизация
    await sequelize.sync({ alter: true });
    console.log("Таблицы синхронизированы");

    // 3. СИД — ВЫЗЫВАЕМ ЯВНО!
    console.log("Запускаем заполнение БД...");
    await seedDatabase();  // ← ЭТА СТРОКА ДОЛЖНА БЫТЬ!
    console.log("Сид завершён");

    // 4. Сервер
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Сервер: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("ОШИБКА ЗАПУСКА:", error);
    process.exit(1);
  }
};

// === СТАРТ ===
startServer();