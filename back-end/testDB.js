// Тестовый скрипт для проверки БД
const sequelize = require("./config/db");
const Lock = require("./models/LockModel");

async function testDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL подключен");
    
    // Проверяем есть ли поле stock
    const tableInfo = await sequelize.getQueryInterface().describeTable('locks');
    console.log("\n📋 Структура таблицы locks:");
    console.log(Object.keys(tableInfo));
    
    if (tableInfo.stock) {
      console.log("\n✅ Поле 'stock' существует");
    } else {
      console.log("\n⚠️ Поле 'stock' отсутствует! Добавляем...");
      await sequelize.query(`
        ALTER TABLE locks 
        ADD COLUMN stock INT DEFAULT 0 COMMENT 'Количество товара на складе'
      `);
      console.log("✅ Поле 'stock' добавлено");
    }
    
    // Тестовый запрос
    const locks = await Lock.findAll({ limit: 3 });
    console.log(`\n✅ Найдено товаров: ${locks.length}`);
    if (locks.length > 0) {
      console.log("Первый товар:", locks[0].toJSON());
    }
    
  } catch (error) {
    console.error("❌ Ошибка:", error.message);
    console.error(error.stack);
  } finally {
    await sequelize.close();
  }
}

testDB();
