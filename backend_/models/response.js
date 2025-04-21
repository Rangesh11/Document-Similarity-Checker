const mongoose = require('mongoose');

const comparisonResultSchema = new mongoose.Schema({
  user: {
    email: { type: String, required: true } // Store user's email
  },
  similarity: { type: Number, required: true },
  jaccardSimilarity: { type: Number, required: true },
  semanticSimilarity: { type: Number, required: true },
  hammingDistance: { type: Number, required: true },
  plagiarismDetected: { type: Boolean, required: true },
  similarContent: [{
    paragraph1: { type: String },
    paragraph2: { type: String },
    similarity: { type: String },
    index1: { type: Number },
    index2: { type: Number }
  }],
  sharedSequences: [{
    text: { type: String },
    pos1: { type: Number },
    pos2: { type: Number },
    length: { type: Number }
  }],
  doc1Paragraphs: [{ type: String }],
  doc2Paragraphs: [{ type: String }],
  doc1Text: { type: String },
  doc2Text: { type: String },
  fileInfo: {
    file1: {
      name: { type: String },
      size: { type: Number },
      type: { type: String }
    },
    file2: {
      name: { type: String },
      size: { type: Number },
      type: { type: String }
    }
  }
});

const ComparisonResult = mongoose.model('ComparisonResult', comparisonResultSchema);

module.exports = ComparisonResult;
