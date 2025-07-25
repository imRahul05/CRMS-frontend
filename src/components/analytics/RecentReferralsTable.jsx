import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-200 text-green-800';
      case 'Rejected':
        return 'bg-red-200 text-red-800';
      case 'Pending':
        return 'bg-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-200 text-blue-800';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyles(status)}`}>
      {status}
    </span>
  );
};

const RecentReferralsTable = ({ referrals }) => {
  if (!referrals || referrals.length === 0) {
    return (
      <div className="col-span-full">
        <h3 className="text-xl font-semibold mb-4">Recent Referrals</h3>
        <div className="text-center text-gray-600 py-4">
          No recent referrals available
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-full">
      <h3 className="text-xl font-semibold mb-4">Recent Referrals</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Referred By</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map((referral, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-4 py-2 text-center">{referral.name}</td>
                <td className="px-4 py-2 text-center">{referral.referredBy.name}</td>
                <td className="px-4 py-2 text-center">
                  <StatusBadge status={referral.status} />
                </td>
                <td className="px-4 py-2 text-center">{referral.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentReferralsTable;
