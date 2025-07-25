import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import './App.css';
import Home from './Pages/Home';
import NavBar from './components/NavBar';
import { ReferralForm, CandidatesDashboard } from './Pages/user';
import { AdminDashboard, CandidateList } from './Pages/admin';
import Analytics from './Pages/admin/Analytics';
import UpdateCandidate from './Pages/UpdateCandidate';
import Login from './Pages/Login';
import Register from './Pages/Register';
import LandingPage from './Pages/LandingPage';
import Profile from './Pages/Profile';
import AuthGuard from './components/AuthGuard';
import RoleGuard from './components/RoleGuard';
import { CandidateProvider } from './contexts/CandidateContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import { useLocation } from 'react-router-dom'; // add at the top

import 'react-toastify/dist/ReactToastify.css';
import ResetPassword from './Pages/ResetPassword';
import ChangePassword from './Pages/ChangePassword';

const App = () => {
  return (
    <AuthProvider>
      <CandidateProvider>
        <Router>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            style={{ marginTop: '55px' }} 
          />
          <AppRoutes />
        </Router>
      </CandidateProvider>
    </AuthProvider>
  );
};


const AppRoutes = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
        <Route path="/reset-password" element={isAuthenticated ? <Navigate to="/" /> : <ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Landing page route */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <LandingPage />} />
        
        <Route
          path="/home"
          element={
            <AuthGuard>
              {location.pathname === '/home' && user?.role === 'admin' ? (
                <Navigate to="/admin" />
              ) : (
                <Home />
              )}
            </AuthGuard>
          }
        />

        <Route path="/referral" element={<AuthGuard><ReferralForm /></AuthGuard>} />
        <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
        <Route path="/dashboard" element={<AuthGuard><CandidatesDashboard /></AuthGuard>} />
        <Route path="/admin" element={<RoleGuard allowedRoles={['admin']}><AdminDashboard /></RoleGuard>} />
        <Route path="/admin/candidates" element={<RoleGuard allowedRoles={['admin']}><CandidateList /></RoleGuard>} />
        <Route path="/admin/analytics" element={<RoleGuard allowedRoles={['admin']}><Analytics /></RoleGuard>} />
        <Route path="/update/:id" element={<RoleGuard allowedRoles={['admin']}><UpdateCandidate /></RoleGuard>} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />

      </Routes>
    </>
  );
};


export default App;