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
            month_year: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    is: /^\d{4}-\d{2}$/i, // Format: YYYY-MM
                },
            },
            // All specific deduction columns (fine, canteen, etc.) have been removed
            // Dynamic columns will be added by hooks in DeductionAdd model
        },
        {
            tableName: "all_deduction",
            timestamps: true,
            underscored: true,
        }
    );

    return AllDeduction;
};
