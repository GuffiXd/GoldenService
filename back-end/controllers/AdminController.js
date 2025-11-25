const User = require("../models/UserModel");
const Order = require("../models/OrderModel");
const OrderItem = require("../models/OrderItemModel");
const Lock = require("../models/LockModel");
const Product = require("../models/OurProjectModel"); // Assuming this is products/projects

exports.getStats = async (req, res) => {
    try {
        const userCount = await User.count();
        const orderCount = await Order.count();
        const lockCount = await Lock.count(); // Используем Lock вместо Product

        res.json({
            users: userCount,
            orders: orderCount,
            products: lockCount, // Количество товаров (замков)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка получения статистики" });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password"] },
            order: [["createdAt", "DESC"]],
        });
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка получения пользователей" });
    }
};

exports.updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
        return res.status(400).json({ message: "Некорректная роль" });
    }

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        user.role = role;
        await user.save();

        res.json({ message: "Роль обновлена", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка обновления роли" });
    }
};

// ============ УПРАВЛЕНИЕ ТОВАРАМИ (LOCKS) ============

exports.createLock = async (req, res) => {
    try {
        const { name, price, stock, short_description, description } = req.body;
        
        // Генерируем артикул автоматически
        const article = `ART-${Date.now()}`;
        
        const lockData = {
            name,
            article,
            price: parseFloat(price) || 0,
            stock: parseInt(stock, 10) || 0,
            short_description: short_description || "",
            description: description || "",
            image_path: req.file ? `/uploads/${req.file.filename}` : "/images/default-lock.jpg",
            in_stock: (parseInt(stock, 10) || 0) > 0,
            categoryId: 1, // Дефолтная категория
        };

        const lock = await Lock.create(lockData);
        res.status(201).json(lock);
    } catch (err) {
        console.error("Create lock error:", err);
        res.status(500).json({ error: "Ошибка создания товара" });
    }
};

exports.updateLock = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, stock, short_description, description } = req.body;

        const lock = await Lock.findByPk(id);
        if (!lock) {
            return res.status(404).json({ error: "Товар не найден" });
        }

        const updateData = {
            name: name || lock.name,
            price: price ? parseFloat(price) : lock.price,
            stock: stock !== undefined ? parseInt(stock, 10) : lock.stock,
            short_description: short_description !== undefined ? short_description : lock.short_description,
            description: description !== undefined ? description : lock.description,
            in_stock: (stock !== undefined ? parseInt(stock, 10) : lock.stock) > 0,
        };

        if (req.file) {
            updateData.image_path = `/uploads/${req.file.filename}`;
        }

        await lock.update(updateData);
        res.json(lock);
    } catch (err) {
        console.error("Update lock error:", err);
        res.status(500).json({ error: "Ошибка обновления товара" });
    }
};

exports.deleteLock = async (req, res) => {
    try {
        const { id } = req.params;
        const lock = await Lock.findByPk(id);

        if (!lock) {
            return res.status(404).json({ error: "Товар не найден" });
        }

        await lock.destroy();
        res.json({ message: "Товар успешно удален" });
    } catch (err) {
        console.error("Delete lock error:", err);
        res.status(500).json({ error: "Ошибка удаления товара" });
    }
};

// ============ УПРАВЛЕНИЕ ЗАКАЗАМИ ============

exports.getAllOrders = async (req, res) => {
    try {
        console.log("Запрос на получение всех заказов от пользователя:", req.user?.email);
        
        const orders = await Order.findAll({
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email"],
                    required: false, // LEFT JOIN вместо INNER JOIN
                },
                {
                    model: OrderItem,
                    as: "orderItems",
                    required: false,
                    include: [
                        {
                            model: Lock,
                            attributes: ["id", "name", "image_path"],
                            required: false,
                        },
                    ],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        console.log(`Найдено заказов: ${orders.length}`);

        // Маппинг статусов из БД в английский формат для фронта
        const statusMap = {
            "новый": "pending",
            "в процессе": "processing",
            "в обработке": "processing",
            "завершен": "delivered",
            "отменен": "cancelled"
        };

        const formattedOrders = orders.map(order => {
            const orderJson = order.toJSON ? order.toJSON() : order;
            return {
                id: orderJson.id,
                user_name: orderJson.user?.name || "Гость",
                user_email: orderJson.user?.email || "",
                total_price: Number(orderJson.total_price),
                status: statusMap[orderJson.status] || "pending",
                created_at: orderJson.createdAt,
                shipping_address: [orderJson.address, orderJson.city, orderJson.postcode, orderJson.country]
                    .filter(Boolean)
                    .join(", "),
                items: orderJson.orderItems?.map(item => ({
                    product_name: item.Lock?.name || "Удалённый товар",
                    image_path: item.Lock?.image_path,
                    quantity: item.quantity,
                    price: Number(item.price_at_purchase),
                })) || [],
            };
        });

        res.json(formattedOrders);
    } catch (err) {
        console.error("Get all orders error:", err);
        console.error("Error stack:", err.stack);
        res.status(500).json({ error: "Ошибка получения заказов", details: err.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Маппинг статусов из английского в русский для БД
        const statusMap = {
            "pending": "новый",
            "processing": "в обработке",
            "shipped": "в процессе",
            "delivered": "завершен",
            "cancelled": "отменен"
        };

        const validStatuses = Object.keys(statusMap);
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Некорректный статус" });
        }

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ error: "Заказ не найден" });
        }

        order.status = statusMap[status];
        await order.save();

        res.json({ message: "Статус заказа обновлен", order });
    } catch (err) {
        console.error("Update order status error:", err);
        res.status(500).json({ error: "Ошибка обновления статуса" });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({ error: "Заказ не найден" });
        }

        // Удаляем связанные элементы заказа
        await OrderItem.destroy({ where: { orderId: id } });
        
        // Удаляем сам заказ
        await order.destroy();

        res.json({ message: "Заказ успешно удален" });
    } catch (err) {
        console.error("Delete order error:", err);
        res.status(500).json({ error: "Ошибка удаления заказа" });
    }
};