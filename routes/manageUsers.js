
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Balance = require('../models/Balance');

// Endpoint to update user fields: email, fullname, or balance
router.post('/', async (req, res) => {
    const { userId, field, newValue } = req.body;

    try {
        if (!['email', 'fullname', 'balance'].includes(field)) {
            return res.status(400).json({ message: 'Invalid field.' });
        }

        if (field === 'email') {
            const existingUser = await User.findOne({ email: newValue });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use.' });
            }
            await User.findByIdAndUpdate(userId, { email: newValue });
        } else if (field === 'fullname') {
            await User.findByIdAndUpdate(userId, { fullname: newValue });
        } else if (field === 'balance') {
            await Balance.findOneAndUpdate({ userId }, { balance: newValue }, { upsert: true });
        }

        res.status(200).json({ message: `${field} updated successfully.` });
    } catch (error) {
        console.error(`Error updating ${field}:`, error);
        res.status(500).json({ message: 'An error occurred while updating user information.' });
    }
});

module.exports = router;
