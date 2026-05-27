const express = require("express");
const router = express.Router();
const { register, login, validateToken } = require('../controllers/authController');

// Route for user registration
router.post('/register', register);

// Route for existing user login
router.post('/login', login);

// Route to validate JWT token
router.get('/validate', validateToken);

module.exports = router;