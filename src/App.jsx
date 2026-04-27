import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import EmployeeApplyLoanPage from './pages/apply/EmployeeApplyLoanPage';
import EmployeeApplicationSuccessPage from './pages/apply/EmployeeApplicationSuccessPage';
import CompleteRegistrationPage from './pages/auth/CompleteRegistrationPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Layout from './components/layout/Layout';
import ModulePlaceholder from './pages/shared/ModulePlaceholder';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import LoanApplication from './pages/employee/LoanApplication';
import AdminDashboard from './pages/admin/AdminDashboard';
import HRDashboard from './pages/hr/HRDashboard';
import CreditDashboard from './pages/credit/CreditDashboard';
import FinanceDashboard from './pages/finance/FinanceDashboard';
import ManagementDashboard from './pages/management/ManagementDashboard';
import RecoveryDashboard from './pages/recovery/RecoveryDashboard';

import MyStatus from './pages/employee/MyStatus';
import Statements from './pages/employee/Statements';
import VerificationQueue from './pages/hr/VerificationQueue';
import CreditQueue from './pages/credit/CreditQueue';
import PayoutQueue from './pages/finance/PayoutQueue';
import ApplicationStatus from './pages/admin/ApplicationStatus';
import ManagementReports from './pages/management/ManagementReports';
import RecoveryList from './pages/recovery/RecoveryList';
import HistoryPage from './pages/shared/HistoryPage';
import UserManagement from './pages/admin/UserManagement';
import Reconciliation from './pages/finance/Reconciliation';
import Settlement from './pages/finance/Settlement';
import FinanceReports from './pages/finance/FinanceReports';
import WriteOffs from './pages/finance/WriteOffs';
import ManagementAnalytics from './pages/management/ManagementAnalytics';
import ManagementInvestorCenter from './pages/management/ManagementInvestorCenter';
import ManagementAgeAnalysis from './pages/management/ManagementAgeAnalysis';
import ManagementSystemBackups from './pages/management/ManagementSystemBackups';
import DocumentsCenter from './pages/employee/DocumentsCenter';
import Profile from './pages/shared/Profile';
import ApplicationFullView from './pages/employee/ApplicationFullView';
import HRVerificationDetail from './pages/hr/HRVerificationDetail';
import HREmployees from './pages/hr/HREmployees';
import HRReports from './pages/hr/HRReports';
import RemittanceAdvices from './pages/hr/RemittanceAdvices';
import NewLoansReport from './pages/hr/NewLoansReport';
import OverdueReport from './pages/hr/OverdueReport';
import AdminApplicationDetail from './pages/admin/AdminApplicationDetail';
import CreditProfilePage from './pages/credit/CreditProfilePage';
import RiskReviews from './pages/credit/RiskReviews';
import RecoveryCaseDetail from './pages/recovery/RecoveryCaseDetail';
import PaymentManagement from './pages/admin/PaymentManagement';
import AdminControls from './pages/admin/AdminControls';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/apply-loan" element={<EmployeeApplyLoanPage />} />
      <Route path="/apply-success" element={<EmployeeApplicationSuccessPage />} />
      <Route path="/register" element={<CompleteRegistrationPage />} />

      {/* Role-Based Protected Routes */}
      <Route
        path="/employee/*"
        element={
          <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]}>
            <Layout>
              <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<EmployeeDashboard />} />
                <Route path="apply" element={<LoanApplication />} />
                <Route path="status" element={<MyStatus />} />
                <Route path="statements" element={<Statements />} />
                <Route path="documents" element={<DocumentsCenter />} />
                <Route path="application/:id" element={<ApplicationFullView />} />
                <Route path="profile" element={<Profile />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <Layout>
              <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="applications" element={<ApplicationStatus />} />
                <Route path="status" element={<ApplicationStatus />} />
                <Route path="payments" element={<PaymentManagement />} />
                <Route path="controls" element={<AdminControls />} />
                <Route path="applications/:id" element={<AdminApplicationDetail />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="companies" element={<ModulePlaceholder title="Company Management" />} />
                <Route path="documents" element={<ModulePlaceholder title="Document Repository" />} />
                <Route path="reports" element={<ModulePlaceholder title="System Reports" />} />
                <Route path="audit-logs" element={<ModulePlaceholder title="Audit Logs" />} />
                <Route path="reconciliation" element={<Reconciliation />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/hr/*"
        element={
          <ProtectedRoute allowedRoles={[ROLES.HR]}>
            <Layout>
              <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<HRDashboard />} />
                <Route path="verifications" element={<VerificationQueue />} />
                <Route path="verifications/:id" element={<HRVerificationDetail />} />
                <Route path="employees" element={<HREmployees />} />
                <Route path="remittances" element={<RemittanceAdvices />} />
                <Route path="new-loans" element={<NewLoansReport />} />
                <Route path="overdue" element={<OverdueReport />} />
                <Route path="reports" element={<HRReports />} />
                <Route path="history" element={<HistoryPage title="Verification History" />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/credit/*"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CREDIT]}>
            <Layout>
              <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<CreditDashboard />} />
                <Route path="queue" element={<CreditQueue />} />
                <Route path="profile/:id" element={<CreditProfilePage />} />
                <Route path="reviews" element={<RiskReviews />} />
                <Route path="history" element={<HistoryPage title="Assessment History" />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/finance/*"
        element={
          <ProtectedRoute allowedRoles={[ROLES.FINANCE]}>
            <Layout>
              <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<FinanceDashboard />} />
                <Route path="payouts" element={<PayoutQueue />} />
                <Route path="history" element={<HistoryPage title="Payout History" />} />
                <Route path="reconciliation" element={<Reconciliation />} />
                <Route path="settlement" element={<Settlement />} />
                <Route path="write-offs" element={<WriteOffs />} />
                <Route path="reports" element={<FinanceReports />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/management/*"
        element={
          <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
            <Layout>
              <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<ManagementDashboard />} />
                <Route path="investor" element={<ManagementInvestorCenter />} />
                <Route path="age-analysis" element={<ManagementAgeAnalysis />} />
                <Route path="reports" element={<ManagementReports />} />
                <Route path="backups" element={<ManagementSystemBackups />} />
                <Route path="audit" element={<ModulePlaceholder title="Executive Audit Trail" />} />
                <Route path="analytics" element={<ManagementAnalytics />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/recovery/*"
        element={
          <ProtectedRoute allowedRoles={[ROLES.RECOVERY]}>
            <Layout>
              <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<RecoveryDashboard />} />
                <Route path="list" element={<RecoveryList />} />
                <Route path="case/:id" element={<RecoveryCaseDetail />} />
                <Route path="collections" element={<HistoryPage title="Collections History" />} />
                <Route path="tracking" element={<ModulePlaceholder title="Payment Tracking" />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/unauthorized" element={<div className="min-h-screen min-h-dvh bg-white flex flex-col items-center justify-center text-slate-200 space-y-6 px-6 py-10">
        <h1 className="text-6xl sm:text-8xl font-display font-black text-red-500 tracking-tighter">403</h1>
        <div className="text-center space-y-2 max-w-md">
            <p className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Access Denied</p>
            <p className="text-slate-400 font-medium lowercase text-sm sm:text-base">you do not have permission to view this section.</p>
        </div>
        <button onClick={() => window.location.href = '/'} className="btn-primary mt-4 w-full max-w-xs">Return to Dashboard</button>
      </div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
