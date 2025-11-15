const Statistics = require("../models/StatisticsModel");

const statisticsController = {
  getAll: async (req, res) => {
    try {
      const stats = await Statistics.findAll({
        attributes: ["id", "title", "value"],
        order: [["id", "ASC"]],
      });

      // Если у тебя другие имена полей — адаптируй!
      const formatted = stats.map(s => ({
        id: s.id,
        title: s.title || s.name,        // если у тебя `name`
        value: Number(s.value || s.count), // если `count`
      }));

      res.json(formatted);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  },
};

module.exports = statisticsController;