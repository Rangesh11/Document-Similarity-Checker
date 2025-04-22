import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const DetailsTab = ({ result }) => {
  const [expandedItem, setExpandedItem] = useState(null);

  if (!result) return null;

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

  const highlightSimilarities = (text1, text2) => {
    const words1 = text1.split(/\s+/);
    const words2 = text2.split(/\s+/);
    
    let highlighted1 = '';
    let highlighted2 = '';
    
    for (let i = 0; i < words1.length; i++) {
      let found = false;
 
      for (let j = 0; j < words2.length - 2; j++) {
        if (i < words1.length - 2 && 
            words1[i].toLowerCase() === words2[j].toLowerCase() &&
            words1[i+1].toLowerCase() === words2[j+1].toLowerCase() &&
            words1[i+2].toLowerCase() === words2[j+2].toLowerCase()) {
          
          let matchLength = 3;
          
          while (i + matchLength < words1.length && 
                 j + matchLength < words2.length &&
                 words1[i + matchLength].toLowerCase() === words2[j + matchLength].toLowerCase()) {
            matchLength++;
          }

          highlighted1 += `<span class="bg-yellow-200">${words1.slice(i, i + matchLength).join(' ')}</span> `;
          i += matchLength - 1;
          found = true;
          break;
        }
      }
      
      if (!found && i < words1.length) {
        highlighted1 += words1[i] + ' ';
      }
    }

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
    <div>
      <h3 className="text-xl font-semibold text-indigo-600 mb-4">Similar Content</h3>
      
      {result.similarContent.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No significant similar content detected
        </div>
      ) : (
        <div className="space-y-4">
          {result.similarContent
            .slice()
            .sort((a, b) => parseFloat(b.similarity) - parseFloat(a.similarity))
            .map((item, idx) => {
              const { highlighted1, highlighted2 } = highlightSimilarities(item.paragraph1, item.paragraph2);
              return (
                <div key={idx} className="border rounded-lg overflow-hidden">
                  <div 
                    className="bg-gray-50 p-3 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleItem(idx)}
                  >
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
  );
};

export default DetailsTab;