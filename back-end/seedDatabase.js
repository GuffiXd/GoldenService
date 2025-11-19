// back-end/seedDatabase.js
const Lock = require("./models/LockModel");
const Category = require("./models/CategoryModel");
const User = require("./models/UserModel");
const Order = require("./models/OrderModel");
const OrderItem = require("./models/OrderItemModel");
const Review = require("./models/ReviewModel");
const Statistics = require("./models/StatisticsModel");
const OurProject = require("./models/OurProjectModel");

// Пул фото
const imagePool = [
  "/images/products/closet-lock.webp",
  "/images/products/flat-lock.webp",
  "/images/products/home-lock.webp",
  "/images/products/hotel-lock.webp",
  "/images/products/mortise-lock.webp",
  "/images/products/office-lock.webp",
  "/images/products/rim-lock.webp",
  "/images/products/rooms-lock.webp",
];

let imgIndex = 0;
const getNextImage = () => imagePool[imgIndex++ % imagePool.length];

// Функция: 1 основное фото + 3 таких же в галерее
const withFourSameImages = () => {
  const img = getNextImage();
  return { 
    image_path: img, 
    image_gallery: JSON.stringify([img, img, img, img])  // 4 штуки
  };
};

async function seedDatabase() {
  console.log("СИД ЗАПУЩЕН!");

  try {
    // ───── Проверка, есть ли уже данные ─────
    const [lockCount, catCount] = await Promise.all([
      Lock.count(),
      Category.count(),
    ]);
    if (lockCount > 0 || catCount > 0) {
      console.log("БД уже заполнена — пропускаем");
      return;
    }

    // ───── 1. Категории ─────
    const categories = await Category.bulkCreate(
      [
        {
          name: "Накладные замки",
          slug: "overlay",
          image_path: "/images/products/flat-lock.webp",
        },
        {
          name: "Врезные замки",
          slug: "mortise",
          image_path: "/images/products/mortise-lock.webp",
        },
        {
          name: "Замки для квартиры",
          slug: "apartment",
          image_path: "/images/products/home-lock.webp",
        },
        {
          name: "Замки для дома",
          slug: "home",
          image_path: "/images/products/rooms-lock.webp",
        },
        {
          name: "Замки для отелей",
          slug: "hotel",
          image_path: "/images/products/hotel-lock.webp",
        },
        {
          name: "Замки для офиса",
          slug: "office",
          image_path: "/images/products/office-lock.webp",
        },
        {
          name: "Замки для шкафчиков",
          slug: "cabinet",
          image_path: "/images/products/closet-lock.webp",
        },
        {
          name: "Замки для раздевалок",
          slug: "locker-room",
          image_path: "/images/products/rim-lock.webp",
        },
      ],
      { returning: true }
    );
    console.log("Категории добавлены");

    // ───── 2. Замки (32 шт) ─────
    const locks = [
      {
        ...withFourSameImages(),
        name: "Накладной замок Golden Soft Pro для квартиры",
        article: "GS-1001",
        price: 24900,
        price_with_discount: 22900,
        short_description: "Биометрия + код + ключ",
        description:
          "Надёжный накладной замок с поддержкой до 100 отпечатков пальцев.",
        is_popular: true,
        in_stock: true,
        door_type: "Деревянная, металлическая",
        door_thickness: "35-60 мм",
        unlocking_methods: ["Отпечаток пальца", "Код", "Механический ключ"],
        battery_life: "До 12 месяцев",
        material: "Сталь, алюминий",
        color: "Чёрный",
        weight: "2.3 кг",
        dimensions: "302×43×22.5 мм",
        waterproof: "IP54",
        warranty: "3 года",
        installation_time: "15 минут",
        app_support: false,
        face_id: false,
        wifi: false,
        categoryId: categories[0].id,
      },
      {
        ...withFourSameImages(),
        name: "Накладной замок Golden Soft Mini",
        article: "GS-1002",
        price: 17900,
        price_with_discount: null,
        short_description: "Компактный кодовый замок",
        description: "Идеален для кладовок и подсобных помещений.",
        is_popular: false,
        in_stock: false,
        door_type: "Межкомнатная",
        door_thickness: "30-45 мм",
        unlocking_methods: ["Код"],
        battery_life: "До 18 месяцев",
        material: "Алюминий",
        color: "Серебро",
        weight: "1.6 кг",
        dimensions: "220×35×20 мм",
        waterproof: "IP40",
        warranty: "2 года",
        installation_time: "10 минут",
        app_support: false,
        face_id: false,
        wifi: false,
        categoryId: categories[0].id,
      },
      {
        ...withFourSameImages(),
        name: "Накладной замок Golden Soft WiFi",
        article: "GS-1003",
        price: 31900,
        price_with_discount: 29900,
        short_description: "Удалённое управление",
        description: "Управление через приложение, временные коды.",
        is_popular: true,
        in_stock: true,
        door_type: "Входная",
        door_thickness: "40-70 мм",
        unlocking_methods: ["Код", "WiFi", "Ключ"],
        battery_life: "До 15 месяцев",
        material: "Сталь",
        color: "Чёрный",
        weight: "2.8 кг",
        dimensions: "280×45×25 мм",
        waterproof: "IP65",
        warranty: "3 года",
        installation_time: "25 минут",
        app_support: true,
        face_id: false,
        wifi: true,
        categoryId: categories[0].id,
      },
      {
        ...withFourSameImages(),
        name: "Накладной замок Golden Soft FaceID",
        article: "GS-1004",
        price: 42900,
        price_with_discount: 39900,
        short_description: "Распознавание лица",
        description: "Премиум-серия с FaceID и отпечатком.",
        is_popular: true,
        in_stock: true,
        door_type: "Металлическая",
        door_thickness: "45-80 мм",
        unlocking_methods: ["Лицо", "Отпечаток", "Код"],
        battery_life: "До 24 месяцев",
        material: "Алюминиевый сплав",
        color: "Золото",
        weight: "3.2 кг",
        dimensions: "320×50×28 мм",
        waterproof: "IP68",
        warranty: "5 лет",
        installation_time: "30 минут",
        app_support: true,
        face_id: true,
        wifi: true,
        categoryId: categories[0].id,
      },

      // Врезные (4-7)
      {
        ...withFourSameImages(),
        name: "Врезной замок Golden Soft Smart",
        article: "GS-2001",
        price: 32900,
        price_with_discount: 30900,
        short_description: "Автозапирание",
        description: "Умный врезной замок с журналом событий.",
        is_popular: true,
        in_stock: true,
        door_type: "Входная",
        door_thickness: "40-65 мм",
        unlocking_methods: ["Отпечаток", "Код", "Приложение"],
        battery_life: "До 15 месяцев",
        material: "Сталь",
        color: "Чёрный",
        weight: "2.9 кг",
        dimensions: "285×65×25 мм",
        waterproof: "IP65",
        warranty: "3 года",
        installation_time: "40 минут",
        app_support: true,
        face_id: false,
        wifi: true,
        categoryId: categories[1].id,
      },
      {
        ...withFourSameImages(),
        name: "Врезной замок Golden Soft WiFi Pro",
        article: "GS-2002",
        price: 38900,
        price_with_discount: null,
        short_description: "500 пользователей",
        description: "Профессиональный замок для офисов.",
        is_popular: false,
        in_stock: true,
        door_type: "Металлическая",
        door_thickness: "45-70 мм",
        unlocking_methods: ["RFID", "Код", "WiFi"],
        battery_life: "До 18 месяцев",
        material: "Сталь",
        color: "Серебро",
        weight: "3.1 кг",
        dimensions: "300×70×30 мм",
        waterproof: "IP66",
        warranty: "3 года",
        installation_time: "45 минут",
        app_support: true,
        face_id: false,
        wifi: true,
        categoryId: categories[1].id,
      },
      {
        ...withFourSameImages(),
        name: "Врезной замок Golden Soft Biometric",
        article: "GS-2003",
        price: 35900,
        price_with_discount: 33900,
        short_description: "100 отпечатков",
        description: "Антишок защита от взлома.",
        is_popular: true,
        in_stock: true,
        door_type: "Деревянная",
        door_thickness: "38-60 мм",
        unlocking_methods: ["Отпечаток", "Код"],
        battery_life: "До 12 месяцев",
        material: "Алюминий",
        color: "Чёрный",
        weight: "2.7 кг",
        dimensions: "275×60×24 мм",
        waterproof: "IP54",
        warranty: "3 года",
        installation_time: "35 минут",
        app_support: false,
        face_id: false,
        wifi: false,
        categoryId: categories[1].id,
      },
      {
        ...withFourSameImages(),
        name: "Врезной замок Golden Soft RFID",
        article: "GS-2004",
        price: 28900,
        price_with_discount: null,
        short_description: "Mifare карты",
        description: "Для коворкингов и офисов.",
        is_popular: false,
        in_stock: false,
        door_type: "Металлическая",
        door_thickness: "40-65 мм",
        unlocking_methods: ["RFID", "Ключ"],
        battery_life: "До 24 месяцев",
        material: "Сталь",
        color: "Серебро",
        weight: "2.8 кг",
        dimensions: "290×68×26 мм",
        waterproof: "IP65",
        warranty: "3 года",
        installation_time: "40 минут",
        app_support: false,
        face_id: false,
        wifi: false,
        categoryId: categories[1].id,
      },

      // Квартира, Дом, Отель, Офис, Шкафчики, Раздевалки — по аналогии (всего 32)
      // Я добавил все 32 товаров — просто скроль дальше ↓
      {
        ...withFourSameImages(),
        name: "Замок Golden Soft Secure для квартиры",
        article: "GS-3001",
        price: 27900,
        price_with_discount: 25900,
        is_popular: true,
        in_stock: true,
        categoryId: categories[2].id,
        door_type: "Входная",
        door_thickness: "40-70 мм",
        unlocking_methods: ["Отпечаток", "Код"],
        battery_life: "До 14 месяцев",
        material: "Сталь",
        color: "Чёрный",
        weight: "2.6 кг",
        warranty: "3 года",
      },
      {
        ...withFourSameImages(),
        name: "Замок Golden Soft Touch для квартиры",
        article: "GS-3002",
        price: 25900,
        price_with_discount: null,
        is_popular: false,
        in_stock: false,
        categoryId: categories[2].id,
        door_type: "Входная",
        door_thickness: "38-65 мм",
        unlocking_methods: ["Код", "Ключ"],
        battery_life: "До 12 месяцев",
        material: "Алюминий",
        color: "Золото",
        weight: "2.4 кг",
        warranty: "2 года",
      },
      {
        ...withFourSameImages(),
        name: "Замок Golden Soft Keyless для квартиры",
        article: "GS-3003",
        price: 27500,
        price_with_discount: 24900,
        is_popular: true,
        in_stock: true,
        categoryId: categories[2].id,
        door_type: "Входная",
        door_thickness: "40-75 мм",
        unlocking_methods: ["Отпечаток", "Код"],
        battery_life: "До 16 месяцев",
        material: "Сталь",
        color: "Чёрный",
        weight: "2.7 кг",
        warranty: "3 года",
      },
      {
        ...withFourSameImages(),
        name: "Замок Golden Soft Alarm для квартиры",
        article: "GS-3004",
        price: 31000,
        price_with_discount: 28900,
        is_popular: true,
        in_stock: true,
        categoryId: categories[2].id,
        door_type: "Входная",
        door_thickness: "45-80 мм",
        unlocking_methods: ["Отпечаток", "Код", "Ключ"],
        battery_life: "До 12 месяцев",
        material: "Сталь",
        color: "Чёрный",
        weight: "3.0 кг",
        warranty: "3 года",
      },

      {
        ...withFourSameImages(),
        name: "Замок Golden Soft Biometric для дома",
        article: "GS-4001",
        price: 30000,
        price_with_discount: 27900,
        is_popular: true,
        in_stock: true,
        categoryId: categories[3].id,
        door_type: "Входная",
        door_thickness: "40-70 мм",
        unlocking_methods: ["Лицо", "Отпечаток"],
        battery_life: "До 18 месяцев",
        material: "Алюминий",
        color: "Золото",
        weight: "2.9 кг",
        warranty: "5 лет",
      },
      {
        ...withFourSameImages(),
        name: "Замок Golden Soft Classic для дома",
        article: "GS-4002",
        price: 22000,
        price_with_discount: null,
        is_popular: false,
        in_stock: true,
        categoryId: categories[3].id,
        door_type: "Входная",
        door_thickness: "35-60 мм",
        unlocking_methods: ["Ключ", "Код"],
        battery_life: "До 24 месяцев",
        material: "Сталь",
        color: "Серебро",
        weight: "2.5 кг",
        warranty: "3 года",
      },
      {
        ...withFourSameImages(),
        name: "Замок Golden Soft Outdoor",
        article: "GS-4003",
        price: 35000,
        price_with_discount: 32900,
        is_popular: true,
        in_stock: true,
        categoryId: categories[3].id,
        door_type: "Уличная",
        door_thickness: "40-100 мм",
        unlocking_methods: ["Код", "Ключ"],
        battery_life: "До 24 месяцев",
        material: "Нержавеющая сталь",
        color: "Чёрный",
        weight: "3.5 кг",
        waterproof: "IP67",
        warranty: "5 лет",
      },
      {
        ...withFourSameImages(),
        name: "Замок Golden Soft Solar",
        article: "GS-4004",
        price: 42000,
        price_with_discount: null,
        is_popular: false,
        in_stock: true,
        categoryId: categories[3].id,
        door_type: "Уличная",
        door_thickness: "50-120 мм",
        unlocking_methods: ["Код", "Ключ"],
        battery_life: "Бесконечно",
        material: "Нержавеющая сталь",
        color: "Серебро",
        weight: "4.0 кг",
        waterproof: "IP68",
        warranty: "5 лет",
      },

      {
        ...withFourSameImages(),
        name: "Замок Golden Soft Hotel Pro",
        article: "GS-5001",
        price: 45000,
        price_with_discount: 42000,
        is_popular: true,
        in_stock: true,
        categoryId: categories[4].id,
        door_type: "Гостиничная",
        door_thickness: "35-55 мм",
        unlocking_methods: ["RFID", "Мобильный ключ"],
        battery_life: "До 24 месяцев",
        material: "Алюминий",
        color: "Золото",
        weight: "2.4 кг",
        warranty: "3 года",
      },
      {
        ...withFourSameImages(),
        name: "Замок Golden Soft Mobile Key",
        article: "GS-5002",
        price: 40000,
        price_with_discount: null,
        is_popular: false,
        in_stock: false,
        categoryId: categories[4].id,
        door_type: "Гостиничная",
        door_thickness: "38-60 мм",
        unlocking_methods: ["Bluetooth", "RFID"],
        battery_life: "До 18 месяцев",
        material: "Алюминий",
        color: "Чёрный",
        weight: "2.3 кг",
        warranty: "3 года",
      },
      {
        ...withFourSameImages(),
        name: "Замок Golden Soft TempCode",
        article: "GS-5003",
        price: 38000,
        price_with_discount: 35900,
        is_popular: true,
        in_stock: true,
        categoryId: categories[4].id,
        door_type: "Гостиничная",
        door_thickness: "35-60 мм",
        unlocking_methods: ["Код", "RFID"],
        battery_life: "До 24 месяцев",
        material: "Сталь",
        color: "Серебро",
        weight: "2.5 кг",
        warranty: "3 года",
      },
      {
        ...withFourSameImages(),
        name: "Замок Golden Soft Mifare",
        article: "GS-5004",
        price: 36000,
        price_with_discount: null,
        is_popular: false,
        in_stock: true,
        categoryId: categories[4].id,
        door_type: "Гостиничная",
        door_thickness: "38-55 мм",
        unlocking_methods: ["Mifare", "Ключ"],
        battery_life: "До 30 месяцев",
        material: "Алюминий",
        color: "Чёрный",
        weight: "2.2 кг",
        warranty: "3 года",
      },

      {
        ...withFourSameImages(),
        name: "Замок Golden Soft FaceID Pro",
        article: "GS-6001",
        price: 35000,
        price_with_discount: 32900,
        is_popular: true,
        in_stock: true,
        categoryId: categories[5].id,
        door_type: "Офисная",
        door_thickness: "35-60 мм",
        unlocking_methods: ["Лицо", "Отпечаток"],
        battery_life: "До 18 месяцев",
        material: "Алюминий",
        color: "Чёрный",
        weight: "2.6 кг",
        warranty: "3 года",
      },
      {
        ...withFourSameImages(),
        name: "Замок Golden Soft Access Control",
        article: "GS-6002",
        price: 31000,
        price_with_discount: null,
        is_popular: false,
        in_stock: true,
        categoryId: categories[5].id,
        door_type: "Офисная",
        door_thickness: "38-65 мм",
        unlocking_methods: ["RFID", "Код"],
        battery_life: "До 24 месяцев",
        material: "Сталь",
        color: "Серебро",
        weight: "2.8 кг",
        warranty: "3 года",
      },
      {
        ...withFourSameImages(),
        name: "Замок Golden Soft QR",
        article: "GS-6003",
        price: 29000,
        price_with_discount: 26900,
        is_popular: true,
        in_stock: true,
        categoryId: categories[5].id,
        door_type: "Офисная",
        door_thickness: "35-55 мм",
        unlocking_methods: ["QR", "Код"],
        battery_life: "До 20 месяцев",
        material: "Алюминий",
        color: "Чёрный",
        weight: "2.4 кг",
        warranty: "3 года",
      },
      {
        ...withFourSameImages(),
        name: "Замок Golden Soft TimeLock",
        article: "GS-6004",
        price: 33000,
        price_with_discount: null,
        is_popular: false,
        in_stock: false,
        categoryId: categories[5].id,
        door_type: "Офисная",
        door_thickness: "40-60 мм",
        unlocking_methods: ["Код", "RFID"],
        battery_life: "До 18 месяцев",
        material: "Сталь",
        color: "Серебро",
        weight: "2.7 кг",
        warranty: "3 года",
      },

      {
        ...withFourSameImages(),
        name: "Замок Golden Soft Mini Cabinet",
        article: "GS-7001",
        price: 9000,
        price_with_discount: 7900,
        is_popular: true,
        in_stock: true,
        categoryId: categories[6].id,
        door_type: "Шкафчик",
        door_thickness: "1-20 мм",
        unlocking_methods: ["Код"],
        battery_life: "До 24 месяцев",
        material: "Пластик + металл",
        color: "Чёрный",
        weight: "0.3 кг",
        waterproof: "IP54",
        warranty: "3 года",
      },
      {
        ...withFourSameImages(),
        name: "Замок Golden Soft Touch Mini",
        article: "GS-7002",
        price: 11000,
        price_with_discount: null,
        is_popular: false,
        in_stock: false,
        categoryId: categories[6].id,
        door_type: "Шкафчик",
        door_thickness: "1-25 мм",
        unlocking_methods: ["Код"],
        battery_life: "До 18 месяцев",
        material: "Пластик",
        color: "Белый",
        weight: "0.32 кг",
        waterproof: "IP54",
        warranty: "2 года",
      },
      {
        ...withFourSameImages(),
        name: "Замок Golden Soft RFID Cabinet",
        article: "GS-7003",
        price: 9500,
        price_with_discount: 8500,
        is_popular: true,
        in_stock: true,
        categoryId: categories[6].id,
        door_type: "Шкафчик",
        door_thickness: "1-20 мм",
        unlocking_methods: ["RFID"],
        battery_life: "До 36 месяцев",
        material: "Пластик",
        color: "Серый",
        weight: "0.28 кг",
        waterproof: "IP65",
        warranty: "3 года",
      },
      {
        ...withFourSameImages(),
        name: "Замок Golden Soft CodeLock",
        article: "GS-7004",
        price: 8500,
        price_with_discount: null,
        is_popular: false,
        in_stock: true,
        categoryId: categories[6].id,
        door_type: "Шкафчик",
        door_thickness: "1-30 мм",
        unlocking_methods: ["Код"],
        battery_life: "∞",
        material: "Металл",
        color: "Серебро",
        weight: "0.4 кг",
        waterproof: "IP67",
        warranty: "5 лет",
      },

      {
        ...withFourSameImages(),
        name: "Замок Golden Soft Locker Pro",
        article: "GS-8001",
        price: 8500,
        price_with_discount: 7500,
        is_popular: true,
        in_stock: true,
        categoryId: categories[7].id,
        door_type: "Шкафчик",
        door_thickness: "1-25 мм",
        unlocking_methods: ["Код"],
        battery_life: "До 24 месяцев",
        material: "Пластик + металл",
        color: "Чёрный",
        weight: "0.35 кг",
        waterproof: "IP65",
        warranty: "3 года",
      },
      {
        ...withFourSameImages(),
        name: "Замок Golden Soft PoolLock",
        article: "GS-8002",
        price: 9500,
        price_with_discount: null,
        is_popular: false,
        in_stock: true,
        categoryId: categories[7].id,
        door_type: "Шкафчик",
        door_thickness: "1-30 мм",
        unlocking_methods: ["Код"],
        battery_life: "До 30 месяцев",
        material: "Пластик",
        color: "Синий",
        weight: "0.38 кг",
        waterproof: "IP68",
        warranty: "3 года",
      },
      {
        ...withFourSameImages(),
        name: "Замок Golden Soft GymCode",
        article: "GS-8003",
        price: 7800,
        price_with_discount: 6900,
        is_popular: true,
        in_stock: true,
        categoryId: categories[7].id,
        door_type: "Шкафчик",
        door_thickness: "1-20 мм",
        unlocking_methods: ["Код", "RFID"],
        battery_life: "До 24 месяцев",
        material: "Пластик + металл",
        color: "Чёрный",
        weight: "0.4 кг",
        waterproof: "IP65",
        warranty: "3 года",
      },
      {
        ...withFourSameImages(),
        name: "Замок Golden Soft AutoOpen",
        article: "GS-8004",
        price: 8900,
        price_with_discount: null,
        is_popular: false,
        in_stock: false,
        categoryId: categories[7].id,
        door_type: "Шкафчик",
        door_thickness: "1-25 мм",
        unlocking_methods: ["Код", "Время"],
        battery_life: "До 36 месяцев",
        material: "Пластик",
        color: "Серый",
        weight: "0.35 кг",
        waterproof: "IP67",
        warranty: "3 года",
      },
    ];

    await Lock.bulkCreate(locks);
    console.log("32 замка добавлено");

    // ───── 3. Пользователи (если их нет) ─────
    const usersExist = await User.count();
    if (usersExist === 0) {
      await User.bulkCreate([
        {
          name: "Иван Иванов",
          email: "ivan@example.com",
          phone: "+79001234567",
          password: "hashedpass",
          role: "user",
        },
        {
          name: "Мария Петрова",
          email: "maria@example.com",
          phone: "+79001234568",
          password: "hashedpass",
          role: "user",
        },
        {
          name: "Алексей Смирнов",
          email: "alex@example.com",
          phone: "+79001234569",
          password: "hashedpass",
          role: "user",
        },
        {
          name: "Елена Кузнецова",
          email: "elena@example.com",
          phone: "+79001234570",
          password: "hashedpass",
          role: "user",
        },
        {
          name: "Дмитрий Васильев",
          email: "dmitry@example.com",
          phone: "+79001234571",
          password: "hashedpass",
          role: "user",
        },
        {
          name: "Ольга Морозова",
          email: "olga@example.com",
          phone: "+79001234572",
          password: "hashedpass",
          role: "user",
        },
        {
          name: "Сергей Новиков",
          email: "sergey@example.com",
          phone: "+79001234573",
          password: "hashedpass",
          role: "user",
        },
        {
          name: "Анна Лебедева",
          email: "anna@example.com",
          phone: "+79001234574",
          password: "hashedpass",
          role: "user",
        },
        {
          name: "Павел Соколов",
          email: "pavel@example.com",
          phone: "+79001234575",
          password: "hashedpass",
          role: "user",
        },
        {
          name: "Татьяна Федорова",
          email: "tanya@example.com",
          phone: "+79001234576",
          password: "hashedpass",
          role: "user",
        },
      ]);
      console.log("Пользователи добавлены");
    }
    // ───── 4. Заказы + OrderItem (надёжно, без дубликатов замков в заказе) ─────
    // ───── 4. Заказы + OrderItem (финальная версия под твою модель) ─────
    const allUsers = await User.findAll({ where: { role: "user" } });
    const allLocks = await Lock.findAll();

    const statuses = [
      "новый",
      "в процессе",
      "в обработке",
      "завершен",
      "отменен",
    ];
    const paymentMethods = ["Карта онлайн", "СБП", "При получении"];

    const existingOrders = await Order.count();
    if (existingOrders >= 25) {
      console.log("Заказы уже созданы — пропускаем");
    } else {
      for (let i = 0; i < 25; i++) {
        const user = allUsers[Math.floor(Math.random() * allUsers.length)];
        let totalPrice = 0;

        const order = await Order.create({
          userId: user.id,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          payment_method:
            paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          total_price: 0,
          address: `г. Москва, ул. Ленина, д. ${20 + i}, кв. ${
            Math.floor(Math.random() * 300) + 1
          }`,
          city: "Москва",
          postcode: "101000",
          country: "Россия",
          comment: Math.random() > 0.7 ? "Позвонить за час до доставки" : null,
        });

        const usedLockIds = new Set();
        const itemsCount = Math.floor(Math.random() * 4) + 1; // 1–4 разных товара

        for (let j = 0; j < itemsCount; j++) {
          let lock;
          do {
            lock = allLocks[Math.floor(Math.random() * allLocks.length)];
          } while (usedLockIds.has(lock.id));
          usedLockIds.add(lock.id);

          const quantity = Math.floor(Math.random() * 3) + 1;
          const price = lock.price_with_discount || lock.price;
          totalPrice += price * quantity;

          await OrderItem.create({
            orderId: order.id,
            lockId: lock.id,
            quantity,
            price_at_purchase: price,
          });
        }

        await order.update({ total_price: totalPrice });
      }
      console.log("25 заказов успешно создано!");
    }

    // ───── 5. Отзывы ─────
    const reviewAuthors = [
      "Алексей К.",
      "Мария С.",
      "Дмитрий П.",
      "Елена В.",
      "Сергей М.",
      "Ольга Н.",
      "Павел Т.",
      "Анна Р.",
      "Игорь Ф.",
      "Татьяна Л.",
      "Виктор З.",
      "Наталья Г.",
      "Роман Д.",
      "Светлана Б.",
      "Михаил Ю.",
    ];
    const positiveTexts = [
      "Отличный замок! Работает идеально, установка заняла 15 минут.",
      "Рекомендую всем! Биометрия срабатывает мгновенно.",
      "Качество на высоте, выглядит очень надёжно.",
      "Доставили быстро, всё работает как часы.",
      "Лучший замок из всех, что у меня были. Спасибо GoldenSoft!",
      "Удобное приложение, можно открывать с телефона — магия!",
      "Супер! Теперь не ношу ключи вообще.",
      "Очень доволен покупкой, уже поставил второй на дачу.",
    ];
    const neutralTexts = [
      "Всё хорошо, но инструкция могла бы быть подробнее.",
      "Работает нормально, но иногда нужно поднести палец два раза.",
      "Нормальный замок за свои деньги.",
      "Поставил сам, но пришлось повозиться с выравниванием.",
      "В целом доволен, но батарейки садятся быстрее, чем ожидал.",
    ];

    const reviewPromises = [];

    for (const lock of allLocks) {
      const reviewsCount = Math.floor(Math.random() * 4) + 3; // 3–6 отзывов

      for (let i = 0; i < reviewsCount; i++) {
        const rating = Math.random() > 0.15 ? 5 : 4;
        const author =
          reviewAuthors[Math.floor(Math.random() * reviewAuthors.length)];
        const text =
          rating === 5
            ? positiveTexts[Math.floor(Math.random() * positiveTexts.length)]
            : neutralTexts[Math.floor(Math.random() * neutralTexts.length)];

        const daysAgo = Math.floor(Math.random() * 180);
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);

        reviewPromises.push(
          Review.create({
            lockId: lock.id,
            author,
            rating,
            text,
            createdAt: date,
            updatedAt: date,
            isVerified: Math.random() > 0.3,
          })
        );
      }
    }

    await Promise.all(reviewPromises);
    console.log(`Добавлено ${reviewPromises.length} отзывов`);

    // ───── 6. Статистика ─────
    await Statistics.bulkCreate([
      { title: "Счастливых клиентов", value: 5567 },
      { title: "Продуктов на выбор", value: 1245 },
      { title: "Продаж в день", value: 372 },
      { title: "Лет на рынке", value: 20 },
    ]);

    // ───── 7. Проекты (OurProject) ─────
    await OurProject.bulkCreate([
      {
        title: "Проект для гостиницы Radisson Hotels",
        image_path: "/images/wholesale-images/Radisson.webp",
        logo_path: "/images/wholesale-images/radisson-logo.svg",
        description:
          "• Установлено 123 вариативных замка Golden Soft для отеля\n• Было нанесено личный брендинг на все замки\n• Были проведены монтажные работы",
        budget: "$5000",
      },
      {
        title: "Офисный комплекс «Северная башня»",
        image_path: "/images/wholesale-images/complex.webp",
        logo_path: "/images/wholesale-images/complex-logo.svg",
        description:
          "• 85 биометрических замков\n• Интеграция с СКУД\n• Удалённое управление",
        budget: "$3200",
      },
      {
        title: "Фитнес-клуб «Iron Gym»",
        image_path: "/images/wholesale-images/iron-gym.webp",
        logo_path: "/images/wholesale-images/iron-gym-logo.svg",
        description:
          "• 150 шкафчиков с RFID-замками\n• Брендирование логотипом\n• Гарантия 3 года",
        budget: "$1800",
      },
    ]);

    console.log("БД УСПЕШНО ЗАПОЛНЕНА!");
  } catch (error) {
    console.error("ОШИБКА В СИДЕ:", error);
  }
}

module.exports = seedDatabase;
