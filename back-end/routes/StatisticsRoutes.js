// back-end/routes/StatisticsRoutes.js
const express = require('express');
const router = express.Router();
const StatisticsController = require('../controllers/StatisticsController');

router.get('/', StatisticsController.getStatistics);

module.exports = router;