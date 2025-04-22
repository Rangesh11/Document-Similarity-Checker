const crypto = require('crypto');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { text } = require('express');
const ComparisonResult = require('../models/response');

const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

// Add this function to generate explanations based on analysis
const generateSimilarityExplanation = (result) => {
  const overallSimilarity = parseFloat(result.similarity);
  const jaccardSim = parseFloat(result.jaccardSimilarity);
  const sharedSequencesCount = result.sharedSequences?.length || 0;
  const similarParagraphsCount = result.similarContent?.length || 0;
  
  let explanation = {
    summary: '',
    factors: [],
    details: '',
    recommendations: []
  };
  
  // Generate summary based on similarity level
  if (overallSimilarity >= 0.8) {
    explanation.summary = 'The documents show very high similarity, indicating potential substantial copying or shared authorship.';
  } else if (overallSimilarity >= 0.6) {
    explanation.summary = 'The documents show significant similarity that exceeds typical coincidental matches.';
  } else if (overallSimilarity >= 0.4) {
    explanation.summary = 'The documents show moderate similarity that may indicate shared concepts or limited copied content.';
  } else {
    explanation.summary = 'The documents show low similarity, suggesting mostly original content with minimal overlap.';
  }
  
  // Add contributing factors
  explanation.factors = [
    {
      name: 'Vocabulary Overlap',
      value: jaccardSim,
      description: `The documents share ${Math.round(jaccardSim * 100)}% of their unique words, ${
        jaccardSim > 0.6 ? 'suggesting potentially shared authorship or subject matter' : 
        jaccardSim > 0.3 ? 'indicating moderate lexical overlap' : 
        'indicating distinct vocabulary choices'
      }.`
    },
    {
      name: 'Shared Phrases',
      value: Math.min(1, sharedSequencesCount / 10),
      description: `${sharedSequencesCount} significant shared phrases were detected${
        sharedSequencesCount > 10 ? ', which strongly suggests direct copying' : 
        sharedSequencesCount > 5 ? ', indicating some potentially copied content' : 
        ', representing minimal phrase-level similarity'
      }.`
    },
    {
      name: 'Similar Paragraphs',
      value: Math.min(1, similarParagraphsCount / result.doc1Paragraphs?.length || 1),
      description: `${similarParagraphsCount} out of ${result.doc1Paragraphs?.length || 'unknown'} paragraphs show significant similarity${
        similarParagraphsCount > result.doc1Paragraphs?.length * 0.5 ? ', suggesting widespread content overlap' : 
        similarParagraphsCount > 3 ? ', indicating multiple sections with shared content' : 
        ', representing isolated instances of similar content'
      }.`
    }
  ];
  
  // Generate detailed analysis
  const wordsDoc1 = tokenizer.tokenize((result.doc1Text || '').toLowerCase());
  const wordsDoc2 = tokenizer.tokenize((result.doc2Text || '').toLowerCase());
  
  const uniqueWordsDoc1 = new Set(wordsDoc1.map(word => stemmer.stem(word)));
  const uniqueWordsDoc2 = new Set(wordsDoc2.map(word => stemmer.stem(word)));
  
  const uniqueToDoc1 = [...uniqueWordsDoc1].filter(word => !uniqueWordsDoc2.has(word)).length;
  const uniqueToDoc2 = [...uniqueWordsDoc2].filter(word => !uniqueWordsDoc1.has(word)).length;
  const sharedWords = [...uniqueWordsDoc1].filter(word => uniqueWordsDoc2.has(word)).length;
  
  explanation.details = `
Analysis reveals that Document 1 contains approximately ${uniqueToDoc1} unique terms not found in Document 2, 
while Document 2 contains about ${uniqueToDoc2} unique terms not found in Document 1. 
The documents share approximately ${sharedWords} terms in common.

${similarParagraphsCount > 0 ? 
    `The highest similarity is found in paragraph ${result.similarContent[0].index1 + 1} of Document 1 and 
    paragraph ${result.similarContent[0].index2 + 1} of Document 2, with a similarity score of 
    ${Math.round(parseFloat(result.similarContent[0].similarity) * 100)}%.` : 
    'No individual paragraphs with significant similarity were identified.'}
  `.trim();
  
  // Generate recommendations
  if (overallSimilarity >= 0.7) {
    explanation.recommendations.push('Review the most similar sections highlighted in the report to identify potential plagiarism concerns.');
    explanation.recommendations.push('Consider checking the authorship of both documents to determine if they share a common source.');
  }
  
  if (similarParagraphsCount > 0) {
    explanation.recommendations.push('Examine paragraphs with high similarity scores for potential direct copying or paraphrasing.');
  }
  
  if (overallSimilarity < 0.3) {
    explanation.recommendations.push('The documents appear substantially different. No immediate plagiarism concerns are evident.');
  }
  
  return explanation;
};

