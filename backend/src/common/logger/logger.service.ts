import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggerService extends ConsoleLogger {
  private readonly environment: string;

  constructor(private configService: ConfigService) {
    super();
    this.environment =
      this.configService.get<string>('NODE_ENV') || 'development';

    // Set log levels based on environment
    const logLevels: LogLevel[] =
      this.environment === 'production'
        ? ['error', 'warn', 'log']
        : ['error', 'warn', 'log', 'debug', 'verbose'];

    this.setLogLevels(logLevels);
  }

  log(message: string, context?: string) {
    super.log(this.formatMessage(message), context);
  }

  error(message: string, trace?: string, context?: string) {
    super.error(this.formatMessage(message), trace, context);
  }

  warn(message: string, context?: string) {
    super.warn(this.formatMessage(message), context);
  }

  debug(message: string, context?: string) {
    super.debug(this.formatMessage(message), context);
  }

  verbose(message: string, context?: string) {
    super.verbose(this.formatMessage(message), context);
  }

  protected formatMessage(message: string): string {
    return `[${this.environment}] ${message}`;
  }
}
