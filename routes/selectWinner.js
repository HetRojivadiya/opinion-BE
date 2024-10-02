const express = require('express');
const router = express.Router();
const ConfirmedBets = require('../models/ConfirmedBets');
const CompletedBets = require('../models/CompletedBets');
const LiveContest = require('../models/LiveContest');
const CompletedContest = require('../models/CompletedContest');
const Balance = require('../models/Balance');

router.post('/', async (req, res) => {
    const { contestId, winnerOption } = req.body;

    try {
        // Get all bets for the provided contestId
        const confirmedBets = await ConfirmedBets.find({ contestId });
        const liveContest = await LiveContest.findOne({ id: contestId });

        if (!confirmedBets || confirmedBets.length === 0) {
            return res.status(404).json({ message: 'No bets found for this contest.' });
        }

        if (!liveContest) {
            return res.status(404).json({ message: 'Live contest not found.' });
        }

        // Process each confirmed bet
        for (let bet of confirmedBets) {
            let winner;
            if (winnerOption === 'YES') {
                winner = bet.yesUserId; // YES option wins
            } else if (winnerOption === 'NO') {
                winner = bet.noUserId; // NO option wins
            } else {
                return res.status(400).json({ message: 'Invalid winner option provided.' });
            }

            // Find the balance for the winner
            let winnerBalance = await Balance.findOne({ userId: winner });
            if (!winnerBalance) {
                return res.status(404).json({ message: `No balance record found for user ${winner}.` });
            }

            // Add 10 to the winner's balance
            winnerBalance.balance += 10;
            await winnerBalance.save();

            // Move the confirmed bet to completed bets with the winner field
            const completedBet = new CompletedBets({
                title: bet.title,
                contestId: bet.contestId,
                yesUserId: bet.yesUserId,
                noUserId: bet.noUserId,
                yesPrice: bet.yesPrice,
                noPrice: bet.noPrice,
                winner: winner
            });
            await completedBet.save();

            // Delete the confirmed bet
            await ConfirmedBets.findByIdAndDelete(bet._id);
        }

        // Move the live contest to completed contest with winner info
        const completedContest = new CompletedContest({
            id: liveContest.id,
            title: liveContest.title,
            sports_key: liveContest.sports_key,
            sport_title: liveContest.sport_title,
            home_team: liveContest.home_team,
            away_team: liveContest.away_team,
            yes_odds: liveContest.yes_odds,
            no_odds: liveContest.no_odds,
            yesQueue: liveContest.yesQueue,
            noQueue: liveContest.noQueue,
            winner: winnerOption, // Add the winner option
        });
        await completedContest.save();

        // Delete the contest from LiveContest
        await LiveContest.findOneAndDelete({ id: contestId });

        res.status(200).json({ message: 'Contest settled successfully, bets and contest have been updated.' });
    } catch (error) {
        console.error('Error in selecting winner:', error);
        res.status(500).json({ message: 'An error occurred while settling the contest.' });
    }
});

module.exports = router;
