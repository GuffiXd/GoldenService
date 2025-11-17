// models/OrderModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./UserModel");

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  total_price: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "В копейках (или рублях ×100, если хочешь точность)",
  },
  status: {
    type: DataTypes.ENUM("new", "processing", "shipped", "completed", "canceled"),
    defaultValue: "new",
  },
  payment_method: { type: DataTypes.STRING(50), allowNull: false },
  comment: { type: DataTypes.TEXT },

  // Адрес доставки
  address: DataTypes.STRING,
  city: DataTypes.STRING,
  postcode: DataTypes.STRING,
  country: { type: DataTypes.STRING, defaultValue: "Россия" },
}, {
  timestamps: true,
});

// Связи
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

module.exports = Order;