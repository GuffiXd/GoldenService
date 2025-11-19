// back-end/models/WholesaleOrderModel.js

const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class WholesaleOrder extends Model {}


WholesaleOrder.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Имя контактного лица",
    },

    company: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Название компании (опционально)",
    },

    phone: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "Телефон для связи",
      validate: {
        is: /^\+?[0-9]{10,15}$/,
      },
    },

    lockId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "ID замка, который хотят заказать оптом",
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
      comment: "Количество единиц (обычно от 10+)",
    },

    logo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Нужна ли гравировка логотипа",
    },

    installation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Нужен ли монтаж",
    },

    totalCost: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      comment: "Ориентировочная сумма (может быть примерной)",
      get() {
        const value = this.getDataValue("totalCost");
        return value ? Number(value) : 0;
      },
    },
  },
  {
    sequelize,
    modelName: "WholesaleOrder",  
    tableName: "wholesale_orders", 
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    indexes: [
      { fields: ["lockId"] },
      { fields: ["createdAt"] },
    ],
    comment: "Заявки на оптовый заказ замков (из формы на сайте)",
  }
);

module.exports = WholesaleOrder;