// logger.ts
export type LogLevel = "debug" | "info" | "warn" | "error";

class Logger {
  // Only log messages at or above the current level.
  private levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  private static isDevelopment(): boolean {
    return (
      (typeof process !== "undefined" &&
        process.env.NODE_ENV !== "production") ||
      (typeof import.meta !== "undefined" &&
        import.meta.env?.MODE !== "production") ||
      (typeof window !== "undefined" && (window as any).__DEV__ === true)
    );
  }

  constructor(private currentLevel: LogLevel = "debug") {}

  private shouldLog(level: LogLevel): boolean {
    // For production, you might force the level to be 'warn' or higher.
    if (!Logger.isDevelopment()) {
      return this.levelPriority[level] >= this.levelPriority["warn"];
    }
    return this.levelPriority[level] >= this.levelPriority[this.currentLevel];
  }

  debug(message: string, ...optionalParams: any[]) {
    if (this.shouldLog("debug")) {
      console.debug(message, ...optionalParams);
    }
  }

  info(message: string, ...optionalParams: any[]) {
    if (this.shouldLog("info")) {
      console.info(message, ...optionalParams);
    }
  }

  warn(message: string, ...optionalParams: any[]) {
    if (this.shouldLog("warn")) {
      console.warn(message, ...optionalParams);
    }
  }

  error(message: string, ...optionalParams: any[]) {
    if (this.shouldLog("error")) {
      console.error(message, ...optionalParams);
    }
  }
}

export default new Logger("debug"); // Adjust default level as necessary
