/**
 * Middleware to filter file uploads by type
 * Only allows PDF, DOCX and TXT files
 */
const fileFilter = (req, file, cb) => {
  // List of accepted MIME types
  const allowedMimeTypes = [
    'application/pdf',                                                   // PDF
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'text/plain'                                                         // TXT
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    // Accept file
    cb(null, true);
  } else {
    // Reject file
    cb(new Error('File type not supported. Please upload PDF, DOCX, or TXT files only.'), false);
  }
};

module.exports = fileFilter;