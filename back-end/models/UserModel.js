// back-end/models/UserModel.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class User extends Model {}


User.init(
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
      comment: "ФИО пользователя",
      validate: {
        len: [2, 100],
      },
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Некорректный email" },
      },
      comment: "Email — используется для входа",
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "Телефон в формате +7XXXXXXXXXX",
      validate: {
        is: /^\+?[0-9]{10,15}$/,
      },
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Хэшированный пароль (bcrypt)",
    },

    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
      comment: "Роль: user — обычный пользователь, admin — администратор",
    },


    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    paranoid: true,    
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    indexes: [
      { unique: true, fields: ["email"] },
      { fields: ["phone"] },
      { fields: ["role"] },
    ],
    hooks: {
  
    },
  }
);

module.exports = User;