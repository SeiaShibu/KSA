import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Customer Pages
import CustomerDashboard from './pages/Customer/CustomerDashboard';
import NewComplaint from './pages/Customer/NewComplaint';
import MyComplaints from './pages/Customer/MyComplaints';

// Technician Pages
import TechnicianDashboard from './pages/Technician/TechnicianDashboard';
import AssignedComplaints from './pages/Technician/AssignedComplaints';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import AllComplaints from './pages/Admin/AllComplaints';
import ManageTechnicians from './pages/Admin/ManageTechnicians';
import CreateUser from './pages/Admin/CreateUser';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* Navbar */}
          <Navbar />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Customer Routes */}
            <Route path="/customer" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/customer/new-complaint" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <NewComplaint />
              </ProtectedRoute>
            } />
            <Route path="/customer/complaints" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <MyComplaints />
              </ProtectedRoute>
            } />

            {/* Technician Routes */}
            <Route path="/technician" element={
              <ProtectedRoute allowedRoles={['technician']}>
                <TechnicianDashboard />
              </ProtectedRoute>
            } />
            <Route path="/technician/complaints" element={
              <ProtectedRoute allowedRoles={['technician']}>
                <AssignedComplaints />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/complaints" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AllComplaints />
              </ProtectedRoute>
            } />
            <Route path="/admin/technicians" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageTechnicians />
              </ProtectedRoute>
            } />
            <Route path="/admin/create-user" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CreateUser />
              </ProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Catch-all: redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'white',
                color: '#374151',
                border: '1px solid #D1D5DB',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                padding: '16px',
              },
              success: {
                iconTheme: { primary: '#10B981', secondary: 'white' },
              },
              error: {
                iconTheme: { primary: '#EF4444', secondary: 'white' },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
