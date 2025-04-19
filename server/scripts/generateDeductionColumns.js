// server/utils/dynamicDeductionColumns.js

const { DeductionAdd } = require("../models/hrModels");
const { hrDb } = require("../config/db");
const logger = require("./logger");
const { DataTypes } = require("sequelize");

/**
 * Generate columns in the all_deduction table based on existing deduction_add entries
 */
const generateDeductionColumns = async () => {
    try {
        // Get all deduction types
        const deductionTypes = await DeductionAdd.findAll();

        // Get existing columns in the all_deduction table to avoid duplicates
        const [existingColumns] = await hrDb.query(
            "SHOW COLUMNS FROM all_deduction"
        );
        const existingColumnNames = existingColumns.map(
            (column) => column.Field
        );

        logger.info(
            `Found ${existingColumnNames.length} existing columns in all_deduction table`
        );

        // Loop through each deduction type and add columns if they don't exist
        for (const deduction of deductionTypes) {
            if (deduction.type === "add_and_less") {
                // Add both _add and _less columns
                const addColumnName = `${deduction.deduction_name}_add`;
                const lessColumnName = `${deduction.deduction_name}_less`;

                if (!existingColumnNames.includes(addColumnName)) {
                    await hrDb
                        .getQueryInterface()
                        .addColumn("all_deduction", addColumnName, {
                            type: DataTypes.FLOAT,
                            allowNull: true,
                            defaultValue: 0,
                        });
                    logger.info(
                        `Added column ${addColumnName} to all_deduction table`
                    );
                }

                if (!existingColumnNames.includes(lessColumnName)) {
                    await hrDb
                        .getQueryInterface()
                        .addColumn("all_deduction", lessColumnName, {
                            type: DataTypes.FLOAT,
                            allowNull: true,
                            defaultValue: 0,
                        });
                    logger.info(
                        `Added column ${lessColumnName} to all_deduction table`
                    );
                }
            } else {
                // Only add _less column
                const lessColumnName = `${deduction.deduction_name}_less`;

                if (!existingColumnNames.includes(lessColumnName)) {
                    await hrDb
                        .getQueryInterface()
                        .addColumn("all_deduction", lessColumnName, {
                            type: DataTypes.FLOAT,
                            allowNull: true,
                            defaultValue: 0,
                        });
                    logger.info(
                        `Added column ${lessColumnName} to all_deduction table`
                    );
                }
            }
        }

        logger.info("Deduction column generation completed");
    } catch (error) {
        logger.error("Error generating deduction columns", {
            error: error.message,
            stack: error.stack,
        });
        throw error;
    }
};

module.exports = {
    generateDeductionColumns,
};
