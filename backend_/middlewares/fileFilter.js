module.exports = (req, file, cb) => {
  const fileTypes = /pdf/;
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only PDF files are allowed'), false);
};