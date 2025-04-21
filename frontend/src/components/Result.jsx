import React from 'react';
import SummaryTab from './tabs/SummaryTab';
import DetailsTab from './tabs/DetailsTab';
import AnalysisTab from './tabs/AnalysisTab';
import StructureTab from './tabs/StructureTab';
import EmptyResultState from './EmptyResultState';
import TabNavigation from './TabNavigation';
import ReportDownloadButton from './ReportDownloadButton';
import { FileText } from 'lucide-react';

const Result = ({ result, activeTab, setActiveTab, expandedItem, toggleItem, loading }) => {
  // If no results yet, show empty state
  if (!result && !loading) {
    return <EmptyResultState />;
  }

  // Function to highlight similarities between text sections
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
    <div id="results" className="w-full md:w-1/2">
      {result && (
        <div className="bg-white rounded-lg shadow-lg p-6 overflow-y-auto max-h-[calc(100vh-2rem)]">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-6">
            Comparison Results
          </h2>
          
          {/* Tabs Navigation */}
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {/* Tab Content */}
          {activeTab === 'summary' && <SummaryTab result={result} />}
          
          {activeTab === 'details' && (
            <DetailsTab 
              result={result} 
              expandedItem={expandedItem}
              toggleItem={toggleItem}
              highlightSimilarities={highlightSimilarities}
            />
          )}
          
          {activeTab === 'analysis' && <AnalysisTab result={result} />}
          
          {activeTab === 'structure' && <StructureTab result={result} />}
          
          {/* Download report button */}
          <ReportDownloadButton result={result} />
        </div>
      )}
    </div>
  );
};

export default Result;