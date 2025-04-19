const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const NetTotalPay = sequelize.define(
        "NetTotalPay",
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
            net_pay: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
            },
            actual_pay: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
            },
            recovery: {
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
            tableName: "net_total_pay",
            timestamps: true,
            underscored: true,
        }
    );

    return NetTotalPay;
};
