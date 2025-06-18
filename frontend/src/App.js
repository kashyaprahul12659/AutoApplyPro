import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useUser } from './hooks/useUniversalAuth';
import { ToastContainer } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import 'react-toastify/dist/ReactToastify.css';

// Error Boundary and Loading Components
import ErrorBoundary from './components/ErrorBoundary';
import { PageErrorBoundary } from './components/withErrorBoundary';
import { PageLoading } from './components/LoadingSkeletons';
import FeedbackButton from './components/common/FeedbackButton';

// Components (keep these as regular imports since they're small and used frequently)
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routing/PrivateRoute';
import ExtensionIntegration from './components/extension/ExtensionIntegration';

// Lazy load pages for better performance
const Landing = lazy(() => import('./pages/Landing'));
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const History = lazy(() => import('./pages/History'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const CoverLetter = lazy(() => import('./pages/CoverLetter'));
const JDAnalyzer = lazy(() => import('./pages/JDAnalyzer'));
const JobTracker = lazy(() => import('./pages/JobTracker'));
const TestAutofill = lazy(() => import('./pages/TestAutofill'));
const ResumeBuilderPage = lazy(() => import('./pages/ResumeBuilderPage'));
const ResumeBuilder = lazy(() => import('./components/resumebuilder/ResumeBuilder'));
const Profile = lazy(() => import('./pages/Profile'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const { isLoaded } = useUser();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <Helmet>
          <title>AutoApply Pro - Apply to jobs faster with AI</title>
          <meta name="description" content="AutoApply Pro helps you apply to jobs faster with AI-powered autofill, cover letter generation, and job description analysis." />
          <meta name="keywords" content="job application, autofill forms, resume parser, AI cover letter, job search" />
          <meta property="og:title" content="AutoApply Pro - Apply to jobs faster with AI" />
          <meta property="og:description" content="Save time on job applications with auto-filling forms, AI cover letters, and skill matching." />
          <meta property="og:type" content="website" />
          <meta name="theme-color" content="#4f46e5" />
          <link rel="canonical" href="https://autoapplypro.tech" />
          <link rel="icon" href="/favicon.ico" />
        </Helmet>
        {!isLandingPage && <Navbar />}
        <main className={`flex-grow ${!isLandingPage ? 'container mx-auto px-4 py-8' : ''}`}>
          <Suspense fallback={<PageLoading />}>
            <Routes>
            <Route path="/" element={
              <PageErrorBoundary pageName="Landing">
                <Landing />
              </PageErrorBoundary>
            } />
            <Route path="/home" element={
              <PageErrorBoundary pageName="Home">
                <Home />
              </PageErrorBoundary>
            } />
            <Route path="/login/*" element={
              <PageErrorBoundary pageName="Login">
                <Login />
              </PageErrorBoundary>
            } />
            <Route path="/register/*" element={
              <PageErrorBoundary pageName="Register">
                <Register />
              </PageErrorBoundary>
            } />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <PageErrorBoundary pageName="Dashboard">
                  <Dashboard />
                </PageErrorBoundary>
              </PrivateRoute>
            } />
            <Route path="/history" element={
              <PrivateRoute>
                <PageErrorBoundary pageName="History">
                  <History />
                </PageErrorBoundary>
              </PrivateRoute>
            } />
            <Route path="/coverletter" element={
              <PrivateRoute>
                <PageErrorBoundary pageName="CoverLetter">
                  <CoverLetter />
                </PageErrorBoundary>
              </PrivateRoute>
            } />
            <Route path="/jd-analyzer" element={
              <PrivateRoute>
                <PageErrorBoundary pageName="JDAnalyzer">
                  <JDAnalyzer />
                </PageErrorBoundary>
              </PrivateRoute>
            } />
            <Route path="/job-tracker" element={
              <PrivateRoute>
                <PageErrorBoundary pageName="JobTracker">
                  <JobTracker />
                </PageErrorBoundary>
              </PrivateRoute>
            } />
            <Route path="/test-autofill" element={
              <PrivateRoute>
                <PageErrorBoundary pageName="TestAutofill">
                  <TestAutofill />
                </PageErrorBoundary>
              </PrivateRoute>
            } />
            <Route path="/resumes" element={
              <PrivateRoute>
                <PageErrorBoundary pageName="ResumeBuilderPage">
                  <ResumeBuilderPage />
                </PageErrorBoundary>
              </PrivateRoute>
            } />
            <Route path="/ai-resume" element={
              <PrivateRoute>
                <PageErrorBoundary pageName="ResumeBuilderPage">
                  <ResumeBuilderPage />
                </PageErrorBoundary>
              </PrivateRoute>
            } />
            <Route path="/resume-builder/:id?" element={
              <PrivateRoute>
                <PageErrorBoundary pageName="ResumeBuilder">
                  <ResumeBuilder />
                </PageErrorBoundary>
              </PrivateRoute>
            } />            <Route path="/profile" element={
              <PrivateRoute>
                <PageErrorBoundary pageName="Profile">
                  <Profile />
                </PageErrorBoundary>
              </PrivateRoute>
            } />
            
            {/* Legal Pages - Public Routes */}
            <Route path="/privacy-policy" element={
              <PageErrorBoundary pageName="PrivacyPolicy">
                <PrivacyPolicy />
              </PageErrorBoundary>
            } />
            <Route path="/terms-of-service" element={
              <PageErrorBoundary pageName="TermsOfService">
                <TermsOfService />
              </PageErrorBoundary>
            } />
            <Route path="/refund-policy" element={
              <PageErrorBoundary pageName="RefundPolicy">
                <RefundPolicy />
              </PageErrorBoundary>
            } />
            
            <Route path="*" element={
              <PageErrorBoundary pageName="NotFound">
                <NotFound />
              </PageErrorBoundary>
            } /></Routes>
        </Suspense>
      </main>
      
      {!isLandingPage && <Footer />}
      {!isLandingPage && <FeedbackButton />}
      <ExtensionIntegration />
      <ToastContainer 
        position={window.innerWidth < 768 ? 'bottom-center' : 'top-right'}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className="rounded-md shadow-lg"
        limit={3}
        toastClassName="rounded-lg shadow-md"
        bodyClassName="text-sm font-medium"
      />
      </div>
    </ErrorBoundary>
  );
}

export default App;
