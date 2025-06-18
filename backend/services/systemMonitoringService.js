const os = require('os');
const mongoose = require('mongoose');
const { logger } = require('../utils/logger');
const { cache } = require('../utils/cache');

class SystemMonitoringService {
  constructor() {
    this.metrics = {
      system: {},
      application: {},
      database: {},
      performance: {}
    };
    
    this.alertThresholds = {
      cpuUsage: 80, // 80%
      memoryUsage: 85, // 85%
      diskUsage: 90, // 90%
      responseTime: 5000, // 5 seconds
      errorRate: 5, // 5% error rate
      activeConnections: 1000 // Max active connections
    };
    
    this.startMonitoring();
  }
  
  // Start system monitoring
  startMonitoring() {
    // Monitor system metrics every 30 seconds
    setInterval(() => {
      this.collectSystemMetrics();
    }, 30000);
    
    // Monitor application metrics every 60 seconds
    setInterval(() => {
      this.collectApplicationMetrics();
    }, 60000);
    
    // Monitor database metrics every 60 seconds
    setInterval(() => {
      this.collectDatabaseMetrics();
    }, 60000);
    
    logger.info('System monitoring started');
  }
  
  // Collect system metrics
  collectSystemMetrics() {
    try {
      const cpus = os.cpus();
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      
      this.metrics.system = {
        timestamp: new Date().toISOString(),
        cpu: {
          count: cpus.length,
          model: cpus[0]?.model || 'Unknown',
          usage: this.getCpuUsage()
        },
        memory: {
          total: Math.round(totalMem / 1024 / 1024), // MB
          used: Math.round(usedMem / 1024 / 1024), // MB
          free: Math.round(freeMem / 1024 / 1024), // MB
          usagePercent: Math.round((usedMem / totalMem) * 100)
        },
        disk: this.getDiskUsage(),
        network: this.getNetworkStats(),
        uptime: Math.round(os.uptime()),
        loadAverage: os.loadavg()
      };
      
      // Check for alerts
      this.checkSystemAlerts();
      
      // Cache metrics for API access
      cache.set('system_metrics', this.metrics.system, 60);
      
    } catch (error) {
      logger.error('Error collecting system metrics:', error);
    }
  }
  
  // Collect application metrics
  collectApplicationMetrics() {
    try {
      const processInfo = process.memoryUsage();
      
      this.metrics.application = {
        timestamp: new Date().toISOString(),
        process: {
          pid: process.pid,
          uptime: Math.round(process.uptime()),
          memory: {
            rss: Math.round(processInfo.rss / 1024 / 1024), // MB
            heapTotal: Math.round(processInfo.heapTotal / 1024 / 1024), // MB
            heapUsed: Math.round(processInfo.heapUsed / 1024 / 1024), // MB
            external: Math.round(processInfo.external / 1024 / 1024) // MB
          },
          cpu: process.cpuUsage()
        },
        performance: this.getPerformanceMetrics(),
        errors: this.getErrorMetrics(),
        activeConnections: this.getActiveConnections()
      };
      
      // Check for application alerts
      this.checkApplicationAlerts();
      
      // Cache metrics for API access
      cache.set('application_metrics', this.metrics.application, 60);
      
    } catch (error) {
      logger.error('Error collecting application metrics:', error);
    }
  }
  
  // Collect database metrics
  collectDatabaseMetrics() {
    try {
      const connectionState = mongoose.connection.readyState;
      const dbStats = mongoose.connection.db ? this.getDatabaseStats() : null;
      
      this.metrics.database = {
        timestamp: new Date().toISOString(),
        connection: {
          state: this.getConnectionStateText(connectionState),
          host: mongoose.connection.host,
          port: mongoose.connection.port,
          name: mongoose.connection.name
        },
        stats: dbStats,
        collections: this.getCollectionStats()
      };
      
      // Check for database alerts
      this.checkDatabaseAlerts();
      
      // Cache metrics for API access
      cache.set('database_metrics', this.metrics.database, 60);
      
    } catch (error) {
      logger.error('Error collecting database metrics:', error);
    }
  }
  
  // Get current metrics for API
  getCurrentMetrics() {
    return {
      system: cache.get('system_metrics') || this.metrics.system,
      application: cache.get('application_metrics') || this.metrics.application,
      database: cache.get('database_metrics') || this.metrics.database,
      timestamp: new Date().toISOString()
    };
  }
  
  // Get performance metrics
  getPerformanceMetrics() {
    // This would typically integrate with APM tools
    // For now, return basic metrics
    return {
      averageResponseTime: cache.get('avg_response_time') || 0,
      requestsPerMinute: cache.get('requests_per_minute') || 0,
      errorRate: cache.get('error_rate') || 0,
      throughput: cache.get('throughput') || 0
    };
  }
  
  // Get error metrics
  getErrorMetrics() {
    return {
      total: cache.get('total_errors') || 0,
      rate: cache.get('error_rate') || 0,
      recent: cache.get('recent_errors') || []
    };
  }
  
  // Get active connections
  getActiveConnections() {
    // This would typically track WebSocket and HTTP connections
    return cache.get('active_connections') || 0;
  }
  
