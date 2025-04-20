
const express = require('express');
const router = express.Router();
const multer = require('multer');
const compareController = require('../controllers/compareController');
const authMiddleware = require('../middlewares/authMiddleware');
const fileFilter = require('../middlewares/fileFilter'); // Added for file filter

// Configure file upload
const storage = multer.memoryStorage();
const upload = multer({ storage, fileFilter });

router.post('/compare', authMiddleware, upload.array('documents', 2), compareController.compareDocuments);

module.exports = router;
