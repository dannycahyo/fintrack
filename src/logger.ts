import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    }),
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/app.log" }),
  ],
});

export default logger;
