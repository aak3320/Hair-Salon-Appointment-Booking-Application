const express = require("express");
const router = express.Router();

const appointmentController = require("../controllers/appointmentController");

router.post("/", appointmentController.createAppointment);
router.patch("/:id/cancel", appointmentController.cancelAppointment);

module.exports = router;