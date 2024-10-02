const express = require('express');
const router = express.Router();
const LiveContest = require('../models/LiveContest'); // Import the LiveContest model

// Function to insert live contest data into MongoDB
const insertLiveContest = async (data) => {
  const { id,title, sports_key, sport_title, home_team, away_team, odds } = data;

  // Check if contest with this ID already exists
  const existingContest = await LiveContest.findOne({ id });
  if (existingContest) {
    return { message: 'already exists' }; // Respond if ID exists
  }

  // Calculate odds
  const yesOdds = Math.round(( 10/ odds) * 2) / 2; // Round to nearest 0.5
  const noOdds = 10 - yesOdds; // Other odds

  // Create a new live contest entry
  const newContest = new LiveContest({
    id,
    title,
    sports_key,
    sport_title,
    home_team,
    away_team,
    yes_odds: yesOdds,
    no_odds: noOdds,
    yesQueue:[],
    noQueue:[],
  });

  // Save to the database
  try {
    await newContest.save();
    return { message: 'entry added successfully' };
  } catch (error) {
    return { message: 'error adding entry', error };
  }
};

// POST route to receive and insert contest data
router.post('/', async (req, res) => {
  const result = await insertLiveContest(req.body); // Pass request body to the function
  res.json(result); // Send response back to the client
});

module.exports = router;
