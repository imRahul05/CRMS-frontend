import React from 'react';

const StatCard = ({ title, value, bgColor, textColor }) => (
  <div className={`${bgColor} p-4 rounded-lg`}>
    <h3 className={`text-lg font-semibold ${textColor}`}>{title}</h3>
    <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
  </div>
);

const StatsGrid = ({ counts }) => {
  if (!counts) return null;

  const stats = [
    { title: 'Total Referrals', value: counts.total || 0, bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
    { title: 'Pending', value: counts.pending || 0, bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
    { title: 'Accepted', value: counts.accepted || 0, bgColor: 'bg-green-100', textColor: 'text-green-800' },
    { title: 'Rejected', value: counts.rejected || 0, bgColor: 'bg-red-100', textColor: 'text-red-800' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsGrid;
