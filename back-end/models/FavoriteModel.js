// back-end/models/Favorite.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class Favorite extends Model {}

Favorite.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    lockId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "locks", key: "id" },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "Favorite",
    tableName: "favorites",
    timestamps: true,
    indexes: [
      { unique: true, fields: ["userId", "lockId"] }, // нельзя дважды добавить в избранное
    ],
  }
);

module.exports = Favorite;