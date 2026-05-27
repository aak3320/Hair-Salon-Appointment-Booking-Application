const express = require("express");
const router = express.Router();

const { Profile, updateProfile } = require("../controllers/profileController");
const {protect} = require("../middleware/authMiddleware"); 

router.get("/", protect, Profile);

// Update logged in user profile (PUT /api/profile)
router.put("/", protect, updateProfile);

module.exports = router;