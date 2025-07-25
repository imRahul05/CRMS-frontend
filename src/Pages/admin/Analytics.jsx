import React, { useEffect } from 'react';
import StatsGrid from '../../components/analytics/StatsGrid';
import RecentReferralsTable from '../../components/analytics/RecentReferralsTable';
import AnalyticsGraph from '../../components/analytics/AnalyticsGraph';
import { useAnalytics } from '../../utils/useAnalytics';

const graphTypes = [
  { value: 'bar', label: 'Referrals by Status' },
  { value: 'pie', label: 'Experience Distribution' },
  { value: 'line', label: 'Daily Referrals Trend' },
  { value: 'stats', label: 'Overall Statistics' }
];

const Analytics = () => {
  const {
    graphType,
    setGraphType,
    loading,
    data,
    layout,
    statsData,
    fetchData,
    refreshData
  } = useAnalytics();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Refresh Data"
            >
              <svg 
                className="w-5 h-5"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
            </button>
            <select
              value={graphType}
              onChange={(e) => setGraphType(e.target.value)}
              className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {graphTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : graphType === 'stats' ? (
          statsData ? (
            <>
              <StatsGrid counts={statsData.counts} />
              <RecentReferralsTable referrals={statsData.recentReferrals} />
            </>
          ) : (
            <div className="text-center text-gray-600 py-8">
              No statistics data available
            </div>
          )
        ) : data && layout ? (
          <AnalyticsGraph data={data} layout={layout} />
        ) : (
          <div className="text-center text-gray-600 py-8">
            No graph data available
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
