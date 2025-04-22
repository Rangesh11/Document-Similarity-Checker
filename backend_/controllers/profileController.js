// profileController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ComparisonResult = require('../models/response');

// Get user profile
const getProfile = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Error in getProfile:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get last two comparisons by user email
const getLastTwoComparisons = async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Log the request body
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const comparisons = await ComparisonResult.find({ 'user.email': email })
      .sort({ createdAt: -1 })
      .limit(2);

    if (!comparisons || comparisons.length === 0) {
      return res.status(404).json({ message: 'No comparisons found' });
    }

    res.json(comparisons);
  } catch (err) {
    console.error('Error fetching comparison history:', err);
    res.status(500).json({ message: 'Error fetching comparison history' });
  }
};



module.exports = {
  getProfile,
  getLastTwoComparisons,
};