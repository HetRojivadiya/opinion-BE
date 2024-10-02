const mongoose = require('mongoose');

// Define the livecontest schema
const liveContestSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true }, 
  title:{type: String, unique: true, required: true},
  sports_key: { type: String, required: true },
  sport_title: { type: String, required: true },
  home_team: { type: String, required: true },
  away_team: { type: String, required: true },
  yes_odds: { type: Number, required: true },
  no_odds: { type: Number, required: true },
  yesQueue:[{  userId: { type: String },
    price: { type: Number } }],
  noQueue:[{ userId: { type: String },
    price: { type: Number } }]
});

// Export the model
module.exports = mongoose.model('LiveContest', liveContestSchema);