// Add semantic similarity analysis
const calculateSemanticSimilarity = (text1, text2) => {
  // This is a simplified semantic analysis - in a real implementation, 
  // you might use a more sophisticated NLP model or external API
  
  // Extract key phrases (simplified)
  const extractKeyPhrases = (text) => {
    const words = tokenizer.tokenize(text.toLowerCase());
    const stemmed = words.map(word => stemmer.stem(word));
    return stemmed.filter(word => word.length > 3);
  };
  
  const phrases1 = extractKeyPhrases(text1);
  const phrases2 = extractKeyPhrases(text2);
  
  // Calculate overlap of concepts
  const set1 = new Set(phrases1);
  const set2 = new Set(phrases2);
  
  const intersection = [...set1].filter(phrase => set2.has(phrase));
  
  // Return semantic similarity score (0-1)
  return intersection.length / Math.max(set1.size, set2.size);
};

// Modify the main compareDocuments function to include the new features
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

    const cosineSim = computeSimilarity(text1, text2);
    const jaccardSim = jaccardSimilarity(text1, text2);
    const semanticSim = calculateSemanticSimilarity(text1, text2);
    const hammingDistance = compareFingerprints(text1, text2);
 
    const { similar, paras1, paras2 } = getSimilarContent(text1, text2);
    
    const sharedSequences = findSharedSequences(text1, text2);
    
    const isPlagiarized = detectPlagiarism(cosineSim, jaccardSim, similar);

    let paragraphAnalysis = [];
    if (similar.length > 0) {

      paragraphAnalysis = similar.sort((a, b) => 
        parseFloat(b.similarity) - parseFloat(a.similarity)
      );
    }

    const resultData = {
      similarity: cosineSim.toFixed(4),
      jaccardSimilarity: jaccardSim.toFixed(4),
      semanticSimilarity: semanticSim.toFixed(4),
      hammingDistance,
      plagiarismDetected: isPlagiarized ? 'Yes' : 'No',
      similarContent: paragraphAnalysis,
      doc1Paragraphs: paras1,
      doc2Paragraphs: paras2,
      doc1Text: text1, // Store for explanation generation
      doc2Text: text2, // Store for explanation generation
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
    };
    
    // Generate AI explanation
    resultData.explanation = generateSimilarityExplanation(resultData);
    
    // Identify most distinctive words in each document
    const wordsDoc1 = text1.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    const wordsDoc2 = text2.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    
    const freqDoc1 = {};
    wordsDoc1.forEach(word => freqDoc1[word] = (freqDoc1[word] || 0) + 1);
    
    const freqDoc2 = {};
    wordsDoc2.forEach(word => freqDoc2[word] = (freqDoc2[word] || 0) + 1);
    
    const doc1Words = Object.keys(freqDoc1).map(word => ({ word, count: freqDoc1[word] }));
    const doc2Words = Object.keys(freqDoc2).map(word => ({ word, count: freqDoc2[word] }));
    
    resultData.topWords = {
      doc1: doc1Words.sort((a, b) => b.count - a.count).slice(0, 10),
      doc2: doc2Words.sort((a, b) => b.count - a.count).slice(0, 10)
    };
    
    // Calculate frequency distribution for charts
    resultData.sentenceLengthData = {
      doc1: analyzeTextStructure(text1),
      doc2: analyzeTextStructure(text2)
    };
    
    // Send response with comprehensive analysis
    res.json(resultData);
  } catch (error) {
    console.error("Error occurred during comparison: ", error);
    res.status(500).json({ 
      error: 'Error comparing documents. Please try again.' 
    });
  }
};

