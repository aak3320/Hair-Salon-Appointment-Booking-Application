const express = require("express");
const router = express.Router();

const salonController = require("../controllers/salonController");

router.get("/", salonController.getAllSalons);
router.get("/featured", salonController.getFeaturedSalons);
router.get("/nearby", salonController.getNearbySalons);
router.get("/:id", salonController.getSalonById);
module.exports = router;