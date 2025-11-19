// back-end/models/OrderItemModel.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");


class OrderItem extends Model {}

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
    tableName: "order_items", 
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