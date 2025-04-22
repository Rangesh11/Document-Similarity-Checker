// profileRoutes.js
const express = require('express');
const router = express.Router();
const { getProfile, getLastTwoComparisons } = require('../controllers/profileController');
const authenticate = require('../middlewares/authenticate');

router.get('/get', authenticate, getProfile);


router.post('/last-comparisons', authenticate, getLastTwoComparisons);

module.exports = router;