const { registerUser } = require('../services/authService');

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

module.exports = { register };