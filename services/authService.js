const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

// Login user 
const loginUser = async (email, password) => {

    //Check if the user with the provided email exists
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password.');
    }

    // Compare entered password with hashed password in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error('Invalid email or password.');
    }

    //Generate JWT token
    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE
        }
    );
    return { token, user };
};

module.exports = {registerUser, loginUser};
