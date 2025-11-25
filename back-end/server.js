const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const path = require("path");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. === CORS (ОБЯЗАТЕЛЬНО ПЕРВЫМ) ===
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Порт Vite
    credentials: true, // Разрешаем куки/сессии
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// 2. === HELMET И ПАРСЕРЫ ===
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 3. === СЕССИИ ===
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST || "localhost",
  port: 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "golden_soft_db",
  clearExpired: true,
  checkExpirationInterval: 900000,
});

app.use(
  session({
    key: "golden_session",
    secret: process.env.SESSION_SECRET || "super_secret_key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false, // Не создавать пустые сессии
    cookie: {
      httpOnly: true,
      secure: false, // false для localhost, true для HTTPS
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 дней
      sameSite: "lax",
    },
  })
);

// 4. === ПОДКЛЮЧЕНИЕ БД ===
// Важно: сначала require models, чтобы sequelize инициализировался
const db = require("./models");
const { sequelize, User } = db;
const seedDatabase = require("./seedDatabase");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "golden-soft-2025-secret";

// 5. === ПРОСЛОЙКА АВТОРИЗАЦИИ (Session + JWT) ===
app.use(async (req, res, next) => {
  // 1. Проверка сессии (Cookie)
  if (req.session && req.session.userId) {
    try {
      const user = await User.findByPk(req.session.userId, {
        attributes: ["id", "name", "email", "phone", "role"],
      });
      if (user) req.user = user;
    } catch (err) {
      console.error("Ошибка восстановления сессии:", err);
    }
  }

  // 2. Проверка токена (Header Authorization), если юзер еще не найден
  if (!req.user && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findByPk(decoded.id, {
          attributes: ["id", "name", "email", "phone", "role"],
        });
        if (user) req.user = user;
      } catch (err) {
        console.error("JWT Error:", err.message);
      }
    }
  }

  next();
});

// 6. === РОУТЫ ===
app.use("/api/locks", require("./routes/LockRoutes"));
app.use("/api/categories", require("./routes/CategoryRoutes"));
app.use("/api/statistics", require("./routes/StatisticsRoutes"));
app.use("/api/projects", require("./routes/ProjectRoutes"));
app.use("/api/orders", require("./routes/OrdersRoutes"));
app.use("/api/favorites", require("./routes/FavoriteRoutes"));
app.use("/api/addresses", require("./routes/AddressRoutes")); // <-- Адреса
app.use("/api/auth", require("./routes/AuthRoutes"));
app.use("/api/form", require("./routes/CallbackRoutes"));
app.use("/api/wholesale", require("./routes/WholesaleRoutes"));
app.use("/api/admin", require("./routes/AdminRoutes"));

// Тестовый роут
app.get("/", (req, res) => {
  res.json({
    status: "Server Works",
    user: req.user ? req.user.name : "Guest"
  });
});

// Ошибки
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// 7. === ЗАПУСК ===
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL подключен.");

    // alter: false - не изменяем структуру таблиц автоматически
    // Используйте migrations для изменения структуры БД
    await sequelize.sync({ alter: false });

    // Запуск сида (заполнение БД, если она пуста)
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error(e);
  }
};

startServer();