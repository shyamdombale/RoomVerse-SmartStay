import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Compare from './pages/Compare';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';

// Protected Portals
import Dashboard from './pages/Dashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Phase 6 Property Management Pages
import ManageProperties from './pages/owner/ManageProperties';
import AddProperty from './pages/owner/AddProperty';
import EditProperty from './pages/owner/EditProperty';
import AdminProperties from './pages/admin/AdminProperties';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/:id" element={<PropertyDetail />} />
          <Route path="compare" element={<Compare />} />
          <Route path="favorites" element={<Favorites />} />

          {/* Auth Routes */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Role-Protected Portals */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRoles={['customer', 'tenant']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="owner"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="owner/properties"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <ManageProperties />
              </ProtectedRoute>
            }
          />
          <Route
            path="owner/properties/new"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <AddProperty />
              </ProtectedRoute>
            }
          />
          <Route
            path="owner/properties/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['owner', 'admin']}>
                <EditProperty />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/properties"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminProperties />
              </ProtectedRoute>
            }
          />

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}