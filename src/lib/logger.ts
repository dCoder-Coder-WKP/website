/**
 * Structured logger for production use.
 *
 * - In development: all levels output to console.
 * - In production: `info` is suppressed, only `warn` and `error` pass through.
 * - Ready to be swapped for Sentry / Datadog / LogRocket by changing the transport.
 */

type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  data?: unknown;
  timestamp: string;
}

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

function formatEntry(entry: LogEntry): string {
  const parts = [
    `[${entry.timestamp}]`,
    `[${entry.level.toUpperCase()}]`,
    entry.context ? `[${entry.context}]` : '',
    entry.message,
  ];
  return parts.filter(Boolean).join(' ');
}

function emit(entry: LogEntry): void {
  const formatted = formatEntry(entry);

  switch (entry.level) {
    case 'info':
      if (!IS_PRODUCTION) {
        // eslint-disable-next-line no-console
        console.log(formatted, entry.data ?? '');
      }
      break;
    case 'warn':
      // eslint-disable-next-line no-console
      console.warn(formatted, entry.data ?? '');
      break;
    case 'error':
      // eslint-disable-next-line no-console
      console.error(formatted, entry.data ?? '');
      break;
  }
}

function createEntry(level: LogLevel, message: string, context?: string, data?: unknown): LogEntry {
  return {
    level,
    message,
    context,
    data,
    timestamp: new Date().toISOString(),
  };
}

export const logger = {
  info(message: string, data?: unknown, context?: string) {
    emit(createEntry('info', message, context, data));
  },
  warn(message: string, data?: unknown, context?: string) {
    emit(createEntry('warn', message, context, data));
  },
  error(message: string, data?: unknown, context?: string) {
    emit(createEntry('error', message, context, data));
  },
};
