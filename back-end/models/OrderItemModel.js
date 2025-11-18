// back-end/models/OrderItemModel.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/**
 * Промежуточная таблица: товары в заказе
 * Связывает Order ↔ Lock (многие ко многим) + хранит количество и цену на момент покупки
 * Таблица: order_items
 */
class OrderItem extends Model {}

/**
 * Инициализация модели OrderItem
 */
OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
      comment: "Количество единиц товара в заказе",
    },
    price_at_purchase: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      comment: "Цена за единицу на момент покупки (с учётом скидки)",
      get() {
        const value = this.getDataValue("price_at_purchase");
        return value ? Number(value) : 0;
      },
    },
  },
  {
    sequelize,
    modelName: "OrderItem",
    tableName: "order_items",           // ← правильное имя таблицы!
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    indexes: [
      { fields: ["orderId"] },
      { fields: ["lockId"] },
    ],
  }
);

module.exports = OrderItem;