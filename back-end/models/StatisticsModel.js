// back-end/models/StatisticsModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Statistics = sequelize.define(
  "Statistics",
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
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "statistics",
    timestamps: true,
  }
);

module.exports = Statistics;