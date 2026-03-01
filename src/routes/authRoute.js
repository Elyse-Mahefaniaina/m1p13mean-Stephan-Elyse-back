const express = require('express');
const router = express.Router();

const {
    login,
    refreshToken,
    logout
} = require('../controller/authController');

router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);

module.exports = router;
