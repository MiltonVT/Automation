export enum LogLevel { DEBUG, INFO, WARN, ERROR }

export class Logger {
  static log(level: LogLevel, message: string, context?: any) {
    const timestamp = new Date().toISOString();
    const ctx = context ? JSON.stringify(context) : '';
    // eslint-disable-next-line no-console
    console.log(`[${timestamp}] [${LogLevel[level]}] ${message} ${ctx}`);
  }
  static debug(msg: string, ctx?: any) { this.log(LogLevel.DEBUG, msg, ctx); }
  static info(msg: string, ctx?: any) { this.log(LogLevel.INFO, msg, ctx); }
  static warn(msg: string, ctx?: any) { this.log(LogLevel.WARN, msg, ctx); }
  static error(msg: string, ctx?: any) { this.log(LogLevel.ERROR, msg, ctx); }
}
