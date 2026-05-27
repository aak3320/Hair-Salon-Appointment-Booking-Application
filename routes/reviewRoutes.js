const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");
const verifyToken = require("../middleware/authMiddleware");

// Create Review
router.post("/", verifyToken, reviewController.createReview);

// Get Reviews By Salon
router.get("/", reviewController.getReviewsBySalon);

module.exports = router;