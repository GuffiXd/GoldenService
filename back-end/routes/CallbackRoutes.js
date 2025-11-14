const express = require("express");
const router = express.Router();
const StatisticsController = require("../controllers/CallbackController");

// ✅ POST /api/form/callback — сохранить заявку
router.post("/callback", StatisticsController.createCallback);

// ✅ GET /api/form/callbacks — получить все заявки
router.get("/callbacks", StatisticsController.getAllCallbacks);

// ✅ DELETE /api/form/callback/:id — удалить заявку
router.delete("/callback/:id", StatisticsController.deleteCallback);

module.exports = router;
