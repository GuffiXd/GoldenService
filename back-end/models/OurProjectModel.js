// back-end/models/OurProjectModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const OurProject = sequelize.define(
  "OurProject",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    image_path: {
      type: DataTypes.STRING(512),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    budget: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    logo_path: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
  },
  {
    tableName: "our_projects",
    timestamps: true,
  }
);

module.exports = OurProject;