// models/OrderItemModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Order = require("./OrderModel");
const Lock = require("./LockModel");

const OrderItem = sequelize.define("OrderItem", {
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  price_at_purchase: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Order.belongsToMany(Lock, { through: OrderItem });
Lock.belongsToMany(Order, { through: OrderItem });

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);
OrderItem.belongsTo(Lock);

module.exports = OrderItem;