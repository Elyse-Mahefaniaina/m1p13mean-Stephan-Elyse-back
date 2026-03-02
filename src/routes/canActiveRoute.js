const express = require('express');
const canActive = require('../controller/canActiveController');
const router = express.Router();

router.post('/', canActive);

module.exports = router;
