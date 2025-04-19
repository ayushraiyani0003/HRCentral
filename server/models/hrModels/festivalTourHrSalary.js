const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const FestivalTourHrSalary = sequelize.define(
        "FestivalTourHrSalary",
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
            festival_hours: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            festival_hours_salary: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            tour_hours: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            tour_hours_salary: {
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
            tableName: "festival_tour_hr_salary",
            timestamps: true,
            underscored: true,
        }
    );

    return FestivalTourHrSalary;
};
