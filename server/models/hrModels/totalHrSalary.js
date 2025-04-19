const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const TotalHrSalary = sequelize.define(
        "TotalHrSalary",
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
            total_hr: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            total_hr_salary: {
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
            tableName: "total_hr_salary",
            timestamps: true,
            underscored: true,
        }
    );

    return TotalHrSalary;
};
