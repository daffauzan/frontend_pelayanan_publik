import React from 'react';
import { 
  createBrowserRouter,
  Navigate, 
} from 'react-router-dom';

import PublicLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// Public Pages
import HomePage from '../pages/public/Home';
import LoginPage from '../pages/auth/Login';
import RegisterPage from '../pages/auth/Register';

// User Pages
import UserDashboard from '../pages/user/Dashboard';
import SuratPage from '../pages/user/Surat';
import PengaduanPage from '../pages/user/Pengaduan';
import TrackingPage from '../pages/user/Tracking';
import ProfilePage from '../pages/user/Profile';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminSuratPage from '../pages/admin/SuratManagement';
import AdminPengaduanPage from '../pages/admin/PengaduanManagement';
import AdminTrackingPage from '../pages/admin/Tracking';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },

  /**
   * User Routes
   */
  {
    path: '/user',
    element: (
      <ProtectedRoute>
        <RoleRoute allowedRole="user">
          <DashboardLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/user/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <UserDashboard />,
      },
      {
        path: 'surat',
        element: <SuratPage />,
      },
      {
        path: 'pengaduan',
        element: <PengaduanPage />,
      },
      {
        path: 'tracking',
        element: <TrackingPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },

  /**
   * Admin Routes
   */
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <RoleRoute allowedRole="admin">
          <DashboardLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboard />,
      },
      {
        path: 'surat',
        element: <AdminSuratPage />,
      },
      {
        path: 'pengaduan',
        element: <AdminPengaduanPage />,
      },
      {
        path: 'tracking',
        element: <AdminTrackingPage />,
      },
    ],
  },

  /**
   * Fallback Route
   */
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;