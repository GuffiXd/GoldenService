// back-end/models/OrderModel.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/**
 * Модель заказа пользователя
 * Таблица: orders
 */
class Order extends Model {}

/**
 * Инициализация модели Order
 */
Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    total_price: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
      comment: "Общая сумма заказа в рублях (с копейками)",
      get() {
        const value = this.getDataValue("total_price");
        return value ? Number(value) : 0;
      },
    },

    status: {
      type: DataTypes.ENUM("new", "processing", "shipped", "completed", "canceled"),
      allowNull: false,
      defaultValue: "new",
      comment: "Статус заказа",
    },

    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "Способ оплаты",
    },

    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Комментарий к заказу",
    },

    // Адрес доставки
    address: { type: DataTypes.STRING(255), allowNull: true },
    city: { type: DataTypes.STRING(100), allowNull: true },
    postcode: { type: DataTypes.STRING(20), allowNull: true },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "Россия",
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "ID пользователя (если заказ от зарегистрированного)",
    },
  },
  {
    sequelize,
    modelName: "Order",
    tableName: "orders",
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    indexes: [
      { fields: ["status"] },
      { fields: ["createdAt"] },
      { fields: ["userId"] },
    ],
  }
);

module.exports = Order;