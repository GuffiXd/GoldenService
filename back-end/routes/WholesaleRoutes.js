// back-end/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const { searchLocks, createOrder } = require("../controllers/WholesaleController");

router.get("/search", searchLocks);
router.post("/", createOrder);

module.exports = router;