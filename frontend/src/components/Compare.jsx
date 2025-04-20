import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { X, Upload, FileText, AlertTriangle, Check, ChevronDown, ChevronUp } from 'lucide-react';

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
    console.log(token);
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

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 p-4 md:p-8">
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
                <div className="flex border-b mb-6">
                  <button 
                    className={`px-4 py-2 font-medium ${activeTab === 'summary' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('summary')}
                  >
                    Summary
                  </button>
                  <button 
                    className={`px-4 py-2 font-medium ${activeTab === 'details' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('details')}
                  >
                    Similar Content
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
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Hamming Distance</h3>
                        <div className="text-3xl font-bold text-indigo-600">
                          {result.hammingDistance}
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          Fingerprint difference between documents
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
                        {result.similarContent.slice().sort((a, b) => b.similarity - a.similarity).map((item, idx) => {
                          const { highlighted1, highlighted2 } = highlightSimilarities(item.paragraph1, item.paragraph2);
                          return (
                            <div key={idx} className="border rounded-lg overflow-hidden">
                              <div 
                                className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50" 
                                onClick={() => toggleItem(idx)}
                              >
                                <div className="flex items-center">
                                  <div className={`px-2 py-1 rounded-md text-xs font-medium mr-2 ${getSimilarityColor(item.similarity)}`}>
                                    {getSimilarityLabel(item.similarity)} ({Math.round(parseFloat(item.similarity) * 100)}%)
                                  </div>
                                  <span className="text-gray-700 font-medium">Match #{idx + 1}</span>
                                </div>
                                <div>
                                  {expandedItem === idx ? (
                                    <ChevronUp className="h-5 w-5 text-gray-500" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-500" />
                                  )}
                                </div>
                              </div>
                              
                              {expandedItem === idx && (
                                <div className="p-4 border-t bg-gray-50">
                                  <div className="mb-3">
                                    <div className="text-sm text-gray-600 mb-1">
                                      Document 1, Paragraph {item.index1 + 1}:
                                    </div>
                                    <div className="bg-white p-3 rounded border" 
                                      dangerouslySetInnerHTML={{ __html: highlighted1 }} />
                                  </div>
                                  
                                  <div>
                                    <div className="text-sm text-gray-600 mb-1">
                                      Document 2, Paragraph {item.index2 + 1}:
                                    </div>
                                    <div className="bg-white p-3 rounded border"
                                      dangerouslySetInnerHTML={{ __html: highlighted2 }} />
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compare;