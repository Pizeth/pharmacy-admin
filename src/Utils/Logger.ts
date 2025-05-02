import { LogLevel } from "../Types/types";

/**
 * Logger class for structured logging.
 *
 * @remarks
 * - Automatically detects development mode based on environment variables (`NODE_ENV`, `import.meta.env.MODE`, `__DEV__`).
 * - Use `Logger.setDevelopmentMode(isDev)` to manually override the development mode in edge cases or custom environments.
 */
class Logger {
  // Static property to override development mode
  private static forceDevelopment: boolean | null = null;

  /**
   * Manually set the development mode.
   * @param isDev - True to force development mode, false to force production mode.
   */
  static setDevelopmentMode(isDev: boolean): void {
    Logger.forceDevelopment = isDev;
  }

  // Only log messages at or above the current level.
  private levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  private static isDevelopment(): boolean {
    // Use the forced value if set
    if (Logger.forceDevelopment !== null) {
      return Logger.forceDevelopment;
    }
    // Otherwise, fall back to automatic detection
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
