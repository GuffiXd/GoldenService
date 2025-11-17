// back-end/models/LockModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Category = require("./CategoryModel");

const Lock = sequelize.define(
  "Lock",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    article: { type: DataTypes.STRING(100), unique: true, allowNull: false },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      get() {
        return Number(this.getDataValue("price"));
      },
    },
    price_with_discount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      get() {
        const value = this.getDataValue("price_with_discount");
        return value ? Number(value) : null;
      },
    },
    description: { type: DataTypes.TEXT, allowNull: true },
    short_description: { type: DataTypes.STRING(512), allowNull: true }, // для карточки
    image_path: { type: DataTypes.STRING(512), allowNull: false },
    image_gallery: { type: DataTypes.JSON, defaultValue: [] }, // массив путей
    is_popular: { type: DataTypes.BOOLEAN, defaultValue: false },
    in_stock: { type: DataTypes.BOOLEAN, defaultValue: true },

    // Новые поля — полные характеристики
    door_type: { type: DataTypes.STRING(255) }, // "Деревянная", "Металлическая"
    door_thickness: { type: DataTypes.STRING(100) }, // "35-50 мм"
    unlocking_methods: { type: DataTypes.JSON }, // ["Палец", "Код", "Карта", "Ключ", "Лицо"]
    battery_life: { type: DataTypes.STRING(100) }, // "До 12 месяцев"
    material: { type: DataTypes.STRING(255) }, // "Сталь, алюминий"
    color: { type: DataTypes.STRING(100) }, // "Чёрный", "Золото", "Серебро"
    weight: { type: DataTypes.STRING(100) }, // "2.5 кг"
    dimensions: { type: DataTypes.STRING(200) }, // "302мм × 43мм × 22.5мм"
    waterproof: { type: DataTypes.STRING(100) }, // "IP65"
    warranty: { type: DataTypes.STRING(100), defaultValue: "3 года" },
    installation_time: { type: DataTypes.STRING(100) }, // "15 минут"
    app_support: { type: DataTypes.BOOLEAN, defaultValue: false },
    face_id: { type: DataTypes.BOOLEAN, defaultValue: false },
    wifi: { type: DataTypes.BOOLEAN, defaultValue: false },

    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Category, key: "id" },
    },
  },
  {
    tableName: "locks",
    timestamps: true,
  }
);

Lock.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Lock, { foreignKey: "categoryId" });

module.exports = Lock;
