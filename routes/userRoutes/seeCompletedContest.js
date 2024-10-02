const express = require('express');
const router = express.Router();
const CompletedBets = require('../../models/CompletedBets');

router.post('/', async (req, res) => {
    const { userId } = req.body;

    try {
        // Find all bets where the user is either in yesUserId or noUserId
        const bets = await CompletedBets.find({
            $or: [
                { yesUserId: userId },
                { noUserId: userId }
            ]
        });

        if (bets.length === 0) {
            return res.status(404).json({ message: 'No completed bets found.' });
        }

        // Send the result back to the frontend
        res.status(200).json({ completedBets: bets });
    } catch (error) {
        console.error('Error fetching completed bets:', error);
        res.status(500).json({ message: 'An error occurred while fetching completed bets.' });
    }
});

module.exports = router;
