import React from 'react';
import { MessageSquare, List, Zap } from 'lucide-react';

const AnalysisTab = ({ result }) => {
  if (!result) return null;

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
                  <div className="ml-2 text-gray-800">{sequence.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

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

  return (
    <div className="space-y-6">
      {renderExplanation()}
      {renderSharedSequences()}
      {renderTopWords()}
    </div>
  );
};

export default AnalysisTab;