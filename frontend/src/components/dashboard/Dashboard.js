import React, { Suspense } from 'react';
import withErrorBoundary from '../withErrorBoundary';
import { CardSkeleton, ListSkeleton } from '../LoadingSkeletons';
import { useApi } from '../../hooks/useApi';
import { performanceMonitor } from '../../utils/performance';

// Lazy load components for better performance
const DashboardStats = React.lazy(() => import('./DashboardStats'));
const QuickActions = React.lazy(() => import('./QuickActions'));
const ActivityFeed = React.lazy(() => import('./ActivityFeed'));
const ResumeBuilderWidget = React.lazy(() => import('./ResumeBuilderWidget'));
const AICoverLetterCard = React.lazy(() => import('./AICoverLetterCard'));
const ProgressTracker = React.lazy(() => import('./ProgressTracker'));

/**
 * Main Dashboard Component
 * Provides an overview of user statistics, quick actions, and recent activity
 */
const Dashboard = ({ user }) => {
  // Performance monitoring
  React.useEffect(() => {
    const measurement = performanceMonitor.startMeasurement('dashboard-render');
    return () => {
      measurement.end();
    };
  }, []);

  // Fetch dashboard data using our custom hook
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats
  } = useApi('/api/users/ai-status', {
    dependencies: [user?.id],
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheKey: `dashboard-stats-${user?.id}`
  });

  const {
    data: recentActivity,
    loading: activityLoading,
    error: activityError
  } = useApi('/api/dashboard/activity', {
    dependencies: [user?.id],
    params: { limit: 10 },
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheKey: `dashboard-activity-${user?.id}`
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || 'User'}
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Here's your job application overview
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm border">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.isProUser ? 'Pro User' : 'Free User'}
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm border">
                <span className="text-sm font-medium text-gray-700">
                  AI Credits: {stats?.data?.aiCredits || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <Suspense fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => <CardSkeleton key={i} />)}
            </div>
          }>
            <DashboardStats 
              stats={stats?.data} 
              loading={statsLoading} 
              error={statsError}
              onRetry={refetchStats}
            />
          </Suspense>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">            {/* Quick Actions */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <Suspense fallback={<CardSkeleton />}>
                <QuickActions user={user} />
              </Suspense>
            </section>

            {/* Activity Feed */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <Suspense fallback={<ListSkeleton />}>
                <ActivityFeed 
                  activities={recentActivity?.data}
                  loading={activityLoading}
                  error={activityError}
                />
              </Suspense>
            </section>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-8">            {/* Progress Tracker */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress</h2>
              <Suspense fallback={<CardSkeleton />}>
                <ProgressTracker user={user} />
              </Suspense>
            </section>

            {/* Resume Builder Widget */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Resume Builder</h2>
              <Suspense fallback={<CardSkeleton />}>
                <ResumeBuilderWidget user={user} />
              </Suspense>
            </section>

            {/* AI Cover Letter Card */}
            <section>              <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Assistant</h2>
              <Suspense fallback={<CardSkeleton />}>
                <AICoverLetterCard user={user} />
              </Suspense>
            </section>
          </div>
        </div>

        {/* Mobile Quick Access Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900">
                {stats?.data?.aiCredits || 0}
              </div>
              <div className="text-xs text-gray-500">Credits</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900">
                {user?.isProUser ? 'Pro' : 'Free'}
              </div>
              <div className="text-xs text-gray-500">Plan</div>
            </div>
            <button
              onClick={() => refetchStats()}
              className="flex items-center justify-center w-10 h-10 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withErrorBoundary(Dashboard, {
  fallback: ({ error, retry }) => (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Dashboard Error
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              There was an error loading your dashboard. Please try again.
            </p>
            {retry && (
              <div className="mt-6">
                <button
                  onClick={retry}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
});
