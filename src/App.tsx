import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

// Public pages
import { LandingPage } from '@/pages/LandingPage';
import { ExplorePage } from '@/pages/ExplorePage';
import { ProviderProfilePage } from '@/pages/ProviderProfilePage';
import { BookingPage } from '@/pages/BookingPage';

// Auth pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';

// Onboarding
import { OnboardingPage } from '@/pages/OnboardingPage';

// Learner dashboard
import { LearnerDashboardHome } from '@/pages/learner/DashboardHome';
import { MyBookingsPage } from '@/pages/learner/MyBookingsPage';
import { MessagesPage } from '@/pages/learner/MessagesPage';
import { LearnerReviewsPage } from '@/pages/learner/ReviewsPage';
import { LearnerProfilePage } from '@/pages/learner/ProfilePage';

// Provider dashboard
import { ProviderDashboard } from '@/pages/provider/ProviderDashboard';
import { ProviderSkillsPage } from '@/pages/provider/ProviderSkillsPage';
import { ProviderBookingsPage } from '@/pages/provider/ProviderBookingsPage';
import { ProviderEarningsPage } from '@/pages/provider/ProviderEarningsPage';
import { ProviderAvailabilityPage } from '@/pages/provider/ProviderAvailabilityPage';

// Admin
import { AdminDashboard } from '@/pages/admin/AdminDashboard';

// Shared
import { SettingsPage } from '@/pages/SettingsPage';
import { NotificationsPage } from '@/pages/NotificationsPage';

// ── Protected route wrapper ───────────────────────────────────────────────────
function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

// ── Loading fallback ──────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Public ── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/skills" element={<ExplorePage />} />
        <Route path="/providers/:id" element={<ProviderProfilePage />} />
        <Route path="/booking/:id" element={<BookingPage />} />

        {/* ── Auth ── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* ── Onboarding ── */}
        <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />

        {/* ── Learner dashboard ── */}
        <Route path="/dashboard" element={<ProtectedRoute><LearnerDashboardHome /></ProtectedRoute>} />
        <Route path="/dashboard/bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
        <Route path="/dashboard/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
        <Route path="/dashboard/reviews" element={<ProtectedRoute><LearnerReviewsPage /></ProtectedRoute>} />
        <Route path="/dashboard/profile" element={<ProtectedRoute><LearnerProfilePage /></ProtectedRoute>} />

        {/* ── Provider dashboard ── */}
        <Route path="/provider" element={<ProtectedRoute><ProviderDashboard /></ProtectedRoute>} />
        <Route path="/provider/skills" element={<ProtectedRoute><ProviderSkillsPage /></ProtectedRoute>} />
        <Route path="/provider/bookings" element={<ProtectedRoute><ProviderBookingsPage /></ProtectedRoute>} />
        <Route path="/provider/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
        <Route path="/provider/reviews" element={<ProtectedRoute><LearnerReviewsPage /></ProtectedRoute>} />
        <Route path="/provider/earnings" element={<ProtectedRoute><ProviderEarningsPage /></ProtectedRoute>} />
        <Route path="/provider/availability" element={<ProtectedRoute><ProviderAvailabilityPage /></ProtectedRoute>} />
        <Route path="/provider/profile" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* ── Admin ── */}
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/*" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />

        {/* ── Shared ── */}
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/settings/:tab" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
