const LiveContest = require('../models/LiveContest'); 
const ConfirmedBets = require('../models/ConfirmedBets');
const Unmatchedbets = require('../models/UnmatchedBets');
const Balance = require('../models/Balance')
const match = async() => {
    const livecontests = await LiveContest.find({});
    await Unmatchedbets.deleteMany({});
    for (const contest of livecontests) {
        yesQueue = contest.yesQueue;
        noQueue = contest.noQueue;
    
        while(yesQueue.length > 0 && noQueue.length >0){
            const yesBet = yesQueue.shift();
            const noBet = noQueue.shift();
            console.log(yesBet)
            console.log(noBet)
            if((yesBet.price + noBet.price) != 10){
                if(yesBet.price >= noBet.price)yesBet.price = 10 - noBet.price;
                else noBet.price = 10 - yesBet.price;
            }
            const confirmedBet = new ConfirmedBets({
                title: contest.title,
                contestId: contest.id,
                yesUserId: yesBet.userId,
                noUserId: noBet.userId,
                yesPrice: yesBet.price,
                noPrice: noBet.price,
              });
        
              await confirmedBet.save();
              const balance = await Balance.findOne({userId:yesBet.userId});
              balance.balance = balance.balance - yesBet.price;
              await balance.save();
              const balance2 = await Balance.findOne({userId:noBet.userId});
              balance2.balance = balance2.balance - noBet.price;
              await balance2.save();
        }
        while(yesQueue.length > 0){
            const yesBet = yesQueue.shift();
            const unmatchedBet = new Unmatchedbets({
                contestId: contest.id,
                userId:yesBet.userId,
            })
            await unmatchedBet.save(); 
        }
        while(noQueue.length > 0){
            const noBet = noQueue.shift();
            const unmatchedBet = new Unmatchedbets({
                contestId: contest.id,
                userId: noBet.userId,
            })
            await unmatchedBet.save();
        }
    contest.yesQueue = yesQueue;
    contest.noQueue = noQueue;
    await contest.save();
    }
};

const matchBets = ()=>{
    setInterval(match,10000);
}

module.exports =  matchBets ;

