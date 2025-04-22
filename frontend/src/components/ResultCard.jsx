import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, BarChart2, Info } from 'lucide-react';
import SimilarityBadge from './SimilarityBadge';

/**
 * ResultCard - A compact card component to display comparison history results
 * @param {Object} historyItem - The history item data from the backend
 */
const ResultCard = ({ historyItem, index }) => {
  const [expanded, setExpanded] = useState(false);

  if (!historyItem) return null;

  // Format the similarity score as a percentage
  const similarityScore = (historyItem.similarityScore * 100).toFixed(1);
  
  // Determine color based on similarity score
  const getSimilarityColor = (score) => {
    const value = parseFloat(score) / 100;
    if (value >= 0.9) return 'text-red-600';
    if (value >= 0.7) return 'text-orange-600';
    if (value >= 0.5) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getSimilarityLevel = (score) => {
    const value = parseFloat(score) / 100;
    if (value >= 0.9) return 'Very High';
    if (value >= 0.7) return 'High';
    if (value >= 0.5) return 'Moderate';
    return 'Low';
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Card Header */}
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-3 flex justify-between items-center cursor-pointer"
           onClick={() => setExpanded(!expanded)}>
        <div>
          <h3 className="font-medium text-gray-800">Comparison #{index + 1}</h3>
          <p className="text-sm text-gray-500">
            {new Date(historyItem.date).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric'
            })}
          </p>
        </div>
        <div className="flex items-center">
          <span className={`mr-2 font-semibold ${getSimilarityColor(similarityScore)}`}>
            {similarityScore}%
          </span>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </div>
      </div>

      {/* Basic Info - Always Visible */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Document 1</h4>
            <p className="text-gray-800 break-words truncate">{historyItem.document1}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Document 2</h4>
            <p className="text-gray-800 break-words truncate">{historyItem.document2}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Similarity Score</h4>
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
              <div 
                className={`h-2.5 rounded-full ${
                  parseFloat(similarityScore) >= 80 ? 'bg-red-600' : 
                  parseFloat(similarityScore) >= 60 ? 'bg-orange-600' : 
                  parseFloat(similarityScore) >= 40 ? 'bg-yellow-600' : 
                  'bg-green-600'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, parseFloat(similarityScore)))}%` }}
              ></div>
            </div>
            <span className={`text-sm font-medium ${getSimilarityColor(similarityScore)}`}>
              {getSimilarityLevel(similarityScore)}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && historyItem.details && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="space-y-4">
            {/* Additional Metrics */}
            {historyItem.details.jaccardSimilarity && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-xs text-gray-500 mb-1">Jaccard Similarity</div>
                    <div className="font-semibold text-indigo-600">
                      {(historyItem.details.jaccardSimilarity * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-xs text-gray-500 mb-1">Semantic Similarity</div>
                    <div className="font-semibold text-indigo-600">
                      {(historyItem.details.semanticSimilarity * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Analysis Summary */}
            {historyItem.details.summary && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-1 text-indigo-600" />
                  Analysis Summary
                </h4>
                <p className="text-gray-700 text-sm">{historyItem.details.summary}</p>
              </div>
            )}

            {/* Similar Content Count */}
            {historyItem.details.similarContentCount && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Similar Content</h4>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Similar paragraphs found:</span>
                    <span className="font-medium text-indigo-600">{historyItem.details.similarContentCount}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* View Full Report Button */}
            <div className="mt-2">
              <button 
                className="flex items-center justify-center w-full py-2 bg-indigo-100 text-indigo-700 font-medium rounded-md hover:bg-indigo-200 transition-colors"
                onClick={() => {
                  // Here you would implement a redirect to see the full comparison
                  // or potentially reconstruct the full report based on history data
                  console.log("View full report for:", historyItem._id);
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                View Full Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultCard;