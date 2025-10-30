// back-end/test-db.js
const sequelize = require('./config/db');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Тест: ПОДКЛЮЧЕНИЕ УСПЕШНО!');
    process.exit(0);
  } catch (err) {
    console.error('Тест: ОШИБКА:', err.message);
    process.exit(1);
  }
})();