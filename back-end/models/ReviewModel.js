// back-end/models/ReviewModel.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/**
 * Модель отзыва о замке
 * Таблица: reviews
 * По 3 отзыва на каждый замок (для показа под карточкой товара)
 */
class Review extends Model {}

/**
 * Инициализация модели Review
 */
Review.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    lockId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "К какому замку относится отзыв",
    },

    author: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Имя автора отзыва",
    },

    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
      comment: "Оценка от 1 до 5 звёзд",
    },

    text: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Текст отзыва",
    },

    date: {
      type: DataTypes.DATEONLY, // только дата: 2025-04-15
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "Дата отзыва (для отображения: '15 апреля 2025')",
    },

    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Проверенный покупатель (галочка)",
    },
  },
  {
    sequelize,
    modelName: "Review",
    tableName: "reviews",
    timestamps: true, // createdAt и updatedAt (на всякий случай)
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    indexes: [
      { fields: ["lockId"] },
      { fields: ["rating"] },
      { fields: ["createdAt"] },
    ],
    comment: "Отзывы покупателей под карточками замков (по 3 на товар)",
  }
);

module.exports = Review;