import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CatalogProvider } from './contexts/CatalogContext';
import { ToastProvider } from './components/ui/Toast';
import { BottomNav } from './components/layout/BottomNav';
import { supabase } from './lib/supabase';
import { HomePage } from './pages/HomePage';
import { LandingPage } from './pages/LandingPage';
import { SearchPage } from './pages/SearchPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { CyclesPage } from './pages/CyclesPage';
import { ChaptersPage } from './pages/ChaptersPage';
import { VideoListPage } from './pages/VideoListPage';
import { PlayerPage } from './pages/PlayerPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProgressPage } from './pages/ProgressPage';
import { NotesPage } from './pages/NotesPage';
import { LiveClassPage } from './pages/LiveClassPage';
import { QnAPage } from './pages/QnAPage';
import { QnADetailPage } from './pages/QnADetailPage';
import { QuizPage } from './pages/QuizPage';
import { QuizListPage } from './pages/QuizListPage';
import { QuizResultPage } from './pages/QuizResultPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ShopPage, AboutPage, SuccessStoriesPage, ContactPage, PrivacyPage, TermsPage, RefundPage } from './pages/Placeholders';

const AdminLayout = React.lazy(() => import('./pages/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminContent = React.lazy(() => import('./pages/admin/AdminContent').then(m => ({ default: m.AdminContent })));
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers').then(m => ({ default: m.AdminUsers })));
const AdminLogs = React.lazy(() => import('./pages/admin/AdminLogs').then(m => ({ default: m.AdminLogs })));
const AdminSystem = React.lazy(() => import('./pages/admin/AdminSystem').then(m => ({ default: m.AdminSystem })));

const ProtectedRoute: React.FC<{ 
  children: React.ReactNode 
}> = ({ children }) => {
  const { user, profile, isLoading, signOut } = useAuth();

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
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 flex-col bg-background">
        <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-surface p-8 shadow-sm text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-text-primary">
            Access Restricted
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Your account does not have access to NexusEdu content. Please contact the administrator.
          </p>
          <div className="mt-8">
            <button
              onClick={() => signOut()}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const PublicOrDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return null;
  
  if (user) {
    return <HomePage />;
  }
  
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
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/" element={<PublicOrDashboard />} />
          <Route path="/courses" element={<PublicOrDashboard />} />
          
          {/* Public Pages */}
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/success" element={<SuccessStoriesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/refund" element={<RefundPage />} />

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
          <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
          <Route path="/live" element={<ProtectedRoute><LiveClassPage /></ProtectedRoute>} />
          <Route path="/qna" element={<ProtectedRoute><QnAPage /></ProtectedRoute>} />
          <Route path="/qna/:questionId" element={<ProtectedRoute><QnADetailPage /></ProtectedRoute>} />

          <Route path="/admin" element={
            <ProtectedRoute>
              <Suspense fallback={
                <div className="flex h-screen items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              }>
                <AdminLayout />
              </Suspense>
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="logs" element={<AdminLogs />} />
            <Route path="system" element={<AdminSystem />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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
