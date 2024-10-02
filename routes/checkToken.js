const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/', (req, res) => {
    const { token } = req.body;


    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    try {

        const decoded = jwt.verify(token,  process.env.JWT_SECRET,);
        
        res.status(200).json({ message: 'Token is valid', decoded });
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
});

module.exports = router;