  // Get CPU usage (simplified implementation)
  getCpuUsage() {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;
    
    cpus.forEach(cpu => {
      for (let type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });
    
    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    const usage = 100 - ~~(100 * idle / total);
    
    return Math.max(0, Math.min(100, usage));
  }
  
  // Get disk usage (simplified implementation)
  getDiskUsage() {
    // This is a simplified implementation
    // In production, you'd use a library like 'node-disk-info'
    return {
      total: 100000, // 100GB placeholder
      used: 45000, // 45GB placeholder
      free: 55000, // 55GB placeholder
      usagePercent: 45
    };
  }
  
  // Get network stats (simplified implementation)
  getNetworkStats() {
    const networkInterfaces = os.networkInterfaces();
    const stats = {
      interfaces: Object.keys(networkInterfaces).length,
      addresses: []
    };
    
    Object.values(networkInterfaces).forEach(interfaces => {
      interfaces.forEach(iface => {
        if (!iface.internal) {
          stats.addresses.push({
            address: iface.address,
            family: iface.family,
            mac: iface.mac
          });
        }
      });
    });
    
    return stats;
  }
  
  // Get database stats
  async getDatabaseStats() {
    try {
      if (!mongoose.connection.db) return null;
      
      const stats = await mongoose.connection.db.stats();
      return {
        collections: stats.collections || 0,
        objects: stats.objects || 0,
        dataSize: Math.round((stats.dataSize || 0) / 1024 / 1024), // MB
        storageSize: Math.round((stats.storageSize || 0) / 1024 / 1024), // MB
        indexes: stats.indexes || 0,
        indexSize: Math.round((stats.indexSize || 0) / 1024 / 1024) // MB
      };
    } catch (error) {
      logger.error('Error getting database stats:', error);
      return null;
    }
  }
  
  // Get collection stats
  getCollectionStats() {
    // This would typically get stats for each collection
    // Simplified implementation
    return {
      users: { count: 0, size: 0 },
      resumes: { count: 0, size: 0 },
      history: { count: 0, size: 0 }
    };
  }
  
  // Get connection state text
  getConnectionStateText(state) {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    return states[state] || 'unknown';
  }
  
  // Check system alerts
  checkSystemAlerts() {
    const { cpu, memory, disk } = this.metrics.system;
    
    if (cpu.usage > this.alertThresholds.cpuUsage) {
      this.sendAlert('high_cpu_usage', `CPU usage is ${cpu.usage}%`);
    }
    
    if (memory.usagePercent > this.alertThresholds.memoryUsage) {
      this.sendAlert('high_memory_usage', `Memory usage is ${memory.usagePercent}%`);
    }
    
    if (disk.usagePercent > this.alertThresholds.diskUsage) {
      this.sendAlert('high_disk_usage', `Disk usage is ${disk.usagePercent}%`);
    }
  }
  
  // Check application alerts
  checkApplicationAlerts() {
    const { performance, errors, activeConnections } = this.metrics.application;
    
    if (performance.averageResponseTime > this.alertThresholds.responseTime) {
      this.sendAlert('slow_response_time', `Average response time is ${performance.averageResponseTime}ms`);
    }
    
    if (performance.errorRate > this.alertThresholds.errorRate) {
      this.sendAlert('high_error_rate', `Error rate is ${performance.errorRate}%`);
    }
    
    if (activeConnections > this.alertThresholds.activeConnections) {
      this.sendAlert('high_connection_count', `Active connections: ${activeConnections}`);
    }
  }
  
  // Check database alerts
  checkDatabaseAlerts() {
    const { connection } = this.metrics.database;
    
    if (connection.state !== 'connected') {
      this.sendAlert('database_disconnected', `Database is ${connection.state}`);
    }
  }
  
  // Send alert
  sendAlert(type, message) {
    const alert = {
      type,
      message,
      timestamp: new Date().toISOString(),
      severity: this.getAlertSeverity(type)
    };
    
    logger.warn(`System Alert [${type}]: ${message}`, alert);
    
    // Store recent alerts
    const recentAlerts = cache.get('system_alerts') || [];
    recentAlerts.unshift(alert);
    
    // Keep only last 50 alerts
    if (recentAlerts.length > 50) {
      recentAlerts.splice(50);
    }
    
    cache.set('system_alerts', recentAlerts, 3600); // Store for 1 hour
    
    // In production, you might want to send these to external monitoring services
    // or notify administrators via email/SMS
  }
  
  // Get alert severity
  getAlertSeverity(type) {
    const severityMap = {
      high_cpu_usage: 'warning',
      high_memory_usage: 'warning',
      high_disk_usage: 'critical',
      slow_response_time: 'warning',
      high_error_rate: 'critical',
      high_connection_count: 'warning',
      database_disconnected: 'critical'
    };
    
    return severityMap[type] || 'info';
  }
  
  // Get recent alerts
  getRecentAlerts(limit = 20) {
    const alerts = cache.get('system_alerts') || [];
    return alerts.slice(0, limit);
  }
  
  // Get system health status
  getHealthStatus() {
    const metrics = this.getCurrentMetrics();
    const alerts = this.getRecentAlerts(5);
    
    let status = 'healthy';
    let issues = [];
    
    // Check for critical alerts in last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentCriticalAlerts = alerts.filter(alert => 
      alert.severity === 'critical' && 
      new Date(alert.timestamp) > fiveMinutesAgo
    );
    
    if (recentCriticalAlerts.length > 0) {
      status = 'critical';
      issues = recentCriticalAlerts.map(alert => alert.message);
    } else {
      // Check current metrics
      if (metrics.system?.cpu?.usage > this.alertThresholds.cpuUsage ||
          metrics.system?.memory?.usagePercent > this.alertThresholds.memoryUsage) {
        status = 'warning';
        issues.push('High resource usage detected');
      }
      
      if (metrics.database?.connection?.state !== 'connected') {
        status = 'critical';
        issues.push('Database connection issue');
      }
    }
    
    return {
      status,
      issues,
      lastCheck: new Date().toISOString(),
      uptime: Math.round(process.uptime()),
      version: process.env.npm_package_version || '1.0.0'
    };
  }
}

module.exports = new SystemMonitoringService();
