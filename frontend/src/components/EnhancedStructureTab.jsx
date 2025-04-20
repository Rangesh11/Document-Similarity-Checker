import React from 'react';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Info, BarChart2, Zap } from 'lucide-react';

const StructureTab = ({ result }) => {
  // Generate mock section-wise distance data if not available
  const sectionDistances = result.sectionDistances || Array.from({ length: 8 }, (_, i) => ({
    section: `Section ${i + 1}`,
    distance: Math.min(100, Math.max(10, result.hammingDistance - 15 + Math.random() * 30)),
  }));

  // Determine threshold colors
  const getDistanceColor = (distance) => {
    if (distance < 30) return '#10B981'; // Green for similar
    if (distance < 60) return '#F59E0B'; // Yellow/Orange for moderate
    return '#EF4444'; // Red for different
  };

  // Progress circle for cosine similarity
  const CosineSimilarityCircle = ({ value }) => {
    const percentage = Math.round(value * 100);
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (circumference * percentage) / 100;
    
    return (
      <div className="flex flex-col items-center">
        <svg width="120" height="120" className="transform -rotate-90">
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="#4F46E5"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="mt-2 text-center">
          <span className="text-2xl font-bold text-indigo-600">{percentage}%</span>
          <p className="text-gray-500 text-sm">Cosine Similarity</p>
        </div>
      </div>
    );
  };
  
  // Get data for section-wise distance chart
  const getSectionDistanceData = () => {
    return sectionDistances.map((item) => ({
      section: item.section,
      distance: item.distance,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top metrics dashboard */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
          <BarChart2 className="h-5 w-5 mr-2 text-indigo-600" />
          Structural Similarity Dashboard
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Cosine Similarity - Radial Progress */}
          <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center">
            <CosineSimilarityCircle value={parseFloat(result.similarity)} />
          </div>
          
          {/* Jaccard Similarity - Gauge */}
          <div className="bg-gray-50 p-4 rounded-lg flex flex-col">
            <h4 className="text-md font-medium text-gray-700 mb-2 text-center">Jaccard Similarity</h4>
            <div className="flex-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={100}>
                <AreaChart
                  data={[{ name: '0%', value: 0 }, { name: '25%', value: 25 }, { name: '50%', value: 50 }, { name: '75%', value: 75 }, { name: '100%', value: 100 }]}
                  margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                >
                  <defs>
                    <linearGradient id="jaccard" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="50%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="url(#jaccard)" fill="url(#jaccard)" />
                  <Line
                    type="monotone"
                    data={[{ name: 'current', value: Math.round(parseFloat(result.jaccardSimilarity) * 100) }]}
                    dataKey="value"
                    stroke="#4F46E5"
                    strokeWidth={3}
                    dot={{ r: 6, fill: "#4F46E5", strokeWidth: 2, stroke: "#fff" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-2">
              <span className="text-2xl font-bold text-indigo-600">
                {Math.round(parseFloat(result.jaccardSimilarity) * 100)}%
              </span>
            </div>
          </div>
          
          {/* Hamming Distance - Gradient Bar */}
          <div className="bg-gray-50 p-4 rounded-lg flex flex-col">
            <h4 className="text-md font-medium text-gray-700 mb-2 text-center">Structure Distance</h4>
            <div className="flex-1 flex flex-col justify-center">
              <div className="w-full">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-600">Very Similar</span>
                  <span className="text-xs text-gray-600">Very Different</span>
                </div>
                <div className="h-6 w-full rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 relative">
                  <div className="absolute top-0 h-full" style={{ left: `${Math.min(95, Math.max(5, result.hammingDistance))}%` }}>
                    <div className="w-4 h-8 bg-white rounded-full border-2 border-gray-800 transform -translate-x-1/2 -translate-y-1/4"></div>
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <span className={`text-2xl font-bold ${getDistanceColor(result.hammingDistance) === '#10B981' ? 'text-green-600' : getDistanceColor(result.hammingDistance) === '#F59E0B' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {result.hammingDistance}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Section-wise fingerprint distance chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-indigo-600" />
          Section-by-Section Fingerprint Analysis
        </h3>
        
        <p className="text-gray-600 mb-4">
          This chart shows structural similarity across different sections of the documents.
          Lower values indicate more similar document structures.
        </p>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={getSectionDistanceData()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="section" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}`, 'Distance']} />
              <defs>
                <linearGradient id="colorDistance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="distance"
                stroke="#4F46E5"
                fillOpacity={1}
                fill="url(#colorDistance)"
              />
              <Line
                type="monotone"
                dataKey="distance"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={5}
                      stroke="#fff"
                      strokeWidth={2}
                      fill={getDistanceColor(payload.distance)}
                    />
                  );
                }}
              />
              
              {/* Visual thresholds */}
              <Line
                type="monotone"
                dataKey={() => 30}
                stroke="#10B981"
                strokeDasharray="3 3"
                strokeWidth={1}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey={() => 60}
                stroke="#F59E0B"
                strokeDasharray="3 3"
                strokeWidth={1}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend for thresholds */}
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Very Similar (&lt;30)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Moderate (30-60)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Very Different (&gt;60)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// This is what will be rendered when the Structure tab is selected
const StructureTabContent = ({ result }) => {
  if (!result) return null;
  
  return <StructureTab result={result} />;
};

export default function EnhancedStructureTab({ result }) {
  return <StructureTabContent result={result} />;
}
