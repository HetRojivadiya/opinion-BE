const express = require('express');
const router = express.Router()
const LiveContest = require('../../models/LiveContest')
const ConfirmedBets = require('../../models/ConfirmedBets')
const UnmatchedBets = require('../../models/UnmatchedBets')
const Balance = require('../../models/Balance')
router.post('/',async (req,res)=>{
    const { id,userId,option,price } = req.body;
    const balance = await Balance.findOne({userId})
    if (!balance || balance.length === 0) {
      return res.status(404).json({ message: 'No User found' });
    }
    if(balance.balance < price)return res.status(404).json({ message: 'Low balance..' });
    const livecontest = await LiveContest.find({id});

    if (!livecontest || livecontest.length === 0) {
        return res.status(404).json({ message: 'No contests found' });
      }
    
    if(option === "YES"){
        const result = await addToYesQueue(id, userId, price);
        if(!(result.status))return res.status(404).json({ message: result.message });
    }else {
        const result = await addToNoQueue(id, userId, price);
        if(!(result.status))return res.status(404).json({ message: result.message });
    }
      setTimeout(
        async ()=>{
            const unmatchedBet = await UnmatchedBets.find({contestId:id,userId})
            if (unmatchedBet.length > 0) {
              console.log(unmatchedBet)
                return res.status(404).json({ message: 'Order has failed to match please try again..' });
              }
              if(option === "YES"){
              const matchedBet = await ConfirmedBets.find({contestId:id,yesUserId:userId});
                if ( !matchedBet || matchedBet.length === 0) {
                return res.status(404).json({ message: 'Something went wrong please try again..' });
                }
                return res.status(200).json({ message:'Order booked succesfully see in portfolio' })
              }else {
                const matchedBet = await ConfirmedBets.find({contestId:id,noUserId:userId});
                if ( !matchedBet || matchedBet.length === 0) {
                return res.status(404).json({ message: 'Something went wrong please try again..' });
                }
                return res.status(200).json({ message:'Order booked succesfully see in portfolio' })
              }
        },20000)

})

const addToYesQueue = async (id, userId, price) => {
    try {
      const result = await LiveContest.findOneAndUpdate(
        { id }, 
        { $push: { yesQueue: { userId, price} } },
        { new: true, upsert: true } 
      );
  
      if (result) {
        console.log('User added to yesQueue:', result);
        return { status: true };
      } else {
        return { status:false, message:"Error placing the bet to yesQueue"};
      }
    } catch (error) {
      console.error('Error adding to yesQueue:', error);
      return { message: 'Error adding to yesQueue', error };
    }
  };
  const addToNoQueue = async (id, userId, price) => {
    try {
      const result = await LiveContest.findOneAndUpdate(
        { id }, 
        { $push: { noQueue: { userId, price} } }, 
        { new: true, upsert: true }
      );
  
      if (result) {
        console.log('User added to noQueue:', result);
        return { status: true };
      } else {
        return { status:false, message:"Error placing the bet to noQueue"};
      }
    } catch (error) {
      console.error('Error adding to noQueue:', error);
      return { message: 'Error adding to noQueue', error };
    }
  };
module.exports = router;