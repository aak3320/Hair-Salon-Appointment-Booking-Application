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
};

const updateUserProfile = async (userId, updatedData) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    // Check if Changed email and mobile number are already used by other users
    if (updatedData.email && updatedData.email !== user.email) {
        const emailExists = await User.findOne({
            email: updatedData.email
        });

        if (emailExists) {
            throw new Error("Email is already used to another account");
        }
    }

    if (updatedData.mobileNumber && updatedData.mobileNumber !== user.mobileNumber) {
        const mobileExists = await User.findOne({
            mobileNumber: updatedData.mobileNumber
        });

        if (mobileExists) {
            throw new Error("Mobile number is already used to another account");
        }
    }

    // Update only fields that are user want to change
    if (updatedData.name) {
        user.name = updatedData.name;
    } 

    if (updatedData.email) {
        user.email = updatedData.email;
    }

    if (updatedData.mobileNumber) {
        user.mobileNumber = updatedData.mobileNumber;
     }

     //save updated data to MongoDB
     await user.save();
     
     return user;

};

const deleteUserProfile = async (userId) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }
    
    await User.findByIdAndDelete(userId);

    return true;
};

module.exports = { userProfile, updateUserProfile, deleteUserProfile };