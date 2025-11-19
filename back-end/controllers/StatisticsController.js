const Statistics = require("../models/StatisticsModel");

const statisticsController = {
  getAll: async (req, res) => {
    try {
      const stats = await Statistics.findAll({
        attributes: ["id", "title", "value"],
        order: [["id", "ASC"]],
      });


      const formatted = stats.map(s => ({
        id: s.id,
        title: s.title || s.name,       
        value: Number(s.value || s.count), 
      }));

      res.json(formatted);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  },
};

module.exports = statisticsController;