const { registerUser, loginUser } = require('../services/authService');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Controller function to handle user registration
const register = async (req, res) => {
    try {
        // Extract user details from the request body
        const { name, email, mobileNumber, password, role } = req.body;

        // Basic validation
        if (!name || !email || !mobileNumber || !password) {
            return res.status(400).json({ 
                message: 'Please provide all required fields' 
            });
        }

        // Call the service function to register the user
        const newUser = await registerUser(name, email, mobileNumber, password, role);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: newUser
        });
    }  catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Controller function to handle user login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Please enter email and password' 
            });
        }

        // Call the service function to login the user
        const { user, token } = await loginUser(email, password);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token,
            user: user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const validateToken = async (req, res) => {

    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User no longer exists'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Token is valid'
        });
    } catch (err) {
        res.status(401).json({
            success: false,
            message: 'Token is invalid or expired'
        });
    }
};

module.exports = { register, login, validateToken };