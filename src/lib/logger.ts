// Production Structured Logging Utility with Secret Redaction

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  requestId?: string;
  userId?: string;
  userRole?: string;
  path?: string;
  method?: string;
  status?: number;
  durationMs?: number;
  [key: string]: any;
}

const SENSITIVE_KEYS = new Set([
  'password',
  'passwordhash',
  'token',
  'jwt_secret',
  'secret',
  'api_key',
  'authorization',
  'cookie',
  'database_url',
]);

function redactSensitiveData(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(redactSensitiveData);

  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      cleaned[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      cleaned[key] = redactSensitiveData(value);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

export class Logger {
  private static formatLog(level: LogLevel, message: string, context?: LogContext) {
    const entry = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
      ...(context && { context: redactSensitiveData(context) }),
    };

    const output = JSON.stringify(entry);

    switch (level) {
      case 'error':
        console.error(output);
        break;
      case 'warn':
        console.warn(output);
        break;
      case 'debug':
        if (process.env.NODE_ENV !== 'production') console.debug(output);
        break;
      default:
        console.log(output);
        break;
    }
  }

  public static info(message: string, context?: LogContext) {
    this.formatLog('info', message, context);
  }

  public static warn(message: string, context?: LogContext) {
    this.formatLog('warn', message, context);
  }

  public static error(message: string, error?: any, context?: LogContext) {
    const errorDetails = error instanceof Error ? { errorName: error.name, errorMessage: error.message } : { error };
    this.formatLog('error', message, { ...context, ...errorDetails });
  }

  public static debug(message: string, context?: LogContext) {
    this.formatLog('debug', message, context);
  }
}

export default Logger;
