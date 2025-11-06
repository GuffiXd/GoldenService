// back-end/models/Lock.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Category = require("./CategoryModel");

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
      validate: { notEmpty: true },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    price_with_discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: { min: 0 },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image_path: {
      type: DataTypes.STRING(512),
      allowNull: false,
      validate: { notEmpty: true },
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_popular: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
    },
  },
  {
    tableName: "locks",
    timestamps: true,
    indexes: [
      { fields: ["is_featured"] },
      { fields: ["is_popular"] },
      { fields: ["categoryId"] },
      { fields: ["price"] },
    ],
  }
);

// Связи
Lock.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Lock, { foreignKey: "categoryId" });

module.exports = Lock;