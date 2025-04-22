import React from 'react';

// This component receives original text and highlighted regions to display
const TextHighlighter = ({ text1, text2 }) => {
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
            words2[i+2].toLowerCase() === words1[j+1].toLowerCase()) {
          
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

  const { highlighted1, highlighted2 } = highlightSimilarities(text1, text2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div 
          className="bg-blue-50 p-3 rounded text-gray-800 border border-blue-100 text-sm overflow-auto max-h-56"
          dangerouslySetInnerHTML={{ __html: highlighted1 }}
        />
      </div>
      <div>
        <div 
          className="bg-teal-50 p-3 rounded text-gray-800 border border-teal-100 text-sm overflow-auto max-h-56"
          dangerouslySetInnerHTML={{ __html: highlighted2 }}
        />
      </div>
    </div>
  );
};

export default TextHighlighter;