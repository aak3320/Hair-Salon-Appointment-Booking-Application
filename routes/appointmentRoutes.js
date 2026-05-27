const express = require("express");
const router = express.Router();

const appointmentController = require("../controllers/appointmentController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, appointmentController.createAppointment);
router.patch("/:id/cancel", protect, appointmentController.cancelAppointment);

module.exports = router;