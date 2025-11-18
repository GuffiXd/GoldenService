// back-end/models/StatisticsModel.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/**
 * Модель для блока статистики на главной странице
 * (например: "1250+ довольных клиентов", "15 лет на рынке" и т.д.)
 * Таблица: statistics
 */
class Statistics extends Model {}

/**
 * Инициализация модели Statistics
 */
Statistics.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Текст под цифрой (например: 'Довольных клиентов', 'Лет на рынке')",
    },

    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Числовое значение для анимированного счётчика",
    },
  },
  {
    sequelize,
    modelName: "Statistics",
    tableName: "statistics",
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    indexes: [
      { fields: ["id"] }, // по умолчанию, но явно — для порядка
    ],
    comment: "Статистика для главной страницы — 4 блока с анимированными цифрами",
  }
);

module.exports = Statistics;