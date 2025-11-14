// back-end/models/StatisticsModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Callback = sequelize.define(
  "Callback",
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
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "callback",
    timestamps: true,
  }
);

module.exports = Callback;
