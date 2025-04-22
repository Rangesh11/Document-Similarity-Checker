const express = require('express');
const { getHistory } = require('../controllers/historyController');
// No need for authMiddleware if not verifying token
const router = express.Router();

// Use POST so we can send email in the request body
router.post('/history', getHistory);

module.exports = router;
