import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';

import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import PatientsPage from './pages/Patients.jsx';
import QueuePage from './pages/Queue.jsx';
import PharmacyPage from './pages/Pharmacy.jsx';
import BillingPage from './pages/Billing.jsx';
import ReportsPage from './pages/Reports.jsx';
import UsersPage from './pages/Users.jsx';

function Page({ children, roles }) {
  return (
    <ProtectedRoute roles={roles}>
      <AuthenticatedPage>{children}</AuthenticatedPage>
    </ProtectedRoute>
  );
}

function AuthenticatedPage({ children }) {
  const { user } = useAuth();
  if (!user) return null;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Page><Dashboard /></Page>} />
        <Route
          path="/patients"
          element={<Page roles={['reception', 'doctor', 'manager']}><PatientsPage /></Page>}
        />
        <Route
          path="/queue"
          element={<Page roles={['reception', 'doctor', 'manager']}><QueuePage /></Page>}
        />
        <Route
          path="/pharmacy"
          element={<Page roles={['pharmacist', 'manager']}><PharmacyPage /></Page>}
        />
        <Route
          path="/billing"
          element={<Page roles={['manager', 'reception']}><BillingPage /></Page>}
        />
        <Route
          path="/reports"
          element={<Page roles={['manager']}><ReportsPage /></Page>}
        />
        <Route
          path="/users"
          element={<Page roles={['manager']}><UsersPage /></Page>}
        />
      </Routes>
    </AuthProvider>
  );
}
