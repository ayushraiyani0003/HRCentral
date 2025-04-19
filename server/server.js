const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const initDb = require("./config/initDb");
const setupAssociations = require("./models/associations");
const logger = require("./utils/logger");
const { ExpenseAdd, DeductionAdd } = require("./models/hrModels");
require("dotenv").config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());

// Use morgan with winston logger
app.use(
    morgan("combined", {
        stream: {
            write: (message) => {
                // Remove line breaks to avoid duplicate log entries
                logger.info(message.trim());
            },
        },
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// app.use('/api/salary', require('./routes/salary'));
// app.use('/api/employee', require('./routes/employee'));
// Add other routes as needed

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error("Server error", {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    res.status(500).json({
        success: false,
        message: "An unexpected error occurred",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
});

// Initialize database and start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Initialize database with force: false to preserve existing data
        logger.info("Initializing database connection...");
        const dbInitialized = await initDb(false);

        if (dbInitialized) {
            // Set up cross-database associations after database initialization
            logger.info("Setting up database associations...");
            setupAssociations();

            app.listen(PORT, () => {
                logger.info(`Server running on port ${PORT}`);
            });
        } else {
            logger.error(
                "Failed to start server due to database initialization error"
            );
        }
    } catch (error) {
        logger.error("Server startup error", {
            error: error.message,
            stack: error.stack,
        });
    }
};

// Start the server
startServer();

module.exports = app; // For testing purposes
