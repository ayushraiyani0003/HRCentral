const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const TotalEarningDeduct = sequelize.define(
        "TotalEarningDeduct",
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
            total_expense: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
            },
            total_earning: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
            },
            total_deduction: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
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
            tableName: "total_earning_deduct",
            timestamps: true,
            underscored: true,
        }
    );

    return TotalEarningDeduct;
};
