import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...initialState
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (token && user) {
      // Ensure user has an ID
      if (!user.id) {
        user.id = user._id || String(Date.now()); // Fallback ID if none exists
      }
      
      // Ensure user has a role
      if (!user.role) {
        user.role = 'user'; // Default to 'user' role if none exists
      }
      
      dispatch({ 
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      });
    }
  }, []);


  const login = async (email, password) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await api.post('/api/user/login', { email, password });
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      });
      
      // When a user successfully logs in, we'll try to refresh the candidates data
      try {
        const candidateContext = await import('./CandidateContext');
        const refreshCandidates = candidateContext.useCandidates().refreshCandidates;
        if (refreshCandidates) refreshCandidates();
      } catch (err) {
        console.error('Failed to refresh candidates after login:', err);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      
      dispatch({
        type: 'AUTH_FAILURE',
        payload: errorMessage
      });
      
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
  dispatch({ type: 'AUTH_START' });
  try {
    const response = await api.post('/api/user/signup', userData);
    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
    dispatch({
      type: 'AUTH_FAILURE',
      payload: errorMessage
    });
    return { success: false, error: errorMessage };
  }
};


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    dispatch({ type: 'LOGOUT' });
  };


  const updateProfile = async (userData) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await api.put('/users/profile', userData);
      const updatedUser = response.data;
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: updatedUser, token: state.token }
      });
      
      return { success: true };
    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.response?.data?.message || 'Profile update failed'
      });
      
      return { success: false, error: error.response?.data?.message || 'Profile update failed' };
    }
  };


  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
