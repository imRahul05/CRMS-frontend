import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import './App.css';
import Home from './Pages/Home';
import NavBar from './components/NavBar';
import { ReferralForm, CandidatesDashboard } from './Pages/user';
import { AdminDashboard } from './Pages/admin';
import UpdateCandidate from './Pages/UpdateCandidate';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Profile from './Pages/Profile';
import AuthGuard from './components/AuthGuard';
import RoleGuard from './components/RoleGuard';
import { CandidateProvider } from './contexts/CandidateContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <AuthProvider>
      <CandidateProvider>
        <Router>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <AppRoutes />
        </Router>
      </CandidateProvider>
    </AuthProvider>
  );
};

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />

      
        <Route path="/" element={
          <AuthGuard>
            {user?.role === 'admin' ? <Navigate to="/admin" /> : <Home />}
          </AuthGuard>
        } />
        <Route path="/referral" element={<AuthGuard><ReferralForm /></AuthGuard>} />
        <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
        
        <Route path="/dashboard" element={<AuthGuard><CandidatesDashboard /></AuthGuard>} />
        
        <Route path="/admin" element={<RoleGuard allowedRoles={['admin']}><AdminDashboard /></RoleGuard>} />
        <Route path="/update/:id" element={<RoleGuard allowedRoles={['admin']}><UpdateCandidate /></RoleGuard>} />
        
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </>
  );
  
};

export default App;