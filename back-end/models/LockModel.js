const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Lock = sequelize.define(
  "Lock",
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
      validate: {
        notEmpty: true,
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
    price_with_discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true, // ← ДОПУСКАЕМ NULL (если нет скидки)
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
    description: {
      type: DataTypes.TEXT, // ← TEXT, а не STRING (для длинных описаний)
      allowNull: true,     // ← можно без описания
    },
    image_path: {
      type: DataTypes.STRING(512),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // ← по умолчанию НЕ в слайдере
    },
  },
  {
    tableName: "locks",
    timestamps: true,
    indexes: [
      { fields: ["is_featured"] },
      { fields: ["price"] },
    ],
  }
);

module.exports = Lock;