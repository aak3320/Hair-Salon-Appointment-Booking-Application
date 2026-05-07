const bcrypt = require('bcrypt');
const User = require('../models/User');

// Register a new user
const registerUser = async (name, email, mobileNumber, password, role) => { 

    // Check if the email or mobile number already exists
    const existingEmail = await User.findOne ({ email });
    if (existingEmail) {
        throw new Error('Email is already registered. Please use a different email.');
    }

    const existingMobile = await User.findOne ({ mobileNumber });
    if (existingMobile) {
        throw new Error('Mobile number is already registered. Please use a different mobile number.');
    }

    // Hash the password before saving into database
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds for hashing whihch shows how strong hashing is

    // Create a new user instance in the database
    const newUser = await User.create({
        name,
        email,
        mobileNumber,
        password: hashedPassword,
        role: role || 'customer' // Default role is 'customer' if not provided
    });

    return newUser;
};

module.exports = {registerUser};
