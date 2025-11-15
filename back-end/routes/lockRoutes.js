// back-end/routes/lockRoutes.js
const express = require("express");
const router = express.Router();
const lockController = require("../controllers/lockController");

router.get("/", lockController.getAllLocks);
router.get("/slider", lockController.getSliderLocks);
router.get("/popular", lockController.getPopularLocks);
router.get("/search", lockController.searchLocks);
router.get("/:id", lockController.getLockById);

module.exports = router;