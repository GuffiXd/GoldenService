// backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const lockRoutes = require('./routes/lockRoutes');
const path = require('path');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ----------------------
// 🔹 CORS (разрешаем фронтенд с Vite)
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ----------------------
// 🔹 Настраиваем helmet (чтобы не блокировал картинки)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// ----------------------
// 🔹 Парсинг JSON
app.use(express.json());

// ----------------------
// 🔹 Статическая папка для картинок
// ВАЖНО: этот middleware должен быть ДО роутов
app.use('/images', express.static(path.join(__dirname, 'images')));

// ----------------------
// 🔹 API маршруты
app.use('/api/locks', lockRoutes);

// ----------------------
// 🔹 Тестовый роут
app.get('/', (req, res) => {
  res.send('✅ Backend работает!');
});

// ----------------------
// 🔹 Запуск сервера
const startServer = async () => {
  try {
    if (typeof sequelize.authenticate !== 'function') {
      throw new Error('sequelize.authenticate НЕ является функцией. Проверь config/db.js');
    }

    await sequelize.authenticate();
    console.log('✅ Подключение к MySQL успешно!');

    await sequelize.sync({ alter: true });
    console.log('✅ Таблицы синхронизированы');

    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Ошибка подключения:', err.message);
    process.exit(1);
  }
};

startServer();
