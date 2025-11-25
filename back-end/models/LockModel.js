// back-end/models/LockModel.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class Lock extends Model {}

Lock.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    // Основные данные
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Полное название замка",
    },
    article: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: "Артикул (уникальный код товара)",
    },

    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      get() {
        const value = this.getDataValue("price");
        return value ? Number(value) : 0;
      },
      comment: "Цена без скидки",
    },
    price_with_discount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      get() {
        const value = this.getDataValue("price_with_discount");
        return value ? Number(value) : null;
      },
      comment: "Цена со скидкой (если есть)",
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Полное описание для страницы товара",
    },
    short_description: {
      type: DataTypes.STRING(512),
      allowNull: true,
      comment: "Краткое описание для карточки товара",
    },

    image_path: {
      type: DataTypes.STRING(512),
      allowNull: false,
      comment: "Главное изображение замка",
    },
    image_gallery: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Массив дополнительных изображений",
    },

    // Флаги
    is_popular: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Популярный товар (выводится в блоке 'Хиты продаж')",
    },
    in_stock: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Наличие на складе",
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "Количество товара на складе",
    },

    // Технические характеристики
    door_type: { type: DataTypes.STRING(255), comment: "Тип двери: деревянная, металлическая и т.д." },
    door_thickness: { type: DataTypes.STRING(100), comment: "Толщина двери, например: 35-50 мм" },
    unlocking_methods: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: '["Палец", "Код", "Карта", "Ключ", "Лицо"]',
    },
    battery_life: { type: DataTypes.STRING(100), comment: "Срок работы от батареи" },
    material: { type: DataTypes.STRING(255), comment: "Материал корпуса" },
    color: { type: DataTypes.STRING(100), comment: "Цвет замка" },
    weight: { type: DataTypes.STRING(100), comment: "Вес замка" },
    dimensions: { type: DataTypes.STRING(200), comment: "Габариты: длина × ширина × высота" },
    waterproof: { type: DataTypes.STRING(100), comment: "Степень защиты от воды, например: IP65" },
    warranty: {
      type: DataTypes.STRING(100),
      defaultValue: "3 года",
      comment: "Гарантия",
    },
    installation_time: { type: DataTypes.STRING(100), comment: "Время установки" },
    app_support: { type: DataTypes.BOOLEAN, defaultValue: false },
    face_id: { type: DataTypes.BOOLEAN, defaultValue: false },
    wifi: { type: DataTypes.BOOLEAN, defaultValue: false },

    // Внешний ключ
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
      comment: "ID категории замка",
    },
  },
  {
    sequelize,
    modelName: "Lock",     
    tableName: "locks",  
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    indexes: [
      { fields: ["article"], unique: true },
      { fields: ["categoryId"] },
      { fields: ["is_popular"] },
      { fields: ["in_stock"] },
      { fields: ["price"] },
    ],
  }
);

module.exports = Lock;