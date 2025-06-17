import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useUser } from './hooks/useUniversalAuth';
import { ToastContainer } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import 'react-toastify/dist/ReactToastify.css';
import FeedbackButton from './components/common/FeedbackButton';

// Pages
import Landing from './pages/Landing';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import CoverLetter from './pages/CoverLetter';
import JDAnalyzer from './pages/JDAnalyzer';
import JobTracker from './pages/JobTracker';
import TestAutofill from './pages/TestAutofill';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import ResumeBuilder from './components/resumebuilder/ResumeBuilder';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routing/PrivateRoute';
import ExtensionIntegration from './components/extension/ExtensionIntegration';

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
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>AutoApply Pro - Apply to jobs faster with AI</title>
        <meta name="description" content="AutoApply Pro helps you apply to jobs faster with AI-powered autofill, cover letter generation, and job description analysis." />
        <meta name="keywords" content="job application, autofill forms, resume parser, AI cover letter, job search" />
        <meta property="og:title" content="AutoApply Pro - Apply to jobs faster with AI" />
        <meta property="og:description" content="Save time on job applications with auto-filling forms, AI cover letters, and skill matching." />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content="#4f46e5" />
        <link rel="canonical" href="https://autoapplypro.com" />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>
      
      {!isLandingPage && <Navbar />}
      <main className={`flex-grow ${!isLandingPage ? 'container mx-auto px-4 py-8' : ''}`}>        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login/*" element={<Login />} />
          <Route path="/register/*" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
          <Route path="/coverletter" element={<PrivateRoute><CoverLetter /></PrivateRoute>} />
          <Route path="/jd-analyzer" element={<PrivateRoute><JDAnalyzer /></PrivateRoute>} />
          <Route path="/job-tracker" element={<PrivateRoute><JobTracker /></PrivateRoute>} />          <Route path="/test-autofill" element={<PrivateRoute><TestAutofill /></PrivateRoute>} />          <Route path="/resumes" element={<PrivateRoute><ResumeBuilderPage /></PrivateRoute>} />
          <Route path="/ai-resume" element={<PrivateRoute><ResumeBuilderPage /></PrivateRoute>} />
          <Route path="/resume-builder/:id?" element={<PrivateRoute><ResumeBuilder /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
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
  );
}

export default App;
