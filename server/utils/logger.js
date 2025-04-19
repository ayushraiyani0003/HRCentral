const winston = require("winston");
const path = require("path");
const fs = require("fs");

// Create logs directory if it doesn't exist
const logDir = "logs";
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Define log format
const logFormat = winston.format.printf(
    ({ level, message, timestamp, ...meta }) => {
        return `${timestamp} ${level.toUpperCase()}: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta) : ""
        }`;
    }
);

// Create logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        logFormat
    ),
    defaultMeta: { service: "hr-central" },
    transports: [
        // Console output
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                logFormat
            ),
        }),
        // File output - error level
        new winston.transports.File({
            filename: path.join(logDir, "error.log"),
            level: "error",
        }),
        // File output - all levels
        new winston.transports.File({
            filename: path.join(logDir, "combined.log"),
        }),
    ],
});

module.exports = logger;
