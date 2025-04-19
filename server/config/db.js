const { Sequelize } = require("sequelize");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Set up logger - we can't import directly to avoid circular dependencies
// So we'll create a very simple logger until the main one is available
let logger;
try {
    logger = require("../utils/logger");
} catch (error) {
    // Simple logger as fallback
    const logDir = path.join(__dirname, "../../logs");
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }

    logger = {
        info: (msg) => {
            if (process.env.NODE_ENV === "development") console.log(msg);
        },
        error: (msg, meta) => {
            console.error(msg, meta);
            // Also log to file as fallback
            fs.appendFileSync(
                path.join(logDir, "db-errors.log"),
                `${new Date().toISOString()} - ${msg} - ${JSON.stringify(
                    meta
                )}\n`
            );
        },
    };
}

// Custom logging function that ignores schema queries
const customLogger = (query) => {
    // Skip logging for schema/information queries
    if (
        query.includes("INFORMATION_SCHEMA") ||
        query.includes("SHOW INDEX") ||
        query.includes("SELECT 1+1") ||
        query.startsWith("SELECT TABLE_NAME")
    ) {
        return;
    }

    // Log other queries if in development mode
    if (
        process.env.NODE_ENV === "development" &&
        process.env.LOG_QUERIES === "true"
    ) {
        logger.info(`SQL: ${query}`);
    }
};

// Create a connection to the employee database
const employeeDb = new Sequelize(
    process.env.EMPLOYEE_DB_NAME,
    process.env.EMPLOYEE_DB_USER,
    process.env.EMPLOYEE_DB_PASSWORD,
    {
        host: process.env.EMPLOYEE_DB_HOST,
        dialect: process.env.EMPLOYEE_DB_DIALECT || "mysql",
        port: process.env.EMPLOYEE_DB_PORT || 3306,
        logging: customLogger,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

// Create a connection to the HR payroll database
const hrDb = new Sequelize(
    process.env.HR_DB_NAME,
    process.env.HR_DB_USER,
    process.env.HR_DB_PASSWORD,
    {
        host: process.env.HR_DB_HOST,
        dialect: process.env.HR_DB_DIALECT || "mysql",
        port: process.env.HR_DB_PORT || 3306,
        logging: customLogger,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

// Test the database connections
const testDbConnection = async () => {
    try {
        await employeeDb.authenticate();
        logger.info(
            "Employee database connection has been established successfully."
        );

        await hrDb.authenticate();
        logger.info(
            "HR database connection has been established successfully."
        );
    } catch (error) {
        logger.error("Unable to connect to the databases", {
            error: error.message,
            stack: error.stack,
        });
    }
};

module.exports = {
    employeeDb,
    hrDb,
    testDbConnection,
};
