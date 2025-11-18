// back-end/models/CategoryModel.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/**
 * Модель категории замков
 * Таблица: categories
 */
class Category extends Model {}

/**
 * Инициализация модели Category
 */
Category.init(
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
      comment: "Название категории (отображается в меню и на сайте)",
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Slug обязателен" },
        is: /^[a-z0-9-]+$/i,
      },
      comment: "ЧПУ-адрес категории (например: dvernye-zamki)",
    },
    image_path: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Путь к изображению категории (например: /images/categories/door-locks.webp)",
      validate: {
        is: /\.(webp|jpg|jpeg|png|svg)$/i,
      },
    },
  },
  {
    sequelize,
    modelName: "Category",          // имя модели в коде
    tableName: "categories",        // имя таблицы в БД
    timestamps: true,               // createdAt + updatedAt
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    indexes: [
      { unique: true, fields: ["slug"] },
      { fields: ["name"] },
    ],
    hooks: {
      // Автоматически генерируем slug из name, если не указан (по желанию можно включить)
      // beforeValidate: (category) => {
      //   if (!category.slug && category.name) {
      //     category.slug = category.name
      //       .toLowerCase()
      //       .replace(/[^a-z0-9]+/g, "-")
      //       .replace(/(^-|-$)/g, "");
      //   }
      // },
    },
  }
);

module.exports = Category;