// Add text structure analysis function
const analyzeTextStructure = (text) => {
  // Split into sentences (simple approach)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Calculate sentence lengths
  const lengths = sentences.map(s => {
    const words = s.trim().split(/\s+/).length;
    return { length: words };
  });
  
  // Group by length range for chart display
  const distribution = {};
  lengths.forEach(item => {
    let range;
    if (item.length <= 5) range = '1-5';
    else if (item.length <= 10) range = '6-10';
    else if (item.length <= 15) range = '11-15';
    else if (item.length <= 20) range = '16-20';
    else range = '21+';
    
    distribution[range] = (distribution[range] || 0) + 1;
  });
  
  return {
    averageLength: lengths.reduce((sum, item) => sum + item.length, 0) / (lengths.length || 1),
    distribution: Object.entries(distribution).map(([range, count]) => ({ range, count }))
  };
};
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
    const semanticSim = calculateSemanticSimilarity(text1, text2);
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

    // Create result object
    const resultData = {
      similarity: cosineSim.toFixed(4),
      jaccardSimilarity: jaccardSim.toFixed(4),
      semanticSimilarity: semanticSim.toFixed(4),
      hammingDistance,
      plagiarismDetected: isPlagiarized ? 'Yes' : 'No',
      similarContent: paragraphAnalysis,
      doc1Paragraphs: paras1,
      doc2Paragraphs: paras2,
      doc1Text: text1, // Store for explanation generation
      doc2Text: text2, // Store for explanation generation
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
    };
    
    // Generate AI explanation
    resultData.explanation = generateSimilarityExplanation(resultData);
    
    // Identify most distinctive words in each document
    const wordsDoc1 = text1.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    const wordsDoc2 = text2.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    
    const freqDoc1 = {};
    wordsDoc1.forEach(word => freqDoc1[word] = (freqDoc1[word] || 0) + 1);
    
    const freqDoc2 = {};
    wordsDoc2.forEach(word => freqDoc2[word] = (freqDoc2[word] || 0) + 1);
    
    const doc1Words = Object.keys(freqDoc1).map(word => ({ word, count: freqDoc1[word] }));
    const doc2Words = Object.keys(freqDoc2).map(word => ({ word, count: freqDoc2[word] }));
    
    resultData.topWords = {
      doc1: doc1Words.sort((a, b) => b.count - a.count).slice(0, 10),
      doc2: doc2Words.sort((a, b) => b.count - a.count).slice(0, 10)
    };
    
    // Calculate frequency distribution for charts
    resultData.sentenceLengthData = {
      doc1: analyzeTextStructure(text1),
      doc2: analyzeTextStructure(text2)
    };

    
    
    // Save to database if user is authenticated
    if (req.body.email) {
      try {
        const userEmail = req.body.email;
    
        const comparisonToSave = new ComparisonResult({
          user: {
            email: userEmail, // Store the user's email
          },
          similarity: parseFloat(resultData.similarity),
          jaccardSimilarity: parseFloat(resultData.jaccardSimilarity),
          semanticSimilarity: parseFloat(resultData.semanticSimilarity),
          hammingDistance: resultData.hammingDistance,
          plagiarismDetected: resultData.plagiarismDetected === 'Yes', // Convert to boolean
          similarContent: resultData.similarContent.map(content => ({
            paragraph1: content.paragraph1,
            paragraph2: content.paragraph2,
            similarity: content.similarity,
            index1: content.index1,
            index2: content.index2
          })),
          sharedSequences: resultData.sharedSequences.map(sequence => ({
            text: sequence.text,
            pos1: sequence.pos1,
            pos2: sequence.pos2,
            length: sequence.length
          })),
          doc1Paragraphs: resultData.doc1Paragraphs,
          doc2Paragraphs: resultData.doc2Paragraphs,
          doc1Text: resultData.doc1Text,
          doc2Text: resultData.doc2Text,
          fileInfo: resultData.fileInfo
        });
    
        const savedComparison = await comparisonToSave.save();
        resultData.id = savedComparison._id;
      } catch (dbError) {
        console.error("Error saving to database:", dbError);
      }
    } else {
      console.warn("User not authenticated, skipping database save");
    }
    
    
    
    // Send response with comprehensive analysis
    res.json(resultData);
    
  } catch (error) {
    console.error("Error occurred during comparison: ", error);
    res.status(500).json({ 
      error: 'Error comparing documents. Please try again.' 
    });
  }
};