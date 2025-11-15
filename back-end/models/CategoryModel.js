// back-end/models/Category.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Название категории обязательно" },
        len: [2, 100],
      },
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Slug обязателен" },
        is: /^[a-z0-9-]+$/i, // только буквы, цифры, дефис
      },
    },
    image_path: {
      type: DataTypes.STRING(255),
      allowNull: true, // можно без картинки
      validate: {
        is: /\.(webp|jpg|jpeg|png|svg)$/i, // только изображения
      },
    },
  },
  {
    tableName: "categories",
    timestamps: true,
    indexes: [
      { fields: ["slug"], unique: true },
      { fields: ["name"] },
    ],
  }
);

module.exports = Category;