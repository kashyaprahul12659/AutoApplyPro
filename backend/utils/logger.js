const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which level to log based on environment
const level = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return isDevelopment ? 'debug' : 'info';
};

// Define format for logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define transport for daily rotate file
const fileRotateTransport = new DailyRotateFile({
  filename: path.join(__dirname, '../logs/app-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxFiles: '30d', // Keep logs for 30 days
  maxSize: '20m', // Max file size 20MB
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  )
});

// Define transport for error logs
const errorFileTransport = new DailyRotateFile({
  filename: path.join(__dirname, '../logs/error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxFiles: '30d',
  maxSize: '20m',
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  )
});

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports: [
    new winston.transports.Console(),
    fileRotateTransport,
    errorFileTransport
  ],
  // Handle exceptions and rejections
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/exceptions.log'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/rejections.log'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
});

// HTTP request logging middleware
const httpLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'Unknown',
      userId: req.user?.id || 'Anonymous'
    };
    
    // Log as info for successful requests, warn for client errors, error for server errors
    if (res.statusCode >= 500) {
      logger.error('HTTP Request', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('HTTP Request', logData);
    } else {
      logger.http('HTTP Request', logData);
    }
  });
  
  next();
};

// Audit logging for sensitive operations
const auditLogger = (action, userId, details = {}) => {
  logger.info('AUDIT', {
    action,
    userId,
    timestamp: new Date().toISOString(),
    details
  });
};

// Performance logging
const performanceLogger = (operation, duration, metadata = {}) => {
  logger.info('PERFORMANCE', {
    operation,
    duration: `${duration}ms`,
    timestamp: new Date().toISOString(),
    ...metadata
  });
};

// Security event logging
const securityLogger = (event, details = {}) => {
  logger.warn('SECURITY', {
    event,
    timestamp: new Date().toISOString(),
    ...details
  });
};

// Error logging with context
const errorLogger = (error, context = {}) => {
  logger.error('APPLICATION_ERROR', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...context
  });
};

module.exports = {
  logger,
  httpLogger,
  auditLogger,
  performanceLogger,
  securityLogger,
  errorLogger
};
