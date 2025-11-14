// back-end/routes/lockRoutes.js
const express = require('express');
const router = express.Router();
const lockController = require('../controllers/LockController');

// Роуты
router.get('/', lockController.getAllLocks);
router.get('/slider', lockController.getSliderLocks);
router.get('/popular', lockController.getPopularLocks); // ← ЗАПЯТАЯ!

module.exports = router;