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
- ${result.fileInfo?.file1?.name || 'Document 1'}
- ${result.fileInfo?.file2?.name || 'Document 2'}

Similarity Scores:
- Overall Similarity: ${Math.round(parseFloat(result?.similarity || 0) * 100)}%
- Jaccard Similarity: ${Math.round(parseFloat(result?.jaccardSimilarity || 0) * 100)}%
- Semantic Similarity: ${Math.round(parseFloat(result?.semanticSimilarity || 0) * 100)}%
- Plagiarism Detection: ${result?.plagiarismDetected ? 'Yes' : 'No'}

Analysis Summary:
${result?.explanation?.summary || 'No explanation available'}

Similar Content:
${result?.similarContent?.length || 0} similar paragraphs found
${result?.sharedSequences?.length || 0} shared phrases detected
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
      <div className="bg-white p-6 rounded-lg text-center">
        <div className="flex justify-center mb-4">
          <FileText className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Results will appear here</h3>
        <p className="text-sm text-gray-500">
          Upload two documents and click "Compare Documents" to see detailed similarity analysis, AI explanations, and more.
        </p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="bg-white p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Comparison Results</h3>
        
        <ResultTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="mt-4">
          {activeTab === 'summary' && <SummaryTab result={result} />}
          {activeTab === 'details' && <DetailsTab result={result} />}
          {activeTab === 'analysis' && <AnalysisTab result={result} />}
          {activeTab === 'structure' && <EnhancedStructureTab result={result} />}
        </div>

        {/* Download report button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleDownloadReport}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FileText className="h-4 w-4 mr-2" />
            Download Report
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ResultsPanel;