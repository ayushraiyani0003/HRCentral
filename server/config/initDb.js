// =================== config/initDb.js ===================
const { sequelize, testDbConnection } = require("./db");
const models = require("../models");

// Set up logger with fallback
let logger;
try {
    logger = require("../utils/logger");
} catch (error) {
    logger = {
        info: (msg) => console.log(msg),
        error: (msg, meta) => console.error(msg, meta),
    };
}

// Function to initialize and sync all database models
const initDb = async (force = false) => {
    try {
        // Test database connection first
        const connectionTest = await testDbConnection();
        if (!connectionTest) {
            throw new Error("Database connection failed");
        }

        // Sync database models
        logger.info("Syncing HR database models...");

        // Sync with force option if specified (WARNING: This will drop existing tables)
        await sequelize.sync({ force });

        logger.info("HR database models synced successfully.");

        // Optionally run any seed data here
        // await seedDatabase();

        return true;
    } catch (error) {
        logger.error("Database initialization failed", {
            error: error.message,
            stack: error.stack,
        });
        return false;
    }
};

// Optional: Add a function to sync without dropping tables
const syncDb = async (alter = false) => {
    try {
        await testDbConnection();

        logger.info("Syncing database schema...");
        await sequelize.sync({ alter });
        logger.info("Database schema synced successfully.");

        return true;
    } catch (error) {
        logger.error("Database sync failed", {
            error: error.message,
            stack: error.stack,
        });
        return false;
    }
};

// Export initDb as default for backward compatibility
module.exports = initDb;

// Also export as named exports
module.exports.initDb = initDb;
module.exports.syncDb = syncDb;
module.exports.models = models;
module.exports.sequelize = sequelize;
