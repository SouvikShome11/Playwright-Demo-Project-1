import path from "path";

import winston from "winston";

const LOG_FILE = path.resolve("reports/logs/test-run.ndjson");

type LogLevel = "error" | "warn" | "info" | "debug";

export class Logger {
  private static readonly instances = new Map<string, Logger>();

  private readonly winstonLogger: winston.Logger;
  private readonly name: string;
  private testContext?: string;

  private constructor(name: string) {
    this.name = name;
    this.winstonLogger = this.buildWinstonLogger();
  }

  // ── Factory ────────────────────────────────────────────────────────────────

  // Returns the singleton for this name, creating it on first call.
  static getInstance(name: string): Logger {
    let instance = Logger.instances.get(name);
    if (!instance) {
      instance = new Logger(name);
      Logger.instances.set(name, instance);
    }
    return instance;
  }

  // ── Test context ───────────────────────────────────────────────────────────

  // Call from fixtures before use() to tag all logs with the running test title.
  setTestContext(title: string): void {
    this.testContext = title;
  }

  // Call from fixtures after use() to prevent stale context leaking.
  clearTestContext(): void {
    this.testContext = undefined;
  }

  // ── Log methods ────────────────────────────────────────────────────────────

  info(message: string): void {
    this.write("info", message);
  }

  warn(message: string): void {
    this.write("warn", message);
  }

  error(message: string): void {
    this.write("error", message);
  }

  debug(message: string): void {
    this.write("debug", message);
  }

  // Highlights a named action step — maps to INFO level, prefixed with ▶.
  step(message: string): void {
    this.write("info", `▶ ${message}`);
  }

  // ── Internal ───────────────────────────────────────────────────────────────

  private write(level: LogLevel, message: string): void {
    this.winstonLogger[level](message);
  }

  private buildWinstonLogger(): winston.Logger {
    const level: string = process.env["LOG_LEVEL"] ?? "info";
    const logToFile: boolean = process.env["LOG_TO_FILE"] !== "false";

    const transports: winston.transport[] = [
      new winston.transports.Console({ format: this.consoleFormat() }),
    ];

    if (logToFile) {
      transports.push(
        new winston.transports.File({
          filename: LOG_FILE,
          format: this.ndjsonFormat(),
        }),
      );
    }

    return winston.createLogger({ level, transports });
  }

  // Human-readable coloured output for the terminal.
  private consoleFormat(): winston.Logform.Format {
    return winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: "HH:mm:ss" }),
      winston.format.printf((info) => {
        const ctx = this.testContext ? ` [${this.testContext}]` : "";
        return `${info["timestamp"] as string} [${info.level}] [${
          this.name
        }]${ctx} ${info.message as string}`;
      }),
    );
  }

  // One JSON object per line — machine-readable, grep-friendly.
  private ndjsonFormat(): winston.Logform.Format {
    return winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf((info) => {
        const record: Record<string, unknown> = {
          timestamp: info["timestamp"],
          level: info.level,
          name: this.name,
          message: info.message as string,
        };
        if (this.testContext) record["test"] = this.testContext;
        return JSON.stringify(record);
      }),
    );
  }
}
