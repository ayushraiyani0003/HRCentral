const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const NetOtHrSalary = sequelize.define(
        "NetOtHrSalary",
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
            expected_hours: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            net_hr: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            net_hr_salary: {
                type: DataTypes.FLOAT,
                allowNull: false,
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
            tableName: "net_ot_hr_salary",
            timestamps: true,
            underscored: true,
        }
    );

    return NetOtHrSalary;
};
