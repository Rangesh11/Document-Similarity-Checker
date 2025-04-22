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

const getLastTwoComparisons = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const results = await ComparisonResult.find({ 'user.email': email })
      .sort({ createdAt: -1 })
      .limit(2);

    res.json(results);
  } catch (error) {
    console.error('Error in getLastTwoComparisons:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = {
  getProfile,
  getLastTwoComparisons,
};
