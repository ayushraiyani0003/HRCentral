const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const GrossSalary = sequelize.define(
        "GrossSalary",
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
            gross_salary: {
                type: DataTypes.INTEGER,
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
            tableName: "gross_salary",
            timestamps: true, // This will automatically add createdAt and updatedAt fields
            underscored: true, // Converts camelCase columns to snake_case
        }
    );

    return GrossSalary;
};
