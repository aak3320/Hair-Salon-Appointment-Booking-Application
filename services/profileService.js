// Handles business logic for profile
const User = require("../models/User");

// Fetches user profile by ID from MongoDB
const userProfile = async (userId) => {

    // Find user by ID and remove password from the data
    const user = await User.findById(userId).select("-password"); 

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}

module.exports = { userProfile };