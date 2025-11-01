// back-end/routes/lockRoutes.js
const express = require('express');
const router = express.Router();
const lockController = require('../controllers/lockController');

// Роуты
router.get('/', lockController.getAllLocks);
router.get('/slider', lockController.getSliderLocks); // ← ДОБАВЬ ЭТОТ РОУТ

module.exports = router;