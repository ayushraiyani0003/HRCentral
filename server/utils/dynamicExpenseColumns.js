const { ExpenseAdd } = require("../models/hrModels");
const { hrDb } = require("../config/db");
const logger = require("./logger");

/**
 * Dynamically generates columns in the expense table based on expense_add entries
 */
const generateExpenseColumns = async () => {
    try {
        logger.info("Starting dynamic expense column generation...");

        // Get all expense types from the expense_add table
        const expenseTypes = await ExpenseAdd.findAll();

        if (!expenseTypes || expenseTypes.length === 0) {
            logger.info(
                "No expense types found. No columns will be generated."
            );
            return;
        }

        logger.info(
            `Found ${expenseTypes.length} expense types. Generating columns...`
        );

        // Get current table structure from database information schema
        const [tableInfo] = await hrDb.query(`SHOW COLUMNS FROM expense`);

        // Create a list of existing columns
        const existingColumns = tableInfo.map((column) => column.Field);
        logger.info(`Existing columns: ${existingColumns.join(", ")}`);

        // For each expense type, generate the appropriate columns if they don't exist
        for (const expenseType of expenseTypes) {
            // Convert expense name to a database-friendly format
            const expenseName = expenseType.expense_name
                .toLowerCase()
                .replace(/\s+/g, "_")
                .replace(/[^a-z0-9_]/g, "");
            const { type } = expenseType;

            logger.info(
                `Processing expense type: ${expenseType.expense_name} (${type})`
            );

            // Define column names based on expense type
            let columnsToAdd = [];

            switch (type) {
                case "hours_base":
                    // For hours-based, we need two columns: one for hours and one for total
                    columnsToAdd = [
                        {
                            name: expenseName,
                            definition: `FLOAT DEFAULT 0 COMMENT 'Hours for ${expenseType.expense_name}'`,
                        },
                        {
                            name: `${expenseName}_exp_total`,
                            definition: `FLOAT DEFAULT 0 COMMENT 'Total expense for ${expenseType.expense_name}'`,
                        },
                    ];
                    break;

                case "day_count_base":
                    // For day-based, we need two columns: one for count and one for total
                    columnsToAdd = [
                        {
                            name: `${expenseName}_day_count`,
                            definition: `INT DEFAULT 0 COMMENT 'Days for ${expenseType.expense_name}'`,
                        },
                        {
                            name: `${expenseName}_exp_total`,
                            definition: `FLOAT DEFAULT 0 COMMENT 'Total expense for ${expenseType.expense_name}'`,
                        },
                    ];
                    break;

                case "manual_entry":
                    // For manual entry, we need just one column for the expense
                    columnsToAdd = [
                        {
                            name: `${expenseName}_exp`,
                            definition: `FLOAT DEFAULT 0 COMMENT 'Expense for ${expenseType.expense_name}'`,
                        },
                    ];
                    break;
            }

            // Add each column if it doesn't already exist
            for (const column of columnsToAdd) {
                if (!existingColumns.includes(column.name)) {
                    logger.info(
                        `Adding column ${column.name} to expense table`
                    );

                    try {
                        await hrDb.query(
                            `ALTER TABLE expense ADD COLUMN ${column.name} ${column.definition}`
                        );
                        logger.info(`Successfully added column ${column.name}`);
                    } catch (err) {
                        logger.error(`Error adding column ${column.name}`, {
                            error: err.message,
                            stack: err.stack,
                        });
                    }
                } else {
                    logger.info(
                        `Column ${column.name} already exists. Skipping.`
                    );
                }
            }
        }

        logger.info("Dynamic expense column generation completed");
    } catch (error) {
        logger.error("Error generating dynamic expense columns", {
            error: error.message,
            stack: error.stack,
        });
        throw error;
    }
};

module.exports = { generateExpenseColumns };
