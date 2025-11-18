// back-end/models/index.js
const fs = require("fs");
const path = require("path");
const sequelize = require("../config/db");

const db = {};

// === Автозагрузка всех моделей из папки models ===
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf(".") !== 0 &&
      file !== path.basename(__filename) && // исключаем index.js
      file.slice(-3) === ".js"
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    
    // Поддержка обоих стилей: class и sequelize.define
    if (typeof model === "function" && model.prototype && model.init) {
      // Это class extends Model — уже инициализирована
      db[model.name] = model;
    } else if (typeof model === "function") {
      // Старый стиль — нужно вызвать с (sequelize, DataTypes)
      const { DataTypes } = require("sequelize");
      const initializedModel = model(sequelize, DataTypes);
      db[initializedModel.name] = initializedModel;
    } else {
      // На всякий случай — если вдруг экспорт объекта
      Object.assign(db, model);
    }
  });

// === АССОЦИАЦИИ (только здесь, один раз, красиво и понятно!) ===

const {
  Category,
  Lock,
  Order,
  OrderItem,
  User,
  Statistics,
  OurProject,
  CallbackModel,      // если есть
  WholesaleOrder,     // ← наша новая модель!
} = db;

// 1. Категории ↔ Замки
if (Category && Lock) {
  Category.hasMany(Lock, { foreignKey: "categoryId", as: "locks" });
  Lock.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
}

// 2. Пользователи ↔ Заказы
if (User && Order) {
  User.hasMany(Order, { foreignKey: "userId", as: "orders" });
  Order.belongsTo(User, { foreignKey: "userId", as: "user" });
}

// 3. Заказы ↔ Товары в заказе ↔ Замки (многие ко многим)
if (Order && OrderItem && Lock) {
  // Order → OrderItem
  Order.hasMany(OrderItem, { foreignKey: "orderId", as: "orderItems" });
  OrderItem.belongsTo(Order, { foreignKey: "orderId" });

  // Lock → OrderItem
  Lock.hasMany(OrderItem, { foreignKey: "lockId", as: "orderItems" });
  OrderItem.belongsTo(Lock, { foreignKey: "lockId" });

  // Many-to-Many: Order ↔ Lock через OrderItem
  Order.belongsToMany(Lock, {
    through: OrderItem,
    foreignKey: "orderId",
    otherKey: "lockId",
    as: "items",
  });
  Lock.belongsToMany(Order, {
    through: OrderItem,
    foreignKey: "lockId",
    otherKey: "orderId",
    as: "orders",
  });
}

// 4. Оптовые заказы ↔ Замки
if (WholesaleOrder && Lock) {
  Lock.hasMany(WholesaleOrder, {
    foreignKey: "lockId",
    as: "wholesaleOrders",
  });
  WholesaleOrder.belongsTo(Lock, {
    foreignKey: "lockId",
    as: "lock",
  });
}

if (db.Lock && db.Review) {
  db.Lock.hasMany(db.Review, {
    foreignKey: "lockId",
    as: "reviews",
  });

  db.Review.belongsTo(db.Lock, {
    foreignKey: "lockId",
    as: "lock",
  });
}

// 5. Проекты и статистика — независимые, ассоциаций нет
// OurProject, Statistics — ничего не связываем

// === Экспорт ===
db.sequelize = sequelize;
db.Sequelize = require("sequelize");

module.exports = db;