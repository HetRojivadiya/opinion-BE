const mongoose = require('mongoose');

// Define the livecontest schema
const completedContestSchema = new mongoose.Schema({
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
    price: { type: Number } }],
    winner:{ type: String, required: true },
});

// Export the model
module.exports = mongoose.model('CompletedContest', completedContestSchema);
