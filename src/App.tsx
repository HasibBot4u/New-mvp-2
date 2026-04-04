import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CatalogProvider } from './contexts/CatalogContext';
import { ToastProvider } from './components/ui/Toast';
import { BottomNav } from './components/layout/BottomNav';
import { supabase } from './lib/supabase';

const HomePage = React.lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const LandingPage = React.lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const SearchPage = React.lazy(() => import('./pages/SearchPage').then(m => ({ default: m.SearchPage })));
const SubjectsPage = React.lazy(() => import('./pages/SubjectsPage').then(m => ({ default: m.SubjectsPage })));
const CyclesPage = React.lazy(() => import('./pages/CyclesPage').then(m => ({ default: m.CyclesPage })));
const ChaptersPage = React.lazy(() => import('./pages/ChaptersPage').then(m => ({ default: m.ChaptersPage })));
const VideoListPage = React.lazy(() => import('./pages/VideoListPage').then(m => ({ default: m.VideoListPage })));
const PlayerPage = React.lazy(() => import('./pages/PlayerPage').then(m => ({ default: m.PlayerPage })));
const LoginPage = React.lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const PlannerPage = React.lazy(() => import('./pages/PlannerPage').then(m => ({ default: m.PlannerPage })));
const ProgressPage = React.lazy(() => import('./pages/ProgressPage').then(m => ({ default: m.ProgressPage })));
const NotesPage = React.lazy(() => import('./pages/NotesPage').then(m => ({ default: m.NotesPage })));
const LiveClassPage = React.lazy(() => import('./pages/LiveClassPage').then(m => ({ default: m.LiveClassPage })));
const QnAPage = React.lazy(() => import('./pages/QnAPage').then(m => ({ default: m.QnAPage })));
const QnADetailPage = React.lazy(() => import('./pages/QnADetailPage').then(m => ({ default: m.QnADetailPage })));
const StudyAssistantPage = React.lazy(() => import('./pages/StudyAssistantPage').then(m => ({ default: m.StudyAssistantPage })));
const QuizPage = React.lazy(() => import('./pages/QuizPage').then(m => ({ default: m.QuizPage })));
const QuizListPage = React.lazy(() => import('./pages/QuizListPage').then(m => ({ default: m.QuizListPage })));
const QuizResultPage = React.lazy(() => import('./pages/QuizResultPage').then(m => ({ default: m.QuizResultPage })));
const LeaderboardPage = React.lazy(() => import('./pages/LeaderboardPage').then(m => ({ default: m.LeaderboardPage })));
const AboutPage = React.lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = React.lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const SuccessStoriesPage = React.lazy(() => import('./pages/SuccessStoriesPage').then(m => ({ default: m.SuccessStoriesPage })));
const PrivacyPage = React.lazy(() => import('./pages/legal/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const TermsPage = React.lazy(() => import('./pages/legal/TermsPage').then(m => ({ default: m.TermsPage })));
const RefundPolicyPage = React.lazy(() => import('./pages/legal/RefundPolicyPage').then(m => ({ default: m.RefundPolicyPage })));

const AdminLayout = React.lazy(() => import('./pages/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminContent = React.lazy(() => import('./pages/admin/AdminContent').then(m => ({ default: m.AdminContent })));
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers').then(m => ({ default: m.AdminUsers })));
const AdminEnrollment = React.lazy(() => import('./pages/admin/AdminEnrollment').then(m => ({ default: m.AdminEnrollment })));
const AdminLogs = React.lazy(() => import('./pages/admin/AdminLogs').then(m => ({ default: m.AdminLogs })));
const AdminSystem = React.lazy(() => import('./pages/admin/AdminSystem').then(m => ({ default: m.AdminSystem })));

import { EnrollmentForm } from './components/EnrollmentForm';

const ProtectedRoute: React.FC<{ 
  children: React.ReactNode 
}> = ({ children }) => {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center 
                      bg-gray-50 flex-col gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 
                        border-t-primary rounded-full 
                        animate-spin" />
        <p className="text-gray-500 text-sm">Loading NexusEdu...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (profile?.is_blocked === true) {
    return (
      <Navigate
        to="/login"
        state={{ blocked: true }}
        replace
      />
    );
  }

  const registrationsOpen = localStorage.getItem('registrations_open') !== 'false';
  if (!registrationsOpen && profile?.is_enrolled === false && profile?.role !== 'admin') {
    return <EnrollmentForm />;
  }

  return <>{children}</>;
};

const PublicOrDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500/20 
                        border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }
  
  // Logged-in users see the student dashboard
  if (user) return <HomePage />;
  
  // Non-logged-in visitors see the public landing page
  return <LandingPage />;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Log page views
    supabase.from('page_views').insert({
      user_id: user?.id || null,
      page: location.pathname,
    }).then();
  }, [location.pathname, user?.id]);

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      <main className="flex-1">
        <Suspense fallback={
          <div className="flex h-screen items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        }>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/" element={<PublicOrDashboard />} />
            <Route path="/courses" element={<PublicOrDashboard />} />
            
            {/* Public Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/success-stories" element={<SuccessStoriesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/refund-policy" element={<RefundPolicyPage />} />

            <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
            <Route path="/subjects" element={<ProtectedRoute><SubjectsPage /></ProtectedRoute>} />
            <Route path="/subject/:subjectId" element={<ProtectedRoute><CyclesPage /></ProtectedRoute>} />
            <Route path="/cycle/:cycleId" element={<ProtectedRoute><ChaptersPage /></ProtectedRoute>} />
            <Route path="/chapter/:chapterId" element={<ProtectedRoute><VideoListPage /></ProtectedRoute>} />
            <Route path="/watch/:videoId" element={<ProtectedRoute><PlayerPage /></ProtectedRoute>} />
            <Route path="/chapter/:chapterId/quizzes" element={<ProtectedRoute><QuizListPage /></ProtectedRoute>} />
            <Route path="/quiz/:quizId" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
            <Route path="/quiz/:quizId/result/:attemptId" element={<ProtectedRoute><QuizResultPage /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/planner" element={<ProtectedRoute><PlannerPage /></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
            <Route path="/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
            <Route path="/live" element={<ProtectedRoute><LiveClassPage /></ProtectedRoute>} />
            <Route path="/qna" element={<ProtectedRoute><QnAPage /></ProtectedRoute>} />
            <Route path="/qna/:questionId" element={<ProtectedRoute><QnADetailPage /></ProtectedRoute>} />
            <Route path="/assistant" element={<ProtectedRoute><StudyAssistantPage /></ProtectedRoute>} />

            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="enrollment" element={<AdminEnrollment />} />
              <Route path="logs" element={<AdminLogs />} />
              <Route path="system" element={<AdminSystem />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <BottomNav />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CatalogProvider>
        <ToastProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AppContent />
          </Router>
        </ToastProvider>
      </CatalogProvider>
    </AuthProvider>
  );
};

export default App;
