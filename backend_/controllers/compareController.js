const crypto = require('crypto');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { text } = require('express');

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
  if (!text) return {}; 

  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '') 
    .replace(/\s+/g, ' ')   
    .trim()
    .split(/\s+/);

  const freqMap = {};
  words.forEach((word) => {
    if (word.length <= 2 || ['the', 'and', 'for', 'but', 'not', 'with', 'this', 'that'].includes(word)) {
      return;
    }
    freqMap[word] = (freqMap[word] || 0) + 1;
  });
  
  return freqMap;
};

// Calculate cosine similarity between two document vectors
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

// Calculate Jaccard similarity between two texts
const jaccardSimilarity = (text1, text2) => {
  if (!text1 || !text2) return 0;
  
  // Get unique words from both texts
  const words1 = text1.toLowerCase().match(/\w+/g) || [];
  const words2 = text2.toLowerCase().match(/\w+/g) || [];
  
  // Filter out common words
  const stopwords = new Set(['the', 'and', 'for', 'but', 'not', 'with', 'this', 'that', 'is', 'are', 'was', 'were']);
  const filteredWords1 = words1.filter(word => word.length > 2 && !stopwords.has(word));
  const filteredWords2 = words2.filter(word => word.length > 2 && !stopwords.has(word));
  
  const setA = new Set(filteredWords1);
  const setB = new Set(filteredWords2);
  
  // Calculate intersection and union
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  
  if (union.size === 0) return 0;
  return intersection.size / union.size;
};

// Compute vector-based similarity between texts
const computeSimilarity = (text1, text2) => {
  const vecA = textToVector(text1);
  const vecB = textToVector(text2);
  return cosineSimilarity(vecA, vecB);
};

// Detect plagiarism based on combined metrics
const detectPlagiarism = (cosineSim, jaccardSim, paragraphMatches) => {
  // Calculate weighted score
  const cosineWeight = 0.5;
  const jaccardWeight = 0.3;
  const paragraphWeight = 0.2;
  
  // Calculate paragraph match score
  let paragraphScore = 0;
  if (paragraphMatches && paragraphMatches.length > 0) {
    const highSimilarityMatches = paragraphMatches.filter(match => parseFloat(match.similarity) >= 0.8).length;
    paragraphScore = Math.min(1, highSimilarityMatches / 3); // Normalize to 0-1 range
  }
  
  const combinedScore = (cosineSim * cosineWeight) + 
                        (jaccardSim * jaccardWeight) + 
                        (paragraphScore * paragraphWeight);
                        
  return combinedScore >= 0.7; // Threshold for plagiarism detection
};

// Find similar paragraphs between documents
const getSimilarContent = (text1, text2, threshold = 0.6) => {
  // Split texts into paragraphs
  const paras1 = text1.split(/\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 30); // Only consider substantive paragraphs
    
  const paras2 = text2.split(/\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 30);
    
  const similar = [];

  // Compare each paragraph from doc1 with each from doc2
  paras1.forEach((p1, i) => {
    paras2.forEach((p2, j) => {
      const sim = computeSimilarity(p1, p2);
      if (sim >= threshold) {
        similar.push({ 
          paragraph1: p1, 
          paragraph2: p2, 
          similarity: sim.toFixed(4), 
          index1: i, 
          index2: j 
        });
      }
    });
  });

  return { similar, paras1, paras2 };
};

// Extract text from PDF file
const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
};

// Extract text from DOCX file
const extractTextFromDOCX = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error("Error extracting text from DOCX:", error);
    throw new Error("Failed to extract text from DOCX");
  }
};

// Extract text from uploaded files
const extractText = async (file) => {
  if (!file || !file.buffer) {
    throw new Error("Invalid file");
  }
  
  const mimeType = file.mimetype;
  
  if (mimeType === 'application/pdf') {
    return extractTextFromPDF(file.buffer);
  } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return extractTextFromDOCX(file.buffer);
  } else if (mimeType === 'text/plain') {
    // For text files, just convert buffer to string
    return file.buffer.toString('utf-8');
  } else {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }
};

// Find sequences of similar words (advanced method)
const findSharedSequences = (text1, text2, minLength = 5) => {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  const sequences = [];
  
  // Find matching sequences using sliding window approach
  for (let i = 0; i <= words1.length - minLength; i++) {
    for (let j = 0; j <= words2.length - minLength; j++) {
      let matchLength = 0;
      
      // Check how many consecutive words match
      while (i + matchLength < words1.length && 
             j + matchLength < words2.length && 
             words1[i + matchLength] === words2[j + matchLength]) {
        matchLength++;
      }
      
      // If we found a significant match
      if (matchLength >= minLength) {
        sequences.push({
          text: words1.slice(i, i + matchLength).join(' '),
          pos1: i,
          pos2: j,
          length: matchLength
        });
        
        // Skip ahead to avoid overlapping matches
        i += matchLength - 1;
        break;
      }
    }
  }
  
  return sequences;
};

// Main controller function to compare documents
exports.compareDocuments = async (req, res) => {
  try {
    // Check if files are uploaded
    if (!req.files || req.files.length !== 2) {
      return res.status(400).json({ 
        error: 'Please upload exactly two files for comparison.' 
      });
    }

    // Extract text from both documents
    const file1 = req.files[0];
    const file2 = req.files[1];
    
    // Parse text from different file formats
    let text1, text2;
    try {
      text1 = await extractText(file1);
      text2 = await extractText(file2);
    } catch (error) {
      return res.status(400).json({ 
        error: `Error extracting text: ${error.message}` 
      });
    }

    // Check if extracted text is valid
    if (!text1 || !text2 || text1.length < 10 || text2.length < 10) {
      return res.status(400).json({ 
        error: 'One or both documents are empty or could not be properly parsed.' 
      });
    }

    // Calculate similarity metrics
    const cosineSim = computeSimilarity(text1, text2);
    const jaccardSim = jaccardSimilarity(text1, text2);
    const hammingDistance = compareFingerprints(text1, text2);
    
    // Find similar content between documents
    const { similar, paras1, paras2 } = getSimilarContent(text1, text2);
    
    // Get shared sequences for further analysis
    const sharedSequences = findSharedSequences(text1, text2);
    
    // Determine if plagiarism is detected
    const isPlagiarized = detectPlagiarism(cosineSim, jaccardSim, similar);

    // Prepare detailed paragraph summary
    let paragraphAnalysis = [];
    if (similar.length > 0) {
      // Sort by similarity score (highest first)
      paragraphAnalysis = similar.sort((a, b) => 
        parseFloat(b.similarity) - parseFloat(a.similarity)
      );
    }

    // Send response with comprehensive analysis
    res.json({
      similarity: cosineSim.toFixed(4),
      jaccardSimilarity: jaccardSim.toFixed(4),
      hammingDistance,
      plagiarismDetected: isPlagiarized ? 'Yes' : 'No',
      similarContent: paragraphAnalysis,
      doc1Paragraphs: paras1,
      doc2Paragraphs: paras2,
      sharedSequences: sharedSequences.slice(0, 20),  // Limit to top 20 shared sequences
      fileInfo: {
        file1: {
          name: file1.originalname,
          size: file1.size,
          type: file1.mimetype
        },
        file2: {
          name: file2.originalname,
          size: file2.size,
          type: file2.mimetype
        }
      }
    });
  } catch (error) {
    console.error("Error occurred during comparison: ", error);
    res.status(500).json({ 
      error: 'Error comparing documents. Please try again.' 
    });
  }
};