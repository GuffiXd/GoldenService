// back-end/models/OurProjectModel.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");


class OurProject extends Model {}


OurProject.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Название проекта (например: 'Офис Сбера в Москве')",
    },

    image_path: {
      type: DataTypes.STRING(512),
      allowNull: false,
      comment: "Главное фото проекта",
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Подробное описание проекта",
    },

    budget: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "Бюджет проекта (например: '2.5 млн ₽' или 'По запросу')",
    },

    logo_path: {
      type: DataTypes.STRING(512),
      allowNull: true,
      comment: "Логотип заказчика (если есть)",
    },
  },
  {
    sequelize,
    modelName: "OurProject",
    tableName: "our_projects",
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    indexes: [
      { fields: ["createdAt"] },
    ],
  }
);

module.exports = OurProject;