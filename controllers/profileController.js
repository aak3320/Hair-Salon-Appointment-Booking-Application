const {userProfile} = require('../services/profileService');

// Get logged in user's profile
const Profile = async (req, res) => {
    
    try {
        
        // Get user ID from the authenticated request
        const userId = req.user.id; 

        // Fetch user profile using the service function
        const user = await userProfile(userId);

        res.status(200).json({
            success: true,
            user: user
        });
    } catch (err) {

        if (err.message === "User not found") {
            return res.status(404).json({
                success: false,
                message: err.message
            });
        }

        // Any other server error
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

module.exports = { Profile };
