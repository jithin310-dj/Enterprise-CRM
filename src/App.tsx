/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CRMProvider, useCRM } from './context/CRMContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Customers } from './pages/Customers';
import { Leads } from './pages/Leads';
import { Billing } from './pages/Billing';
import { Products } from './pages/Products';
import { HR } from './pages/HR';
import { Attendance } from './pages/Attendance';
import { Leave } from './pages/Leave';
import { Payroll } from './pages/Payroll';
import { Recruitment } from './pages/Recruitment';
import { Tasks } from './pages/Tasks';
import { Meetings } from './pages/Meetings';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

// Private Route Session Guard
const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { currentUser } = useCRM();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Auth Route Guard (Redirects active sessions back to Dashboard)
const AuthRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { currentUser } = useCRM();
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const AppContent: React.FC = () => {
  return (
    <Routes>
      {/* Public Authentication Screen */}
      <Route
        path="/login"
        element={
          <AuthRoute>
            <Auth />
          </AuthRoute>
        }
      />

      {/* Main CRM Application Deck */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="customers" element={<Customers />} />
        <Route path="leads" element={<Leads />} />
        <Route path="billing" element={<Billing />} />
        <Route path="products" element={<Products />} />
        <Route path="hr" element={<HR />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="leave" element={<Leave />} />
        <Route path="payroll" element={<Payroll />} />
        <Route path="recruitment" element={<Recruitment />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="meetings" element={<Meetings />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch-all Wildcard Redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <CRMProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </CRMProvider>
  );
}
