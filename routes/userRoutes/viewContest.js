const express = require('express');
const router = express.Router();
const LiveContest = require('../../models/LiveContest'); // Import the LiveContest model

// New POST route to retrieve all contests but exclude sports_key and sport_title
router.post('/', async (req, res) => {
  try {
    const { id} = req.body;
    // Find all contests, excluding sports_key and sport_title fields
    const contests = await LiveContest.find({id});

    if (!contests || contests.length === 0) {
      return res.status(404).json({ message: 'No contests found' });
    }

    res.json(contests); // Send the contests data in the response
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving contests', error });
  }
});

module.exports = router;
