const express = require('express')
const app = express()
const cors = require('cors')

const allowedOrigins = [
  'https://opinion-fe.onrender.com',
  'http://localhost:3000'
];

app.use(cors({
  credentials: true,
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      // Allow requests with no origin (e.g., mobile apps or curl requests)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

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
const alreadyExist = require('./routes/alreadyExist')
const completedContest = require('./routes/completedContest')
const users = require('./routes/users')
const manageUsers = require('./routes/manageUsers')
const withdrawRoutes = require('./routes/userRoutes/withdraw');

connectDB();

//user
app.use('/checkToken',checkToken);
app.use('/getUserDetails',userDetails);
app.use('/payment', payment );
app.use('/withdraw', withdrawRoutes);
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
app.use('/alreadyExist',alreadyExist);
app.use('/completedContest',completedContest)
app.use('/users',users)
app.use('/manageusers',manageUsers)
app.get("/",(req,res)=>{
    res.json("message is clear")
})

app.listen(PORT,()=>{
    console.log("Server is running on port no : ",PORT)
})
