const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
const dotenv = require('dotenv')
dotenv.config();
const PORT = process.env.PORT
app.use(express.json())
const signupRoutes = require('./routes/signupRoutes')
const checkToken = require('./routes/checkToken')
const loginRoutes = require('./routes/loginRoutes')
const getAllCategories = require('./routes/getAllCategories')
const getSpecificSports = require('./routes/getSpecificSports')
const createContest = require('./routes/createContest')
const liveContest = require('./routes/userRoutes/liveContest')
const viewContest = require('./routes/userRoutes/viewContest')
const placeBet = require('./routes/userRoutes/placeBet')
const selectWinner = require('./routes/selectWinner')
const seePortfolio = require('./routes/userRoutes/seePortfolio')
const userDetails = require('./routes/userRoutes/userDetails')
const seeCompletedContest = require('./routes/userRoutes/seeCompletedContest')
const logout = require('./routes/userRoutes/logout')
const payment = require('./routes/userRoutes/payment')
const matchBets = require('./routes/matchBets')
const connectDB = require('./connectDB')
const CompletedBets = require('./routes/userRoutes/completedBets')



connectDB();

//user
app.use('/checkToken',checkToken);
app.use('/getUserDetails',userDetails);
app.use('/payment', payment );
app.use('/signup',signupRoutes);
app.use('/login',loginRoutes);
app.use('/liveContest',liveContest);
app.use('/viewContest',viewContest);
app.use('/confirmedBets',seePortfolio);
app.use('/completedBets',CompletedBets);

app.use('/placeBet',placeBet);
app.use('/seeCompletedContest',seeCompletedContest);
app.use('/logout',logout);
//admin
matchBets();
app.use('/getAllCategories',getAllCategories);
app.use('/getSpecificSports',getSpecificSports);
app.use('/createContest',createContest);
app.use('/selectWinner',selectWinner);

app.get("/",(req,res)=>{
    res.json("message is clear")
})

app.listen(PORT,()=>{
    console.log("Server is running on port no : ",PORT)
})
