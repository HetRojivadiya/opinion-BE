const express = require('express');
const router = express.Router();
const ConfirmedBets = require('../../models/ConfirmedBets');

router.post('/', async (req, res) => {
    const { userId } = req.body;

    try {
        // Find all bets where the user is either in yesUserId or noUserId
        const bets = await ConfirmedBets.find({
            $or: [
                { yesUserId: userId },
                { noUserId: userId }
            ]
        });

        if (bets.length === 0) {
            return res.status(404).json({ message: 'No confirmed bets found.' });
        }

        // Send the result back to the frontend
        res.status(200).json({ confirmedBets: bets });
    } catch (error) {
        console.error('Error fetching confirmed bets:', error);
        res.status(500).json({ message: 'An error occurred while fetching confirmed bets.' });
    }
});

module.exports = router;
