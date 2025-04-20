import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { 
  X, Upload, FileText, AlertTriangle, Check, ChevronDown, ChevronUp,
  BarChart2, Info, List, MessageSquare, Zap
} from 'lucide-react';

import EnhancedStructureTab from './EnhancedStructureTab';
import Header from './Header';

const Compare = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('summary');

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    
    if (newFiles.length === 0) return;
    
    // Validate file types
    const invalidFiles = newFiles.filter(file => 
      !['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
      .includes(file.type));
    
    if (invalidFiles.length > 0) {
      setError('Please upload only PDF, DOCX, or TXT files.');
      return;
    }
    
    // Only keep two files maximum
    if (files.length + newFiles.length > 2) {
      setError('You can only compare two documents at a time.');
      return;
    }
    
    setFiles([...files, ...newFiles]);
    setError('');
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length !== 2) {
      setError('Please upload exactly two files to compare.');
      return;
    }
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('documents', file);
      });

      const response = await axios.post('http://localhost:5000/api/documents/compare', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      setResult(response.data);
      // Auto-scroll to results on mobile
      if (window.innerWidth < 768) {
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Error occurred while comparing:', err);
      if (err.response) {
        setError(`Error: ${err.response.data.error || 'An unknown error occurred.'}`);
      } else {
        setError('Error comparing documents. Please check your network connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (idx) => {
    setExpandedItem(expandedItem === idx ? null : idx);
  };

  const getSimilarityColor = (similarity) => {
    const value = parseFloat(similarity);
    if (value >= 0.9) return 'text-red-600 bg-red-100';
    if (value >= 0.7) return 'text-orange-600 bg-orange-100';
    if (value >= 0.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getSimilarityLabel = (similarity) => {
    const value = parseFloat(similarity);
    if (value >= 0.9) return 'Very High';
    if (value >= 0.7) return 'High';
    if (value >= 0.5) return 'Moderate';
    return 'Low';
  };

  const getFileIcon = (file) => {
    if (file.type === 'application/pdf') return 'PDF';
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'DOCX';
    if (file.type === 'text/plain') return 'TXT';
    return 'File';
  };

  const highlightSimilarities = (text1, text2) => {
    // Get words from both texts
    const words1 = text1.split(/\s+/);
    const words2 = text2.split(/\s+/);
    
    // Find matching sequences (simplified approach)
    let highlighted1 = '';
    let highlighted2 = '';
    
    for (let i = 0; i < words1.length; i++) {
      let found = false;
      
      // Check for matches of 3+ consecutive words
      for (let j = 0; j < words2.length - 2; j++) {
        if (i < words1.length - 2 && 
            words1[i].toLowerCase() === words2[j].toLowerCase() &&
            words1[i+1].toLowerCase() === words2[j+1].toLowerCase() &&
            words1[i+2].toLowerCase() === words2[j+2].toLowerCase()) {
          
          // Found a match of at least 3 words
          let matchLength = 3;
          
          // See how long this match continues
          while (i + matchLength < words1.length && 
                 j + matchLength < words2.length &&
                 words1[i + matchLength].toLowerCase() === words2[j + matchLength].toLowerCase()) {
            matchLength++;
          }
          
          // Add highlighted match to text1
          highlighted1 += `<span class="bg-yellow-200">${words1.slice(i, i + matchLength).join(' ')}</span> `;
          i += matchLength - 1; // Skip the matched words
          found = true;
          break;
        }
      }
      
      if (!found && i < words1.length) {
        highlighted1 += words1[i] + ' ';
      }
    }
    
    // Similar process for text2
    for (let i = 0; i < words2.length; i++) {
      let found = false;
      
      for (let j = 0; j < words1.length - 2; j++) {
        if (i < words2.length - 2 && 
            words2[i].toLowerCase() === words1[j].toLowerCase() &&
            words2[i+1].toLowerCase() === words1[j+1].toLowerCase() &&
            words2[i+2].toLowerCase() === words1[j+2].toLowerCase()) {
          
          let matchLength = 3;
          
          while (i + matchLength < words2.length && 
                 j + matchLength < words1.length &&
                 words2[i + matchLength].toLowerCase() === words1[j + matchLength].toLowerCase()) {
            matchLength++;
          }
          
          highlighted2 += `<span class="bg-yellow-200">${words2.slice(i, i + matchLength).join(' ')}</span> `;
          i += matchLength - 1;
          found = true;
          break;
        }
      }
      
      if (!found && i < words2.length) {
        highlighted2 += words2[i] + ' ';
      }
    }
    
    return { highlighted1, highlighted2 };
  };

  // Function to render similarity explanation
  // Function to render similarity explanation
const renderExplanation = () => {
  if (!result?.explanation) return null;
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
        <MessageSquare className="h-5 w-5 mr-2 text-indigo-600" />
        AI Analysis
      </h3>
      
      <div className="mb-4">
        <p className="text-gray-800 font-medium">{result.explanation.summary}</p>
      </div>
      
      {result.explanation.factors && (
        <div className="mb-4">
          <h4 className="text-md font-medium text-gray-700 mb-2">Contributing Factors</h4>
          <div className="space-y-3">
          {result.explanation.factors?.map((factor, i) => (
            <div key={i} className="flex flex-col">
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">{factor?.name ?? 'Unnamed Factor'}</span>
                <span className="font-medium">{Math.round((factor?.value ?? 0) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full" 
                  style={{ width: `${Math.round((factor?.value ?? 0) * 100)}%` }}
                ></div>
              </div>
              <span className="text-gray-600 text-sm mt-1">{factor?.description ?? 'No description available'}</span>
            </div>
          ))}
          </div>
        </div>
      )}
      
      {result.explanation.details && (
        <div className="mb-4">
          <h4 className="text-md font-medium text-gray-700 mb-2">Detailed Analysis</h4>
          <p className="text-gray-700">{result.explanation.details}</p>
        </div>
      )}
      
      {result.explanation.recommendations && result.explanation.recommendations.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-2">Recommendations</h4>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {result.explanation.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
  // Function to render text structure analysis
  const renderTextStructure = () => {
    if (!result?.sentenceLengthData) return null;
    
    const data1 = result.sentenceLengthData.doc1;
    const data2 = result.sentenceLengthData.doc2;
    
    return (
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
          <BarChart2 className="h-5 w-5 mr-2 text-indigo-600" />
          Text Structure Comparison
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-2">Document 1</h4>
            <p className="text-gray-600 mb-2">Average sentence length: <span className="font-medium">{data1.averageLength.toFixed(1)} words</span></p>
            
            <div className="space-y-2">
              {data1.distribution.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{item.range} words</span>
                    <span>{item.count} sentences</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (item.count / Math.max(...data1.distribution.map(d => d.count))) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-2">Document 2</h4>
            <p className="text-gray-600 mb-2">Average sentence length: <span className="font-medium">{data2.averageLength.toFixed(1)} words</span></p>
            
            <div className="space-y-2">
              {data2.distribution.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{item.range} words</span>
                    <span>{item.count} sentences</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-teal-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (item.count / Math.max(...data2.distribution.map(d => d.count))) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Function to render top words
  const renderTopWords = () => {
    if (!result?.topWords) return null;
    
    return (
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
          <List className="h-5 w-5 mr-2 text-indigo-600" />
          Top Words Comparison
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-2">Document 1</h4>
            <div className="flex flex-wrap gap-2">
              {result.topWords.doc1.map((item, i) => (
                <div key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {item.word} ({item.count})
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-2">Document 2</h4>
            <div className="flex flex-wrap gap-2">
              {result.topWords.doc2.map((item, i) => (
                <div key={i} className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-sm">
                  {item.word} ({item.count})
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Function to render shared sequences
  // Function to render shared sequences
const renderSharedSequences = () => {
  if (!result?.sharedSequences || result.sharedSequences.length === 0) return null;
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
        <Zap className="h-5 w-5 mr-2 text-indigo-600" />
        Shared Phrases
      </h3>
      
      <p className="text-gray-600 mb-3">The following phrases appear in both documents:</p>
      
      <div className="max-h-60 overflow-y-auto">
        <div className="space-y-2">
          {result.sharedSequences.map((sequence, i) => (
            <div key={i} className="bg-yellow-50 border border-yellow-200 p-2 rounded">
              <div className="flex items-center">
                <span className="text-yellow-800 font-medium">{i + 1}.</span>
                {/* Access the text property of the sequence object */}
                <div className="ml-2 text-gray-800">{sequence.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 p-4 md:p-8">
      {/* <Header/> */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left panel - Upload form */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-center text-indigo-600 mb-6">
                Document Similarity Checker
              </h2>
              
              <div className="mb-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('fileInput').click()}>
                  <Upload className="h-12 w-12 mx-auto text-indigo-500 mb-2" />
                  <p className="text-gray-700 font-medium">
                    Upload documents to compare
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Supports PDF, DOCX, and TXT files
                  </p>
                  <input
                    type="file"
                    id="fileInput"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                    multiple
                  />
                </div>
              </div>
              
              {files.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">Selected Files</h3>
                  <div className="space-y-2">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center">
                          <div className="bg-indigo-100 text-indigo-800 font-medium text-xs py-1 px-2 rounded mr-2">
                            {getFileIcon(file)}
                          </div>
                          <span className="text-gray-700 truncate max-w-xs">{file.name}</span>
                        </div>
                        <button
                          onClick={() => removeFile(idx)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <button
                onClick={handleSubmit}
                disabled={loading || files.length !== 2}
                className={`w-full py-3 rounded-md text-white font-medium flex items-center justify-center ${
                  loading || files.length !== 2
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  'Compare Documents'
                )}
              </button>
            </div>
            
            {/* Instructions */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">How It Works</h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                <li>Upload two documents you want to compare (PDF, DOCX, or TXT)</li>
                <li>Our AI will analyze the content for similarities</li>
                <li>View a detailed comparison with highlighted matching sections</li>
                <li>See similarity scores and potential plagiarism indicators</li>
                <li>Get AI-generated explanations and recommendations</li>
              </ol>
            </div>
          </div>
          
          {/* Right panel - Results */}
          <div id="results" className="w-full md:w-1/2">
            {result && (
              <div className="bg-white rounded-lg shadow-lg p-6 overflow-y-auto max-h-screen">
                <h2 className="text-2xl font-semibold text-indigo-700 mb-6">
                  Comparison Results
                </h2>
                
                {/* Tabs */}
                <div className="flex border-b mb-6 overflow-x-auto">
                  <button 
                    className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'summary' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('summary')}
                  >
                    Summary
                  </button>
                  <button 
                    className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'details' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('details')}
                  >
                    Similar Content
                  </button>
                  <button 
                    className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'analysis' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('analysis')}
                  >
                    AI Analysis
                  </button>
                  <button 
                    className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'structure' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('structure')}
                  >
                    Structure
                  </button>
                </div>
                
                {activeTab === 'summary' && (
                  <div className="space-y-6">
                    {/* Main similarity score */}
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-xl font-medium text-gray-800 mb-1">
                        Overall Similarity
                      </div>
                      <div className="flex items-center justify-center">
                        <div className={`text-5xl font-bold ${
                          parseFloat(result.similarity) >= 0.7 ? 'text-red-600' : 
                          parseFloat(result.similarity) >= 0.5 ? 'text-orange-600' : 
                          'text-green-600'
                        }`}>
                          {Math.round(parseFloat(result.similarity) * 100)}%
                        </div>
                      </div>
                      
                      <div className="mt-2 text-gray-600">
                        {parseFloat(result.similarity) >= 0.8 && (
                          <div className="flex items-center justify-center text-red-600">
                            <AlertTriangle className="h-5 w-5 mr-1" />
                            <span>High plagiarism risk detected</span>
                          </div>
                        )}
                        {parseFloat(result.similarity) < 0.8 && parseFloat(result.similarity) >= 0.6 && (
                          <div className="flex items-center justify-center text-orange-600">
                            <AlertTriangle className="h-5 w-5 mr-1" />
                            <span>Moderate similarity detected</span>
                          </div>
                        )}
                        {parseFloat(result.similarity) < 0.6 && (
                          <div className="flex items-center justify-center text-green-600">
                            <Check className="h-5 w-5 mr-1" />
                            <span>Low similarity detected</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Detailed metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Cosine Similarity</h3>
                        <div className="text-3xl font-bold text-indigo-600">
                          {Math.round(parseFloat(result.similarity) * 100)}%
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          Measures document vector similarity
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Jaccard Similarity</h3>
                        <div className="text-3xl font-bold text-indigo-600">
                          {Math.round(parseFloat(result.jaccardSimilarity) * 100)}%
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          Measures word overlap between documents
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Semantic Similarity</h3>
                        <div className="text-3xl font-bold text-indigo-600">
                          {Math.round(parseFloat(result.semanticSimilarity) * 100)}%
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          Measures concept and meaning overlap
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Plagiarism Detection</h3>
                        <div className={`text-xl font-bold ${
                          result.plagiarismDetected === 'Yes' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {result.plagiarismDetected}
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          Based on combined similarity metrics
                        </p>
                      </div>
                    </div>
                    
                    {/* Summary stats */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Similarity Overview</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-32 text-gray-600">Similar Paragraphs:</div>
                          <div className="font-medium text-gray-800">
                            {result.similarContent.length} found
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-32 text-gray-600">Shared Phrases:</div>
                          <div className="font-medium text-gray-800">
                            {result.sharedSequences?.length || 0} detected
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-32 text-gray-600">Document 1:</div>
                          <div className="font-medium text-gray-800">
                            {result.doc1Paragraphs?.length || 0} paragraphs
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-32 text-gray-600">Document 2:</div>
                          <div className="font-medium text-gray-800">
                            {result.doc2Paragraphs?.length || 0} paragraphs
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'details' && (
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-600 mb-4">Similar Content</h3>
                    
                    {result.similarContent.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No significant similar content detected
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {result.similarContent.slice().sort((a, b) => parseFloat(b.similarity) - parseFloat(a.similarity)).map((item, idx) => {
                          const { highlighted1, highlighted2 } = highlightSimilarities(item.paragraph1, item.paragraph2);
                          return (
                            <div key={idx} className="border rounded-lg overflow-hidden">
  <div className="bg-gray-50 p-3 flex justify-between items-center cursor-pointer"
       onClick={() => toggleItem(idx)}>
    <div>
      <div className="flex items-center">
        <span className="font-medium text-gray-800 mr-2">
          Paragraph {item.index1 + 1} & {item.index2 + 1}
        </span>
        <span className={`text-sm px-2 py-0.5 rounded-full ${getSimilarityColor(item.similarity)}`}>
          {getSimilarityLabel(item.similarity)} ({Math.round(parseFloat(item.similarity) * 100)}%)
        </span>
      </div>
    </div>
    {expandedItem === idx ? (
      <ChevronUp className="h-5 w-5 text-gray-500" />
    ) : (
      <ChevronDown className="h-5 w-5 text-gray-500" />
    )}
  </div>
  
  {expandedItem === idx && (
    <div className="p-4 border-t">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Document 1 (Para {item.index1 + 1})</h4>
          <div 
            className="bg-blue-50 p-3 rounded text-gray-800 border border-blue-100 text-sm overflow-auto max-h-56"
            dangerouslySetInnerHTML={{ __html: highlighted1 }}
          />
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Document 2 (Para {item.index2 + 1})</h4>
          <div 
            className="bg-teal-50 p-3 rounded text-gray-800 border border-teal-100 text-sm overflow-auto max-h-56"
            dangerouslySetInnerHTML={{ __html: highlighted2 }}
          />
        </div>
      </div>
    </div>
  )}
</div>
          );
        })}
      </div>
    )}
  </div>
)}

{activeTab === 'analysis' && (
  <div className="space-y-6">
    {renderExplanation()}
    {renderSharedSequences()}
    {renderTopWords()}
  </div>
)}

{activeTab === 'structure' && (
<EnhancedStructureTab result={result} />

)}

{/* Download report button */}
<div className="mt-6">
  <button 
    className="flex items-center justify-center w-full py-3 bg-indigo-100 text-indigo-700 font-medium rounded-md hover:bg-indigo-200 transition-colors"
    onClick={() => {
      // Create a simple text report
      const reportText = `
Document Similarity Report
Generated on: ${new Date().toLocaleString()}

Documents:
- ${result.fileInfo.file1.name}
- ${result.fileInfo.file2.name}

Similarity Scores:
- Overall Similarity: ${Math.round(parseFloat(result.similarity) * 100)}%
- Jaccard Similarity: ${Math.round(parseFloat(result.jaccardSimilarity) * 100)}%
- Semantic Similarity: ${Math.round(parseFloat(result.semanticSimilarity) * 100)}%
- Plagiarism Detection: ${result.plagiarismDetected}

Analysis Summary:
${result.explanation?.summary || 'No explanation available'}

Similar Content:
${result.similarContent.length} similar paragraphs found
${result.sharedSequences?.length || 0} shared phrases detected
      `.trim();
      
      // Create and trigger download
      const blob = new Blob([reportText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'similarity-report.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }}
  >
    <FileText className="h-5 w-5 mr-2" />
    Download Report
  </button>
</div>

              </div>
            )}
            
            {/* If no result yet */}
            {!result && !loading && (
              <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col items-center justify-center text-center">
                <div className="bg-indigo-100 p-6 rounded-full mb-4">
                  <FileText className="h-12 w-12 text-indigo-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  Results will appear here
                </h3>
                <p className="text-gray-600 max-w-md">
                  Upload two documents and click "Compare Documents" to see detailed similarity analysis, AI explanations, and more.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compare;