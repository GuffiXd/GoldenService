// routes/orders.js
const express = require("express");
const router = express.Router();
const orderCtrl = require("../controllers/OrderController");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, orderCtrl.createOrder);
router.get("/my", authMiddleware, orderCtrl.getMyOrders);

module.exports = router;