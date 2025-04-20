// BACKEND: compareController.js
const crypto = require('crypto');
const pdfParse = require('pdf-parse');

const getFingerprint = (text) => {
  return crypto.createHash('sha256').update(text).digest('hex');
};

const getHammingDistance = (hash1, hash2) => {
  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) distance++;
  }
  return distance;
};

const compareFingerprints = (text1, text2) => {
  const fingerprint1 = getFingerprint(text1);
  const fingerprint2 = getFingerprint(text2);
  return getHammingDistance(fingerprint1, fingerprint2);
};

const textToVector = (text) => {
  const words = text.toLowerCase().match(/\w+/g);
  const freqMap = {};
  words.forEach((word) => {
    freqMap[word] = (freqMap[word] || 0) + 1;
  });
  return freqMap;
};

const cosineSimilarity = (vecA, vecB) => {
  const allWords = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
  const vectorA = [], vectorB = [];
  allWords.forEach((word) => {
    vectorA.push(vecA[word] || 0);
    vectorB.push(vecB[word] || 0);
  });
  const dotProduct = vectorA.reduce((sum, val, i) => sum + val * vectorB[i], 0);
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, val) => sum + val * val, 0));
  if (!magnitudeA || !magnitudeB) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
};

const jaccardSimilarity = (text1, text2) => {
  const setA = new Set(text1.toLowerCase().match(/\w+/g));
  const setB = new Set(text2.toLowerCase().match(/\w+/g));
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
};

const computeSimilarity = (text1, text2) => {
  const vecA = textToVector(text1);
  const vecB = textToVector(text2);
  return cosineSimilarity(vecA, vecB);
};

const detectPlagiarism = (cosineSim, jaccardSim) => {
  const cosineWeight = 0.6;
  const jaccardWeight = 0.4;
  const combinedScore = cosineSim * cosineWeight + jaccardSim * jaccardWeight;
  return combinedScore >= 0.8;
};

const getSimilarContent = (text1, text2, threshold = 0.7) => {
  const paras1 = text1.split('\n').filter(p => p.trim());
  const paras2 = text2.split('\n').filter(p => p.trim());
  const similar = [];

  paras1.forEach((p1, i) => {
    paras2.forEach((p2, j) => {
      const sim = computeSimilarity(p1, p2);
      if (sim >= threshold) {
        similar.push({ paragraph1: p1, paragraph2: p2, similarity: sim.toFixed(4), index1: i, index2: j });
      }
    });
  });

  return { similar, paras1, paras2 };
};

exports.compareDocuments = async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length !== 2) {
      return res.status(400).json({ error: 'Please upload exactly two PDF files.' });
    }

    const data1 = await pdfParse(files[0].buffer);
    const data2 = await pdfParse(files[1].buffer);

    const text1 = data1.text;
    const text2 = data2.text;

    const cosineSim = computeSimilarity(text1, text2);
    const jaccardSim = jaccardSimilarity(text1, text2);
    const hammingDistance = compareFingerprints(text1, text2);

    const { similar, paras1, paras2 } = getSimilarContent(text1, text2);
    const isPlagiarized = detectPlagiarism(cosineSim, jaccardSim);

    res.json({
      similarity: cosineSim.toFixed(4),
      jaccardSimilarity: jaccardSim.toFixed(4),
      hammingDistance,
      plagiarismDetected: isPlagiarized ? 'Yes' : 'No',
      similarContent: similar,
      doc1Paragraphs: paras1,
      doc2Paragraphs: paras2
    });
  } catch (error) {
    console.error("Error occurred: ", error);
    res.status(500).json({ error: 'Error comparing documents' });
  }
};