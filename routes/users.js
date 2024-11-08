
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Balance = require('../models/Balance');

// Endpoint to fetch users with balance information
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        const balances = await Balance.find({});

        // Merge user data with balance data
        const usersWithBalance = users.map(user => {
            const balanceObj = balances.find(b => b.userId === user._id.toString());
            return {
                _id: user._id,
                username: user.username,
                email: user.email,
                fullname: user.fullname || '',
                balance: balanceObj ? balanceObj.balance : 0,
            };
        });

        res.status(200).json(usersWithBalance);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users.' });
    }
});

module.exports = router;
