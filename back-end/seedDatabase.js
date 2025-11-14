// back-end/seedDatabase.js
const Lock = require("./models/LockModel");
const Category = require("./models/CategoryModel");
const Statistics = require("./models/StatisticsModel");
const OurProject = require("./models/OurProjectModel");

async function seedDatabase() {
  console.log("СИД ЗАПУЩЕН!");

  try {
    // Проверяем, есть ли уже данные
    const [lockCount, catCount, projectCount, statCount] = await Promise.all([
      Lock.count(),
      Category.count(),
      OurProject.count(),
      Statistics.count(),
    ]);

    if (lockCount > 0 || catCount > 0 || projectCount > 0 || statCount > 0) {
      console.log("БД уже содержит данные. Пропускаем сид...");
      return;
    }

    console.log("Начинаем заполнение БД...");

    // 1. Категории
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
    console.log("8 категорий добавлено");

    // 2. Замки — 32 шт.
    const locks = [
      // НАКЛАДНЫЕ
      { name: "Накладной замок Golden Soft Pro для квартиры", article: "1001", price: 25000, price_with_discount: 22900, image_path: "/images/products/flat-lock.webp", description: "Биометрия + код + ключ. Установка за 15 мин.", is_featured: true, is_popular: true, in_stock: true, categoryId: categories[0].id },
      { name: "Накладной замок Golden Soft Mini для кладовки", article: "1002", price: 18000, price_with_discount: null, image_path: "/images/products/rim-lock.webp", description: "Компактный, 12+ мес. на батарейках.", in_stock: false, categoryId: categories[0].id },
      { name: "Накладной замок Golden Soft WiFi", article: "1003", price: 31000, price_with_discount: 28900, image_path: "/images/products/wifi-lock.webp", description: "Удалённое управление через приложение.", is_popular: true, in_stock: true, categoryId: categories[0].id },
      { name: "Накладной замок Golden Soft FaceID", article: "1004", price: 42000, price_with_discount: 38900, image_path: "/images/products/faceid-lock.webp", description: "Распознавание лица + отпечаток.", in_stock: true, categoryId: categories[0].id },

      // ВРЕЗНЫЕ
      { name: "Врезной замок Golden Soft Smart", article: "2001", price: 32000, price_with_discount: 29900, image_path: "/images/products/mortise-lock.webp", description: "Умный дом, авто-запирание, журнал.", is_featured: true, in_stock: true, categoryId: categories[1].id },
      { name: "Врезной замок Golden Soft WiFi Pro", article: "2002", price: 38000, price_with_discount: null, image_path: "/images/products/hotel-lock.webp", description: "WiFi + 500 пользователей.", in_stock: true, categoryId: categories[1].id },
      { name: "Врезной замок Golden Soft Biometric", article: "2003", price: 36000, price_with_discount: 33900, image_path: "/images/products/bio-lock.webp", description: "100 отпечатков, антишок.", in_stock: true, categoryId: categories[1].id },
      { name: "Врезной замок Golden Soft RFID", article: "2004", price: 29000, price_with_discount: null, image_path: "/images/products/rfid-lock.webp", description: "Mifare карты, для офисов.", in_stock: false, categoryId: categories[1].id },

      // КВАРТИРА
      { name: "Замок Golden Soft Secure для квартиры", article: "3001", price: 28000, price_with_discount: 25900, image_path: "/images/products/home-lock.webp", description: "Двойная аутентификация.", is_popular: true, in_stock: true, categoryId: categories[2].id },
      { name: "Замок Golden Soft Touch для квартиры", article: "3002", price: 26000, price_with_discount: null, image_path: "/images/products/office-lock.webp", description: "Сенсорная панель, подсветка.", in_stock: false, categoryId: categories[2].id },
      { name: "Замок Golden Soft Keyless", article: "3003", price: 27500, price_with_discount: 24900, image_path: "/images/products/keyless.webp", description: "Без ключа — код + биометрия.", in_stock: true, categoryId: categories[2].id },
      { name: "Замок Golden Soft Alarm", article: "3004", price: 31000, price_with_discount: 28900, image_path: "/images/products/alarm-lock.webp", description: "Сигнализация при взломе.", in_stock: true, categoryId: categories[2].id },

      // ДОМ
      { name: "Замок Golden Soft Biometric для дома", article: "4001", price: 30000, price_with_discount: 27900, image_path: "/images/products/rooms-lock.webp", description: "Лицо + отпечаток.", in_stock: true, categoryId: categories[3].id },
      { name: "Замок Golden Soft Classic для дома", article: "4002", price: 22000, price_with_discount: null, image_path: "/images/products/closet-lock.webp", description: "С механическим ключом.", in_stock: true, categoryId: categories[3].id },
      { name: "Замок Golden Soft Outdoor", article: "4003", price: 35000, price_with_discount: 32900, image_path: "/images/products/outdoor.webp", description: "IP67, для ворот.", in_stock: true, categoryId: categories[3].id },
      { name: "Замок Golden Soft Solar", article: "4004", price: 42000, price_with_discount: null, image_path: "/images/products/solar-lock.webp", description: "Солнечная батарея, автономность.", in_stock: true, categoryId: categories[3].id },

      // ОТЕЛЬ
      { name: "Замок Golden Soft Hotel Pro", article: "5001", price: 45000, price_with_discount: 42000, image_path: "/images/products/hotel-lock.webp", description: "RFID + PMS интеграция.", in_stock: true, categoryId: categories[4].id },
      { name: "Замок Golden Soft Mobile Key", article: "5002", price: 40000, price_with_discount: null, image_path: "/images/products/mobile-key.webp", description: "Ключ в смартфоне.", in_stock: false, categoryId: categories[4].id },
      { name: "Замок Golden Soft TempCode", article: "5003", price: 38000, price_with_discount: 35900, image_path: "/images/products/tempcode.webp", description: "Временные коды для гостей.", in_stock: true, categoryId: categories[4].id },
      { name: "Замок Golden Soft Mifare", article: "5004", price: 36000, price_with_discount: null, image_path: "/images/products/mifare.webp", description: "Mifare карты, энергосбережение.", in_stock: true, categoryId: categories[4].id },

      // ОФИС
      { name: "Замок Golden Soft FaceID Pro", article: "6001", price: 35000, price_with_discount: 32900, image_path: "/images/products/office-lock.webp", description: "Распознавание лиц, отчёты.", is_popular: true, in_stock: true, categoryId: categories[5].id },
      { name: "Замок Golden Soft Access Control", article: "6002", price: 31000, price_with_discount: null, image_path: "/images/products/access.webp", description: "Интеграция с СКУД.", in_stock: true, categoryId: categories[5].id },
      { name: "Замок Golden Soft QR", article: "6003", price: 29000, price_with_discount: 26900, image_path: "/images/products/qr-lock.webp", description: "Открытие по QR-коду.", in_stock: true, categoryId: categories[5].id },
      { name: "Замок Golden Soft TimeLock", article: "6004", price: 33000, price_with_discount: null, image_path: "/images/products/timelock.webp", description: "Ограничение по времени.", in_stock: false, categoryId: categories[5].id },

      // ШКАФЧИКИ
      { name: "Замок Golden Soft Mini Cabinet", article: "7001", price: 9000, price_with_discount: 7900, image_path: "/images/products/closet-lock.webp", description: "Для фитнес-клубов, 2 года на батарейках.", is_featured: true, in_stock: true, categoryId: categories[6].id },
      { name: "Замок Golden Soft Touch Mini", article: "7002", price: 11000, price_with_discount: null, image_path: "/images/products/touch-mini.webp", description: "Сенсор, подсветка, IP54.", in_stock: false, categoryId: categories[6].id },
      { name: "Замок Golden Soft RFID Cabinet", article: "7003", price: 9500, price_with_discount: 8500, image_path: "/images/products/rfid-cabinet.webp", description: "Браслеты, гигиенично.", in_stock: true, categoryId: categories[6].id },
      { name: "Замок Golden Soft CodeLock", article: "7004", price: 8500, price_with_discount: null, image_path: "/images/products/codelock.webp", description: "Кодовый, без батареек.", in_stock: true, categoryId: categories[6].id },

      // РАЗДЕВАЛКИ
      { name: "Замок Golden Soft Locker Pro", article: "8001", price: 8500, price_with_discount: 7500, image_path: "/images/products/locker-pro.webp", description: "IP65, ударопрочный.", is_featured: true, in_stock: true, categoryId: categories[7].id },
      { name: "Замок Golden Soft PoolLock", article: "8002", price: 9500, price_with_discount: null, image_path: "/images/products/poollock.webp", description: "Влагозащита, для бассейнов.", in_stock: true, categoryId: categories[7].id },
      { name: "Замок Golden Soft GymCode", article: "8003", price: 7800, price_with_discount: 6900, image_path: "/images/products/gymcode.webp", description: "Код + браслет.", in_stock: true, categoryId: categories[7].id },
      { name: "Замок Golden Soft AutoOpen", article: "8004", price: 8900, price_with_discount: null, image_path: "/images/products/autoopen.webp", description: "Автооткрытие по времени.", in_stock: false, categoryId: categories[7].id },
    ];

    await Lock.bulkCreate(locks);
    console.log("32 замка добавлено");

    // 3. Крупные проекты

    await OurProject.bulkCreate([
      {
        title: "Проект для гостиницы Radisson Hotels",
        image_path: "/images/wholesale-images/Radisson.webp",
        logo_path: "/images/wholesale-images/radisson-logo.svg",
        description:
          "• Установлено 123 вариативных замка Golden Soft для отеля\n" +
          "• Было нанесено личный брендинг на все замки\n" +
          "• Были проведены монтажные работы, также была произведена помощь в подключении замков к системе\n",
        budget: "$5000",
      },
      {
        title: "Офисный комплекс «Северная башня»",
        image_path: "/images/wholesale-images/complex.webp",
        logo_path: "/images/wholesale-images/complex-logo.svg",
        description:
          "• 85 биометрических замков\n" +
          "• Интеграция с СКУД\n" +
          "• Удалённое управление\n" +
          "• Журнал проходов с экспортом в Excel\n",
        budget: "$3200",
      },
      {
        title: "Фитнес-клуб «Iron Gym»",
        image_path: "/images/wholesale-images/iron-gym.webp",
        logo_path: "/images/wholesale-images/iron-gym-logo.svg",
        description:
          "• 150 шкафчиков с RFID-замками\n" +
          "• Брендирование логотипом\n" +
          "• Гарантия 3 года\n" +
          "• Влагозащита IP65 — защита от пота и воды\n" +
          "• Автоматическое открытие шкафчиков в конце смены\n",
        budget: "$1800",
      },
    ]);
    console.log("3 крупных проекта добавлено с расширенными описаниями");

    // 4. Статистика
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