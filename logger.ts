import winston, { createLogger, format, transports } from 'winston';

// Define log levels (optional, defaults to npm levels)
const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
};

// Create the logger instance
const logger: winston.Logger = createLogger({
  levels: logLevels,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }), // Capture stack traces
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console({
      level: 'debug',
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message, stack }) => {
          return `${timestamp} ${level}: ${message} ${stack ? `\n${stack}` : ''}`;
        })
      ),
    }),
    new transports.File({
      filename: 'logs/app.log',
      level: 'debug',
    }),
    new transports.File({
        filename: 'logs/error.log',
        level: 'error',
    })
  ],
});

// Example usage
// logger.debug('This is a debug log');
// logger.info('This is an info log');
// logger.warn('This is a warning log');
// logger.error('This is an error log', new Error('Some error'));
// logger.log('fatal', 'This is a fatal log');

export default logger;