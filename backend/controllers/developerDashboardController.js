const developerDashboardService = require('../services/developerDashboardService');
const { logger } = require('../utils/logger');

const developerDashboardController = {
  // Get complete dashboard data
  async getDashboard(req, res) {
    try {
      const dashboardData = await developerDashboardService.getDashboardData();
      
      res.json({
        success: true,
        data: dashboardData
      });
      
    } catch (error) {
      logger.error('Error getting dashboard data:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard data'
      });
    }
  },
  
  // Get dashboard overview
  async getOverview(req, res) {
    try {
      const overview = await developerDashboardService.getOverviewData();
      
      res.json({
        success: true,
        data: overview
      });
      
    } catch (error) {
      logger.error('Error getting dashboard overview:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard overview'
      });
    }
  },
  
  // Get user metrics
  async getUserMetrics(req, res) {
    try {
      const userMetrics = await developerDashboardService.getUserMetrics();
      
      res.json({
        success: true,
        data: userMetrics
      });
      
    } catch (error) {
      logger.error('Error getting user metrics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user metrics'
      });
    }
  },
  
  // Get system status
  async getSystemStatus(req, res) {
    try {
      const systemMetrics = await developerDashboardService.getSystemMetrics();
      
      res.json({
        success: true,
        data: systemMetrics
      });
      
    } catch (error) {
      logger.error('Error getting system status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch system status'
      });
    }
  },
  
  // Get application metrics
  async getApplicationMetrics(req, res) {
    try {
      const appMetrics = await developerDashboardService.getApplicationMetrics();
      
      res.json({
        success: true,
        data: appMetrics
      });
      
    } catch (error) {
      logger.error('Error getting application metrics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch application metrics'
      });
    }
  },
  
  // Get revenue metrics
  async getRevenueMetrics(req, res) {
    try {
      const revenueMetrics = await developerDashboardService.getRevenueMetrics();
      
      res.json({
        success: true,
        data: revenueMetrics
      });
      
    } catch (error) {
      logger.error('Error getting revenue metrics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch revenue metrics'
      });
    }
  },
  
  // Get feature usage metrics
  async getFeatureMetrics(req, res) {
    try {
      const featureMetrics = await developerDashboardService.getFeatureUsageMetrics();
      
      res.json({
        success: true,
        data: featureMetrics
      });
      
    } catch (error) {
      logger.error('Error getting feature metrics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch feature metrics'
      });
    }
  },
  
  // Get real-time metrics
  async getRealTimeMetrics(req, res) {
    try {
      const realTimeMetrics = await developerDashboardService.getRealTimeMetrics();
      
      res.json({
        success: true,
        data: realTimeMetrics
      });
      
    } catch (error) {
      logger.error('Error getting real-time metrics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch real-time metrics'
      });
    }
  },
  
  // Get system alerts
  async getAlerts(req, res) {
    try {
      const { limit = 20, severity } = req.query;
      const alerts = await developerDashboardService.getSystemAlerts();
      
      let filteredAlerts = alerts;
      if (severity) {
        filteredAlerts = alerts.filter(alert => alert.severity === severity);
      }
      
      // Apply limit
      filteredAlerts = filteredAlerts.slice(0, parseInt(limit));
      
      res.json({
        success: true,
        data: {
          alerts: filteredAlerts,
          total: filteredAlerts.length,
          hasMore: alerts.length > parseInt(limit)
        }
      });
      
    } catch (error) {
      logger.error('Error getting alerts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch alerts'
      });
    }
  },
  
  // Force refresh dashboard data
  async refreshDashboard(req, res) {
    try {
      await developerDashboardService.refreshDashboardData();
      
      res.json({
        success: true,
        message: 'Dashboard data refreshed successfully',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      logger.error('Error refreshing dashboard:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to refresh dashboard data'
      });
    }
  },
  
  // Get dashboard configuration
  async getConfig(req, res) {
    try {
      const config = {
        refreshInterval: 5 * 60 * 1000, // 5 minutes
        features: {
          userMetrics: true,
          systemMonitoring: true,
          revenueTracking: true,
          featureAnalytics: true,
          realTimeMetrics: true,
          alerting: true
        },
        chartTypes: [
          'line', 'bar', 'pie', 'doughnut', 'area', 'scatter'
        ],
        timeRanges: [
          { label: '1 Hour', value: '1h' },
          { label: '24 Hours', value: '24h' },
          { label: '7 Days', value: '7d' },
          { label: '30 Days', value: '30d' },
          { label: '90 Days', value: '90d' }
        ],
        widgets: [
          { id: 'overview', name: 'Overview', enabled: true },
          { id: 'users', name: 'User Metrics', enabled: true },
          { id: 'system', name: 'System Status', enabled: true },
          { id: 'revenue', name: 'Revenue', enabled: true },
          { id: 'features', name: 'Feature Usage', enabled: true },
          { id: 'alerts', name: 'System Alerts', enabled: true }
        ]
      };
      
      res.json({
        success: true,
        data: config
      });
      
    } catch (error) {
      logger.error('Error getting dashboard config:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard configuration'
      });
    }
  }
};

module.exports = developerDashboardController;
