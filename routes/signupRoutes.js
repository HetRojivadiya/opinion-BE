const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Assuming you have a User model for permanent storage
const Balance = require('../models/Balance'); // Assuming you have a Balance model for user balances
const router = express.Router();

// POST /signup route for simple signup without email verification
router.post('/', async (req, res) => {
    const { username, email, password, fullname } = req.body;

    try {
        // Check if the user already exists in the permanent User collection
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Check if the username already exists in the permanent User collection
        existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already taken" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the User collection
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            fullname
        });

        await newUser.save();

        // Assign an initial balance to the new user
        const balance = new Balance({
            userId: newUser._id,
            balance: 500 // Initial balance
        });
        await balance.save();

        // Respond with success
        res.status(200).json({ message: "Signup successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// You can export the router for use in your main server file
module.exports = router;
