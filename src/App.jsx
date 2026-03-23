import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Parent Dashboard Pages
import ParentDashboard from './pages/dashboard/ParentDashboard';
import AddChildProfile from './pages/dashboard/AddChildProfile';
import PreliminaryAssessment from './pages/assessment/PreliminaryAssessment';
import IQTest from './pages/assessment/IQTest';
import Consultation from './pages/features/Consultation';
import Therapies from './pages/features/Therapies';
import DietPlan from './pages/features/DietPlan';
import Exercise from './pages/features/Exercise';
import Store from './pages/features/Store';
import InfoHub from './pages/features/InfoHub';
import Settings from './pages/settings/Settings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';

import AdminChildren from './pages/admin/AdminChildren';
import AdminIQTests from './pages/admin/AdminIQTests';
import AdminAssessments from './pages/admin/AdminAssessments';
import AdminTherapists from './pages/admin/AdminTherapists';

import AdminConsultations from './pages/admin/AdminConsultations';
import AdminDietPlans from './pages/admin/AdminDietPlans';

import AdminExercise from './pages/admin/AdminExercise';
import AdminStore from './pages/admin/AdminStore';
import AdminInfoHub from './pages/admin/AdminInfoHub';

import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSubscriptions from './pages/admin/AdminSubscriptions';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Dashboard Auth Routes with DashboardLayout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<ParentDashboard />} />
          <Route path="/add-child" element={<AddChildProfile />} />
          <Route path="/assessment" element={<PreliminaryAssessment />} />
          <Route path="/iq-test" element={<IQTest />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/therapies" element={<Therapies />} />
          <Route path="/diet-plan" element={<DietPlan />} />
          <Route path="/exercise" element={<Exercise />} />
          <Route path="/store" element={<Store />} />
          <Route path="/info-hub" element={<InfoHub />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Admin Routes with AdminLayout */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/children" element={<AdminChildren />} />
          <Route path="/admin/iq-tests" element={<AdminIQTests />} />
          <Route path="/admin/assessments" element={<AdminAssessments />} />
          <Route path="/admin/therapists" element={<AdminTherapists />} />
          <Route path="/admin/consultations" element={<AdminConsultations />} />
          <Route path="/admin/diet-plans" element={<AdminDietPlans />} />
          <Route path="/admin/exercise" element={<AdminExercise />} />
          <Route path="/admin/store" element={<AdminStore />} />
          <Route path="/admin/info-hub" element={<AdminInfoHub />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          {/* Redirect undefined admin paths */}
          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
