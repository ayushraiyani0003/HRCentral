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
            },
            vehicle_count: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            vehicle_exp_total: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            ot_hrs_total: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            ot_hrs_exp: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            fabrication_total: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            fabrication_exp: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            zink_5_total: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            zink_5_exp: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            night_hrs_exp_total: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            outdoor_count_exp: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            outdoor_count_exp_total: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            rollforming_day_count: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            zink_3_exp: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            zink_3_total: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            pending_expense: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            total_expense: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            chhol_exp: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            chhol_total: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            vehicle_day_count: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            night_hrs_exp: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            rollforming_total: {
                type: DataTypes.FLOAT,
                allowNull: true,
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
        }
    );

    return Expense;
};
