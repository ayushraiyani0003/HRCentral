const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const PendingHrSalary = sequelize.define(
        "PendingHrSalary",
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
            pending_hr: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            pending_hr_salary: {
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
            tableName: "pending_hr_salary",
            timestamps: true,
            underscored: true,
        }
    );

    return PendingHrSalary;
};
