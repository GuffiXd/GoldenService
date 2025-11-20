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

// 5. === ПРОСЛОЙКА АВТОРИЗАЦИИ ===
app.use(async (req, res, next) => {
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
  next();
});

// 6. === РОУТЫ ===
app.use("/api/locks", require("./routes/LockRoutes"));
app.use("/api/categories", require("./routes/CategoryRoutes"));
app.use("/api/statistics", require("./routes/StatisticsRoutes"));
app.use("/api/projects", require("./routes/ProjectRoutes"));
app.use("/api/form", require("./routes/CallbackRoutes"));
app.use("/api/wholesale", require("./routes/WholesaleRoutes"));
app.use("/api/auth", require("./routes/AuthRoutes"));
app.use("/api/orders", require("./routes/OrdersRoutes"));
app.use("/api/favorites", require("./routes/FavoriteRoutes")); // <-- Наш роут

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
    
    // alter: true обновит таблицы, если вы меняли модели
    await sequelize.sync({ alter: false }); 

    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error(e);
  }
};

startServer();