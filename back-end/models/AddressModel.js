// back-end/models/Address.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class Address extends Model {}

Address.init(
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
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Дом, Работа, Квартира и т.д.",
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    apartment: DataTypes.STRING(50),
    entrance: DataTypes.STRING(20),
    floor: DataTypes.STRING(20),
    intercom: DataTypes.STRING(20),
    comment: DataTypes.TEXT,
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Address",
    tableName: "addresses",
    timestamps: true,
    paranoid: true,
    indexes: [{ fields: ["userId"] }],
    hooks: {
      // При установке isDefault = true — сбрасываем у других
      beforeCreate: async (address) => {
        if (address.isDefault) {
          await Address.update(
            { isDefault: false },
            { where: { userId: address.userId, isDefault: true } }
          );
        }
      },
      beforeUpdate: async (address) => {
        if (address.changed("isDefault") && address.isDefault) {
          await Address.update(
            { isDefault: false },
            { where: { userId: address.userId, isDefault: true, id: { [require("sequelize").Op.ne]: address.id } } }
          );
        }
      },
    },
  }
);

module.exports = Address;