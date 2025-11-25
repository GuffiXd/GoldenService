// back-end/models/CallbackModel.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class Callback extends Model {}

Callback.init(
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
      comment: "Имя клиента",
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isEmail: true,
      },
      comment: "Email клиента",
    },
    is_processed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Обработана ли заявка",
    },
  },
  {
    sequelize,
    modelName: "Callback",
    tableName: "callbacks",
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  }
);

module.exports = Callback;