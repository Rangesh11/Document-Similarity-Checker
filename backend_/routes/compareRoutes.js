const express = require('express');
const router = express.Router();
const multer = require('multer');
const compareController = require('../controllers/compareController');
const authMiddleware = require('../middlewares/authMiddleware');
const fileFilter = require('../middlewares/fileFilter');

// Configure multer storage
const storage = multer.memoryStorage();

// Configure multer with file size limits and filtering
const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
    files: 2 // Maximum 2 files per request
  }
});

// Document comparison route - requires authentication
router.post('/compare', 
  authMiddleware, 
  (req, res, next) => {
    upload.array('documents', 2)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ 
            error: 'File size too large. Maximum file size is 10MB.' 
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({ 
            error: 'Too many files. Please upload exactly two files.' 
          });
        }
        return res.status(400).json({ error: err.message });
      } else if (err) {
        // Non-Multer error
        return res.status(400).json({ error: err.message });
      }
      // No error, continue to controller
      next();
    });
  }, 
  compareController.compareDocuments
);

// Get user's document history (could be implemented later)
router.get('/history', 
  authMiddleware, 
  (req, res) => {
    // This would normally fetch document comparison history from database
    // Placeholder for now
    res.json({ message: 'Document history endpoint - to be implemented' });
  }
);

module.exports = router;