import React from 'react';
import { FileText } from 'lucide-react';

const ReportGenerator = ({ result }) => {
  const generateReport = () => {
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

  return (
    <div className="mt-6">
      <button 
        className="flex items-center justify-center w-full py-3 bg-indigo-100 text-indigo-700 font-medium rounded-md hover:bg-indigo-200 transition-colors"
        onClick={generateReport}
      >
        <FileText className="h-5 w-5 mr-2" />
        Download Report
      </button>
    </div>
  );
};

export default ReportGenerator;