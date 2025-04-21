const express = require('express');
const { getProfile } = require('../controllers/profileController'); // Import the controller function
const router = express.Router();

// Route for getting user profile
router.get('/get', getProfile);

module.exports = router;
