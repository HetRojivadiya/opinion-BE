const express = require('express');
const router = express.Router();
const Users = require('../../models/User');  
const Balance = require('../../models/Balance');  
const jwt = require('jsonwebtoken');


router.post('/', async (req, res) => {
    const { token } = req.body;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET,);
    
    const user = await Users.findOne({ _id: decoded.userId });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const balance = await Balance.findOne({ userId: user._id });

    // Return user details
    res.json({
        fullname : user.fullname,
        email: user.email,
        balance: balance.balance,
    });
});


module.exports = router;