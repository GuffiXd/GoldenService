// back-end/models/OrderModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Lock = require("./LockModel");

const Worders = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING(255), allowNull: false },
    company: { type: DataTypes.STRING(255), allowNull: true },
    phone: { type: DataTypes.STRING(50), allowNull: false },
    lockId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Lock, key: "id" },
    },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    logo: { type: DataTypes.BOOLEAN, defaultValue: false },
    installation: { type: DataTypes.BOOLEAN, defaultValue: false },
    totalCost: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  {
    tableName: "wholesale",
    timestamps: true,
  }
);

Lock.hasMany(Worders, { foreignKey: "lockId" });
Worders.belongsTo(Lock, { foreignKey: "lockId" });

module.exports = Worders;