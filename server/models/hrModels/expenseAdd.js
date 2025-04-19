const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const ExpenseAdd = sequelize.define(
        "ExpenseAdd",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            expense_name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
                comment: "Name of the expense type",
            },
            type: {
                type: DataTypes.ENUM(
                    "hours_base",
                    "day_count_base",
                    "manual_entry"
                ),
                allowNull: false,
                comment: "Type of expense calculation base",
            },
            amount: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
                comment: "Amount per unit (per hour, per day, or fixed amount)",
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                comment: "Whether this expense type is active",
            },
            created_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: "User ID who created this expense type",
            },
            updated_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: "User ID who last updated this expense type",
            },
        },
        {
            tableName: "expense_add",
            timestamps: true,
            underscored: true,
            comment:
                "Master table for expense types and their calculation basis",
            hooks: {
                afterCreate: async (expenseType, options) => {
                    try {
                        // Import here to avoid circular dependency
                        const {
                            generateExpenseColumns,
                        } = require("../../utils/dynamicExpenseColumns");

                        // Generate columns for this new expense type
                        await generateExpenseColumns();
                    } catch (error) {
                        console.error(
                            "Error generating columns after expense type creation:",
                            error
                        );
                    }
                },
                afterBulkCreate: async (expenseTypes, options) => {
                    try {
                        // Import here to avoid circular dependency
                        const {
                            generateExpenseColumns,
                        } = require("../../utils/dynamicExpenseColumns");

                        // Generate columns for all new expense types
                        await generateExpenseColumns();
                    } catch (error) {
                        console.error(
                            "Error generating columns after bulk expense type creation:",
                            error
                        );
                    }
                },
            },
        }
    );

    return ExpenseAdd;
};
