

const express = require('express');
const router = express.Router();
const axios = require('axios');
  
router.post('/', async (req, res) => {
  try {
    const { key } = req.body
    const response = await axios.get(`${process.env.SPECIFIC_SPORTS_LINK}`+`${key}/odds/?apiKey=${process.env.API_KEY}&regions=us&markets=h2h&oddsFormat=decimal`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while getting specific sports data ' });
  }
});

module.exports = router;


