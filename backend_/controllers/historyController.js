const ComparisonResult = require('../models/response');

const getHistory = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Fetch all history documents for this email
    const historyData = await ComparisonResult.find({ 'user.email': email })
      .sort({ date: -1 })
      .lean();

    return res.status(200).json(historyData);
  } catch (error) {
    console.error('Error fetching history:', error);
    return res.status(500).json({ message: 'Error fetching history data' });
  }
};

module.exports = { getHistory };
