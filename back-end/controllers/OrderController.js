const Order = require("../models/OrderModel");
const OrderItem = require("../models/OrderItemModel")
const Lock = require("../models/LockModel")

exports.createOrder = async (req, res) => {
  const { items, payment_method, address, city, postcode, country, comment } = req.body;
  const userId = req.user.id;

  try {
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const lock = await Lock.findByPk(item.id);
      if (!lock || !lock.in_stock) throw new Error(`Товар ${item.id} недоступен`);

      const price = lock.price_with_discount || lock.price;
      total += price * item.quantity;

      orderItems.push({
        lockId: lock.id,
        quantity: item.quantity,
        price_at_purchase: price,
      });
    }

    const order = await Order.create({
      userId,
      total_price: total,
      payment_method,
      address,
      city,
      postcode,
      country,
      comment,
    });

    for (const oi of orderItems) {
      await OrderItem.create({ ...oi, orderId: order.id });
    }

    res.json({ success: true, order: await Order.findByPk(order.id, {
      include: [{ model: OrderItem, include: [Lock] }]
    })});
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.findAll({
    where: { userId: req.user.id },
    order: [["createdAt", "DESC"]],
    include: [{ model: OrderItem, include: [Lock] }],
  });
  res.json({ orders });
};