import React from 'react';
import {
  ChartBarIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  CheckCircleIcon,
  EyeIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { CardSkeleton } from '../LoadingSkeletons';
import withErrorBoundary from '../withErrorBoundary';

/**
 * Enhanced Dashboard Stats Component with modern design and animations
 * Improved with defensive programming for handling undefined data
 */
const DashboardStats = ({ stats = {}, loading = false, error = null }) => {
  // Validate props - defensive programming against invalid input
  const isLoading = loading === true;
  const hasError = error !== null && error !== undefined;
  const safeStats = stats && typeof stats === 'object' ? stats : {};
  
  // Log warning if stats is invalid but don't crash
  if (stats !== null && stats !== undefined && typeof stats !== 'object') {
    console.warn('DashboardStats received invalid stats data:', stats);
  }
  
  // Show loading skeleton if data is being fetched
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map(i => <CardSkeleton key={i} />)}
      </div>
    );
  }

  // Show error state if there's an error
  if (hasError) {
    // Get error message safely
    const errorMessage = 
      typeof error === 'string' ? error :
      error?.message ? error.message : 
      'An unknown error occurred while loading statistics';
      
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Unable to load statistics
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{errorMessage}</p>
              <p className="mt-1">Please try refreshing the page.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle potential nullish data from the API - use default values for safety
  const defaultStats = {
    totalApplications: 0,
    thisMonth: 0,
    responseRate: 0,
    interviews: 0,
    timesSaved: 0,
    profileViews: 0,
    // Safely merge with stats, handling potential undefined values
    ...(safeStats?.data && typeof safeStats.data === 'object' ? safeStats.data : safeStats)
  };
  const statCards = [
    {
      title: 'Total Applications',
      value: defaultStats.totalApplications,
      change: defaultStats.totalApplications > 0 ? '+12%' : '0%',
      trend: defaultStats.totalApplications > 0 ? 'up' : 'neutral',
      icon: DocumentDuplicateIcon,
      color: 'primary',
      gradient: 'from-primary-500 to-primary-600'
    },
    {
      title: 'This Month',
      value: defaultStats.thisMonth,
      change: defaultStats.thisMonth > 0 ? '+8%' : '0%',
      trend: defaultStats.thisMonth > 0 ? 'up' : 'neutral',
      icon: BoltIcon,
      color: 'secondary',
      gradient: 'from-secondary-500 to-secondary-600'
    },
    {
      title: 'Response Rate',
      value: `${defaultStats.responseRate}%`,
      change: defaultStats.responseRate > 0 ? '+5%' : '0%',
      trend: defaultStats.responseRate > 0 ? 'up' : 'neutral',
      icon: ArrowTrendingUpIcon,
      color: 'accent',
      gradient: 'from-accent-500 to-accent-600'
    },
    {
      title: 'Interviews',
      value: defaultStats.interviews,
      change: defaultStats.interviews > 0 ? '+3' : '0',
      trend: defaultStats.interviews > 0 ? 'up' : 'neutral',
      icon: UserGroupIcon,
      color: 'success',
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'Hours Saved',
      value: defaultStats.timesSaved,
      change: defaultStats.timesSaved > 0 ? '+15h' : '0h',
      trend: defaultStats.timesSaved > 0 ? 'up' : 'neutral',
      icon: ClockIcon,
      color: 'warning',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Profile Views',
      value: defaultStats.profileViews,
      change: defaultStats.profileViews > 0 ? '+0' : '0',
      trend: 'neutral',
      icon: EyeIcon,
      color: 'info',
      gradient: 'from-blue-500 to-blue-600'    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div
          key={stat.title}
          className="card card-hover p-6 bg-white border border-neutral-200 hover:border-primary-300 hover:shadow-large transition-all duration-500 group overflow-hidden"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Background Gradient Effect */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

          <div className="relative">
            {/* Header with Icon */}
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white group-hover:scale-110 transition-transform duration-300 shadow-soft`}>
                <stat.icon className="h-6 w-6" />
              </div>

              {/* Trend Indicator */}
              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                stat.trend === 'up'
                  ? 'bg-secondary-100 text-secondary-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                <ArrowTrendingUpIcon className={`h-4 w-4 mr-1 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                {stat.change}
              </div>
            </div>

            {/* Value */}
            <div className="mb-2">
              <div className="text-3xl font-black text-neutral-900 group-hover:text-primary-700 transition-colors duration-300">
                {stat.value}
              </div>
            </div>

            {/* Title */}
            <div className="text-sm font-semibold text-muted group-hover:text-neutral-700 transition-colors duration-300">
              {stat.title}
            </div>
          </div>

          {/* Hover Effect Bar */}
          <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
        </div>
      ))}
    </div>
  );
};

export default withErrorBoundary(DashboardStats, {
  fallback: ({ error, retry }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Dashboard Stats Error
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>There was an error loading the dashboard statistics component.</p>
            {retry && (
              <button
                onClick={retry}
                className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
});
