const Order = require("../models/OrderModel");
const OrderItem = require("../models/OrderItemModel");
const Lock = require("../models/LockModel");

// Создание нового заказа
exports.createOrder = async (req, res) => {
  try {
    // 1. Проверка авторизации
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        success: false, 
        message: "Пользователь не авторизован" 
      });
    }

    const { items, payment_method, address, city, postcode, country, comment } = req.body;
    const userId = req.user.id;

    // 2. Валидация входных данных
    if (!items || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Корзина пуста" 
      });
    }

    // Дополнительная валидация адреса
    if (!address || address === "Адрес не указан") {
      return res.status(400).json({ 
        success: false, 
        message: "Укажите действительный адрес доставки" 
      });
    }

    let total = 0;
    const orderItemsData = [];

    // 3. Проверка наличия товаров и расчет стоимости
    for (const item of items) {
      const lock = await Lock.findByPk(item.id);

      if (!lock) {
        return res.status(400).json({ 
          success: false, 
          message: `Товар с ID ${item.id} не найден` 
        });
      }
      
      if (!lock.in_stock) {
        return res.status(400).json({ 
          success: false, 
          message: `Товар "${lock.name}" закончился на складе` 
        });
      }

      const price = lock.price_with_discount || lock.price;
      total += price * item.quantity;

      orderItemsData.push({
        lockId: lock.id,
        quantity: item.quantity,
        price_at_purchase: price,
      });
    }

    // 4. Создание заказа
    const order = await Order.create({
      userId,
      total_price: total,
      payment_method,
      address,
      city,
      postcode,
      country,
      comment,
      status: "новый"
    });

    // 5. Создание позиций заказа
    for (const oi of orderItemsData) {
      await OrderItem.create({ ...oi, orderId: order.id });
    }

    // 6. Получение созданного заказа с вложениями
    const fullOrder = await Order.findByPk(order.id, {
      attributes: [
        "id", "status", "total_price", "payment_method", 
        "createdAt", "address", "city"
      ],
      include: [
        {
          model: Lock,
          as: "items",
          attributes: ["id", "name", "image_path", "article"],
          through: {
            model: OrderItem,
            attributes: ["quantity", "price_at_purchase"],
          },
        },
      ],
    });

    res.status(201).json({ 
      success: true, 
      message: "Заказ успешно создан",
      order: fullOrder 
    });

  } catch (err) {
    console.error("Ошибка при создании заказа:", err);
    res.status(400).json({ 
      success: false, 
      message: err.message || "Ошибка при оформлении заказа" 
    });
  }
};

// Получение заказов текущего пользователя
exports.getMyOrders = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Пользователь не авторизован" });
    }

    const orders = await Order.findAll({
      where: { userId: req.user.id },
      attributes: [
        "id", "status", "total_price", "payment_method", 
        "createdAt", "address", "city"
      ],
      include: [
        {
          model: Lock,
          as: "items",
          attributes: ["id", "name", "image_path", "article"],
          through: {
            model: OrderItem,
            attributes: ["quantity", "price_at_purchase"],
          },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ orders });
  } catch (err) {
    console.error("Ошибка получения моих заказов:", err);
    res.status(500).json({ error: "Ошибка сервера", details: err.message });
  }
};

// Получение заказов конкретного пользователя
exports.getUserOrders = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: "Неверный ID пользователя" });
    }

    const orders = await Order.findAll({
      where: { userId },
      attributes: [
        "id", "status", "total_price", "payment_method", 
        "createdAt", "address", "city"
      ],
      include: [
        {
          model: Lock,
          as: "items",
          attributes: ["id", "name", "image_path", "article"],
          through: {
            model: OrderItem,
            attributes: ["quantity", "price_at_purchase"],
          },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(orders);
  } catch (err) {
    console.error(`Ошибка получения заказов пользователя ${req.params.userId}:`, err);
    res.status(500).json({ error: "Ошибка сервера", details: err.message });
  }
};