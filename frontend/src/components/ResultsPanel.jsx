import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import ResultTabs from './ResultTabs';
import SummaryTab from './SummaryTab';
import DetailsTab from './DetailsTab';
import AnalysisTab from './AnalysisTab';
import EnhancedStructureTab from './EnhancedStructureTab';

const ResultsPanel = ({ result, loading }) => {
  const [activeTab, setActiveTab] = useState('summary');

  const handleDownloadReport = () => {
    if (!result) return;
    
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
  };

  if (!result && !loading) {
    return (
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
    );
  }

  if (result) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 overflow-y-auto max-h-screen">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-6">
          Comparison Results
        </h2>
        
        <ResultTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {activeTab === 'summary' && <SummaryTab result={result} />}
        {activeTab === 'details' && <DetailsTab result={result} />}
        {activeTab === 'analysis' && <AnalysisTab result={result} />}
        {activeTab === 'structure' && <EnhancedStructureTab result={result} />}

        {/* Download report button */}
        <div className="mt-6">
          <button 
            className="flex items-center justify-center w-full py-3 bg-indigo-100 text-indigo-700 font-medium rounded-md hover:bg-indigo-200 transition-colors"
            onClick={handleDownloadReport}
          >
            <FileText className="h-5 w-5 mr-2" />
            Download Report
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ResultsPanel;