const express = require("express");
const router = express.Router();

const { Profile, updateProfile, deleteProfile } = require("../controllers/profileController");
const {protect} = require("../middleware/authMiddleware"); 

router.get("/", protect, Profile);

// Update logged in user profile (PUT /api/profile)
router.put("/", protect, updateProfile);

// Delete user account (DELETE api/profile)
router.delete("/", protect, deleteProfile);

module.exports = router;