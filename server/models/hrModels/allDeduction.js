const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const AllDeduction = sequelize.define(
        "AllDeduction",
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
            fine: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            canteen: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            pt_amount: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            pf_amount: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            loan_amount: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            other_deduction: {
                type: DataTypes.FLOAT,
                allowNull: true,
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
            tableName: "all_deduction",
            timestamps: true,
            underscored: true,
        }
    );

    return AllDeduction;
};
