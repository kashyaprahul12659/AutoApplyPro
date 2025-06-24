import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';
import { useUser } from './useUniversalAuth';
import { toast } from 'react-toastify';

/**
 * Custom hook for managing dashboard data
 * Provides real-time stats and analytics
 */
export const useDashboardData = () => {
  const { user } = useUser();
  const { apiCall } = useApi();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalApplications: 0,
      thisMonth: 0,
      responseRate: 0,
      interviews: 0,
      timesSaved: 0,
      profileViews: 0
    },
    recentActivity: [],
    loading: true,
    error: null
  });
  const [refreshInterval, setRefreshInterval] = useState(null);
  
  // Fetch dashboard stats from analytics API
  const fetchDashboardStats = useCallback(async () => {
    if (!user) return;

    try {
      const response = await apiCall('/api/dashboard', { method: 'GET' });

      if (response.success) {
        // Ensure we have valid data or use defaults
        const stats = response.data?.stats || {
          totalApplications: 0,
          thisMonth: 0,
          responseRate: 0,
          interviews: 0,
          timesSaved: 0,
          profileViews: 0
        };
        
        const recentApplications = response.data?.recentApplications || [];
        const analytics = response.data?.analytics || {};

        setDashboardData(prev => ({
          ...prev,
          stats,
          recentActivity: recentApplications.map(app => ({
            type: 'application',
            title: `Applied to ${app.position || 'Unknown'} at ${app.company || 'Unknown'}`,
            subtitle: `Status: ${app.status || 'Applied'}`,
            date: app.appliedDate || new Date(),
            icon: 'briefcase'
          })),
          analytics,
          loading: false,
          error: null
        }));
      } else {
        // Handle unsuccessful response
        throw new Error('Dashboard data fetch returned unsuccessful status');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load dashboard data'
      }));
    }
  }, [user, apiCall]);

  // Fetch user's job applications for real stats
  const fetchJobApplications = useCallback(async () => {
    if (!user) return;

    try {
      const response = await apiCall('/api/job-tracker/applications', { method: 'GET' });
      if (response.success && Array.isArray(response.data)) {
        const applications = response.data || [];
        const thisMonth = new Date();
        thisMonth.setMonth(thisMonth.getMonth() - 1);

        const stats = {
          totalApplications: applications.length,
          thisMonth: applications.filter(app => {
            // Safely check dates with null/undefined handling
            try {
              return new Date(app.createdAt) >= thisMonth;
            } catch (e) {
              return false;
            }
          }).length,
          interviews: applications.filter(app => app.status === 'interview').length,
          responseRate: applications.length > 0
            ? Math.round((applications.filter(app => app.status !== 'applied').length / applications.length) * 100)
            : 0
        };

        setDashboardData(prev => ({
          ...prev,
          stats: { ...prev.stats, ...stats }
        }));
      }
    } catch (error) {
      console.error('Error fetching job applications:', error);
      // Don't update error state here to avoid overriding main stats
    }
  }, [user, apiCall]);

  // Initialize data loading
  useEffect(() => {
    if (user) {
      fetchDashboardStats();
      fetchJobApplications();
    }
  }, [user, fetchDashboardStats, fetchJobApplications]);

  // Set up auto-refresh
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        fetchDashboardStats();
        fetchJobApplications();
      }, 5 * 60 * 1000); // Refresh every 5 minutes

      setRefreshInterval(interval);

      return () => {
        if (interval) clearInterval(interval);      };
    }
  }, [user, fetchDashboardStats, fetchJobApplications]);
  
  // Manual refresh function
  const refreshData = useCallback(async () => {
    setDashboardData(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Call the refresh endpoint
      await apiCall('/api/dashboard/refresh', { method: 'POST' });
      // Then fetch fresh data
      await fetchDashboardStats();
      await fetchJobApplications();
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      // Still try to fetch data even if refresh fails
      try {
        await fetchDashboardStats();
        await fetchJobApplications();
      } catch (innerError) {
        console.error('Error fetching dashboard data after refresh failure:', innerError);
        setDashboardData(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Failed to load dashboard data. Please try again later.' 
        }));
      }
    }
  }, [fetchDashboardStats, fetchJobApplications, apiCall]);

  return {
    ...dashboardData,
    refreshData
  };
};

export default useDashboardData;
