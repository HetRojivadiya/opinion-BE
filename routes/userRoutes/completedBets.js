const express = require('express');
const router = express.Router();
const CompletedBets = require('../../models/CompletedBets'); // Use the CompletedBets model
const User = require('../../models/User'); // Assuming you have a User model

// Route to get completed bets for a user using POST
router.post('/', async (req, res) => {
  const userId = req.body.userId; // Get userId from the request body

  console.log(userId);
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Find all completed bets for the user
    const completedBets = await CompletedBets.find({
      $or: [{ yesUserId: userId }, { noUserId: userId }]
    });

    // Populate user details
    const betsWithUserDetails = await Promise.all(completedBets.map(async (bet) => {
      const isYesUser = bet.yesUserId === userId;
      const oppositeUserId = isYesUser ? bet.noUserId : bet.yesUserId;

      const oppositeUser = await User.findById(oppositeUserId);

      return {
        ...bet.toObject(),
        oppositeUserName: oppositeUser ? oppositeUser.username : 'Unknown User', // Adjust according to your User model
        myBet: isYesUser ? bet.yesPrice : bet.noPrice,
        opponentBet: isYesUser ? bet.noPrice : bet.yesPrice,
        betOutcome: bet.winner === userId ? 'Won' : 'Lost' // Determine if the user won or lost
      };
    }));

    // Send the data back to the client
    res.json(betsWithUserDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;