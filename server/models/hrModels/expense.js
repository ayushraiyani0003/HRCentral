const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Expense = sequelize.define(
        "Expense",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            employee_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                // Foreign key removed for cross-database compatibility
                // references: {
                //   model: 'employees',
                //   key: 'employee_id',
                // },
            },
            month_year: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    is: /^\d{4}-\d{2}$/i, // Format: YYYY-MM
                },
            },
        },
        {
            tableName: "expense",
            timestamps: true,
            underscored: true,
            comment: "Records all employee expenses for each month",
        }
    );

    // This hook will automatically calculate total_expense before saving
    Expense.beforeSave(async (instance, options) => {
        // Calculate total by summing all expense fields
        let total = 0;

        // Add all expense totals
        total += instance.night_hrs_exp_total || 0;
        total += instance.ot_hrs_exp || 0;
        total += instance.vehicle_exp_total || 0;
        total += instance.rollforming_total || 0;
        total += instance.zink_5_exp || 0;
        total += instance.zink_3_exp || 0;
        total += instance.fabrication_exp || 0;
        total += instance.chhol_exp || 0;
        total += instance.outdoor_count_exp || 0;
        total += instance.pending_expense || 0;

        // Set the total_expense field
        instance.total_expense = total;
    });

    return Expense;
};
