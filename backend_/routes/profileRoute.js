// profileRoutes.js
const express = require('express');
const router = express.Router();
const { getProfile, getLastTwoComparisons } = require('../controllers/profileController');
const authenticate = require('../middlewares/authenticate');

// Route for getting user profile (token required)
router.get('/get', authenticate, getProfile);

// Route for getting last two comparisons (email in body, token required)
router.post('/last-comparisons', authenticate, getLastTwoComparisons);

module.exports = router;