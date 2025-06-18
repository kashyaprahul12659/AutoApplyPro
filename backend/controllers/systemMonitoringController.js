const systemMonitoringService = require('../services/systemMonitoringService');
const { logger } = require('../utils/logger');

const systemMonitoringController = {
  // Get system overview
  async getSystemOverview(req, res) {
    try {
      const metrics = systemMonitoringService.getCurrentMetrics();
      const healthStatus = systemMonitoringService.getHealthStatus();
      const recentAlerts = systemMonitoringService.getRecentAlerts(10);
      
      res.json({
        success: true,
        data: {
          health: healthStatus,
          metrics,
          alerts: recentAlerts,
          timestamp: new Date().toISOString()
        }
      });
      
    } catch (error) {
      logger.error('Error getting system overview:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch system overview'
      });
    }
  },
  
  // Get detailed system metrics
  async getSystemMetrics(req, res) {
    try {
      const { type } = req.query;
      const metrics = systemMonitoringService.getCurrentMetrics();
      
      let responseData = metrics;
      
      // Filter by metric type if specified
      if (type && metrics[type]) {
        responseData = { [type]: metrics[type] };
      }
      
      res.json({
        success: true,
        data: responseData
      });
      
    } catch (error) {
      logger.error('Error getting system metrics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch system metrics'
      });
    }
  },
  
  // Get system health status
  async getHealthStatus(req, res) {
    try {
      const healthStatus = systemMonitoringService.getHealthStatus();
      
      // Set appropriate HTTP status based on health
      let statusCode = 200;
      if (healthStatus.status === 'warning') {
        statusCode = 200; // Still OK, but with warnings
      } else if (healthStatus.status === 'critical') {
        statusCode = 503; // Service unavailable
      }
      
      res.status(statusCode).json({
        success: true,
        data: healthStatus
      });
      
    } catch (error) {
      logger.error('Error getting health status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch health status'
      });
    }
  },
  
  // Get system alerts
  async getSystemAlerts(req, res) {
    try {
      const { limit = 50, severity } = req.query;
      let alerts = systemMonitoringService.getRecentAlerts(parseInt(limit));
      
      // Filter by severity if specified
      if (severity) {
        alerts = alerts.filter(alert => alert.severity === severity);
      }
      
      res.json({
        success: true,
        data: {
          alerts,
          total: alerts.length,
          severityCounts: this.getAlertSeverityCounts(alerts)
        }
      });
      
    } catch (error) {
      logger.error('Error getting system alerts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch system alerts'
      });
    }
  },
  
  // Get performance metrics
  async getPerformanceMetrics(req, res) {
    try {
      const metrics = systemMonitoringService.getCurrentMetrics();
      
      const performanceData = {
        system: {
          cpu: metrics.system?.cpu,
          memory: metrics.system?.memory,
          uptime: metrics.system?.uptime,
          loadAverage: metrics.system?.loadAverage
        },
        application: {
          process: metrics.application?.process,
          performance: metrics.application?.performance,
          activeConnections: metrics.application?.activeConnections
        },
        database: {
          connection: metrics.database?.connection,
          stats: metrics.database?.stats
        },
        timestamp: new Date().toISOString()
      };
      
      res.json({
        success: true,
        data: performanceData
      });
      
    } catch (error) {
      logger.error('Error getting performance metrics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch performance metrics'
      });
    }
  },
  
  // Get resource usage
  async getResourceUsage(req, res) {
    try {
      const metrics = systemMonitoringService.getCurrentMetrics();
      
      const resourceData = {
        cpu: {
          usage: metrics.system?.cpu?.usage,
          count: metrics.system?.cpu?.count,
          model: metrics.system?.cpu?.model
        },
        memory: {
          system: metrics.system?.memory,
          process: metrics.application?.process?.memory
        },
        disk: metrics.system?.disk,
        network: metrics.system?.network,
        database: {
          dataSize: metrics.database?.stats?.dataSize,
          storageSize: metrics.database?.stats?.storageSize,
          indexSize: metrics.database?.stats?.indexSize
        }
      };
      
      res.json({
        success: true,
        data: resourceData
      });
      
    } catch (error) {
      logger.error('Error getting resource usage:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch resource usage'
      });
    }
  },
  
  // Get monitoring configuration
  async getMonitoringConfig(req, res) {
    try {
      const config = {
        alertThresholds: systemMonitoringService.alertThresholds,
        monitoringIntervals: {
          systemMetrics: 30000, // 30 seconds
          applicationMetrics: 60000, // 60 seconds
          databaseMetrics: 60000 // 60 seconds
        },
        features: {
          systemMonitoring: true,
          performanceTracking: true,
          alerting: true,
          resourceTracking: true
        }
      };
      
      res.json({
        success: true,
        data: config
      });
      
    } catch (error) {
      logger.error('Error getting monitoring config:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch monitoring configuration'
      });
    }
  },
  
  // Helper method to count alert severities
  getAlertSeverityCounts(alerts) {
    const counts = { info: 0, warning: 0, critical: 0 };
    
    alerts.forEach(alert => {
      if (counts.hasOwnProperty(alert.severity)) {
        counts[alert.severity]++;
      }
    });
    
    return counts;
  }
};

module.exports = systemMonitoringController;
