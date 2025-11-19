// backend/server.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const path = require("path");

//КОНФИГ
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//ПОДКЛЮЧЕНИЕ БД И МОДЕЛЕЙ
require("./models");
const { sequelize } = require("./models");
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

//МИДЛВАРЫ
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Статические файлы
app.use("/images", express.static(path.join(__dirname, "images")));

//API РОУТЫ
app.use("/api/locks", lockRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/form", callbackRoutes);
app.use("/api/wholesale", wholesaleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

//ГЛАВНАЯ СТРАНИЦА API
app.get("/", (req, res) => {
  res.json({
    message: "Golden Soft API",
    status: "работает",
    version: "1.0.0",
    time: new Date().toLocaleString("ru-RU"),
    environment: process.env.NODE_ENV || "development",
    endpoints: {
      locks: "/api/locks",
      categories: "/api/categories",
      statistics: "/api/statistics",
      projects: "/api/projects",
      callback: "/api/form",
      wholesale: "/api/wholesale",
      auth: "/api/auth",
      orders: "/api/orders",
    },
  });
});

//404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Маршрут ${req.originalUrl} не найден`,
  });
});

//ГЛОБАЛЬНЫЙ ОБРАБОТЧИК ОШИБОК
app.use((err, req, res, next) => {
  console.error("Ошибка сервера:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Внутренняя ошибка сервера",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      error: err.name,
    }),
  });
});

//ЗАПУСК СЕРВЕРА
const startServer = async () => {
  try {
    console.log("Подключение к MySQL...");

    await sequelize.authenticate();
    console.log("MySQL успешно подключён");

    
    if (process.env.NODE_ENV !== "production") {
      console.log("Синхронизация моделей с БД (dev-режим)...");
      await sequelize.sync({ alter: true });
      console.log("Схема БД синхронизирована");


      const lockCount = await sequelize.models.Lock?.count();
      if (lockCount === 0 || lockCount === undefined) {
        console.log("База пустая — запускаем сид...");
        await seedDatabase();
        console.log("Сид успешно выполнен!");
      } else {
        console.log(`В таблице locks уже есть ${lockCount} записей — сид пропущен`);
      }
    } else {
      console.log("Production режим — sync и сид отключены");
    }


    app.listen(PORT, "0.0.0.0", () => {
      console.log("\nСервер успешно запущен!");
      console.log(`http://localhost:${PORT}`);
      console.log(`Режим: ${process.env.NODE_ENV || "development"}\n`);
    });
  } catch (error) {
    console.error("Не удалось запустить сервер:", error.message || error);
    process.exit(1);
  }
};

startServer();