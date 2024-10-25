import { createLogger, format, transports } from "winston";
import { ElasticsearchTransport } from "winston-elasticsearch";

const esTransportOpts = {
  level: "info",
  clientOpts: {
    node: process.env.ELASTICSEARCH_HOST || "http://localhost:9200",
  },
};

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
    new ElasticsearchTransport(esTransportOpts),
  ],
});

export default logger;
