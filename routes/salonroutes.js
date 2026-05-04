const express = require("express");
const router = express.Router();
const salonController = require("../controllers/salonController");

router.get("/featured", salonController.getFeaturedSalons);

module.exports = router;