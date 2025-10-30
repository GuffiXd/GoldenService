// backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const sequelize = require('./config/db'); // ← ЭТО ДОЛЖЕН БЫТЬ ЭКЗЕМПЛЯР!

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173' // Vite
}));
app.use(express.json());

// Роуты
app.get('/', (req, res) => {
  res.send('Backend работает!');
});

// Запуск
const startServer = async () => {
  try {
    // Проверка: это функция?
    if (typeof sequelize.authenticate !== 'function') {
      throw new Error('sequelize.authenticate НЕ является функцией. Проверь config/db.js');
    }

    await sequelize.authenticate();
    console.log('Подключение к MySQL успешно!');

    await sequelize.sync({ alter: true });
    console.log('Таблицы синхронизированы');

    app.listen(PORT, () => {
      console.log(`Сервер запущен: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Ошибка подключения:', err.message);
    process.exit(1);
  }
};

startServer();