import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, RoleGuard, OnboardingGuard } from './components/auth/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';
import DoctorLayout from './layouts/DoctorLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOtp from './pages/auth/VerifyOtp';

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
import Onboarding from './pages/onboarding/Onboarding';

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

// Doctor/Therapist Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorChildren from './pages/doctor/DoctorChildren';
import DoctorChildProfile from './pages/doctor/DoctorChildProfile';
import DoctorAssessments from './pages/doctor/DoctorAssessments';
import DoctorTherapyPlans from './pages/doctor/DoctorTherapyPlans';
import DoctorDietPlans from './pages/doctor/DoctorDietPlans';
import DoctorVideoReviews from './pages/doctor/DoctorVideoReviews';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorAnalytics from './pages/doctor/DoctorAnalytics';
import DoctorCommunication from './pages/doctor/DoctorCommunication';
import DoctorReports from './pages/doctor/DoctorReports';
import DoctorInsights from './pages/doctor/DoctorInsights';
import DoctorSettings from './pages/doctor/DoctorSettings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
        {/* Public Routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
        </Route>

        {/* Dashboard Auth Routes with DashboardLayout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<RoleGuard allowedRoles={['PARENT']}><OnboardingGuard requireCompleted={false}><Onboarding /></OnboardingGuard></RoleGuard>} />
          
          <Route element={<RoleGuard allowedRoles={['PARENT']}><OnboardingGuard requireCompleted={true}><DashboardLayout /></OnboardingGuard></RoleGuard>}>
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
        </Route>

        {/* Doctor/Therapist Routes with DoctorLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleGuard allowedRoles={['THERAPIST']}><DoctorLayout /></RoleGuard>}>
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/doctor/children" element={<DoctorChildren />} />
            <Route path="/doctor/children/:id" element={<DoctorChildProfile />} />
            <Route path="/doctor/assessments" element={<DoctorAssessments />} />
            <Route path="/doctor/therapy-plans" element={<DoctorTherapyPlans />} />
            <Route path="/doctor/diet-plans" element={<DoctorDietPlans />} />
            <Route path="/doctor/videos" element={<DoctorVideoReviews />} />
            <Route path="/doctor/appointments" element={<DoctorAppointments />} />
            <Route path="/doctor/analytics" element={<DoctorAnalytics />} />
            <Route path="/doctor/communication" element={<DoctorCommunication />} />
            <Route path="/doctor/reports" element={<DoctorReports />} />
            <Route path="/doctor/insights" element={<DoctorInsights />} />
            <Route path="/doctor/settings" element={<DoctorSettings />} />
            <Route path="/doctor/*" element={<Navigate to="/doctor" replace />} />
          </Route>
        </Route>

        {/* Admin Routes with AdminLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleGuard allowedRoles={['ADMIN']}><AdminLayout /></RoleGuard>}>
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
        </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
