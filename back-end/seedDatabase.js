// back-end/seedDatabase.js
const Lock = require("./models/LockModel");
const Category = require("./models/CategoryModel");
const Statistics = require("./models/StatisticsModel");

async function seedDatabase() {
  console.log("СИД ЗАПУЩЕН!"); // ← ДОЛЖНА ПОЯВИТЬСЯ СРАЗУ!

  try {
    const lockCount = await Lock.count();
    const catCount = await Category.count();
    const statCount = await Statistics.count();

    if (lockCount > 0 || catCount > 0 || statCount > 0) {
      console.log("БД уже заполнена. Пропускаем...");
      return;
    }

    console.log("Начинаем заполнение...");

    const categories = await Category.bulkCreate([
      { name: "Накладные электронные замки", slug: "overlay" },
      { name: "Врезные электронные замки", slug: "mortise" },
      { name: "Замки для квартиры", slug: "apartment" },
      { name: "Замки для дома", slug: "home" },
      { name: "Замки для отелей", slug: "hotel" },
      { name: "Замки для офиса", slug: "office" },
      { name: "Замки для шкафчиков", slug: "cabinet" },
      { name: "Замки для раздевалок", slug: "locker-room" },
    ], { returning: true });

    const locks = [
        // 1. Накладные
        { name: "GS-Overlay Pro", price: "25000.00", price_with_discount: "29000.00", image_path: "/images/products/flat-lock.webp", is_popular: true, categoryId: categories[0].id },
        { name: "GS-Overlay Mini", price: "18000.00", price_with_discount: null, image_path: "/images/products/rim-lock.webp", categoryId: categories[0].id },
  
        // 2. Врезные
        { name: "GS-Mortise Smart", price: "32000.00", price_with_discount: "35000.00", image_path: "/images/products/mortise-lock.webp", is_featured: true, categoryId: categories[1].id },
        { name: "GS-Mortise WiFi", price: "38000.00", price_with_discount: null, image_path: "/images/products/hotel-lock.webp", categoryId: categories[1].id },
  
        // 3. Квартира
        { name: "GS-Apartment Secure", price: "28000.00", price_with_discount: "32000.00", image_path: "/images/products/home-lock.webp", is_popular: true, categoryId: categories[2].id },
        { name: "GS-Apartment Touch", price: "26000.00", price_with_discount: null, image_path: "/images/products/office-lock.webp", categoryId: categories[2].id },
  
        // 4. Дом
        { name: "GS-Home Biometric", price: "30000.00", price_with_discount: "34000.00", image_path: "/images/products/rooms-lock.webp", categoryId: categories[3].id },
        { name: "GS-Home Classic", price: "22000.00", price_with_discount: null, image_path: "/images/products/closet-lock.webp", categoryId: categories[3].id },
  
        // 5. Отель
        { name: "GS-Hotel Elite", price: "45000.00", price_with_discount: "50000.00", image_path: "/images/products/hotel-lock.webp", is_featured: true, categoryId: categories[4].id },
        { name: "GS-Hotel RFID", price: "40000.00", price_with_discount: null, image_path: "/images/products/mortise-lock.webp", categoryId: categories[4].id },
  
        // 6. Офис
        { name: "GS-Office Pro", price: "35000.00", price_with_discount: "39000.00", image_path: "/images/products/office-lock.webp", is_popular: true, categoryId: categories[5].id },
        { name: "GS-Office Access", price: "31000.00", price_with_discount: null, image_path: "/images/products/flat-lock.webp", categoryId: categories[5].id },
  
        // 7. Шкафчики
        { name: "GS-Cabinet Mini", price: "9000.00", price_with_discount: "12000.00", image_path: "/images/products/closet-lock.webp", categoryId: categories[6].id },
        { name: "GS-Cabinet Touch", price: "11000.00", price_with_discount: null, image_path: "/images/products/rim-lock.webp", categoryId: categories[6].id },
  
        // 8. Раздевалки
        { name: "GS-Locker Pro", price: "8500.00", price_with_discount: "10000.00", image_path: "/images/products/rooms-lock.webp", categoryId: categories[7].id },
        { name: "GS-Locker RFID", price: "9500.00", price_with_discount: null, image_path: "/images/products/home-lock.webp", categoryId: categories[7].id },
      ];

    await Lock.bulkCreate(locks);
    console.log("16 замков добавлено");

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

module.exports = seedDatabase; // ← ОБЯЗАТЕЛЬНО!