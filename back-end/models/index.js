const fs = require("fs");
const path = require("path");
const sequelize = require("../config/db"); // Убедись, что путь верный

const db = {};

// 1. Автоматическая загрузка всех моделей из папки
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== path.basename(__filename) && // исключаем этот файл (index.js)
      file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    // Загружаем модель
    const modelDef = require(path.join(__dirname, file));
    
    // Инициализируем модель
    // Если экспорт идет как класс (современный стиль)
    if (typeof modelDef === "function" && modelDef.prototype && modelDef.init) {
       // Если модель еще не инициализирована в самом файле, можно вызвать init здесь, 
       // но обычно в классовом подходе init делается внутри файла модели.
       // Предполагаем, что require возвращает сам класс модели.
       db[modelDef.name] = modelDef;
    } 
    // Если экспорт идет как функция (стиль module.exports = (sequelize, DataTypes) => ...)
    else if (typeof modelDef === "function") {
      const { DataTypes } = require("sequelize");
      const model = modelDef(sequelize, DataTypes);
      db[model.name] = model;
    }
  });

// Сохраняем sequelize в объект db
db.sequelize = sequelize;
db.Sequelize = require("sequelize");

// Достаем модели для удобства настройки связей
const {
  Category,
  Lock,
  Order,
  OrderItem,
  User,
  Statistics,
  OurProject,
  CallbackModel,
  WholesaleOrder,
  Favorite, // Убедись, что файл Favorite.js существует в папке models!
  Address,
  Review
} = db;

// === 2. НАСТРОЙКА АССОЦИАЦИЙ ===

// Категории ↔ Замки
if (Category && Lock) {
  Category.hasMany(Lock, { foreignKey: "categoryId", as: "locks" });
  Lock.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
}

// Пользователи ↔ Заказы
if (User && Order) {
  User.hasMany(Order, { foreignKey: "userId", as: "orders" });
  Order.belongsTo(User, { foreignKey: "userId", as: "user" });
}

// Заказы ↔ Товары ↔ Замки
if (Order && OrderItem && Lock) {
  Order.hasMany(OrderItem, { foreignKey: "orderId", as: "orderItems" });
  OrderItem.belongsTo(Order, { foreignKey: "orderId" });

  Lock.hasMany(OrderItem, { foreignKey: "lockId", as: "orderItems" });
  OrderItem.belongsTo(Lock, { foreignKey: "lockId" });

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

// Оптовые заказы
if (WholesaleOrder && Lock) {
  Lock.hasMany(WholesaleOrder, { foreignKey: "lockId", as: "wholesaleOrders" });
  WholesaleOrder.belongsTo(Lock, { foreignKey: "lockId", as: "lock" });
}

// Отзывы
if (Lock && Review) {
  Lock.hasMany(Review, { foreignKey: "lockId", as: "reviews" });
  Review.belongsTo(Lock, { foreignKey: "lockId", as: "lock" });
}

// Адреса
if (User && Address) {
  User.hasMany(Address, { foreignKey: "userId", as: "addresses" });
  Address.belongsTo(User, { foreignKey: "userId" });
}

// === ИЗБРАННОЕ (СЕРДЦЕ) ===
if (User && Lock && Favorite) {
  // Связь "Многие ко многим" для удобного получения списка
  User.belongsToMany(Lock, { through: Favorite, foreignKey: "userId", as: "favorites" });
  Lock.belongsToMany(User, { through: Favorite, foreignKey: "lockId", as: "favoritedBy" });

  // Прямые связи для работы с таблицей связей напрямую (удаление, добавление)
  User.hasMany(Favorite, { foreignKey: "userId" });
  Favorite.belongsTo(User, { foreignKey: "userId" });

  Lock.hasMany(Favorite, { foreignKey: "lockId" });
  Favorite.belongsTo(Lock, { foreignKey: "lockId" });
}

module.exports = db;