/**
 * Script to run the expense column generation process based on existing expense_add entries
 * Run using: node server/scripts/generateExpenseColumns.js
 */

require("dotenv").config();
const { generateExpenseColumns } = require("../utils/dynamicExpenseColumns");
const { ExpenseAdd } = require("../models/hrModels");
const { hrDb } = require("../config/db");
const logger = require("../utils/logger");

const runGeneration = async () => {
    try {
        logger.info(
            "Starting expense column generation from existing expense_add entries"
        );

        // First, check if the expense_add table exists and has records
        const [tables] = await hrDb.query("SHOW TABLES LIKE 'expense_add'");

        if (tables.length === 0) {
            logger.error(
                "expense_add table does not exist. Please create it first."
            );
            process.exit(1);
        }

        // Check if there are any records in the expense_add table
        const count = await ExpenseAdd.count();

        if (count === 0) {
            logger.warn(
                "No expense types found in expense_add table. No columns will be generated."
            );
            process.exit(0);
        }

        logger.info(
            `Found ${count} expense types in expense_add table. Generating columns...`
        );

        // Generate columns based on existing expense_add entries
        await generateExpenseColumns();

        logger.info("Expense column generation script completed successfully");
        process.exit(0);
    } catch (error) {
        logger.error("Error in expense column generation script", {
            error: error.message,
            stack: error.stack,
        });
        process.exit(1);
    }
};

// Run the script
runGeneration();
