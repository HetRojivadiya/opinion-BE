const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists in the User collection (permanent storage)
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User account doesn't exist." });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password." });
        }

        // If password is correct, generate a JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '10d' } // Token expires in 10 days
        );

        // Set the token in a cookie and also send it in the response body
        res.cookie('authToken', token, {
            httpOnly: true,  // Securely store the cookie
            secure: true, 
            maxAge: 10 * 24 * 60 * 60 * 1000 // 10 days in milliseconds
        });

        // Send the token and user info to the frontend
        res.status(200).json({ 
            message: "Login successful.",
            token, // Return the token in the body too
            userId: user._id,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});

module.exports = router;
