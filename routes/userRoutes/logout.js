const express = require('express');
const router = express.Router();

// Logout route to clear the JWT cookie
router.post('/', (req, res) => {
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: true
    });

    res.status(200).json({ message: "Logout successful." });
});

module.exports = router;
