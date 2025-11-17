// backend/server.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const path = require("path");

// ==================== КОНФИГ ====================
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Подключение к БД и сид
const sequelize = require("./config/db");
const seedDatabase = require("./seedDatabase");

// ==================== РОУТЫ ====================
const lockRoutes = require("./routes/LockRoutes");
const categoryRoutes = require("./routes/CategoryRoutes");
const statisticsRoutes = require("./routes/StatisticsRoutes");
const projectRoutes = require("./routes/ProjectRoutes");
const callbackRoutes = require("./routes/CallbackRoutes");
const wholesaleRoutes = require("./routes/WholesaleRoutes");
const authRoutes = require("./routes/AuthRoutes");
const orderRoutes = require("./routes/OrdersRoutes");

// ==================== МИДЛВАРЫ ====================
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // если используешь Vite — лучше выключить
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Статические файлы (картинки)
app.use("/images", express.static(path.join(__dirname, "images")));

// ==================== API РОУТЫ ====================
app.use("/api/locks", lockRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/form", callbackRoutes);
app.use("/api/wholesale", wholesaleRoutes);    // опт
app.use("/api/auth", authRoutes);             // регистрация/логин
app.use("/api/orders", orderRoutes);          // заказы пользователей

// ==================== ГЛАВНАЯ ====================
app.get("/", (req, res) => {
  res.json({
    message: "Golden Soft API",
    status: "работает",
    time: new Date().toLocaleString("ru-RU"),
    endpoints: {
      locks: "/api/locks",
      auth: "/api/auth",
      orders: "/api/orders/my",
      wholesale: "/api/wholesale"
    }
  });
});

// ==================== 404 ====================
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Маршрут ${req.originalUrl} не найден`,
  });
});

// ==================== ГЛОБАЛЬНЫЙ ОБРАБОТЧИК ОШИБОК ====================
app.use((err, req, res, next) => {
  console.error("Ошибка сервера:", err.stack || err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Внутренняя ошибка сервера",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ==================== ЗАПУСК СЕРВЕРА ====================
const startServer = async () => {
  try {
    console.log("Подключение к MySQL...");
    await sequelize.authenticate();
    console.log("MySQL подключён");

    console.log("Синхронизация таблиц...");
    await sequelize.sync({ alter: true });
    console.log("Таблицы синхронизированы");

    console.log("Запуск сида (если БД пустая)...");
    await seedDatabase();
    console.log("Сид завершён");

    app.listen(PORT, "0.0.0.0", () => {
      console.log("\nСервер успешно запущен!");
      console.log(`http://localhost:${PORT}`);
      console.log(`Режим: ${process.env.NODE_ENV || "development"}\n`);
    });

  } catch (error) {
    console.error("Не удалось запустить сервер:", error);
    process.exit(1);
  }
};

// Защита от необработанных ошибок
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// ==================== СТАРТ ====================
startServer();