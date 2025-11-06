// back-end/controllers/StatisticsController.js
const Statistics = require("../models/StatisticsModel");

const StatisticsController = {
  getStatistics: async (req, res) => {
    try {
      const stats = await Statistics.findAll();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = StatisticsController;