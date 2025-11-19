// back-end/routes/LockRoutes.js
const express = require("express");
const router = express.Router();
const lockController = require("../controllers/lockController");


router.get("/", lockController.getAllLocks);              
router.get("/popular", lockController.getPopularLocks);      
router.get("/slider", lockController.getSliderLocks);       
router.get("/search", lockController.searchLocks);          
router.get("/:id", lockController.getLockById);               

module.exports = router;