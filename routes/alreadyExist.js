const express = require('express');
const router = express.Router();
const LiveContest = require('../models/LiveContest');

// API to check for existing contests in LiveContest
router.post('/', async (req, res) => {
  try {
    const contests = await LiveContest.find({}, 'id'); // Retrieve only the 'id' field for each contest
    const existingIds = contests.map(contest => contest.id); // Extract IDs into an array
    res.json(existingIds); // Send array of IDs back to client
  } catch (error) {
    res.status(500).json({ message: 'Error fetching existing contests', error });
  }
});

module.exports = router;