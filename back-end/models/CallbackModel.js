// back-end/models/StatisticsModel.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");


class Statistics extends Model {}


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
      comment: "Название показателя (например: 'Довольных клиентов')",
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Числовое значение (например: 1250)",
    },
  },
  {
    sequelize,
    modelName: "Statistics",   
    tableName: "statistics",   
    timestamps: true,           
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  }
);

module.exports = Statistics;