const express = require('express');
const router = express.Router();
const User = require('../../models/User'); // Adjust path as needed
const Balance = require('../../models/Balance'); // Adjust path as needed

// Route to handle withdrawal requests
router.post('/', async (req, res) => {
    const { email, amount } = req.body;

    if (!email || !amount) {
        return res.status(400).json({ message: "Email and amount are required" });
    }

    if (amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
    }

    try {
        // Find the user by email and get their userId
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userId = user._id;

        // Find the balance document for the user
        const userBalance = await Balance.findOne({ userId: userId });

        if (!userBalance) {
            return res.status(404).json({ message: "Balance record not found" });
        }

        // Check if the user's balance is sufficient for the withdrawal
        if (userBalance.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // Update the user's balance
        userBalance.balance -= amount;
        await userBalance.save();

        // Respond with success
        res.status(200).json({ message: "Withdrawal successful", newBalance: userBalance.balance });
    } catch (error) {
        console.error("Error handling withdrawal:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
