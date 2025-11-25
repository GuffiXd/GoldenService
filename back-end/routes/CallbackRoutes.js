const express = require("express");
const router = express.Router();
const CallbackController = require("../controllers/CallbackController");

// ✅ POST /api/form/callback — сохранить заявку
router.post("/callback", CallbackController.createCallback);

// ✅ GET /api/form/callbacks — получить все заявки
router.get("/callbacks", CallbackController.getAllCallbacks);

// ✅ DELETE /api/form/callback/:id — удалить заявку
router.delete("/callback/:id", CallbackController.deleteCallback);

module.exports = router;
