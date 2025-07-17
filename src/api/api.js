import api from './axios';

// Function to fetch all referrals (for admin)
export const fetchAdminReferrals = async () => {
  try {
    const response = await api.get('/api/user/admin/referrals');
   // console.log(response.data[0]._id)
    return response.data;
  } catch (error) {
    console.error('Error fetching admin referrals:', error);
    throw error;
  }
};

// Function to update candidate status
export const updateCandidateStatus = async (candidateId, status) => {
  try {
    const response = await api.put(`/api/user/admin/referrals/${candidateId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating candidate status:', error);
    throw error;
  }
};

// Function to delete a candidate
export const deleteCandidate = async (candidateId) => {
  try {
    const response = await api.delete(`/api/user/admin/referrals/${candidateId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting candidate:', error);
    throw error;
  }
};

// Function to fetch user referrals (for regular users)
export const fetchUserReferrals = async () => {
  try {
    const response = await api.get('/api/user/my-referrals');
    return response.data;
  } catch (error) {
    console.error('Error fetching user referrals:', error);
    throw error;
  }
};

// Function to submit a new referral
export const submitReferral = async (referralData) => {
  try {
    const response = await api.post('/api/user/referal-submit', referralData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting referral:', error);
    throw error;
  }
};




// Function to request password reset
export const requestPasswordResetApi = async (email) => {
  try {
    const response = await api.post('/api/user/reset-password', { email });
    return response.data;
  } catch (error) {
    console.error('Error requesting password reset:', error);
    throw error;
  }
};

export const changePasswordApi = async (newPassword, token) => {
  try {
    const response = await api.post(`/api/user/request-password-change?token=${token}`, {
      newPassword
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};