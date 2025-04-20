import React from 'react'

export const Result = () => {
  return (
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
  )
}
