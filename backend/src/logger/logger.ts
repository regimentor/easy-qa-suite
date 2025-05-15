import winston, { log } from "winston";

interface Levelevel {
  (message: string, ...meta: any[]): Logger;
  (message: any): Logger;
}

export interface Logger {
  info: Levelevel;
  error: Levelevel;
  warn: Levelevel;
  debug: Levelevel;
}

class ConsoleLogger implements Logger {
  #logger: winston.Logger;

  constructor() {
    const customFormat = winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.printf(
        ({ timestamp, level, message }) =>
          `${timestamp} [${level}]: ${message}`,
      ),
    );

    this.#logger = winston.createLogger({
      format: customFormat,
      level: "silly",
      transports: [new winston.transports.Console()],
    });
  }

  info(message: string | any, ...meta: any[]): Logger {
    this.#logger.info(message, ...meta);
    return this;
  }

  error(message: string | any, ...meta: any[]): Logger {
    this.#logger.error(message, ...meta);
    return this;
  }

  warn(message: string | any, ...meta: any[]): Logger {
    this.#logger.warn(message, ...meta);
    return this;
  }

  debug(message: string | any, ...meta: any[]): Logger {
    this.#logger.debug(message, ...meta);
    return this;
  }
}

export function createLogger(args: { meta: string }): Logger {
  const logger = new ConsoleLogger();
  logger.info(`Logger initialized with meta: ${args.meta}`);
  return logger;
}

export const logger = createLogger({ meta: "default" });
