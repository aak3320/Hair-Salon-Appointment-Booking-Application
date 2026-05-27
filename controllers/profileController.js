const {userProfile, updateUserProfile} = require('../services/profileService');

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

const updateProfile = async (req, res) => {

    try {

        const userId = req.user.id;

        // Fetch updated data from request body
        const { name, email, mobileNumber } = req.body;

        //Check is there any field to update
        if (!name && !email && !mobileNumber) {
            return res.status(400).json({
                success: false,
                message: 'Please provide at least one field to update'
            });
        }

        const updatedData = { };

        if (name) {
            updatedData.name = name;
        }

        if (email) {
            updatedData.email = email;
        }

        if (mobileNumber) {
            updatedData.mobileNumber = mobileNumber;
        }

        // Call the service to update user profile
        const updatedUser = await updateUserProfile(userId, updatedData);

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
        
    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = { Profile, updateProfile };
