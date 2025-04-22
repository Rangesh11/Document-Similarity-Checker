import React from 'react';
import { AlertTriangle, Check } from 'lucide-react';

const SummaryTab = ({ result }) => {
  if (!result) return null;

  const getSimilarityColorClass = (similarity) => {
    const value = parseFloat(similarity);
    if (value >= 0.7) return 'text-red-600';
    if (value >= 0.5) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Main similarity score */}
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <div className="text-xl font-medium text-gray-800 mb-1">
          Overall Similarity
        </div>
        <div className="flex items-center justify-center">
          <div className={`text-5xl font-bold ${getSimilarityColorClass(result.similarity)}`}>
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
  );
};

export default SummaryTab;