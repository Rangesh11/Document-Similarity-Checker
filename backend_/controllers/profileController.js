const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getProfile = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from header

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode token
    console.log(decoded); // For debugging

    const user = await User.findById(decoded.userId); // Use the decoded user ID

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the user profile
    res.json({
      username: user.username,
      email: user.email,
      role: user.role, // Include role if necessary
    });
  } catch (error) {
    console.error('Error in getProfile:', error.message); // Log the error message
    res.status(500).json({ message: 'Server error', error: error.message }); // Provide detailed error message
  }
};

module.exports = {
  getProfile,
};
