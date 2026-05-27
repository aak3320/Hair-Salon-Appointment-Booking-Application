const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

// Create Review
router.post("/", protect, reviewController.createReview);

// Get Reviews By Salon
router.get("/", reviewController.getReviewsBySalon);

module.exports = router;