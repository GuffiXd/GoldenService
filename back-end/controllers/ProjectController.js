// back-end/controllers/projectController.js
const OurProject = require("../models/OurProjectModel");

exports.getProjects = async (req, res) => {
  try {
    const projects = await OurProject.findAll({
      order: [["createdAt", "ASC"]],
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};