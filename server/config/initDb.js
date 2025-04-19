const { hrDb, employeeDb, testDbConnection } = require("./db");
const models = require("../models");
const logger = require("../utils/logger");

// Function to initialize and sync all database models
const initDb = async (force = false) => {
    try {
        // Test database connections silently
        await testDbConnection();

        // Sync HR database models with no foreign key constraints
        logger.info("Syncing HR database models...");
        await hrDb.sync({ force });
        logger.info("HR database models synced successfully.");

        // After creating tables, set up associations programmatically
        logger.info("Setting up cross-database associations...");

        // These will be virtual associations that don't create actual foreign keys in the database
        // but will allow Sequelize to handle the relationships in your code

        return true;
    } catch (error) {
        logger.error("Database initialization failed", {
            error: error.message,
            stack: error.stack,
        });
        return false;
    }
};

module.exports = initDb;
