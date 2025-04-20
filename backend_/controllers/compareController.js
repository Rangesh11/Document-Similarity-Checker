const pdfParse = require('pdf-parse');

// Function to calculate cosine similarity
const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
};

// Function to convert text to vector
const textToVector = (text) => {
  const words = text.toLowerCase().match(/\w+/g);
  const freqMap = {};
  words.forEach((word) => {
    freqMap[word] = (freqMap[word] || 0) + 1;
  });
  return freqMap;
};

// Function to compute similarity between two texts
const computeSimilarity = (text1, text2) => {
  const vecA = textToVector(text1);
  const vecB = textToVector(text2);
  const allWords = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
  const vectorA = [];
  const vectorB = [];
  allWords.forEach((word) => {
    vectorA.push(vecA[word] || 0);
    vectorB.push(vecB[word] || 0);
  });
  return cosineSimilarity(vectorA, vectorB);
};

exports.compareDocuments = async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length !== 2) {
      return res.status(400).json({ error: 'Please upload exactly two PDF files.' });
    }

    const data1 = await pdfParse(files[0].buffer);
    const data2 = await pdfParse(files[1].buffer);

    const similarity = computeSimilarity(data1.text, data2.text);

    res.json({ similarity: similarity.toFixed(4) });
  } catch (error) {
    res.status(500).json({ error: 'Error comparing documents' });
  }
};

