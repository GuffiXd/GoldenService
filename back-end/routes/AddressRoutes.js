const express = require("express");
const router = express.Router();
const AddressController = require("../controllers/AddressController");

// Middleware для проверки авторизации
const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Пожалуйста, войдите в систему" });
  }
  next();
};

router.use(isAuthenticated);

router.get("/", AddressController.getAll);
router.post("/", AddressController.create);
router.delete("/:id", AddressController.delete);
router.put("/:id", AddressController.update);

module.exports = router;
