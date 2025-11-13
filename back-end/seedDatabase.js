// back-end/seedDatabase.js
const Lock = require("./models/LockModel");
const Category = require("./models/CategoryModel");
const Statistics = require("./models/StatisticsModel");

async function seedDatabase() {
  console.log("СИД ЗАПУЩЕН!");

  try {
    const lockCount = await Lock.count();
    const catCount = await Category.count();
    const statCount = await Statistics.count();

    if (lockCount > 0 || catCount > 0 || statCount > 0) {
      console.log("БД уже заполнена. Пропускаем...");
      return;
    }

    console.log("Начинаем заполнение...");

    const categories = await Category.bulkCreate(
      [
        { name: "Накладные электронные замки", slug: "overlay" },
        { name: "Врезные электронные замки", slug: "mortise" },
        { name: "Замки для квартиры", slug: "apartment" },
        { name: "Замки для дома", slug: "home" },
        { name: "Замки для отелей", slug: "hotel" },
        { name: "Замки для офиса", slug: "office" },
        { name: "Замки для шкафчиков", slug: "cabinet" },
        { name: "Замки для раздевалок", slug: "locker-room" },
      ],
      { returning: true }
    );

    const locks = [
      // 1. Накладные
      {
        name: "Накладной замок Golden Soft Pro для квартиры",
        price: "25000.00",
        price_with_discount: "29000.00",
        image_path: "/images/products/flat-lock.webp",
        description: "Компактный накладной замок с биометрией и кодовой панелью. Идеален для установки на входную дверь без замены цилиндра. Поддержка до 100 отпечатков пальцев.",
        is_featured: true,
        is_popular: true,
        in_stock: true,
        categoryId: categories[0].id,
      },
      {
        name: "Накладной замок Golden Soft Mini для кладовки",
        price: "18000.00",
        price_with_discount: null,
        image_path: "/images/products/rim-lock.webp",
        description: "Миниатюрный электронный замок для внутренних дверей. Работает от батареек до 12 месяцев. Простая установка за 10 минут.",
        in_stock: false,
        categoryId: categories[0].id,
      },

      // 2. Врезные
      {
        name: "Врезной замок Golden Soft Smart для квартиры",
        price: "32000.00",
        price_with_discount: "35000.00",
        image_path: "/images/products/mortise-lock.webp",
        description: "Интеллектуальный врезать замок с управлением через приложение. Автоматическое запирание, журнал посещений, интеграция с умным домом.",
        in_stock: true,
        categoryId: categories[1].id,
      },
      {
        name: "Врезной замок Golden Soft WiFi для офиса",
        price: "38000.00",
        price_with_discount: null,
        image_path: "/images/products/hotel-lock.webp",
        description: "Профессиональный WiFi-замок с удалённым доступом. Подходит для офисов и коворкингов. До 500 пользователей, временные коды.",
        in_stock: true,
        categoryId: categories[1].id,
      },

      // 3. Квартира
      {
        name: "Дверной замок Golden Soft Secure для квартиры",
        price: "28000.00",
        price_with_discount: "32000.00",
        image_path: "/images/products/home-lock.webp",
        description: "Надёжный электронный замок с двойной аутентификацией: отпечаток + код. Защита от взлома, антишоковая технология.",
        is_popular: true,
        in_stock: true,
        categoryId: categories[2].id,
      },
      {
        name: "Дверной замок Golden Soft Touch для квартиры",
        price: "26000.00",
        price_with_discount: null,
        image_path: "/images/products/office-lock.webp",
        description: "Сенсорный замок с подсветкой клавиатуры. Антивандальное покрытие, защита от подбора кода.",
        in_stock: false,
        categoryId: categories[2].id,
      },

      // 4. Дом
      {
        name: "Дверной замок Golden Soft Biometric для дома",
        price: "30000.00",
        price_with_discount: "34000.00",
        image_path: "/images/products/rooms-lock.webp",
        description: "Биометрический замок премиум-класса. Распознавание лица + отпечаток. Идеален для загородного дома.",
        in_stock: true,
        categoryId: categories[3].id,
      },
      {
        name: "Дверной замок Golden Soft Classic для дома",
        price: "22000.00",
        price_with_discount: null,
        image_path: "/images/products/closet-lock.webp",
        description: "Классический электронный замок с механическим ключом в комплекте. Простота и надёжность для повседневного использования.",
        in_stock: true,
        categoryId: categories[3].id,
      },

      // 5. Отель
      {
        name: "Вариативный замок Golden Soft для отеля",
        price: "45000.00",
        price_with_discount: "50000.00",
        image_path: "/images/products/hotel-lock.webp",
        description: "Отельный замок с RFID-картами и мобильным ключом. Интеграция с PMS-системами. До 1000 карт, энергосбережение.",
        in_stock: true,
        categoryId: categories[4].id,
      },
      {
        name: "Дверной замок Golden Soft RFID для отеля",
        price: "40000.00",
        price_with_discount: null,
        image_path: "/images/products/mortise-lock.webp",
        description: "Профессиональный RFID-замок для гостиниц. Автоматическая блокировка, журнал событий, поддержка Mifare.",
        in_stock: false,
        categoryId: categories[4].id,
      },

      // 6. Офис
      {
        name: "Дверной замок Golden Soft Pro для офиса",
        price: "35000.00",
        price_with_discount: "39000.00",
        image_path: "/images/products/office-lock.webp",
        description: "Офисный замок с распознаванием лиц и QR-кодами. Гибкие права доступа, отчётность по сотрудникам.",
        is_popular: true,
        in_stock: true,
        categoryId: categories[5].id,
      },
      {
        name: "Дверной замок Golden Soft Access для офиса",
        price: "31000.00",
        price_with_discount: null,
        image_path: "/images/products/flat-lock.webp",
        description: "Доступ по карте и коду. Подходит для переговорных и кабинетов. Простая интеграция с СКУД.",
        in_stock: true,
        categoryId: categories[5].id,
      },

      // 7. Шкафчики
      {
        name: "Замок Golden Soft Mini для шкафчика",
        price: "9000.00",
        price_with_discount: "12000.00",
        image_path: "/images/products/closet-lock.webp",
        description: "Компактный замок для фитнес-клубов и раздевалок. Питание от батареек, срок службы 2 года.",
        is_featured: true,
        in_stock: true,
        categoryId: categories[6].id,
      },
      {
        name: "Замок Golden Soft Touch для шкафчика",
        price: "11000.00",
        price_with_discount: null,
        image_path: "/images/products/rim-lock.webp",
        description: "Сенсорный замок с подсветкой. Автоматическое открытие при вводе кода. Пыле- и влагозащита.",
        in_stock: false,
        categoryId: categories[6].id,
      },

      // 8. Раздевалки
      {
        name: "Замок Golden Soft Pro для раздевалки",
        price: "8500.00",
        price_with_discount: "10000.00",
        image_path: "/images/products/rooms-lock.webp",
        description: "Прочный замок для спортивных залов. Ударопрочный корпус, защита IP65. До 50 пользователей.",
        is_featured: true,
        in_stock: true,
        categoryId: categories[7].id,
      },
      {
        name: "Замок Golden Soft RFID для раздевалки",
        price: "9500.00",
        price_with_discount: null,
        image_path: "/images/products/home-lock.webp",
        description: "Бесконтактный замок с браслетами. Быстрое открытие, гигиенично, подходит для бассейнов.",
        in_stock: true,
        categoryId: categories[7].id,
      },
    ];

    await Lock.bulkCreate(locks);
    console.log("16 замков добавлено (с описаниями)");

    await Statistics.bulkCreate([
      { title: "Счастливых клиентов", value: 5567 },
      { title: "Продуктов на выбор", value: 1245 },
      { title: "Продаж в день", value: 372 },
      { title: "Лет на рынке", value: 20 },
    ]);
    console.log("Статистика добавлена");

    console.log("БД УСПЕШНО ЗАПОЛНЕНА!");
  } catch (error) {
    console.error("ОШИБКА В СИДЕ:", error);
  }
}

module.exports = seedDatabase;