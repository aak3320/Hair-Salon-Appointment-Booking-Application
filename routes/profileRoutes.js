const express = require("express");
const router = express.Router();

const { Profile } = require("../controllers/profileController");
const {protect} = require("../middleware/authMiddleware");

router.get("/", protect, Profile);

module.exports = router;